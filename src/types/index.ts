export type UserRole =
  | 'USER'
  | 'ADMIN'
  | 'PROVIDER'
  | 'WALKER'
  | 'VET'
  | 'GROOMER'
  | 'TRAINER'
  | 'BOARDING_PROVIDER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone: string;
  address: string;
  city: string;
  status?: 'Active' | 'Suspended' | 'Deactivated';
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  createdAt: string;
}

export interface Vaccine {
  name: string;
  validUntil: string;
  status: 'Up to Date' | 'Due Soon' | 'Overdue';
  isDue?: boolean;
}

export interface Pet {
  id: string;
  userId: string;
  name: string;
  species: 'Dog' | 'Cat' | 'Other';
  breed: string;
  ageYears: number;
  ageMonths: number;
  dob?: string;
  gender: 'Male (Neutered)' | 'Male (Intact)' | 'Female (Spayed)' | 'Female (Intact)';
  weightKg: number;
  photoUrl: string;
  healthStatus: 'Healthy' | 'Attention Needed' | 'Under Care';
  microchipId: string;
  activeStatusNote: string; // e.g. "On a walk", "Resting at home"
  monthlyStats: {
    month: string;
    kmWalked: number;
    sessions: number;
    safeZonePercent: number;
  };
  safetyProfile: {
    safeZoneName: string;
    safeZoneRadiusKm: number;
    walkerNotes: string;
    allowedTreats: string;
    allergies: string;
    dietaryNotes: string;
  };
  emergencyContacts: {
    name: string;
    role: string;
    phone: string;
    isPrimary?: boolean;
    is24_7Vet?: boolean;
  }[];
  vaccinations: Vaccine[];
}

export interface Provider {
  id: string;
  userId?: string;
  name: string;
  title: string;
  avatar: string;
  serviceTypes: string[];
  verificationStatus: 'verified' | 'pending';
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  hourlyRate: number;
  badges: string[];
  phone: string;
  bio: string;
  availability: string[];
  location: string;
  status?: 'Active' | 'Pending' | 'Suspended';
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  tag?: string;
  badgeColor?: string;
  description: string;
  startingPrice: number;
  durationOptions?: { minutes: number; label: string; price: number; isPopular?: boolean }[];
  isVerified?: boolean;
  isActive?: boolean;
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Active' | 'Completed' | 'Cancelled';

export interface SafeZoneConfig {
  id: string;
  petId: string;
  centerAddress: string;
  centerCoords: { lat: number; lng: number };
  radiusMeters: number; // 500, 1000, 2000
  radiusLabel: string;
  alertOnExit: boolean;
  accidentDetection: boolean;
  pottyPhotoLogs: boolean;
  createdAt?: string;
}

export interface Booking {
  id: string;
  userId: string;
  petId: string;
  providerId: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  durationMinutes: number;
  baseFee: number;
  safetyFee: number;
  totalAmount: number;
  status: BookingStatus;
  safeZoneConfig?: SafeZoneConfig;
  walkSessionId?: string;
  specialInstructions?: string;
  paymentId?: string;
  createdAt: string;
  isHomeVisit?: boolean;
}

export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'apple_pay' | 'google_pay' | 'cash_on_completion';
  transactionId: string;
  timestamp: string;
  receiptUrl?: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  providerId: string;
  providerName: string;
  providerAvatar: string;
  lastMessageText: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'BOOKING_CONFIRMED' | 'BOOKING_CANCELLED' | 'SAFETY_ALERT' | 'MESSAGE' | 'EMERGENCY_SOS' | 'WEATHER_TIP';
  title: string;
  message: string;
  isRead: boolean;
  timestamp: string;
  linkUrl?: string;
  bookingId?: string;
}

export interface PottyBreak {
  type: 'pee' | 'poop';
  timestamp: string;
  photoUrl?: string;
}

export interface ActivityTimelineEvent {
  id: string;
  icon: string;
  title: string;
  time: string;
  description: string;
  type: 'start' | 'zone' | 'hydration' | 'potty' | 'incident' | 'alert';
}

export type SafeZoneState = 'GREEN' | 'YELLOW' | 'RED';

export interface WalkSession {
  id: string;
  bookingId: string;
  petId: string;
  walkerId: string;
  walkerName: string;
  walkerAvatar: string;
  walkerPhone: string;
  petName: string;
  petAvatar: string;
  status: 'in_progress' | 'completed' | 'paused' | 'aborted';
  startTime: string;
  endTime?: string;
  distanceKm: number;
  activeDurationSeconds: number;
  currentSpeedKmH: number;
  avgPace: string;
  walkerBatteryPct: number;
  collarBatteryPct: number;
  pottyCounts: {
    pee: number;
    poop: number;
  };
  isHydrated: boolean;
  safeZoneState: SafeZoneState;
  distanceToBoundaryM: number;
  safeZoneRadiusM: number;
  currentLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  timeline: ActivityTimelineEvent[];
}

export type EmergencyType = 'MANUAL_SOS' | 'ACCIDENT_DETECTED' | 'SAFE_ZONE_BREACH' | 'OTHER';
export type EmergencyStatus = 'Triggered' | 'Acknowledged' | 'In Progress' | 'Resolved' | 'Cancelled';

export interface EmergencyIncident {
  id: string;
  bookingId: string;
  walkSessionId?: string;
  userId: string;
  petId: string;
  walkerId: string;
  timestamp: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  emergencyType: EmergencyType;
  status: EmergencyStatus;
  title: string;
  description: string;
  autoDispatchSecondsRemaining: number;
  contactsNotified: {
    name: string;
    relationship: string;
    phone: string;
    status: 'Delivered' | 'Pending' | 'Calling';
  }[];
  vetClinic: {
    name: string;
    distance: string;
    phone: string;
    status: string;
  };
  resolvedAt?: string;
  resolutionNote?: string;
}

export interface SafetyEvent {
  id: string;
  type: 'SAFE_ZONE_WARNING' | 'SAFE_ZONE_BREACH' | 'MANUAL_SOS' | 'ACCIDENT_DETECTED' | 'INACTIVITY_ALERT';
  bookingId: string;
  walkSessionId?: string;
  userId: string;
  walkerId: string;
  petId: string;
  timestamp: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  status: 'ACTIVE' | 'RESOLVED';
  resolutionNotes?: string;
}

export interface Review {
  id: string;
  bookingId: string;
  providerId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  providerName?: string;
  serviceName?: string;
  rating: number;
  comment: string;
  createdAt: string;
  status?: 'Published' | 'Reported' | 'Hidden';
  reportedReason?: string;
}

export interface PlatformSettings {
  safeZoneWarningThresholdMeters: number;
  emergencyCountdownDurationSeconds: number;
  accidentDetectionTimeoutSeconds: number;
  platformCommissionPercent: number;
  satelliteRefreshIntervalSeconds: number;
  autoDispatchUnits: boolean;
  supportEmergencyHotline: string;
}

export interface AdminAuditLog {
  id: string;
  action: string;
  targetType: string;
  targetId: string;
  adminName: string;
  timestamp: string;
  details: string;
}

export interface AdminBroadcastNotification {
  id: string;
  title: string;
  message: string;
  category: 'Booking' | 'Service' | 'Safety' | 'Emergency' | 'System' | 'Announcement';
  targetAudience: 'ALL_USERS' | 'ACTIVE_WALKERS' | 'VETERINARIANS' | 'ALL_PROVIDERS';
  createdAt: string;
  sentCount: number;
  status: 'Sent' | 'Scheduled' | 'Draft';
}

export * from './reports.ts';
