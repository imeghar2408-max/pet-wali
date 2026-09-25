import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  initialUser,
  initialPets,
  initialServices,
  initialProviders,
  initialBookings,
  initialWalkSession,
  initialEmergencies,
  initialConversations,
  initialMessages,
  initialNotifications,
} from './src/server/db.ts';
import { EmergencyIncident } from './src/types/index.ts';
import {
  AuthRole,
  CaptainService,
  currentAuthUser,
  expireSessionCookie,
  invalidateSession,
  issueSession,
  isCaptainService,
  loginAccount,
  registerAccount,
  requireAuth,
  requireRole,
} from './src/server/auth.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Shared In-Memory State for Full-Stack Endpoints
  let currentUser = { ...initialUser };
  let pets = [...initialPets];
  let bookings = [...initialBookings];
  let activeWalk = { ...initialWalkSession };
  let emergencies = [...initialEmergencies];
  let conversations = [...initialConversations];
  let messages = { ...initialMessages };
  let notifications = [...initialNotifications];

  // API Routes
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'PetCare Shared Backend API', time: new Date().toISOString() });
  });

  const registrationHandler = (role: AuthRole) => async (req: Request, res: Response) => {
    const { name, email, phone, password, confirmPassword } = req.body || {};
    if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100 ||
        typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        typeof phone !== 'string' || phone.trim().length < 7 || phone.trim().length > 32 ||
        typeof password !== 'string' || password.length < 10 || password.length > 128 ||
        password !== confirmPassword) {
      res.status(400).json({ error: 'Please provide valid registration details. Passwords must match and contain at least 10 characters.' });
      return;
    }

    let captainProfile: { yearsExperience: number; servicesOffered: CaptainService[]; bio: string; profilePhoto?: string } = {
      yearsExperience: 0,
      servicesOffered: [],
      bio: '',
    };
    if (role === 'CAPTAIN') {
      const { yearsExperience, servicesOffered, bio, profilePhoto } = req.body;
      if (!Number.isInteger(yearsExperience) || yearsExperience < 0 || yearsExperience > 80 ||
          !Array.isArray(servicesOffered) || servicesOffered.length < 1 ||
          !servicesOffered.every(isCaptainService) || typeof bio !== 'string' || bio.trim().length > 800 ||
          (profilePhoto !== undefined && (typeof profilePhoto !== 'string' || profilePhoto.length > 2048))) {
        res.status(400).json({ error: 'Please provide valid Captain profile details and select Walking, Grooming, or Training.' });
        return;
      }
      captainProfile = { yearsExperience, servicesOffered, bio, profilePhoto };
    }

    try {
      const result = await registerAccount({
        name, email, phone, password, role,
        profilePhoto: captainProfile.profilePhoto,
        yearsExperience: captainProfile.yearsExperience,
        servicesOffered: captainProfile.servicesOffered,
        bio: captainProfile.bio,
      });
      issueSession(res, result.token);
      res.status(201).json({ user: result.user });
    } catch (error: any) {
      if (String(error?.code || '').includes('SQLITE_CONSTRAINT')) {
        res.status(409).json({ error: 'An account with these details could not be created. If you already registered, please sign in.' });
        return;
      }
      console.error('Registration error:', error);
      res.status(500).json({ error: 'We could not create your account right now.' });
    }
  };

  const loginHandler = (role: AuthRole) => async (req: Request, res: Response) => {
    const { email, password } = req.body || {};
    if (typeof email !== 'string' || typeof password !== 'string' || password.length > 128) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }
    const result = await loginAccount(email, password, role);
    if (!result) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }
    issueSession(res, result.token);
    res.json({ user: result.user });
  };

  app.post('/api/auth/user/register', registrationHandler('USER'));
  app.post('/api/auth/user/login', loginHandler('USER'));
  app.post('/api/auth/captain/register', registrationHandler('CAPTAIN'));
  app.post('/api/auth/captain/login', loginHandler('CAPTAIN'));
  app.get('/api/auth/me', requireAuth, (req: Request, res: Response) => {
    res.json({ user: req.authUser });
  });
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    invalidateSession(req);
    expireSessionCookie(res);
    res.status(204).end();
  });

  app.get('/api/captain/profile', requireRole('CAPTAIN'), (req: Request, res: Response) => {
    res.json({ user: req.authUser });
  });
  app.get('/api/captain/requests', requireRole('CAPTAIN'), (req: Request, res: Response) => {
    const captainId = req.authUser!.id;
    const services = req.authUser!.captainProfile?.servicesOffered || [];
    const requests = bookings.filter((booking) => booking.providerId === captainId ||
      (booking.status === 'MATCHING' && services.some((service) => booking.serviceName.toUpperCase().includes(service))));
    res.json(requests);
  });

  // Auth & User Profile
  app.get('/api/user', requireRole('USER'), (req: Request, res: Response) => {
    res.json(req.authUser);
  });

  app.put('/api/user', requireRole('USER'), (req: Request, res: Response) => {
    res.status(501).json({ error: 'Profile updates are not available through this endpoint yet.' });
  });

  // Pets
  app.get('/api/pets', requireRole('USER'), (req: Request, res: Response) => {
    res.json(pets.filter((pet: any) => pet.userId === req.authUser!.id));
  });

  app.post('/api/pets', requireRole('USER'), (req: Request, res: Response) => {
    const newPet = {
      ...req.body,
      id: `pet_${Date.now()}`,
      userId: req.authUser!.id,
      monthlyStats: { month: 'Current', kmWalked: 0, sessions: 0, safeZonePercent: 100 },
    };
    pets.unshift(newPet);
    res.status(201).json(newPet);
  });

  app.put('/api/pets/:id', requireRole('USER'), (req: Request, res: Response) => {
    const idx = pets.findIndex((p: any) => p.id === req.params.id && p.userId === req.authUser!.id);
    if (idx !== -1) {
      pets[idx] = { ...pets[idx], ...req.body };
      res.json(pets[idx]);
    } else {
      res.status(404).json({ error: 'Pet not found' });
    }
  });

  app.delete('/api/pets/:id', requireRole('USER'), (req: Request, res: Response) => {
    pets = pets.filter((p: any) => p.id !== req.params.id || p.userId !== req.authUser!.id);
    res.json({ success: true });
  });

  // Services & Providers
  app.get('/api/services', (_req: Request, res: Response) => {
    res.json(initialServices);
  });

  app.get('/api/providers', (req: Request, res: Response) => {
    const type = req.query.type as string;
    if (type) {
      res.json(initialProviders.filter((p) => p.serviceTypes.includes(type)));
    } else {
      res.json(initialProviders);
    }
  });

  // Bookings
  app.get('/api/bookings', requireRole('USER'), (req: Request, res: Response) => {
    res.json(bookings.filter((booking) => booking.userId === req.authUser!.id));
  });

  app.post('/api/bookings', requireRole('USER'), (req: Request, res: Response) => {
    const newBooking = {
      ...req.body,
      id: `bk_${Date.now()}`,
      userId: req.authUser!.id,
      createdAt: new Date().toISOString(),
    };
    bookings.unshift(newBooking);
    res.status(201).json(newBooking);
  });

  app.put('/api/bookings/:id/cancel', (req: Request, res: Response) => {
    const idx = bookings.findIndex((b) => b.id === req.params.id);
    if (idx !== -1) {
      bookings[idx].status = 'Cancelled';
      res.json(bookings[idx]);
    } else {
      res.status(404).json({ error: 'Booking not found' });
    }
  });

  // Active Dog Walk Session
  app.get('/api/walks/active', (_req: Request, res: Response) => {
    res.json(activeWalk);
  });

  app.put('/api/walks/active', (req: Request, res: Response) => {
    activeWalk = { ...activeWalk, ...req.body };
    res.json(activeWalk);
  });

  // Emergency Incidents & SOS
  app.get('/api/emergencies', (_req: Request, res: Response) => {
    res.json(emergencies);
  });

  app.post('/api/emergencies', (req: Request, res: Response) => {
    const incident: EmergencyIncident = {
      id: `emg_${Date.now()}`,
      bookingId: activeWalk.bookingId,
      walkSessionId: activeWalk.id,
      userId: currentUser.id,
      petId: activeWalk.petId,
      walkerId: activeWalk.walkerId,
      timestamp: new Date().toISOString(),
      location: activeWalk.currentLocation,
      emergencyType: req.body.emergencyType || 'MANUAL_SOS',
      status: 'Triggered',
      title: req.body.title || 'Emergency SOS',
      description: req.body.description || 'Emergency alert triggered by user.',
      autoDispatchSecondsRemaining: 40,
      contactsNotified: [
        {
          name: currentUser.emergencyContact.name,
          relationship: currentUser.emergencyContact.relationship,
          phone: currentUser.emergencyContact.phone,
          status: 'Delivered',
        },
      ],
      vetClinic: {
        name: 'VCA North Bay Emergency Vet',
        distance: '1.2 miles away',
        phone: '+1 555-987-4411',
        status: 'Open 24 Hours • Trauma Ready',
      },
    };
    emergencies.unshift(incident);
    res.status(201).json(incident);
  });

  app.put('/api/emergencies/:id/resolve', (req: Request, res: Response) => {
    const inc = emergencies.find((e) => e.id === req.params.id);
    if (inc) {
      inc.status = 'Resolved';
      inc.resolvedAt = new Date().toISOString();
      inc.resolutionNote = req.body.note || 'Resolved by user';
      res.json(inc);
    } else {
      res.status(404).json({ error: 'Incident not found' });
    }
  });

  // Messaging
  app.get('/api/conversations', (_req: Request, res: Response) => {
    res.json(conversations);
  });

  app.get('/api/messages/:convId', (req: Request, res: Response) => {
    res.json(messages[req.params.convId] || []);
  });

  app.post('/api/messages/:convId', (req: Request, res: Response) => {
    const newMsg = {
      id: `msg_${Date.now()}`,
      conversationId: req.params.convId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text: req.body.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
    };
    if (!messages[req.params.convId]) {
      messages[req.params.convId] = [];
    }
    messages[req.params.convId].push(newMsg);
    res.status(201).json(newMsg);
  });

  // Notifications
  app.get('/api/notifications', (_req: Request, res: Response) => {
    res.json(notifications);
  });

  // Vite integration or static serving
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PetCare server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
