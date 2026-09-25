import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { AdminLayout } from './AdminLayout.tsx';

import { AdminDashboardView } from './views/AdminDashboardView.tsx';
import { AdminUsersView } from './views/AdminUsersView.tsx';
import { AdminPetsView } from './views/AdminPetsView.tsx';
import { AdminProvidersView } from './views/AdminProvidersView.tsx';
import { AdminBookingsView } from './views/AdminBookingsView.tsx';
import { AdminLiveWalksView } from './views/AdminLiveWalksView.tsx';
import { AdminEmergencyCenterView } from './views/AdminEmergencyCenterView.tsx';
import { AdminServicesView } from './views/AdminServicesView.tsx';
import { AdminPaymentsView } from './views/AdminPaymentsView.tsx';
import { AdminReviewsView } from './views/AdminReviewsView.tsx';
import { AdminNotificationsView } from './views/AdminNotificationsView.tsx';
import { AdminAnalyticsView } from './views/AdminAnalyticsView.tsx';
import { AdminSettingsView } from './views/AdminSettingsView.tsx';

export const AdminApp: React.FC = () => {
  const { adminTab } = useApp();

  return (
    <AdminLayout>
      {adminTab === 'dashboard' && <AdminDashboardView />}
      {adminTab === 'users' && <AdminUsersView />}
      {adminTab === 'pets' && <AdminPetsView />}
      {adminTab === 'providers' && <AdminProvidersView />}
      {adminTab === 'bookings' && <AdminBookingsView />}
      {adminTab === 'live-walks' && <AdminLiveWalksView />}
      {adminTab === 'emergency-center' && <AdminEmergencyCenterView />}
      {adminTab === 'services' && <AdminServicesView />}
      {adminTab === 'payments' && <AdminPaymentsView />}
      {adminTab === 'reviews' && <AdminReviewsView />}
      {adminTab === 'notifications' && <AdminNotificationsView />}
      {adminTab === 'analytics' && <AdminAnalyticsView />}
      {adminTab === 'settings' && <AdminSettingsView />}
    </AdminLayout>
  );
};
