export type AuthRole = 'USER' | 'CAPTAIN';
export type CaptainService = 'WALKING' | 'GROOMING' | 'TRAINING';

export interface AuthAccount {
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

type AuthResult = { user: AuthAccount };

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!response.ok) {
    let message = 'Unable to complete authentication.';
    try {
      const body = await response.json();
      if (typeof body.error === 'string') message = body.error;
    } catch { /* retain the safe fallback */ }
    throw new Error(message);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const authApi = {
  async me(): Promise<AuthAccount | null> {
    try {
      const result = await request<AuthResult>('/api/auth/me');
      return result.user;
    } catch (error) {
      if (error instanceof Error && error.message === 'Authentication required.') return null;
      throw error;
    }
  },
  async login(role: AuthRole, email: string, password: string): Promise<AuthAccount> {
    const result = await request<AuthResult>(`/api/auth/${role.toLowerCase()}/login`, {
      method: 'POST', body: JSON.stringify({ email, password }),
    });
    return result.user;
  },
  async register(role: AuthRole, values: Record<string, unknown>): Promise<AuthAccount> {
    const result = await request<AuthResult>(`/api/auth/${role.toLowerCase()}/register`, {
      method: 'POST', body: JSON.stringify(values),
    });
    return result.user;
  },
  logout: () => request<void>('/api/auth/logout', { method: 'POST' }),
};
