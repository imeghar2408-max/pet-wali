/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ServiceReportType = 'DOG_WALKER' | 'DOG_TRAINER' | 'PET_GROOMER' | 'PET_BOARDING';

export interface BaseServiceReport {
  id: string;
  bookingId: string;
  bookingRef: string;
  serviceType: ServiceReportType;
  serviceTitle: string;
  petId: string;
  petName: string;
  petBreed: string;
  petPhotoUrl: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  providerRoleTitle: string;
  date: string;
  startTime?: string;
  endTime?: string;
  durationMinutes: number;
  notes: string;
  rating?: number | null;
  reviewComment?: string;
  createdAt: string;
}

export interface WalkRouteWaypoint {
  lat: number;
  lng: number;
  label?: string;
  time?: string;
  type?: 'start' | 'waypoint' | 'water' | 'potty' | 'end';
}

export interface WalkReport extends BaseServiceReport {
  serviceType: 'DOG_WALKER';
  distanceKm: number;
  avgPace: string;
  safeZoneCompliancePct: number;
  safeZoneBreaches: number;
  safeZoneRadiusM: number;
  waterBreaks: number;
  pottyEvents: {
    pee: number;
    poop: number;
    timestamps: string[];
  };
  walkNotes: string;
  photos: {
    url: string;
    caption: string;
    time: string;
  }[];
  route: {
    startAddress: string;
    endAddress: string;
    waypoints: WalkRouteWaypoint[];
  };
}

export interface TrainingExercise {
  id: string;
  name: string;
  target: string;
  accuracyPercent: number; // e.g. 70
  status: 'Mastered' | 'Proficient' | 'Needs Practice';
  notes: string;
}

export interface SkillProgressMetric {
  skill: string; // "Recall", "Stay", "Heel", "Leave It"
  currentPercent: number; // 70%, 85%, 55%
  previousPercent: number; // 50%, 70%, 40%
  targetPercent: number; // 100%
}

export interface TrainingSessionHistoryItem {
  sessionNumber: number;
  date: string;
  durationMinutes: number;
  skills: {
    skill: string;
    score: number;
  }[];
  summary: string;
}

export interface TrainingReport extends BaseServiceReport {
  serviceType: 'DOG_TRAINER';
  sessionNumber: number;
  totalSessions: number;
  moduleTitle: string;
  trainingGoals: string[];
  exercisesCompleted: TrainingExercise[];
  skillProgress: SkillProgressMetric[];
  sessionHistory: TrainingSessionHistoryItem[];
  trainerNotes: string;
  homeworkRecommendations: string[];
  photos: {
    url: string;
    caption: string;
    time: string;
  }[];
}

export interface GroomingReport extends BaseServiceReport {
  serviceType: 'PET_GROOMER';
  servicesCompleted: string[];
  coatCondition: {
    condition: 'Healthy & Glossy' | 'Mild Matting Treated' | 'Dry Skin Soothed' | 'De-shedded';
    shampooUsed: string;
    sheddingLevel: 'Low' | 'Moderate' | 'Heavy';
    notes: string;
  };
  nailTrimming: {
    completed: boolean;
    method: string;
    pawBalmApplied: boolean;
  };
  bath: {
    shampoo: string;
    hypoallergenic: boolean;
    conditionerApplied: boolean;
    blowDryStyle: string;
  };
  haircut: {
    style: string;
    guardLength: string;
    sanitaryTrim: boolean;
  };
  earCleaning: {
    completed: boolean;
    condition: string;
    notes: string;
  };
  specialObservations: string;
  beforePhotos: {
    url: string;
    label: string;
    description: string;
  }[];
  afterPhotos: {
    url: string;
    label: string;
    description: string;
  }[];
  groomerNotes: string;
}

export interface BoardingMeal {
  time: string;
  mealType: 'Breakfast' | 'Dinner' | 'Healthy Snack';
  foodType: string;
  portionsEatenPct: number;
  notes: string;
}

export interface BoardingActivity {
  time: string;
  title: string;
  durationMinutes: number;
  description: string;
  mood: 'Energetic' | 'Playful' | 'Relaxed' | 'Resting';
}

export interface BoardingWalk {
  time: string;
  distanceKm: number;
  durationMinutes: number;
  safeZoneCompliancePct: number;
  walkerName: string;
}

export interface BoardingReport extends BaseServiceReport {
  serviceType: 'PET_BOARDING';
  checkIn: string;
  checkOut: string;
  totalStayHours: number;
  suiteType: string;
  meals: BoardingMeal[];
  activities: BoardingActivity[];
  walks: BoardingWalk[];
  photos: {
    url: string;
    caption: string;
    time: string;
  }[];
  caregiverNotes: string;
}

export type ServiceReport = WalkReport | TrainingReport | GroomingReport | BoardingReport;
