import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  initialUser,
  initialUsers,
  initialPets,
  initialServices,
  initialProviders,
  initialBookings,
  initialWalkSession,
  initialEmergencies,
  initialConversations,
  initialMessages,
  initialNotifications,
  initialPayments,
  initialReviews,
  initialPlatformSettings,
} from './src/server/db.ts';
import { EmergencyIncident, User, Payment } from './src/types/index.ts';

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

  // Auth & User Profile
  app.get('/api/user', (_req: Request, res: Response) => {
    res.json(currentUser);
  });

  app.put('/api/user', (req: Request, res: Response) => {
    currentUser = { ...currentUser, ...req.body };
    res.json(currentUser);
  });

  // Pets
  app.get('/api/pets', (_req: Request, res: Response) => {
    res.json(pets);
  });

  app.post('/api/pets', (req: Request, res: Response) => {
    const newPet = {
      ...req.body,
      id: `pet_${Date.now()}`,
      userId: currentUser.id,
      monthlyStats: { month: 'Current', kmWalked: 0, sessions: 0, safeZonePercent: 100 },
    };
    pets.unshift(newPet);
    res.status(201).json(newPet);
  });

  app.put('/api/pets/:id', (req: Request, res: Response) => {
    const idx = pets.findIndex((p) => p.id === req.params.id);
    if (idx !== -1) {
      pets[idx] = { ...pets[idx], ...req.body };
      res.json(pets[idx]);
    } else {
      res.status(404).json({ error: 'Pet not found' });
    }
  });

  app.delete('/api/pets/:id', (req: Request, res: Response) => {
    pets = pets.filter((p) => p.id !== req.params.id);
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
  app.get('/api/bookings', (_req: Request, res: Response) => {
    res.json(bookings);
  });

  app.post('/api/bookings', (req: Request, res: Response) => {
    const newBooking = {
      ...req.body,
      id: `bk_${Date.now()}`,
      userId: currentUser.id,
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

  // Admin Authorization Middleware (Enforces role = 'ADMIN' at the backend level)
  const requireAdmin = (req: Request, res: Response, next: express.NextFunction) => {
    const authRole = (req.headers['x-user-role'] as string) || currentUser.role;
    if (authRole !== 'ADMIN') {
      res.status(403).json({
        error: 'Forbidden: Access Denied. Administrator role (role=ADMIN) is required to access this resource.',
        code: 'ADMIN_ACCESS_REQUIRED',
      });
      return;
    }
    next();
  };

  // Shared Admin API Endpoints (Protected at Backend Level)
  app.get('/api/admin/overview', requireAdmin, (_req: Request, res: Response) => {
    const todayBookings = bookings.filter((b) => b.date.toLowerCase().includes('today') || b.date.includes('2026-09-25'));
    const activeEmergenciesCount = emergencies.filter((e) => e.status !== 'Resolved' && e.status !== 'Cancelled').length;
    const totalRev = bookings.reduce((sum, b) => (b.status !== 'Cancelled' ? sum + b.totalAmount : sum), 0);

    res.json({
      totalUsers: 1420 + pets.length,
      activeUsers: 840,
      totalPets: pets.length,
      activeProviders: initialProviders.filter((p) => p.status !== 'Suspended').length,
      todayBookings: todayBookings.length,
      activeBookings: bookings.filter((b) => b.status === 'Active').length,
      completedBookings: bookings.filter((b) => b.status === 'Completed').length,
      cancelledBookings: bookings.filter((b) => b.status === 'Cancelled').length,
      revenue: totalRev,
      activeDogWalks: activeWalk && activeWalk.status === 'in_progress' ? 1 : 0,
      activeEmergencies: activeEmergenciesCount,
      pendingProviderVerifications: initialProviders.filter((p) => p.verificationStatus === 'pending').length,
    });
  });

  app.get('/api/admin/users', requireAdmin, (_req: Request, res: Response) => {
    res.json(initialUsers);
  });

  app.put('/api/admin/users/:id/status', requireAdmin, (req: Request, res: Response) => {
    const u = initialUsers.find((usr: User) => usr.id === req.params.id);
    if (u) {
      u.status = req.body.status;
      res.json(u);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });

  app.put('/api/admin/providers/:id/status', requireAdmin, (req: Request, res: Response) => {
    const prov = initialProviders.find((p) => p.id === req.params.id);
    if (prov) {
      if (req.body.status) prov.status = req.body.status;
      if (req.body.verificationStatus) prov.verificationStatus = req.body.verificationStatus;
      res.json(prov);
    } else {
      res.status(404).json({ error: 'Provider not found' });
    }
  });

  app.get('/api/admin/payments', requireAdmin, (_req: Request, res: Response) => {
    res.json(initialPayments);
  });

  app.post('/api/admin/payments/:id/refund', requireAdmin, (req: Request, res: Response) => {
    const p = initialPayments.find((pay: Payment) => pay.id === req.params.id);
    if (p) {
      p.status = 'refunded';
      res.json(p);
    } else {
      res.status(404).json({ error: 'Payment not found' });
    }
  });

  app.get('/api/admin/reviews', requireAdmin, (_req: Request, res: Response) => {
    res.json(initialReviews);
  });

  app.get('/api/admin/settings', requireAdmin, (_req: Request, res: Response) => {
    res.json(initialPlatformSettings);
  });

  app.put('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
    Object.assign(initialPlatformSettings, req.body);
    res.json(initialPlatformSettings);
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
