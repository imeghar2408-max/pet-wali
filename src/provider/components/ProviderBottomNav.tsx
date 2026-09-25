/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useProviderApp, ProviderTab } from '../ProviderContext.tsx';
import { Compass, CalendarDays, History, Wallet, UserCircle2 } from 'lucide-react';

export const ProviderBottomNav: React.FC = () => {
  const { currentTab, setCurrentTab, setSubView, activeAssignment } = useProviderApp();

  const navItems: { id: ProviderTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Compass },
    { id: 'schedule', label: 'Schedule', icon: CalendarDays },
    { id: 'history', label: 'History', icon: History },
    { id: 'earnings', label: 'Earnings', icon: Wallet },
    { id: 'profile', label: 'Captain', icon: UserCircle2 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-lg">
      <div className="max-w-xl mx-auto px-2 sm:px-4 h-16 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentTab(item.id);
                if (item.id === 'dashboard' && !activeAssignment) {
                  setSubView('main');
                }
              }}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors relative ${
                isActive ? 'text-emerald-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {item.id === 'dashboard' && activeAssignment && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] mt-1 tracking-tight">{item.label}</span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-emerald-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
