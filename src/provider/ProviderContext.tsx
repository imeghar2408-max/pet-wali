/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  ProviderProfile,
  ProviderAssignment,
  ProviderEarningsSummary,
  ProviderNotification,
  ProviderServiceType,
  AssignmentStatus,
  SafeZoneState,
  CustomerReviewForProvider,
} from './types.ts';
import {
  initialProviderProfile,
  sampleIncomingRequests,
  initialScheduledAssignments,
  initialAssignmentHistory,
  initialEarningsSummary,
  initialProviderNotifications,
  sampleCustomerReviews,
} from './mockData.ts';

export type ProviderTab = 'dashboard' | 'schedule' | 'earnings' | 'history' | 'profile';
export type ProviderSubView = 'main' | 'navigation' | 'handover' | 'live-service' | 'completion-summary';

interface ProviderContextType {
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  toggleOnline: () => void;

  providerProfile: ProviderProfile;
  updateProfile: (updates: Partial<ProviderProfile>) => void;
  uploadDocument: (name: string, type: string) => void;

  currentTab: ProviderTab;
  setCurrentTab: (tab: ProviderTab) => void;

  subView: ProviderSubView;
  setSubView: (view: ProviderSubView) => void;

  activeRequest: ProviderAssignment | null;
  requestCountdown: number;
  dispatchSimulatedRequest: (type?: ProviderServiceType) => void;
  acceptRequest: () => void;
  declineRequest: (reason?: string) => void;

  activeAssignment: ProviderAssignment | null;
  setActiveAssignment: (assignment: ProviderAssignment | null) => void;
  startNavigation: () => void;
  markArrived: () => void;
  startService: () => void;
  updateLiveTelemetry: (updates: Partial<NonNullable<ProviderAssignment['liveWalkTelemetry']>>) => void;
  toggleSafeZoneState: (state: SafeZoneState) => void;
  logPotty: (type: 'pee' | 'poop') => void;
  logHydration: () => void;
  updateTrainingDrill: (drillId: string, completed: boolean) => void;
  updateGroomingStep: (stepId: string, completed: boolean) => void;
  endService: () => void;
  completeAssignmentAndCreditEarnings: (notes: string, tip?: number) => void;

  scheduledAssignments: ProviderAssignment[];
  assignmentHistory: ProviderAssignment[];
  historyFilter: 'COMPLETED' | 'CANCELLED' | 'DECLINED';
  setHistoryFilter: (filter: 'COMPLETED' | 'CANCELLED' | 'DECLINED') => void;

  earningsSummary: ProviderEarningsSummary;
  requestPayout: (amount: number) => void;

  reviews: CustomerReviewForProvider[];
  ratingModalOpen: boolean;
  setRatingModalOpen: (open: boolean) => void;
  latestCustomerRatingAlert: CustomerReviewForProvider | null;
  setLatestCustomerRatingAlert: (rev: CustomerReviewForProvider | null) => void;

  notifications: ProviderNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  emergencySosOpen: boolean;
  setEmergencySosOpen: (open: boolean) => void;
  accidentModalOpen: boolean;
  setAccidentModalOpen: (open: boolean) => void;
  triggerAccidentDetectionSim: () => void;

  onboardingModalOpen: boolean;
  setOnboardingModalOpen: (open: boolean) => void;
  selectedScheduleDetail: ProviderAssignment | null;
  setSelectedScheduleDetail: (assignment: ProviderAssignment | null) => void;
}

const ProviderContext = createContext<ProviderContextType | null>(null);

