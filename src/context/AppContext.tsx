import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Pet,
  Provider,
  ServiceCategory,
  Booking,
  WalkSession,
  EmergencyIncident,
  Conversation,
  Message,
  NotificationItem,
  Payment,
  Review,
  PlatformSettings,
  AdminBroadcastNotification,
  AdminAuditLog,
  ServiceReport,
} from '../types/index.ts';
import { api, store } from '../services/api.ts';

export type NavTab =
  | 'home'
  | 'services'
  | 'bookings'
  | 'pets'
  | 'messages'
  | 'profile'
  | 'live-walk'
  | 'emergency-sos'
  | 'service-booking'
  | 'safe-zone'
  | 'provider-search';

interface AppContextType {
  user: User;
  updateUser: (updates: Partial<User>) => Promise<void>;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;

  pets: Pet[];
  activePet: Pet;
  setActivePet: (pet: Pet) => void;
  addPet: (petData: Omit<Pet, 'id' | 'userId' | 'monthlyStats'>) => Promise<Pet>;
  updatePet: (id: string, updates: Partial<Pet>) => Promise<Pet>;
  deletePet: (id: string) => Promise<void>;

  services: ServiceCategory[];
  providers: Provider[];

  bookings: Booking[];
  createBooking: (booking: Omit<Booking, 'id' | 'userId' | 'createdAt'>) => Promise<Booking>;
  cancelBooking: (id: string, reason?: string) => Promise<void>;

  activeWalk: WalkSession | null;
  updateWalkTelemetry: (updates: Partial<WalkSession>) => Promise<void>;
  incrementPotty: (type: 'pee' | 'poop') => Promise<void>;
  logHydrationBreak: () => Promise<void>;
  isWalkingSimulationActive: boolean;
  toggleWalkingSimulation: () => void;

  emergencies: EmergencyIncident[];
  activeEmergency: EmergencyIncident | null;
  triggerSOS: (params: { type: 'MANUAL_SOS' | 'ACCIDENT_DETECTED' | 'SAFE_ZONE_BREACH' | 'OTHER'; title: string; description: string }) => Promise<void>;
  resolveEmergency: (incidentId: string, note?: string) => Promise<void>;
  dispatchEmergency: (incidentId: string) => Promise<void>;

  conversations: Conversation[];
  messages: Record<string, Message[]>;
  sendMessage: (convId: string, text: string) => Promise<void>;
  activeConversationId: string;
  setActiveConversationId: (id: string) => void;

  notifications: NotificationItem[];
  unreadNotifsCount: number;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;

  currentTab: NavTab;
  setCurrentTab: (tab: NavTab) => void;
  bookingServiceSlug: string;
  setBookingServiceSlug: (slug: string) => void;

  // Accident Detection Simulation Trigger
  accidentModalVisible: boolean;
  setAccidentModalVisible: (visible: boolean) => void;
  triggerAccidentDetectionSim: () => void;

  // Digital Pet ID Modal
  petIdModalPet: Pet | null;
  setPetIdModalPet: (pet: Pet | null) => void;

  // Dual App Mode & Admin Navigation
  appMode: 'PROVIDER' | 'USER';
  setAppMode: (mode: 'PROVIDER' | 'USER') => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  isAdmin: boolean;
  switchActiveUser: (u: User) => Promise<void>;

  // Admin Data Management
  users: User[];
  updateUserStatus: (userId: string, status: 'Active' | 'Suspended' | 'Deactivated') => Promise<void>;
  updateProviderStatus: (providerId: string, status: 'Active' | 'Pending' | 'Suspended', verificationStatus?: 'verified' | 'pending') => Promise<void>;
  updateService: (serviceId: string, updates: Partial<ServiceCategory>) => Promise<void>;
  payments: Payment[];
  refundPayment: (paymentId: string) => Promise<void>;
  reviews: Review[];
  flagReview: (reviewId: string, reason: string) => Promise<void>;
  resolveReviewReport: (reviewId: string, action: 'keep' | 'hide') => Promise<void>;
  platformSettings: PlatformSettings;
  updatePlatformSettings: (settings: Partial<PlatformSettings>) => Promise<void>;
  adminBroadcasts: AdminBroadcastNotification[];
  createAdminBroadcast: (b: Omit<AdminBroadcastNotification, 'id' | 'createdAt' | 'sentCount'>) => Promise<void>;
  auditLogs: AdminAuditLog[];
  addAuditLog: (log: Omit<AdminAuditLog, 'id' | 'timestamp'>) => Promise<void>;
  acknowledgeEmergency: (incidentId: string) => Promise<void>;
  startEmergencyResponse: (incidentId: string) => Promise<void>;

