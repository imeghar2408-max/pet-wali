import {
  User,
  Pet,
  Provider,
  ServiceCategory,
  Booking,
  WalkSession,
  EmergencyIncident,
  Message,
  Conversation,
  NotificationItem,
  SafeZoneConfig,
  Review,
  Payment,
  PlatformSettings,
  AdminAuditLog,
  AdminBroadcastNotification,
  ServiceReport,
} from '../types/index.ts';

import {
  initialUser,
  initialAdminUser,
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
  initialAdminBroadcasts,
  initialAuditLogs,
} from '../server/db.ts';

import { initialServiceReports } from '../server/mockReports.ts';

// Local storage keys for resilient persistence
const STORAGE_PREFIX = 'petcare_app_';

function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.warn('Storage set error:', err);
  }
}

// In-Memory & Persisted State Store
class PetCareStore {
  user: User = getStored('user', initialUser);
  users: User[] = getStored('users', initialUsers);
  pets: Pet[] = getStored('pets', initialPets);
  services: ServiceCategory[] = getStored('services', initialServices);
  providers: Provider[] = getStored('providers', initialProviders);
  bookings: Booking[] = getStored('bookings', initialBookings);
  activeWalk: WalkSession | null = getStored('active_walk', initialWalkSession);
  emergencies: EmergencyIncident[] = getStored('emergencies', initialEmergencies);
  conversations: Conversation[] = getStored('conversations', initialConversations);
  messages: Record<string, Message[]> = getStored('messages', initialMessages);
  notifications: NotificationItem[] = getStored('notifications', initialNotifications);
  payments: Payment[] = getStored('payments', initialPayments);
  reviews: Review[] = getStored('reviews', initialReviews);
  platformSettings: PlatformSettings = getStored('platform_settings', initialPlatformSettings);
  adminBroadcasts: AdminBroadcastNotification[] = getStored('admin_broadcasts', initialAdminBroadcasts);
  auditLogs: AdminAuditLog[] = getStored('audit_logs', initialAuditLogs);
  serviceReports: ServiceReport[] = getStored('service_reports', initialServiceReports);

  listeners: Set<() => void> = new Set();

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((l) => l());
  }

  save() {
    setStored('user', this.user);
    setStored('users', this.users);
    setStored('pets', this.pets);
    setStored('services', this.services);
    setStored('providers', this.providers);
    setStored('bookings', this.bookings);
    setStored('active_walk', this.activeWalk);
    setStored('emergencies', this.emergencies);
    setStored('conversations', this.conversations);
    setStored('messages', this.messages);
    setStored('notifications', this.notifications);
    setStored('payments', this.payments);
    setStored('reviews', this.reviews);
    setStored('platform_settings', this.platformSettings);
    setStored('admin_broadcasts', this.adminBroadcasts);
    setStored('audit_logs', this.auditLogs);
    setStored('service_reports', this.serviceReports);
    this.notify();
  }
}

export const store = new PetCareStore();

