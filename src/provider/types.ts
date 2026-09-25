/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ProviderServiceType =
  | 'DOG_WALKER'
  | 'DOG_TRAINER'
  | 'PET_GROOMER';

export type AssignmentStatus =
  | 'PENDING_ACCEPTANCE'
  | 'ACCEPTED'
  | 'NAVIGATING_TO_CUSTOMER'
  | 'ARRIVED_AT_CUSTOMER'
  | 'IN_SERVICE'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DECLINED';

export type SafeZoneState = 'GREEN' | 'YELLOW' | 'RED';

export interface ProviderPet {
  id: string;
  name: string;
  breed: string;
  species: 'Dog' | 'Cat';
  ageYears: number;
  weightKg: number;
  photoUrl: string;
  temperament: string;
  specialInstructions: string;
  allergies?: string;
  microchipId?: string;
  leashNotes?: string;
  feedingSchedule?: string;
}

export interface ProviderCustomer {
  id: string;
  name: string;
  phone: string;
  rating: number;
  totalBookings: number;
  avatar: string;
  emergencyContact?: {
    name: string;
    phone: string;
  };
}

export interface CustomerReviewForProvider {
  id: string;
  customerName: string;
  customerAvatar: string;
  petName: string;
  serviceTitle: string;
  date: string;
  rating: number;
  comment: string;
  categoryScores: {
    professionalism: number; // e.g. 5.0
    petHandling: number; // e.g. 5.0
    punctuality: number; // e.g. 4.9
    serviceQuality: number; // e.g. 5.0
  };
  tags: string[];
}

export interface ProviderAssignment {
  id: string;
  bookingRef: string;
  serviceType: ProviderServiceType;
  serviceTitle: string;
  customer: ProviderCustomer;
  pet: ProviderPet;
  pickupAddress: string;
  pickupCoords: { lat: number; lng: number };
  distanceKm: number;
  estimatedArrivalMin: number;
  scheduledTime: string;
  scheduledDate: string;
  durationMinutes: number;
  estimatedEarnings: number;
  baseEarnings: number;
  distanceBonus: number;
  tip?: number;
  status: AssignmentStatus;
  safeZoneRadiusMeters: number;
  specialRequirements: string[];
  createdAt: string;
  notes?: string;
  ratingReceived?: number;
  reviewComment?: string;
  cancellationReason?: string;
  boardingDates?: {
    checkInDate: string;
    checkOutDate: string;
    checkInTime: string;
    checkOutTime: string;
    durationDays: number;
  };
  checklist?: {
    petReceived: boolean;
    leashSecured: boolean;
    conditionChecked: boolean;
    safeZoneVerified: boolean;
  };
  liveWalkTelemetry?: {
    distanceWalkedKm: number;
    durationSeconds: number;
    currentSpeedKmH: number;
    currentPace: string;
    safeZoneState: SafeZoneState;
    distanceToBoundaryM: number;
    hydrationCount: number;
    peeCount: number;
    poopCount: number;
    isWalking: boolean;
    safeZoneCompliancePct: number;
  };
  trainingProgress?: {
    drills: { id: string; name: string; completed: boolean }[];
    temperamentScore: number;
    trainerNotes: string;
  };
  groomingProgress?: {
    steps: { id: string; name: string; completed: boolean }[];
    coatCondition: string;
    notes: string;
  };
  boardingProgress?: {
    checkInTime: string;
    mealsGiven: { time: string; item: string }[];
    medicationAdministered: boolean;
    dailyExerciseMin: number;
    notes: string;
  };
}

export interface ProviderProfile {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  email: string;
  address: string;
  rating: number;
  totalReviews: number;
  totalCompletedJobs: number;
  experienceYears: number;
  bio: string;
  serviceTypes: ProviderServiceType[];
  serviceAreaRadiusKm: number;
  basePricing: {
    dogWalking: number;
    dogTraining: number;
    petGrooming: number;
    petBoarding: number;
  };
  categoryRatings: {
    professionalism: number;
    petHandling: number;
    punctuality: number;
    serviceQuality: number;
  };
  acceptanceRatePct: number;
  completionRatePct: number;
  verificationStatus: 'Verified' | 'Under Review' | 'Pending' | 'Rejected';
  documents: {
    id: string;
    name: string;
    type: string;
    status: 'Verified' | 'Under Review' | 'Pending';
    uploadDate: string;
    badgeUrl?: string;
  }[];
}

export interface ProviderTransaction {
  id: string;
  bookingRef: string;
  petName: string;
  serviceTitle: string;
  date: string;
  amount: number;
  type: 'EARNING' | 'TIP' | 'BONUS' | 'WITHDRAWAL';
  status: 'COMPLETED' | 'PENDING';
}

export interface ProviderEarningsSummary {
  todayTotal: number;
  todayBase: number;
  todayBonus: number;
  todayTips: number;
  todayJobsCount: number;
  todayOnlineHours: number;
  weeklyTotal: number;
  monthlyTotal: number;
  availableForPayout: number;
  pendingPayouts: number;
  dailyEarnings: {
    day: string;
    date: string;
    amount: number;
    jobs: number;
  }[];
  recentPayouts: {
    id: string;
    amount: number;
    date: string;
    status: 'SUCCESS' | 'PROCESSING';
    bankAccount: string;
  }[];
  transactions: ProviderTransaction[];
}

export type ProviderNotificationCategory =
  | 'NEW_ASSIGNMENT'
  | 'ASSIGNMENT_CANCELLED'
  | 'CUSTOMER_ARRIVAL'
  | 'UPCOMING_SERVICE'
  | 'CUSTOMER_MESSAGE'
  | 'PAYMENT_UPDATE'
  | 'RATING_RECEIVED'
  | 'SAFETY_WARNING'
  | 'SAFE_ZONE_BREACH'
  | 'EMERGENCY_ALERT';

export interface ProviderNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: ProviderNotificationCategory;
  isRead: boolean;
  actionPayload?: any;
}
