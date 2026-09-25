import React, { useState } from 'react';
import { useApp, AdminTab } from '../context/AppContext.tsx';
import { initialAdminUser, initialUser } from '../server/db.ts';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const {
    user,
    isAdmin,
    adminTab,
    setAdminTab,
    setAppMode,
    switchActiveUser,
    activeEmergency,
    emergencies,
  } = useApp();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Authorization Check: Non-admins get access denied screen
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6 antialiased font-sans">
        <div className="w-full max-w-lg bg-slate-800/90 backdrop-blur-md rounded-2xl p-8 border border-slate-700 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mx-auto flex items-center justify-center shadow-inner">
            <span className="material-symbols-outlined text-[36px]">shield_lock</span>
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-wider">
              403 Forbidden • Access Denied
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Administrator Privileges Required
            </h1>
            <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              Your current authenticated session (<strong className="text-slate-200">{user.name}</strong>, role: <code className="bg-slate-900 px-1.5 py-0.5 rounded text-rose-300">{user.role}</code>) does not have access permissions to view the PetCare Platform Operations Console.
            </p>
          </div>

          <div className="bg-slate-900/80 rounded-xl p-4 text-xs text-left space-y-2 border border-slate-700/60 font-mono text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">Security Gate:</span>
              <span className="text-emerald-400">ENFORCED (Role-Based Access)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Required Role:</span>
              <span className="text-rose-400">ADMIN</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Active User Role:</span>
              <span>{user.role}</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {/* Direct Admin Login switch for authorized testing / production ops */}
            <button
              onClick={() => switchActiveUser(initialAdminUser)}
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
              <span>Authenticate as Administrator (Marcus Vance)</span>
            </button>

            <button
              onClick={() => setAppMode('USER')}
              className="w-full h-10 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-medium transition-all"
            >
              Return to Pet Owner App
            </button>
          </div>
        </div>
      </div>
    );
  }

  const navItems: { tab: AdminTab; label: string; icon: string; badge?: number; badgeColor?: string }[] = [
    { tab: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { tab: 'users', label: 'Users', icon: 'group' },
    { tab: 'pets', label: 'Pets', icon: 'pets' },
    { tab: 'providers', label: 'Service Providers', icon: 'badge' },
    { tab: 'bookings', label: 'Bookings', icon: 'calendar_month' },
    { tab: 'live-walks', label: 'Live Walks', icon: 'explore' },
    {
      tab: 'emergency-center',
      label: 'Emergency Center',
      icon: 'e911_emergency',
      badge: emergencies.filter((e) => e.status !== 'Resolved' && e.status !== 'Cancelled').length,
      badgeColor: 'bg-rose-500 text-white animate-pulse',
    },
    { tab: 'services', label: 'Services', icon: 'category' },
    { tab: 'payments', label: 'Payments', icon: 'payments' },
    { tab: 'reviews', label: 'Reviews & Reports', icon: 'rate_review' },
    { tab: 'notifications', label: 'Notifications', icon: 'campaign' },
    { tab: 'analytics', label: 'Analytics', icon: 'analytics' },
    { tab: 'settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex antialiased font-sans selection:bg-emerald-500 selection:text-white">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Persistent Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col justify-between ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto no-scrollbar">
          {/* Logo Header */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0 shadow-md">
                <span className="material-symbols-outlined text-white text-[20px]">pets</span>
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col truncate">
                  <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5 leading-none">
                    PetCare
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                      Admin
                    </span>
                  </span>
                  <span className="text-[10px] text-slate-400 truncate mt-1">
                    Platform Ops Console
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden md:flex w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 items-center justify-center"
            >
              <span className="material-symbols-outlined text-[18px]">
                {sidebarCollapsed ? 'chevron_right' : 'chevron_left'}
              </span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const isActive = adminTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => {
                    setAdminTab(item.tab);
                    setMobileSidebarOpen(false);
                  }}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      isActive ? 'material-symbols-fill' : ''
                    }`}
                  >
                    {item.icon}
                  </span>
                  {!sidebarCollapsed && <span className="truncate flex-1 text-left">{item.label}</span>}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.badgeColor || 'bg-slate-800 text-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Current Admin Profile & Switch to User App */}
        <div className="p-3 border-t border-slate-800 shrink-0 space-y-2 bg-slate-900/80">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-800/50">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-emerald-500/50"
            />
            {!sidebarCollapsed && (
              <div className="flex flex-col min-w-0 flex-1 text-left">
                <span className="text-xs font-bold text-white truncate leading-tight">
                  {user.name}
                </span>
                <span className="text-[10px] text-slate-400 truncate">Platform Administrator</span>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setAppMode('PROVIDER');
            }}
            className="w-full py-2 px-2 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>🐕</span>
            {!sidebarCollapsed && <span>PetCare Provider App</span>}
          </button>

          <button
            onClick={() => {
              // Switch role back to consumer user
              switchActiveUser(initialUser);
              setAppMode('USER');
            }}
            className="w-full py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">switch_account</span>
            {!sidebarCollapsed && <span>Switch to User App</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
        {/* Top Header */}
        <header className="h-16 px-6 bg-slate-900/70 backdrop-blur-md border-b border-slate-800 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden w-9 h-9 rounded-lg text-slate-300 hover:bg-slate-800 flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[20px]">menu</span>
            </button>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Admin</span>
              <span>/</span>
              <span className="font-semibold text-slate-100 capitalize">
                {adminTab.replace('-', ' ')}
              </span>
            </div>
          </div>

          {/* Header Marquee for Active Emergency */}
          {activeEmergency && (
            <div
              onClick={() => setAdminTab('emergency-center')}
              className="hidden lg:flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/30 rounded-full text-rose-400 text-xs font-semibold cursor-pointer animate-pulse"
            >
              <span className="material-symbols-outlined text-[16px] text-rose-500">warning</span>
              <span>ACTIVE INCIDENT: {activeEmergency.title} (Oakwood Zone)</span>
              <span className="text-[10px] underline ml-1">Open Ops Center &rarr;</span>
            </div>
          )}

          {/* Right Header Badges */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/80 rounded-lg text-slate-400 text-xs border border-slate-700/60">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Telemetry Core: Online</span>
            </div>

            <button
              onClick={() => setAdminTab('settings')}
              className="w-9 h-9 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">tune</span>
            </button>

            <button
              onClick={() => {
                switchActiveUser(initialUser);
                setAppMode('USER');
              }}
              className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span className="hidden sm:inline">View Consumer App</span>
            </button>
          </div>
        </header>

        {/* Viewport Content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
};
