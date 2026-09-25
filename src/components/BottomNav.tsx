import React from 'react';
import { useApp, NavTab } from '../context/AppContext.tsx';

export const BottomNav: React.FC = () => {
  const { currentTab, setCurrentTab, conversations } = useApp();

  const unreadMessagesCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const navItems: { tab: NavTab; label: string; icon: string; badge?: number }[] = [
    { tab: 'home', label: 'Home', icon: 'home' },
    { tab: 'services', label: 'Services', icon: 'grid_view' },
    { tab: 'bookings', label: 'Bookings', icon: 'calendar_month' },
    { tab: 'pets', label: 'Pets', icon: 'pets' },
    { tab: 'messages', label: 'Messages', icon: 'chat_bubble', badge: unreadMessagesCount },
    { tab: 'profile', label: 'Profile', icon: 'account_circle' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 pb-safe pointer-events-none">
      <div className="max-w-md mx-auto px-4 mb-3">
        <div className="bg-surface-container-lowest/95 backdrop-blur-xl rounded-full shadow-[0_12px_32px_-4px_rgba(30,75,56,0.12),0_4px_12px_-2px_rgba(26,32,44,0.04)] border border-[#dde2f3]/40 pointer-events-auto">
          <div className="flex justify-between items-center h-[68px] px-2">
            {navItems.map((item) => {
              const isActive = currentTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => setCurrentTab(item.tab)}
                  className={`relative flex flex-col items-center justify-center min-w-[58px] h-12 rounded-full px-2.5 transition-all gap-0.5 ${
                    isActive
                      ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface active:scale-95'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[22px] ${
                      isActive ? 'material-symbols-fill' : ''
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="font-body text-[11px] leading-none">{item.label}</span>

                  {/* Badge */}
                  {item.badge && item.badge > 0 ? (
                    <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-secondary ring-2 ring-surface animate-pulse" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
