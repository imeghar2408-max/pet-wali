/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Header } from './components/Header.tsx';
import { BottomNav } from './components/BottomNav.tsx';
import { NotificationDrawer } from './components/NotificationDrawer.tsx';
import { AccidentDetectionModal } from './components/AccidentDetectionModal.tsx';
import { DigitalPetIdModal } from './components/DigitalPetIdModal.tsx';
import { AddPetModal, EditPetModal } from './components/PetModals.tsx';
import { QuickPetSettingsModal } from './components/QuickPetSettingsModal.tsx';
import { HomeScreen } from './screens/HomeScreen.tsx';
import { BookingScreen } from './screens/BookingScreen.tsx';
import { LiveWalkScreen } from './screens/LiveWalkScreen.tsx';
import { EmergencySosScreen } from './screens/EmergencySosScreen.tsx';
import { PetProfileScreen } from './screens/PetProfileScreen.tsx';
import { MyBookingsScreen } from './screens/MyBookingsScreen.tsx';
import { MessagesScreen } from './screens/MessagesScreen.tsx';
import { UserProfileScreen } from './screens/UserProfileScreen.tsx';
import { ServicesMarketplaceScreen } from './screens/ServicesMarketplaceScreen.tsx';
import { SafeZoneScreen } from './screens/SafeZoneScreen.tsx';
import { SplashOnboardingAuthModal } from './components/SplashOnboardingAuthModal.tsx';
import { ReviewModal } from './components/ReviewModal.tsx';
import { ProviderApp } from './provider/ProviderApp.tsx';
import { AdminApp } from './admin/AdminApp.tsx';
import { Pet } from './types/index.ts';

const MainApp: React.FC = () => {
  const { currentTab, appMode, setAppMode } = useApp();

  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [addPetModalOpen, setAddPetModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);

  // Render the PetCare Provider Captain application (Default Primary Experience)
  if (appMode === 'PROVIDER') {
    return (
      <ProviderApp
        onSwitchAppMode={(mode) => setAppMode(mode)}
        currentAppMode={appMode}
      />
    );
  }

  // If in Admin Mode, render the dedicated professional SaaS Operations console
  if (appMode === 'ADMIN') {
    return <AdminApp />;
  }

  // Determine back arrow visibility in header
  const isSubScreen =
    currentTab === 'live-walk' ||
    currentTab === 'emergency-sos' ||
    currentTab === 'service-booking' ||
    currentTab === 'safe-zone';

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#161c27] flex flex-col antialiased">
      {/* Fixed Top Header */}
      <Header
        showBack={isSubScreen}
        onNotificationClick={() => setNotificationDrawerOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 w-full pt-16">
        {currentTab === 'home' && (
          <HomeScreen
            onOpenAddPet={() => setAddPetModalOpen(true)}
            onOpenQuickSettings={() => setQuickSettingsOpen(true)}
          />
        )}
        {currentTab === 'services' && <ServicesMarketplaceScreen />}
        {currentTab === 'service-booking' && <BookingScreen />}
        {currentTab === 'safe-zone' && <SafeZoneScreen />}
        {currentTab === 'live-walk' && <LiveWalkScreen />}
        {currentTab === 'emergency-sos' && <EmergencySosScreen />}
        {currentTab === 'pets' && (
          <PetProfileScreen onOpenEditPet={(pet) => setEditingPet(pet)} />
        )}
        {currentTab === 'bookings' && <MyBookingsScreen />}
        {currentTab === 'messages' && <MessagesScreen />}
        {currentTab === 'profile' && <UserProfileScreen />}
      </main>

      {/* Floating Bottom Navigation */}
      <BottomNav />

      {/* Overlays and Modals */}
      <NotificationDrawer
        isOpen={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
      />
      <AccidentDetectionModal />
      <DigitalPetIdModal />
      <AddPetModal
        isOpen={addPetModalOpen}
        onClose={() => setAddPetModalOpen(false)}
      />
      <EditPetModal
        pet={editingPet}
        onClose={() => setEditingPet(null)}
      />
      <QuickPetSettingsModal
        isOpen={quickSettingsOpen}
        onClose={() => setQuickSettingsOpen(false)}
        onOpenAddPet={() => setAddPetModalOpen(true)}
      />
      <SplashOnboardingAuthModal />
      <ReviewModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
