import React from 'react';
import { useApp } from '../context/AppContext.tsx';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onNotificationClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack,
  onNotificationClick,
}) => {
  const { user, currentTab, setCurrentTab, unreadNotifsCount, setAppMode, setShowSplash } = useApp();

  const handleBack = () => {
    if (
      currentTab === 'live-walk' ||
      currentTab === 'emergency-sos' ||
      currentTab === 'service-booking' ||
      currentTab === 'safe-zone'
    ) {
      setCurrentTab('home');
    }
  };

  const getSubtitle = () => {
    if (subtitle) return subtitle;
    switch (currentTab) {
      case 'home':
        return 'Home Dashboard';
      case 'services':
        return 'Services Marketplace';
      case 'service-booking':
        return 'Service Booking';
      case 'safe-zone':
        return 'Safe Zone Radar';
      case 'live-walk':
        return 'Live Walk Tracking';
      case 'emergency-sos':
        return 'Emergency SOS';
      case 'pets':
        return 'Pet Profile & Medical';
      case 'bookings':
        return 'My Bookings';
      case 'messages':
        return 'Caregiver Chat';
      case 'profile':
        return 'Parent Account';
      default:
        return 'PetCare Marketplace';
    }
  };

  return (
    <header className="fixed top-0 w-full z-40 pt-safe bg-[#f9f9ff]/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#dde2f3]/50">
      <div className="max-w-md mx-auto h-16 px-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showBack ? (
            <button
              aria-label="Go back"
              onClick={handleBack}
              className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container-high/60 transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back_ios_new</span>
            </button>
          ) : null}

          {/* Brand Logo & Title */}
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => setCurrentTab('home')}
          >
            {/* Paw Icon SVG Logo */}
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-xs">
              <svg className="w-5 h-5 text-secondary-fixed" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-4.5 1c-.83 0-1.5.67-1.5 1.5S6.67 14 7.5 14s1.5-.67 1.5-1.5S8.33 11 7.5 11zm9 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM12 15c-1.66 0-3 1.34-3 3 0 .7.26 1.34.69 1.83.39.44.93.73 1.54.84.25.04.51.06.77.06s.52-.02.77-.06c.61-.11 1.15-.4 1.54-.84.43-.49.69-1.13.69-1.83 0-1.66-1.34-3-3-3z"/>
                <circle cx="8" cy="7" r="1.5" />
                <circle cx="12" cy="5.5" r="1.5" />
                <circle cx="16" cy="7" r="1.5" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-headline font-semibold text-[17px] text-primary leading-none">
                {title || 'PetCare'}
              </span>
              <span className="text-[11px] text-on-surface-variant font-normal leading-tight mt-0.5">
                {getSubtitle()}
              </span>
            </div>
          </div>
        </div>

        {/* Right Action Icons: Intro Tour, Admin Console Toggle, Notifications & User Profile */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowSplash(true)}
            className="w-8 h-8 rounded-full bg-surface-container text-primary hover:bg-surface-container-high text-xs font-semibold flex items-center justify-center transition-colors"
            title="Open Brand Intro &amp; Onboarding Tour"
          >
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
          </button>

          <button
            onClick={() => setAppMode('PROVIDER')}
            className="px-2 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-[11px] font-bold flex items-center gap-1 shadow-xs transition-colors"
            title="Switch to PetCare Provider Captain App"
          >
            <span>🐕</span>
            <span>Captain</span>
          </button>

          <button
            onClick={() => setAppMode('ADMIN')}
            className="px-2 py-1 rounded-lg bg-slate-900 text-slate-100 hover:bg-slate-800 text-[11px] font-semibold flex items-center gap-1 shadow-xs transition-colors"
            title="Open Platform Admin Console"
          >
            <span className="material-symbols-outlined text-[14px] text-emerald-400">shield_lock</span>
            <span className="hidden sm:inline">Admin</span>
          </button>

          <button
            aria-label="Notifications"
            onClick={onNotificationClick}
            className="relative w-10 h-10 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container-high/60 transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadNotifsCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error ring-2 ring-surface"></span>
            )}
          </button>

          <button
            aria-label="User Profile"
            onClick={() => setCurrentTab('profile')}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
              currentTab === 'profile' ? 'ring-2 ring-primary ring-offset-2' : 'hover:opacity-90'
            }`}
          >
            <img
              alt="Elena Miller"
              className="w-8 h-8 rounded-full object-cover shadow-xs"
              src={user.avatar}
            />
          </button>
        </div>
      </div>
    </header>
  );
};