  // User App Enhanced Flows
  selectedProviderId: string | null;
  setSelectedProviderId: (id: string | null) => void;
  selectedServiceSlug: string;
  setSelectedServiceSlug: (slug: string) => void;
  selectedBooking: Booking | null;
  setSelectedBooking: (b: Booking | null) => void;
  showAuthModal: 'login' | 'signup' | 'forgot' | null;
  setShowAuthModal: (m: 'login' | 'signup' | 'forgot' | null) => void;
  showOnboarding: boolean;
  setShowOnboarding: (val: boolean) => void;
  showSplash: boolean;
  setShowSplash: (val: boolean) => void;
  reviewModalBooking: Booking | null;
  setReviewModalBooking: (b: Booking | null) => void;
  submitReview: (review: Omit<Review, 'id' | 'createdAt' | 'userName' | 'userAvatar'>) => Promise<Review>;

  // Post-Service Reports
  serviceReports: ServiceReport[];
  activeReportModal: ServiceReport | null;
  setActiveReportModal: (report: ServiceReport | null) => void;
  activeReportInitialTab: string;
  setActiveReportInitialTab: (tab: string) => void;
  openReportModal: (report: ServiceReport, initialTab?: string) => void;
  getReportsForPet: (petId: string) => ServiceReport[];
  getReportForBooking: (bookingId: string) => ServiceReport | undefined;
  addServiceReport: (report: ServiceReport) => Promise<void>;
  rateServiceReport: (reportId: string, rating: number, comment: string) => Promise<void>;
}