// Client API Services
export const api = {
  // Authentication
  async getCurrentUser(): Promise<User> {
    return { ...store.user };
  },

  async updateUser(updates: Partial<User>): Promise<User> {
    store.user = { ...store.user, ...updates };
    store.save();
    return { ...store.user };
  },

  async login(email: string, _role: string = 'USER'): Promise<User> {
    store.user = {
      ...store.user,
      email,
      role: 'USER',
    };
    store.save();
    return { ...store.user };
  },

  async logout(): Promise<void> {
    // Reset or keep guest mode
    store.user = {
      ...initialUser,
      name: 'Guest Pet Parent',
      email: 'guest@petcare.internal',
    };
    store.save();
  },

  // Pets
  async getPets(): Promise<Pet[]> {
    return [...store.pets];
  },

  async getPetById(id: string): Promise<Pet | undefined> {
    return store.pets.find((p) => p.id === id);
  },

  async addPet(petData: Omit<Pet, 'id' | 'userId' | 'monthlyStats'>): Promise<Pet> {
    const newPet: Pet = {
      ...petData,
      id: `pet_${Date.now()}`,
      userId: store.user.id,
      monthlyStats: {
        month: 'May 2024',
        kmWalked: 0,
        sessions: 0,
        safeZonePercent: 100,
      },
    };
    store.pets = [newPet, ...store.pets];
    store.save();
    return newPet;
  },

  async updatePet(id: string, updates: Partial<Pet>): Promise<Pet> {
    const index = store.pets.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Pet not found');
    store.pets[index] = { ...store.pets[index], ...updates };
    store.save();
    return store.pets[index];
  },

  async deletePet(id: string): Promise<void> {
    store.pets = store.pets.filter((p) => p.id !== id);
    store.save();
  },

  // Services
  async getServices(): Promise<ServiceCategory[]> {
    return [...store.services];
  },

  // Providers
  async getProviders(serviceType?: string): Promise<Provider[]> {
    if (!serviceType) return [...store.providers];
    return store.providers.filter((p) => p.serviceTypes.includes(serviceType));
  },

  async getProviderById(id: string): Promise<Provider | undefined> {
    return store.providers.find((p) => p.id === id);
  },

  // Bookings
  async getBookings(): Promise<Booking[]> {
    return [...store.bookings];
  },

  async getBookingById(id: string): Promise<Booking | undefined> {
    return store.bookings.find((b) => b.id === id);
  },

  async createBooking(bookingData: Omit<Booking, 'id' | 'userId' | 'createdAt'>): Promise<Booking> {
    const newBooking: Booking = {
      ...bookingData,
      id: `bk_${Date.now()}`,
      userId: store.user.id,
      createdAt: new Date().toISOString(),
    };

    store.bookings = [newBooking, ...store.bookings];

    // Add confirmation notification
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: store.user.id,
      type: 'BOOKING_CONFIRMED',
      title: `${newBooking.serviceName} Booked`,
      message: `Your booking on ${newBooking.date} at ${newBooking.time} has been confirmed.`,
      isRead: false,
      timestamp: 'Just now',
      bookingId: newBooking.id,
    };
    store.notifications = [notif, ...store.notifications];

    store.save();
    return newBooking;
  },

  async cancelBooking(bookingId: string, reason?: string): Promise<Booking> {
    const index = store.bookings.findIndex((b) => b.id === bookingId);
    if (index === -1) throw new Error('Booking not found');
    store.bookings[index] = {
      ...store.bookings[index],
      status: 'Cancelled',
      specialInstructions: reason ? `${store.bookings[index].specialInstructions || ''} [Cancelled: ${reason}]` : store.bookings[index].specialInstructions,
    };

    // If active walk was tied to this booking, end it
    if (store.activeWalk && store.activeWalk.bookingId === bookingId) {
      store.activeWalk.status = 'aborted';
    }

    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: store.user.id,
      type: 'BOOKING_CANCELLED',
      title: 'Booking Cancelled',
      message: `Booking ${store.bookings[index].serviceName} was cancelled.`,
      isRead: false,
      timestamp: 'Just now',
      bookingId,
    };
    store.notifications = [notif, ...store.notifications];

    store.save();
    return store.bookings[index];
  },

  // Walk Sessions & Safety
  async getActiveWalk(): Promise<WalkSession | null> {
    return store.activeWalk;
  },

  async updateWalkTelemetry(updates: Partial<WalkSession>): Promise<WalkSession | null> {
    if (!store.activeWalk) return null;
    store.activeWalk = { ...store.activeWalk, ...updates };
    store.save();
    return store.activeWalk;
  },

  async incrementPotty(type: 'pee' | 'poop'): Promise<WalkSession | null> {
    if (!store.activeWalk) return null;
    const current = store.activeWalk.pottyCounts;
    const newCounts = {
      ...current,
      [type]: current[type] + 1,
    };
    const newEvent = {
      id: `tl_${Date.now()}`,
      icon: type === 'pee' ? 'water_drop' : 'potted_plant',
      title: type === 'pee' ? 'Potty break logged (Pee)' : 'Potty break logged (Poop)',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      description: `GPS tagged at Oakwood perimeter. Cleaned & sanitized.`,
      type: 'potty' as const,
    };
    store.activeWalk.pottyCounts = newCounts;
    store.activeWalk.timeline = [newEvent, ...store.activeWalk.timeline];
    store.save();
    return store.activeWalk;
  },

  async logHydrationBreak(): Promise<WalkSession | null> {
    if (!store.activeWalk) return null;
    const newEvent = {
      id: `tl_${Date.now()}`,
      icon: 'water_full',
      title: 'Hydration break given',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      description: 'Walker offered 200ml fresh cool water. Pet drank eagerly.',
      type: 'hydration' as const,
    };
    store.activeWalk.isHydrated = true;
    store.activeWalk.timeline = [newEvent, ...store.activeWalk.timeline];
    store.save();
    return store.activeWalk;
  },

  async triggerEmergencySOS(params: {
    type: 'MANUAL_SOS' | 'ACCIDENT_DETECTED' | 'SAFE_ZONE_BREACH' | 'OTHER';
    title: string;
    description: string;
  }): Promise<EmergencyIncident> {
    const currentWalk = store.activeWalk;
    const incident: EmergencyIncident = {
      id: `emg_${Date.now()}`,
      bookingId: currentWalk?.bookingId || 'bk_manual',
      walkSessionId: currentWalk?.id,
      userId: store.user.id,
      petId: currentWalk?.petId || store.pets[0]?.id || 'pet_milo',
      walkerId: currentWalk?.walkerId || 'prov_sarah_jenkins',
      timestamp: new Date().toISOString(),
      location: currentWalk?.currentLocation || {
        lat: 37.7749,
        lng: -122.4194,
        address: 'Oakwood Park South Entrance, Seattle / SF',
      },
      emergencyType: params.type,
      status: 'Triggered',
      title: params.title,
      description: params.description,
      autoDispatchSecondsRemaining: 42,
      contactsNotified: [
        {
          name: store.user.emergencyContact.name,
          relationship: store.user.emergencyContact.relationship,
          phone: store.user.emergencyContact.phone,
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

    store.emergencies = [incident, ...store.emergencies];

    // Notification
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: store.user.id,
      type: 'EMERGENCY_SOS',
      title: `EMERGENCY ALERT: ${incident.title}`,
      message: incident.description,
      isRead: false,
      timestamp: 'Just now',
    };
    store.notifications = [notif, ...store.notifications];

    if (store.activeWalk) {
      store.activeWalk.safeZoneState = 'RED';
      store.activeWalk.timeline = [
        {
          id: `tl_${Date.now()}`,
          icon: 'emergency',
          title: `EMERGENCY SOS: ${params.title}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          description: params.description,
          type: 'incident',
        },
        ...store.activeWalk.timeline,
      ];
    }

    store.save();
    return incident;
  },

  async resolveEmergency(incidentId: string, resolutionNote: string = 'Marked safe by user / false alarm'): Promise<EmergencyIncident | undefined> {
    const incident = store.emergencies.find((e) => e.id === incidentId);
    if (incident) {
      incident.status = 'Resolved';
      incident.resolvedAt = new Date().toISOString();
      incident.resolutionNote = resolutionNote;
    }
    if (store.activeWalk) {
      store.activeWalk.safeZoneState = 'GREEN';
      store.activeWalk.timeline = [
        {
          id: `tl_${Date.now()}`,
          icon: 'verified',
          title: 'Incident Resolved / Safe',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          description: resolutionNote,
          type: 'zone',
        },
        ...store.activeWalk.timeline,
      ];
    }
    store.save();
    return incident;
  },

  async dispatchEmergency(incidentId: string): Promise<EmergencyIncident | undefined> {
    const incident = store.emergencies.find((e) => e.id === incidentId);
    if (incident) {
      incident.status = 'In Progress';
      incident.autoDispatchSecondsRemaining = 0;
      incident.contactsNotified.push({
        name: 'Dr. Aris Thorne (Primary Vet)',
        relationship: 'Veterinary Surgeon',
        phone: '+1 (555) 345-6789',
        status: 'Delivered',
      });
    }
    store.save();
    return incident;
  },

  // Messaging
  async getConversations(): Promise<Conversation[]> {
    return [...store.conversations];
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    return store.messages[conversationId] || [];
  },

  async sendMessage(conversationId: string, text: string): Promise<Message> {
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: store.user.id,
      senderName: store.user.name,
      senderAvatar: store.user.avatar,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
    };

    if (!store.messages[conversationId]) {
      store.messages[conversationId] = [];
    }
    store.messages[conversationId].push(newMsg);

    // Update conversation last message
    const conv = store.conversations.find((c) => c.id === conversationId);
    if (conv) {
      conv.lastMessageText = text;
      conv.lastMessageTime = 'Just now';
    }

    store.save();

    // Provider auto-reply simulation after brief delay for realistic interaction
    setTimeout(() => {
      const providerReply: Message = {
        id: `msg_${Date.now() + 1}`,
        conversationId,
        senderId: conv?.providerId || 'prov_sarah_jenkins',
        senderName: conv?.providerName || 'Sarah Jenkins',
        senderAvatar: conv?.providerAvatar || initialProviders[0].avatar,
        text: `Thanks Elena! Milo is safe, happy, and doing great. I'll send another photo update shortly! 🐾`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false,
      };
      if (store.messages[conversationId]) {
        store.messages[conversationId].push(providerReply);
      }
      if (conv) {
        conv.lastMessageText = providerReply.text;
        conv.lastMessageTime = 'Just now';
        conv.unreadCount += 1;
      }
      store.save();
    }, 2500);

    return newMsg;
  },

  // Notifications
  async getNotifications(): Promise<NotificationItem[]> {
    return [...store.notifications];
  },

  async markNotificationRead(id: string): Promise<void> {
    const notif = store.notifications.find((n) => n.id === id);
    if (notif) {
      notif.isRead = true;
      store.save();
    }
  },

  async markAllNotificationsRead(): Promise<void> {
    store.notifications.forEach((n) => (n.isRead = true));
    store.save();
  },

  // Reviews
  async submitReview(review: Omit<Review, 'id' | 'createdAt' | 'userName' | 'userAvatar'>): Promise<Review> {
    const newRev: Review = {
      ...review,
      id: `rev_${Date.now()}`,
      userName: store.user.name,
      userAvatar: store.user.avatar,
      createdAt: new Date().toISOString(),
      status: 'Published',
    };
    store.reviews.push(newRev);
    store.save();
    return newRev;
  },

  async getReviews(): Promise<Review[]> {
    return [...store.reviews];
  },

  async flagReview(reviewId: string, reason: string): Promise<Review | undefined> {
    const rev = store.reviews.find((r) => r.id === reviewId);
    if (rev) {
      rev.status = 'Reported';
      rev.reportedReason = reason;
      store.save();
    }
    return rev;
  },

  async resolveReviewReport(reviewId: string, action: 'keep' | 'hide'): Promise<Review | undefined> {
    const rev = store.reviews.find((r) => r.id === reviewId);
    if (rev) {
      rev.status = action === 'hide' ? 'Hidden' : 'Published';
      delete rev.reportedReason;
      store.save();
    }
    return rev;
  },

  // Users (Admin visibility & management)
  async getUsers(): Promise<User[]> {
    return [...store.users];
  },

  async updateUserStatus(userId: string, status: 'Active' | 'Suspended' | 'Deactivated'): Promise<User | undefined> {
    const u = store.users.find((user) => user.id === userId);
    if (u) {
      u.status = status;
      if (store.user.id === userId) {
        store.user.status = status;
      }
      store.save();
    }
    return u;
  },

  async switchActiveUser(userToSwitch: User): Promise<User> {
    store.user = { ...userToSwitch };
    store.save();
    return store.user;
  },

  // Providers (Admin approval & suspension)
  async updateProviderStatus(
    providerId: string,
    status: 'Active' | 'Pending' | 'Suspended',
    verificationStatus?: 'verified' | 'pending'
  ): Promise<Provider | undefined> {
    const prov = store.providers.find((p) => p.id === providerId);
    if (prov) {
      prov.status = status;
      if (verificationStatus) {
        prov.verificationStatus = verificationStatus;
      }
      store.save();
    }
    return prov;
  },

  // Services (Admin pricing and activation)
  async updateService(serviceId: string, updates: Partial<ServiceCategory>): Promise<ServiceCategory | undefined> {
    const srv = store.services.find((s) => s.id === serviceId);
    if (srv) {
      Object.assign(srv, updates);
      store.save();
    }
    return srv;
  },

  // Payments (Admin ledger)
  async getPayments(): Promise<Payment[]> {
    return [...store.payments];
  },

  async refundPayment(paymentId: string): Promise<Payment | undefined> {
    const pay = store.payments.find((p) => p.id === paymentId);
    if (pay) {
      pay.status = 'refunded';
      const b = store.bookings.find((bk) => bk.id === pay.bookingId);
      if (b) {
        b.status = 'Cancelled';
      }
      store.save();
    }
    return pay;
  },

  // Emergency Incident Management (Acknowledge & Start Response)
  async acknowledgeEmergency(incidentId: string): Promise<EmergencyIncident | undefined> {
    const incident = store.emergencies.find((e) => e.id === incidentId);
    if (incident) {
      incident.status = 'Acknowledged';
      store.save();
    }
    return incident;
  },

  async startEmergencyResponse(incidentId: string): Promise<EmergencyIncident | undefined> {
    const incident = store.emergencies.find((e) => e.id === incidentId);
    if (incident) {
      incident.status = 'In Progress';
      store.save();
    }
    return incident;
  },

  // Platform & Safety Configuration
  async getPlatformSettings(): Promise<PlatformSettings> {
    return { ...store.platformSettings };
  },

  async updatePlatformSettings(settings: Partial<PlatformSettings>): Promise<PlatformSettings> {
    store.platformSettings = { ...store.platformSettings, ...settings };
    store.save();
    return { ...store.platformSettings };
  },

  // Broadcasts
  async getAdminBroadcasts(): Promise<AdminBroadcastNotification[]> {
    return [...store.adminBroadcasts];
  },

  async createAdminBroadcast(
    broadcast: Omit<AdminBroadcastNotification, 'id' | 'createdAt' | 'sentCount'>
  ): Promise<AdminBroadcastNotification> {
    const newBroadcast: AdminBroadcastNotification = {
      ...broadcast,
      id: `bc_${Date.now()}`,
      createdAt: new Date().toISOString(),
      sentCount: broadcast.targetAudience === 'ALL_USERS' ? store.users.length * 350 : 42,
    };
    store.adminBroadcasts.unshift(newBroadcast);

    // Also push into notifications stream for active users
    const notifItem: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: store.user.id,
      type: broadcast.category === 'Emergency' ? 'EMERGENCY_SOS' : broadcast.category === 'Safety' ? 'SAFETY_ALERT' : 'WEATHER_TIP',
      title: broadcast.title,
      message: broadcast.message,
      isRead: false,
      timestamp: 'Just now',
    };
    store.notifications.unshift(notifItem);

    store.save();
    return newBroadcast;
  },

  // Audit Logs
  async getAuditLogs(): Promise<AdminAuditLog[]> {
    return [...store.auditLogs];
  },

  async addAuditLog(log: Omit<AdminAuditLog, 'id' | 'timestamp'>): Promise<AdminAuditLog> {
    const newLog: AdminAuditLog = {
      ...log,
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    store.auditLogs.unshift(newLog);
    store.save();
    return newLog;
  },

  // Service Reports
  async getServiceReports(): Promise<ServiceReport[]> {
    return [...store.serviceReports];
  },

  async getReportsForPet(petId: string): Promise<ServiceReport[]> {
    return store.serviceReports.filter((r) => r.petId === petId);
  },

  async getReportForBooking(bookingId: string): Promise<ServiceReport | undefined> {
    return store.serviceReports.find((r) => r.bookingId === bookingId);
  },

  async addServiceReport(report: ServiceReport): Promise<ServiceReport> {
    // Check if exists
    const idx = store.serviceReports.findIndex((r) => r.id === report.id || r.bookingId === report.bookingId);
    if (idx >= 0) {
      store.serviceReports[idx] = report;
    } else {
      store.serviceReports.unshift(report);
    }

    // Push notification to user that report is ready
    const reportNotif: NotificationItem = {
      id: `notif_rep_${Date.now()}`,
      userId: store.user.id,
      type: 'BOOKING_CONFIRMED',
      title: 'Your service report is ready',
      message: `${report.serviceTitle} for ${report.petName} was completed by ${report.providerName}. View full care report and photos.`,
      isRead: false,
      timestamp: 'Just now',
      bookingId: report.bookingId,
    };
    store.notifications.unshift(reportNotif);

    // Also mark booking as Completed if in bookings
    const bIdx = store.bookings.findIndex((b) => b.id === report.bookingId);
    if (bIdx >= 0) {
      store.bookings[bIdx] = {
        ...store.bookings[bIdx],
        status: 'Completed',
      };
    }

    store.save();
    return report;
  },

  async rateServiceReport(reportId: string, rating: number, comment: string): Promise<ServiceReport | null> {
    const repIdx = store.serviceReports.findIndex((r) => r.id === reportId);
    if (repIdx === -1) return null;
    const current = store.serviceReports[repIdx];
    const updated = {
      ...current,
      rating,
      reviewComment: comment,
    };
    store.serviceReports[repIdx] = updated;

    // Also add to public reviews
    const newRev: Review = {
      id: `rev_${Date.now()}`,
      bookingId: current.bookingId,
      providerId: current.providerId,
      userId: store.user.id,
      userName: store.user.name,
      userAvatar: store.user.avatar,
      providerName: current.providerName,
      serviceName: current.serviceTitle,
      rating,
      comment,
      createdAt: new Date().toISOString(),
      status: 'Published',
    };
    store.reviews.unshift(newRev);

    store.save();
    return updated;
  },
};