export const ProviderAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [providerProfile, setProviderProfile] = useState<ProviderProfile>(initialProviderProfile);
  const [currentTab, setCurrentTab] = useState<ProviderTab>('dashboard');
  const [subView, setSubView] = useState<ProviderSubView>('main');

  const [activeRequest, setActiveRequest] = useState<ProviderAssignment | null>(null);
  const [requestCountdown, setRequestCountdown] = useState<number>(15);
  const countdownIntervalRef = useRef<any>(null);

  const [activeAssignment, setActiveAssignment] = useState<ProviderAssignment | null>(null);
  const [scheduledAssignments, setScheduledAssignments] = useState<ProviderAssignment[]>(initialScheduledAssignments);
  const [assignmentHistory, setAssignmentHistory] = useState<ProviderAssignment[]>(initialAssignmentHistory);
  const [historyFilter, setHistoryFilter] = useState<'COMPLETED' | 'CANCELLED' | 'DECLINED'>('COMPLETED');

  const [earningsSummary, setEarningsSummary] = useState<ProviderEarningsSummary>(initialEarningsSummary);
  const [reviews, setReviews] = useState<CustomerReviewForProvider[]>(sampleCustomerReviews);
  const [notifications, setNotifications] = useState<ProviderNotification[]>(initialProviderNotifications);

  const [ratingModalOpen, setRatingModalOpen] = useState<boolean>(false);
  const [latestCustomerRatingAlert, setLatestCustomerRatingAlert] = useState<CustomerReviewForProvider | null>(null);

  const [emergencySosOpen, setEmergencySosOpen] = useState<boolean>(false);
  const [accidentModalOpen, setAccidentModalOpen] = useState<boolean>(false);
  const [onboardingModalOpen, setOnboardingModalOpen] = useState<boolean>(false);
  const [selectedScheduleDetail, setSelectedScheduleDetail] = useState<ProviderAssignment | null>(null);

  // Live timer for active walk simulation
  useEffect(() => {
    let interval: any = null;
    if (activeAssignment?.status === 'IN_SERVICE' && activeAssignment.serviceType === 'DOG_WALKER') {
      interval = setInterval(() => {
        setActiveAssignment((prev) => {
          if (!prev || !prev.liveWalkTelemetry) return prev;
          const currentSec = prev.liveWalkTelemetry.durationSeconds + 1;
          const currentDist = Number((prev.liveWalkTelemetry.distanceWalkedKm + 0.0015).toFixed(3));
          return {
            ...prev,
            liveWalkTelemetry: {
              ...prev.liveWalkTelemetry,
              durationSeconds: currentSec,
              distanceWalkedKm: currentDist,
              isWalking: true,
            },
          };
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeAssignment?.status, activeAssignment?.serviceType]);

  // Request countdown timer (15 seconds Captain window)
  useEffect(() => {
    if (activeRequest) {
      setRequestCountdown(15);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = setInterval(() => {
        setRequestCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current);
            // Timed out: record as declined and clear request
            if (activeRequest) {
              const timedOutRecord: ProviderAssignment = {
                ...activeRequest,
                status: 'DECLINED',
                cancellationReason: 'Acceptance window expired (15s limit). Dispatched to next captain in queue.',
              };
              setAssignmentHistory((h) => [timedOutRecord, ...h]);
            }
            setActiveRequest(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    }
    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [activeRequest]);

  const toggleOnline = () => {
    setIsOnline((prev) => {
      const next = !prev;
      if (!next && activeRequest) {
        setActiveRequest(null);
      }
      return next;
    });
  };

  const dispatchSimulatedRequest = (type?: ProviderServiceType) => {
    if (!isOnline) {
      setIsOnline(true);
    }
    const targetType = type || (providerProfile.serviceTypes[0] || 'DOG_WALKER');
    const template = sampleIncomingRequests[targetType] || sampleIncomingRequests.DOG_WALKER;
    const newReq: ProviderAssignment = {
      ...template,
      id: `req_${Date.now()}`,
      bookingRef: `PC-${targetType.slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      status: 'PENDING_ACCEPTANCE',
    };
    setActiveRequest(newReq);

    // Push in-app notification
    const dispatchNotif: ProviderNotification = {
      id: `notif_${Date.now()}`,
      title: 'New Service Assignment Dispatched',
      message: `${newReq.serviceTitle} for ${newReq.pet.name} matched near ${newReq.pickupAddress}.`,
      timestamp: 'Just now',
      type: 'NEW_ASSIGNMENT',
      isRead: false,
    };
    setNotifications((prev) => [dispatchNotif, ...prev]);
  };

  const acceptRequest = () => {
    if (!activeRequest) return;
    const accepted: ProviderAssignment = {
      ...activeRequest,
      status: 'ACCEPTED',
    };
    setActiveAssignment(accepted);
    setActiveRequest(null);
    setSubView('navigation');
    setCurrentTab('dashboard');

    const notif: ProviderNotification = {
      id: `notif_${Date.now()}`,
      title: 'Booking Accepted ✓',
      message: `You accepted ${accepted.serviceTitle} for ${accepted.pet.name}. Navigate to customer pickup.`,
      timestamp: 'Just now',
      type: 'NEW_ASSIGNMENT',
      isRead: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const declineRequest = (reason?: string) => {
    if (!activeRequest) return;
    const declinedRecord: ProviderAssignment = {
      ...activeRequest,
      status: 'DECLINED',
      cancellationReason: reason || 'Declined by Captain',
    };
    setAssignmentHistory((prev) => [declinedRecord, ...prev]);
    setActiveRequest(null);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
  };

  const startNavigation = () => {
    if (!activeAssignment) return;
    setActiveAssignment({
      ...activeAssignment,
      status: 'NAVIGATING_TO_CUSTOMER',
    });
    setSubView('navigation');
  };

  const markArrived = () => {
    if (!activeAssignment) return;
    setActiveAssignment({
      ...activeAssignment,
      status: 'ARRIVED_AT_CUSTOMER',
    });
    setSubView('handover');

    const notif: ProviderNotification = {
      id: `notif_${Date.now()}`,
      title: 'Customer Arrival Handover',
      message: `Arrived at ${activeAssignment.customer.name}'s location for ${activeAssignment.pet.name}.`,
      timestamp: 'Just now',
      type: 'CUSTOMER_ARRIVAL',
      isRead: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const startService = () => {
    if (!activeAssignment) return;
    setActiveAssignment({
      ...activeAssignment,
      status: 'IN_SERVICE',
      checklist: {
        petReceived: true,
        leashSecured: true,
        conditionChecked: true,
        safeZoneVerified: true,
      },
    });
    setSubView('live-service');
  };

  const updateLiveTelemetry = (updates: Partial<NonNullable<ProviderAssignment['liveWalkTelemetry']>>) => {
    if (!activeAssignment || !activeAssignment.liveWalkTelemetry) return;
    setActiveAssignment({
      ...activeAssignment,
      liveWalkTelemetry: {
        ...activeAssignment.liveWalkTelemetry,
        ...updates,
      },
    });
  };

  const toggleSafeZoneState = (state: SafeZoneState) => {
    if (!activeAssignment || !activeAssignment.liveWalkTelemetry) return;
    const distanceM = state === 'GREEN' ? 750 : state === 'YELLOW' ? 120 : 0;
    setActiveAssignment({
      ...activeAssignment,
      liveWalkTelemetry: {
        ...activeAssignment.liveWalkTelemetry,
        safeZoneState: state,
        distanceToBoundaryM: distanceM,
        safeZoneCompliancePct: state === 'RED' ? 88 : 100,
      },
    });

    if (state === 'RED') {
      const breachNotif: ProviderNotification = {
        id: `notif_${Date.now()}`,
        title: 'Safe Zone Breach Alert!',
        message: 'Telemetry alert: You stepped outside approved 1.0 km perimeter. Return inside boundary.',
        timestamp: 'Just now',
        type: 'SAFE_ZONE_BREACH',
        isRead: false,
      };
      setNotifications((prev) => [breachNotif, ...prev]);
    }
  };

  const logPotty = (type: 'pee' | 'poop') => {
    if (!activeAssignment || !activeAssignment.liveWalkTelemetry) return;
    const current = activeAssignment.liveWalkTelemetry;
    setActiveAssignment({
      ...activeAssignment,
      liveWalkTelemetry: {
        ...current,
        peeCount: type === 'pee' ? current.peeCount + 1 : current.peeCount,
        poopCount: type === 'poop' ? current.poopCount + 1 : current.poopCount,
      },
    });
  };

  const logHydration = () => {
    if (!activeAssignment || !activeAssignment.liveWalkTelemetry) return;
    const current = activeAssignment.liveWalkTelemetry;
    setActiveAssignment({
      ...activeAssignment,
      liveWalkTelemetry: {
        ...current,
        hydrationCount: current.hydrationCount + 1,
      },
    });
  };

  const updateTrainingDrill = (drillId: string, completed: boolean) => {
    if (!activeAssignment || !activeAssignment.trainingProgress) return;
    const updatedDrills = activeAssignment.trainingProgress.drills.map((d) =>
      d.id === drillId ? { ...d, completed } : d
    );
    setActiveAssignment({
      ...activeAssignment,
      trainingProgress: {
        ...activeAssignment.trainingProgress,
        drills: updatedDrills,
      },
    });
  };

  const updateGroomingStep = (stepId: string, completed: boolean) => {
    if (!activeAssignment || !activeAssignment.groomingProgress) return;
    const updatedSteps = activeAssignment.groomingProgress.steps.map((s) =>
      s.id === stepId ? { ...s, completed } : s
    );
    setActiveAssignment({
      ...activeAssignment,
      groomingProgress: {
        ...activeAssignment.groomingProgress,
        steps: updatedSteps,
      },
    });
  };

  const endService = () => {
    if (!activeAssignment) return;
    setSubView('completion-summary');
  };

  const completeAssignmentAndCreditEarnings = (notes: string, tip: number = 0) => {
    if (!activeAssignment) return;
    const finalEarned = activeAssignment.estimatedEarnings + tip;
    const customerRating = 5.0; // Simulated customer rating
    const customerReviewComment = `Outstanding service for ${activeAssignment.pet.name}! Vikram was punctual, highly attentive, and shared live telemetry updates.`;

    const completedRecord: ProviderAssignment = {
      ...activeAssignment,
      status: 'COMPLETED',
      notes,
      tip,
      estimatedEarnings: finalEarned,
      ratingReceived: customerRating,
      reviewComment: customerReviewComment,
    };

    // Update earnings summary
    const newTx = {
      id: `tx_${Date.now()}`,
      bookingRef: activeAssignment.bookingRef,
      petName: `${activeAssignment.pet.name} (${activeAssignment.pet.breed})`,
      serviceTitle: activeAssignment.serviceTitle,
      date: 'Today · Just now',
      amount: finalEarned,
      type: 'EARNING' as const,
      status: 'COMPLETED' as const,
    };

    setEarningsSummary((prev) => ({
      ...prev,
      todayTotal: prev.todayTotal + finalEarned,
      todayBase: prev.todayBase + activeAssignment.baseEarnings,
      todayBonus: prev.todayBonus + activeAssignment.distanceBonus,
      todayTips: prev.todayTips + tip,
      todayJobsCount: prev.todayJobsCount + 1,
      availableForPayout: prev.availableForPayout + finalEarned,
      weeklyTotal: prev.weeklyTotal + finalEarned,
      monthlyTotal: prev.monthlyTotal + finalEarned,
      transactions: [newTx, ...prev.transactions],
    }));

    // Update profile total jobs
    setProviderProfile((prev) => ({
      ...prev,
      totalCompletedJobs: prev.totalCompletedJobs + 1,
      totalReviews: prev.totalReviews + 1,
    }));

    // Add to history
    setAssignmentHistory((prev) => [completedRecord, ...prev]);

    // Simulate Customer Rating received right after service
    const newCustomerReview: CustomerReviewForProvider = {
      id: `rev_${Date.now()}`,
      customerName: activeAssignment.customer.name,
      customerAvatar: activeAssignment.customer.avatar,
      petName: activeAssignment.pet.name,
      serviceTitle: activeAssignment.serviceTitle,
      date: 'Just now',
      rating: customerRating,
      comment: customerReviewComment,
      categoryScores: {
        professionalism: 5.0,
        petHandling: 5.0,
        punctuality: 5.0,
        serviceQuality: 5.0,
      },
      tags: ['Super Punctual', 'Live GPS Tracking', 'Gentle Care'],
    };

    setReviews((prev) => [newCustomerReview, ...prev]);
    setLatestCustomerRatingAlert(newCustomerReview);

    // Notifications: Payment and Rating
    const payNotif: ProviderNotification = {
      id: `notif_pay_${Date.now()}`,
      title: 'Payment Credited to Wallet',
      message: `₹${finalEarned} credited to your PetCare wallet for ${activeAssignment.serviceTitle} (${activeAssignment.pet.name}).`,
      timestamp: 'Just now',
      type: 'PAYMENT_UPDATE',
      isRead: false,
    };

    const ratingNotif: ProviderNotification = {
      id: `notif_rate_${Date.now()}`,
      title: 'Customer Rating Received ★★★★★',
      message: `${activeAssignment.customer.name} rated you 5.0 stars for ${activeAssignment.pet.name}'s service.`,
      timestamp: 'Just now',
      type: 'RATING_RECEIVED',
      isRead: false,
    };

    setNotifications((prev) => [ratingNotif, payNotif, ...prev]);

    // Clear active
    setActiveAssignment(null);
    setSubView('main');
    setCurrentTab('dashboard');
  };

  const requestPayout = (amount: number) => {
    if (amount <= 0 || amount > earningsSummary.availableForPayout) return;
    const newPayout = {
      id: `payout_${Date.now()}`,
      amount,
      date: 'Today · Just now',
      status: 'SUCCESS' as const,
      bankAccount: 'HDFC Bank •• 4912 (Instant IMPS)',
    };
    const withdrawalTx = {
      id: `tx_${Date.now()}`,
      bookingRef: `IMPS-${Date.now().toString().slice(-6)}`,
      petName: 'Wallet IMPS',
      serviceTitle: 'Instant Withdrawal to HDFC Bank (••4912)',
      date: 'Today · Just now',
      amount,
      type: 'WITHDRAWAL' as const,
      status: 'COMPLETED' as const,
    };

    setEarningsSummary((prev) => ({
      ...prev,
      availableForPayout: prev.availableForPayout - amount,
      recentPayouts: [newPayout, ...prev.recentPayouts],
      transactions: [withdrawalTx, ...prev.transactions],
    }));

    const notif: ProviderNotification = {
      id: `notif_${Date.now()}`,
      title: 'Instant Cashout Dispatched',
      message: `₹${amount} successfully transferred to HDFC Bank ••4912 via IMPS.`,
      timestamp: 'Just now',
      type: 'PAYMENT_UPDATE',
      isRead: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const updateProfile = (updates: Partial<ProviderProfile>) => {
    setProviderProfile((prev) => ({ ...prev, ...updates }));
  };

  const uploadDocument = (name: string, type: string) => {
    const newDoc = {
      id: `doc_${Date.now()}`,
      name,
      type,
      status: 'Under Review' as const,
      uploadDate: 'Today',
    };
    setProviderProfile((prev) => ({
      ...prev,
      documents: [...prev.documents, newDoc],
    }));
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const triggerAccidentDetectionSim = () => {
    setAccidentModalOpen(true);
  };

  return (
    <ProviderContext.Provider
      value={{
        isOnline,
        setIsOnline,
        toggleOnline,
        providerProfile,
        updateProfile,
        uploadDocument,
        currentTab,
        setCurrentTab,
        subView,
        setSubView,
        activeRequest,
        requestCountdown,
        dispatchSimulatedRequest,
        acceptRequest,
        declineRequest,
        activeAssignment,
        setActiveAssignment,
        startNavigation,
        markArrived,
        startService,
        updateLiveTelemetry,
        toggleSafeZoneState,
        logPotty,
        logHydration,
        updateTrainingDrill,
        updateGroomingStep,
        endService,
        completeAssignmentAndCreditEarnings,
        scheduledAssignments,
        assignmentHistory,
        historyFilter,
        setHistoryFilter,
        earningsSummary,
        requestPayout,
        reviews,
        ratingModalOpen,
        setRatingModalOpen,
        latestCustomerRatingAlert,
        setLatestCustomerRatingAlert,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        emergencySosOpen,
        setEmergencySosOpen,
        accidentModalOpen,
        setAccidentModalOpen,
        triggerAccidentDetectionSim,
        onboardingModalOpen,
        setOnboardingModalOpen,
        selectedScheduleDetail,
        setSelectedScheduleDetail,
      }}
    >
      {children}
    </ProviderContext.Provider>
  );
};

export const useProviderApp = () => {
  const context = useContext(ProviderContext);
  if (!context) {
    throw new Error('useProviderApp must be used within a ProviderAppProvider');
  }
  return context;
};