export type AdminTab =
  | 'dashboard'
  | 'users'
  | 'pets'
  | 'providers'
  | 'bookings'
  | 'live-walks'
  | 'emergency-center'
  | 'services'
  | 'payments'
  | 'reviews'
  | 'notifications'
  | 'analytics'
  | 'settings';

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(store.user);
  const [users, setUsers] = useState<User[]>(store.users);
  const [pets, setPets] = useState<Pet[]>(store.pets);
  const [activePet, setActivePetState] = useState<Pet>(store.pets[0]);
  const [services, setServices] = useState<ServiceCategory[]>(store.services);
  const [providers, setProviders] = useState<Provider[]>(store.providers);
  const [bookings, setBookings] = useState<Booking[]>(store.bookings);
  const [activeWalk, setActiveWalk] = useState<WalkSession | null>(store.activeWalk);
  const [emergencies, setEmergencies] = useState<EmergencyIncident[]>(store.emergencies);
  const [conversations, setConversations] = useState<Conversation[]>(store.conversations);
  const [messages, setMessages] = useState<Record<string, Message[]>>(store.messages);
  const [notifications, setNotifications] = useState<NotificationItem[]>(store.notifications);
  const [payments, setPayments] = useState<Payment[]>(store.payments);
  const [reviews, setReviews] = useState<Review[]>(store.reviews);
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(store.platformSettings);
  const [adminBroadcasts, setAdminBroadcasts] = useState<AdminBroadcastNotification[]>(store.adminBroadcasts);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(store.auditLogs);

  const [appMode, setAppMode] = useState<'PROVIDER' | 'USER'>('PROVIDER');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [bookingServiceSlug, setBookingServiceSlug] = useState<string>('dog-walking');
  const [activeConversationId, setActiveConversationId] = useState<string>('conv_sarah');
  const [isWalkingSimulationActive, setIsWalkingSimulationActive] = useState<boolean>(true);
  const [accidentModalVisible, setAccidentModalVisible] = useState<boolean>(false);
  const [petIdModalPet, setPetIdModalPet] = useState<Pet | null>(null);

  // User App Enhanced Flows
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [selectedServiceSlug, setSelectedServiceSlug] = useState<string>('dog-walking');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<'login' | 'signup' | 'forgot' | null>(null);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [showSplash, setShowSplash] = useState<boolean>(false);
  const [reviewModalBooking, setReviewModalBooking] = useState<Booking | null>(null);

  // Post-Service Reports
  const [serviceReports, setServiceReports] = useState<ServiceReport[]>(store.serviceReports);
  const [activeReportModal, setActiveReportModal] = useState<ServiceReport | null>(null);
  const [activeReportInitialTab, setActiveReportInitialTab] = useState<string>('overview');

  // Sync state with store on subscription changes
  useEffect(() => {
    const unsub = store.subscribe(() => {
      setUser({ ...store.user });
      setUsers([...store.users]);
      setPets([...store.pets]);
      setServices([...store.services]);
      setProviders([...store.providers]);
      setBookings([...store.bookings]);
      setActiveWalk(store.activeWalk ? { ...store.activeWalk } : null);
      setEmergencies([...store.emergencies]);
      setConversations([...store.conversations]);
      setMessages({ ...store.messages });
      setNotifications([...store.notifications]);
      setPayments([...store.payments]);
      setReviews([...store.reviews]);
      setPlatformSettings({ ...store.platformSettings });
      setAdminBroadcasts([...store.adminBroadcasts]);
      setAuditLogs([...store.auditLogs]);
      setServiceReports([...store.serviceReports]);
    });
    return () => {
      unsub();
    };
  }, []);

  // Update activePet if pets list changes
  const setActivePet = (pet: Pet) => {
    setActivePetState(pet);
  };

  const updateUser = async (updates: Partial<User>) => {
    const updated = await api.updateUser(updates);
    setUser(updated);
  };

  const login = async (email: string) => {
    const u = await api.login(email);
    setUser(u);
  };

  const logout = async () => {
    await api.logout();
    setUser({ ...store.user });
  };

  const addPet = async (petData: Omit<Pet, 'id' | 'userId' | 'monthlyStats'>) => {
    const newPet = await api.addPet(petData);
    setActivePet(newPet);
    return newPet;
  };

  const updatePet = async (id: string, updates: Partial<Pet>) => {
    const updated = await api.updatePet(id, updates);
    if (activePet.id === id) {
      setActivePet(updated);
    }
    return updated;
  };

  const deletePet = async (id: string) => {
    await api.deletePet(id);
    if (activePet.id === id && store.pets.length > 0) {
      setActivePet(store.pets[0]);
    }
  };

  const createBooking = async (booking: Omit<Booking, 'id' | 'userId' | 'createdAt'>) => {
    return await api.createBooking(booking);
  };

  const cancelBooking = async (id: string, reason?: string) => {
    await api.cancelBooking(id, reason);
  };

  const updateWalkTelemetry = async (updates: Partial<WalkSession>) => {
    const updated = await api.updateWalkTelemetry(updates);
    setActiveWalk(updated);
  };

  const incrementPotty = async (type: 'pee' | 'poop') => {
    const updated = await api.incrementPotty(type);
    setActiveWalk(updated);
  };

  const logHydrationBreak = async () => {
    const updated = await api.logHydrationBreak();
    setActiveWalk(updated);
  };

  const toggleWalkingSimulation = () => {
    setIsWalkingSimulationActive((prev) => !prev);
  };

  // Active Emergency
  const activeEmergency = emergencies.find((e) => e.status !== 'Resolved' && e.status !== 'Cancelled') || null;

  const triggerSOS = async (params: {
    type: 'MANUAL_SOS' | 'ACCIDENT_DETECTED' | 'SAFE_ZONE_BREACH' | 'OTHER';
    title: string;
    description: string;
  }) => {
    await api.triggerEmergencySOS(params);
    setCurrentTab('emergency-sos');
  };

  const resolveEmergency = async (incidentId: string, note?: string) => {
    await api.resolveEmergency(incidentId, note);
  };

  const dispatchEmergency = async (incidentId: string) => {
    await api.dispatchEmergency(incidentId);
  };

  const sendMessage = async (convId: string, text: string) => {
    await api.sendMessage(convId, text);
  };

  const markNotificationRead = async (id: string) => {
    await api.markNotificationRead(id);
  };

  const markAllNotificationsRead = async () => {
    await api.markAllNotificationsRead();
  };

  const triggerAccidentDetectionSim = () => {
    setAccidentModalVisible(true);
  };

  // Unread Notifications Count
  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

  // Background Simulated telemetry updates (1 second increments for duration, slight distance and speed jitter)
  useEffect(() => {
    if (!isWalkingSimulationActive || !activeWalk || activeWalk.status !== 'in_progress') return;

    const interval = setInterval(() => {
      setActiveWalk((prev) => {
        if (!prev) return null;
        const newDuration = prev.activeDurationSeconds + 1;
        // Jitter distance slightly every 8 seconds
        const newDist = newDuration % 8 === 0 ? parseFloat((prev.distanceKm + 0.01).toFixed(2)) : prev.distanceKm;
        const newSpeed = +(3.2 + Math.sin(newDuration / 5) * 0.4).toFixed(1);

        // Safe zone boundary check logic:
        // When distance to boundary decreases, state changes from GREEN to YELLOW
        let safeState = prev.safeZoneState;
        if (prev.distanceToBoundaryM <= 100) {
          safeState = 'YELLOW';
        } else if (prev.distanceToBoundaryM <= 0) {
          safeState = 'RED';
        }

        return {
          ...prev,
          activeDurationSeconds: newDuration,
          distanceKm: newDist,
          currentSpeedKmH: newSpeed,
          safeZoneState: safeState,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isWalkingSimulationActive, activeWalk?.status]);

  // Admin Data Actions
  const updateUserStatus = async (userId: string, status: 'Active' | 'Suspended' | 'Deactivated') => {
    await api.updateUserStatus(userId, status);
  };

  const updateProviderStatus = async (
    providerId: string,
    status: 'Active' | 'Pending' | 'Suspended',
    verificationStatus?: 'verified' | 'pending'
  ) => {
    await api.updateProviderStatus(providerId, status, verificationStatus);
  };

  const updateService = async (serviceId: string, updates: Partial<ServiceCategory>) => {
    await api.updateService(serviceId, updates);
  };

  const refundPayment = async (paymentId: string) => {
    await api.refundPayment(paymentId);
  };

  const flagReview = async (reviewId: string, reason: string) => {
    await api.flagReview(reviewId, reason);
  };

  const resolveReviewReport = async (reviewId: string, action: 'keep' | 'hide') => {
    await api.resolveReviewReport(reviewId, action);
  };

  const updatePlatformSettings = async (settings: Partial<PlatformSettings>) => {
    await api.updatePlatformSettings(settings);
  };

  const createAdminBroadcast = async (
    b: Omit<AdminBroadcastNotification, 'id' | 'createdAt' | 'sentCount'>
  ) => {
    await api.createAdminBroadcast(b);
  };

  const addAuditLog = async (log: Omit<AdminAuditLog, 'id' | 'timestamp'>) => {
    await api.addAuditLog(log);
  };

  const acknowledgeEmergency = async (incidentId: string) => {
    await api.acknowledgeEmergency(incidentId);
  };

  const startEmergencyResponse = async (incidentId: string) => {
    await api.startEmergencyResponse(incidentId);
  };

  const switchActiveUser = async (u: User) => {
    await api.switchActiveUser(u);
    setUser({ ...u });
  };

  const submitReview = async (review: Omit<Review, 'id' | 'createdAt' | 'userName' | 'userAvatar'>) => {
    return await api.submitReview(review);
  };

  const openReportModal = (report: ServiceReport, initialTab: string = 'overview') => {
    setActiveReportInitialTab(initialTab);
    setActiveReportModal(report);
  };

  const getReportsForPet = (petId: string) => {
    return serviceReports.filter((r) => r.petId === petId);
  };

  const getReportForBooking = (bookingId: string) => {
    return serviceReports.find((r) => r.bookingId === bookingId);
  };

  const addServiceReport = async (report: ServiceReport) => {
    await api.addServiceReport(report);
  };

  const rateServiceReport = async (reportId: string, rating: number, comment: string) => {
    await api.rateServiceReport(reportId, rating, comment);
  };

  const isAdmin = false;

  return (
    <AppContext.Provider
      value={{
        user,
        updateUser,
        login,
        logout,
        isLoggedIn: !!user.id && user.id !== 'usr_guest',

        pets,
        activePet,
        setActivePet,
        addPet,
        updatePet,
        deletePet,

        services,
        providers,

        bookings,
        createBooking,
        cancelBooking,

        activeWalk,
        updateWalkTelemetry,
        incrementPotty,
        logHydrationBreak,
        isWalkingSimulationActive,
        toggleWalkingSimulation,

        emergencies,
        activeEmergency,
        triggerSOS,
        resolveEmergency,
        dispatchEmergency,

        conversations,
        messages,
        sendMessage,
        activeConversationId,
        setActiveConversationId,

        notifications,
        unreadNotifsCount,
        markNotificationRead,
        markAllNotificationsRead,

        currentTab,
        setCurrentTab,
        bookingServiceSlug,
        setBookingServiceSlug,

        accidentModalVisible,
        setAccidentModalVisible,
        triggerAccidentDetectionSim,

        petIdModalPet,
        setPetIdModalPet,

        // Dual App Mode & Admin Navigation
        appMode,
        setAppMode,
        adminTab,
        setAdminTab,
        isAdmin,
        switchActiveUser,

        // Admin Management
        users,
        updateUserStatus,
        updateProviderStatus,
        updateService,
        payments,
        refundPayment,
        reviews,
        flagReview,
        resolveReviewReport,
        platformSettings,
        updatePlatformSettings,
        adminBroadcasts,
        createAdminBroadcast,
        auditLogs,
        addAuditLog,
        acknowledgeEmergency,
        startEmergencyResponse,

        // User App Enhanced Flows
        selectedProviderId,
        setSelectedProviderId,
        selectedServiceSlug,
        setSelectedServiceSlug,
        selectedBooking,
        setSelectedBooking,
        showAuthModal,
        setShowAuthModal,
        showOnboarding,
        setShowOnboarding,
        showSplash,
        setShowSplash,
        reviewModalBooking,
        setReviewModalBooking,
        submitReview,

        // Post-Service Reports
        serviceReports,
        activeReportModal,
        setActiveReportModal,
        activeReportInitialTab,
        setActiveReportInitialTab,
        openReportModal,
        getReportsForPet,
        getReportForBooking,
        addServiceReport,
        rateServiceReport,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
