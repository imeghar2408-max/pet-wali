import { randomBytes, scrypt as scryptCallback, timingSafeEqual, createHash } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
import type { NextFunction, Request, Response } from 'express';
import { DatabaseSync } from 'node:sqlite';

const scrypt = promisify(scryptCallback);
const databaseDirectory = path.resolve(process.cwd(), 'data');
mkdirSync(databaseDirectory, { recursive: true });

export const authDatabase = new DatabaseSync(path.join(databaseDirectory, 'petcare.sqlite'));
authDatabase.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL COLLATE NOCASE UNIQUE,
    phone TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('USER', 'CAPTAIN')),
    profile_photo TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS captain_profiles (
    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    years_experience INTEGER NOT NULL DEFAULT 0,
    services_offered TEXT NOT NULL DEFAULT '[]',
    bio TEXT NOT NULL DEFAULT '',
    verification_status TEXT NOT NULL DEFAULT 'pending'
  );
  CREATE TABLE IF NOT EXISTS auth_sessions (
    token_hash TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS auth_sessions_expiry ON auth_sessions(expires_at);
`);

export type AuthRole = 'USER' | 'CAPTAIN';
export type CaptainService = 'WALKING' | 'GROOMING' | 'TRAINING';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: AuthRole;
  profilePhoto: string | null;
  createdAt: string;
  captainProfile?: {
    yearsExperience: number;
    servicesOffered: CaptainService[];
    bio: string;
    verificationStatus: string;
  };
}

declare global {
  namespace Express {
    interface Request {
      authUser?: AuthUser;
    }
  }
}

const sessionCookie = 'petcare_session';
const sessionLifetimeSeconds = 60 * 60 * 24 * 14;
const allowedCaptainServices = new Set<CaptainService>(['WALKING', 'GROOMING', 'TRAINING']);

function publicUser(row: any): AuthUser {
  const result: AuthUser = {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    role: row.role,
    profilePhoto: row.profile_photo ?? null,
    createdAt: row.created_at,
  };
  if (row.role === 'CAPTAIN') {
    const profile = authDatabase.prepare('SELECT * FROM captain_profiles WHERE user_id = ?').get(row.id) as any;
    if (profile) {
      result.captainProfile = {
        yearsExperience: profile.years_experience,
        servicesOffered: JSON.parse(profile.services_offered),
        bio: profile.bio,
        verificationStatus: profile.verification_status,
      };
    }
  }
  return result;
}

function hashSessionToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function readCookie(request: Request, name: string): string | undefined {
  const cookieHeader = request.headers.cookie;
  if (!cookieHeader) return undefined;
  for (const part of cookieHeader.split(';')) {
    const separator = part.indexOf('=');
    if (separator < 0) continue;
    if (part.slice(0, separator).trim() === name) {
      return decodeURIComponent(part.slice(separator + 1).trim());
    }
  }
  return undefined;
}

function setSessionCookie(response: Response, token: string): void {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  response.setHeader('Set-Cookie', `${sessionCookie}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${sessionLifetimeSeconds}${secure}`);
}

function clearSessionCookie(response: Response): void {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  response.setHeader('Set-Cookie', `${sessionCookie}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`);
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derivedKey = await scrypt(password, salt, 64) as Buffer;
  return `${salt.toString('hex')}:${derivedKey.toString('hex')}`;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltHex, keyHex] = stored.split(':');
  if (!saltHex || !keyHex) return false;
  const expected = Buffer.from(keyHex, 'hex');
  const actual = await scrypt(password, Buffer.from(saltHex, 'hex'), expected.length) as Buffer;
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function isCaptainService(value: unknown): value is CaptainService {
  return typeof value === 'string' && allowedCaptainServices.has(value as CaptainService);
}

export async function registerAccount(input: {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: AuthRole;
  profilePhoto?: string;
  yearsExperience?: number;
  servicesOffered?: CaptainService[];
  bio?: string;
}): Promise<{ user: AuthUser; token: string }> {
  const now = new Date().toISOString();
  const id = `${input.role.toLowerCase()}_${randomBytes(16).toString('hex')}`;
  const passwordHash = await hashPassword(input.password);
  const token = randomBytes(32).toString('base64url');
  const tokenHash = hashSessionToken(token);
  const transaction = authDatabase.prepare('BEGIN IMMEDIATE');
  transaction.run();
  try {
    authDatabase.prepare(`INSERT INTO users (id, name, email, phone, password_hash, role, profile_photo, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
      id, input.name.trim(), input.email.trim().toLowerCase(), input.phone.trim(), passwordHash,
      input.role, input.profilePhoto?.trim() || null, now, now,
    );
    if (input.role === 'CAPTAIN') {
      authDatabase.prepare(`INSERT INTO captain_profiles (user_id, years_experience, services_offered, bio)
        VALUES (?, ?, ?, ?)`).run(
        id,
        Math.max(0, Math.floor(input.yearsExperience || 0)),
        JSON.stringify(input.servicesOffered || []),
        (input.bio || '').trim(),
      );
    }
    authDatabase.prepare('INSERT INTO auth_sessions (token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)')
      .run(tokenHash, id, Date.now() + sessionLifetimeSeconds * 1000, now);
    authDatabase.exec('COMMIT');
  } catch (error) {
    authDatabase.exec('ROLLBACK');
    throw error;
  }
  const row = authDatabase.prepare('SELECT * FROM users WHERE id = ?').get(id) as any;
  return { user: publicUser(row), token };
}

export async function loginAccount(email: string, password: string, role: AuthRole): Promise<{ user: AuthUser; token: string } | null> {
  const row = authDatabase.prepare('SELECT * FROM users WHERE email = ? COLLATE NOCASE').get(email.trim()) as any;
  const candidateHash = row?.password_hash || `${'00'.repeat(16)}:${'00'.repeat(64)}`;
  const validPassword = await verifyPassword(password, candidateHash);
  if (!row || !validPassword || row.role !== role) return null;

  const token = randomBytes(32).toString('base64url');
  authDatabase.prepare('INSERT INTO auth_sessions (token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)')
    .run(hashSessionToken(token), row.id, Date.now() + sessionLifetimeSeconds * 1000, new Date().toISOString());
  return { user: publicUser(row), token };
}

export function currentAuthUser(request: Request): AuthUser | null {
  const token = readCookie(request, sessionCookie);
  if (!token) return null;
  const row = authDatabase.prepare(`SELECT users.* FROM auth_sessions
    JOIN users ON users.id = auth_sessions.user_id
    WHERE auth_sessions.token_hash = ? AND auth_sessions.expires_at > ?`).get(hashSessionToken(token), Date.now()) as any;
  if (!row) return null;
  return publicUser(row);
}

export function invalidateSession(request: Request): void {
  const token = readCookie(request, sessionCookie);
  if (token) authDatabase.prepare('DELETE FROM auth_sessions WHERE token_hash = ?').run(hashSessionToken(token));
}

export function issueSession(response: Response, token: string): void {
  setSessionCookie(response, token);
}

export function expireSessionCookie(response: Response): void {
  clearSessionCookie(response);
}

export function requireAuth(request: Request, response: Response, next: NextFunction): void {
  const user = currentAuthUser(request);
  if (!user) {
    response.status(401).json({ error: 'Authentication required.' });
    return;
  }
  request.authUser = user;
  next();
}

export function requireRole(role: AuthRole) {
  return (request: Request, response: Response, next: NextFunction): void => {
    requireAuth(request, response, () => {
      if (request.authUser?.role !== role) {
        response.status(403).json({ error: 'You are not authorized to access this resource.' });
        return;
      }
      next();
    });
  };
}
