/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ProviderAppProvider, useProviderApp } from './ProviderContext.tsx';
import { ProviderHeader } from './components/ProviderHeader.tsx';
import { ProviderBottomNav } from './components/ProviderBottomNav.tsx';
import { ProviderHomeScreen } from './screens/ProviderHomeScreen.tsx';
import { IncomingRequestModal } from './screens/IncomingRequestModal.tsx';
import { NavigationScreen } from './screens/NavigationScreen.tsx';
import { ArrivalAndHandoverScreen } from './screens/ArrivalAndHandoverScreen.tsx';
import { LiveWalkScreen } from './screens/LiveWalkScreen.tsx';
import { LiveTrainingScreen } from './screens/LiveTrainingScreen.tsx';
import { LiveGroomingScreen } from './screens/LiveGroomingScreen.tsx';
import { LiveBoardingScreen } from './screens/LiveBoardingScreen.tsx';
import { ServiceCompletionSummary } from './screens/ServiceCompletionSummary.tsx';
import { ProviderEarningsScreen } from './screens/ProviderEarningsScreen.tsx';
import { ProviderScheduleScreen } from './screens/ProviderScheduleScreen.tsx';
import { AssignmentHistoryScreen } from './screens/AssignmentHistoryScreen.tsx';
import { ProviderProfileScreen } from './screens/ProviderProfileScreen.tsx';
import { ProviderOnboardingModal } from './screens/ProviderOnboardingModal.tsx';
import { CustomerRatingDrawerModal } from './components/CustomerRatingDrawerModal.tsx';
import { EmergencySosModal } from './components/EmergencySosModal.tsx';
import { AccidentDetectionModal } from './components/AccidentDetectionModal.tsx';
import { Star, CheckCircle2 } from 'lucide-react';

interface ProviderMainProps {
  onSwitchAppMode: (mode: 'PROVIDER' | 'USER' | 'ADMIN') => void;
  currentAppMode: 'PROVIDER' | 'USER' | 'ADMIN';
}

const ProviderMain: React.FC<ProviderMainProps> = ({ onSwitchAppMode, currentAppMode }) => {
  const {
    currentTab,
    subView,
    activeAssignment,
    latestCustomerRatingAlert,
    setLatestCustomerRatingAlert,
    setRatingModalOpen,
  } = useProviderApp();

  const renderDashboardContent = () => {
    if (subView === 'navigation') {
      return <NavigationScreen />;
    }
    if (subView === 'handover') {
      return <ArrivalAndHandoverScreen />;
    }
    if (subView === 'live-service') {
      if (activeAssignment?.serviceType === 'DOG_WALKER') {
        return <LiveWalkScreen />;
      }
      if (activeAssignment?.serviceType === 'DOG_TRAINER') {
        return <LiveTrainingScreen />;
      }
      if (activeAssignment?.serviceType === 'PET_GROOMER') {
        return <LiveGroomingScreen />;
      }
      if (activeAssignment?.serviceType === 'PET_BOARDING') {
        return <LiveBoardingScreen />;
      }
      return <LiveWalkScreen />;
    }
    if (subView === 'completion-summary') {
      return <ServiceCompletionSummary />;
    }
    return <ProviderHomeScreen />;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col antialiased">
      {/* Top Header */}
      <ProviderHeader
        onSwitchAppMode={onSwitchAppMode}
        currentAppMode={currentAppMode}
      />

      {/* Real-time Customer Rating Received Toast Alert */}
      {latestCustomerRatingAlert && (
        <div className="fixed top-18 left-4 right-4 z-50 max-w-md mx-auto bg-slate-900 text-white p-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-between animate-in slide-in-from-top-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold flex-shrink-0">
              <Star className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-amber-400">
                  {latestCustomerRatingAlert.customerName} rated you ★ {latestCustomerRatingAlert.rating}
                </span>
                <span className="text-[10px] text-slate-400">({latestCustomerRatingAlert.petName})</span>
              </div>
              <p className="text-[11px] text-slate-300 line-clamp-1 italic">
                "{latestCustomerRatingAlert.comment}"
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setRatingModalOpen(true);
                setLatestCustomerRatingAlert(null);
              }}
              className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 bg-slate-800 px-2.5 py-1 rounded-lg"
            >
              View
            </button>
            <button
              onClick={() => setLatestCustomerRatingAlert(null)}
              className="text-slate-400 hover:text-white text-xs px-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Viewport */}
      <main className="flex-1 w-full pt-16">
        {currentTab === 'dashboard' && renderDashboardContent()}
        {currentTab === 'schedule' && <ProviderScheduleScreen />}
        {currentTab === 'history' && <AssignmentHistoryScreen />}
        {currentTab === 'earnings' && <ProviderEarningsScreen />}
        {currentTab === 'profile' && <ProviderProfileScreen />}
      </main>

      {/* Floating Bottom Navigation */}
      <ProviderBottomNav />

      {/* Global Overlays & Modals */}
      <IncomingRequestModal />
      <CustomerRatingDrawerModal />
      <EmergencySosModal />
      <AccidentDetectionModal />
      <ProviderOnboardingModal />
    </div>
  );
};

export const ProviderApp: React.FC<ProviderMainProps> = (props) => {
  return (
    <ProviderAppProvider>
      <ProviderMain {...props} />
    </ProviderAppProvider>
  );
};
