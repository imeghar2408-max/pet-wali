/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useProviderApp } from '../ProviderContext.tsx';
import {
  ShieldCheck,
  Zap,
  Power,
  Bell,
  ChevronDown,
  Sparkles,
  Smartphone,
  Star,
  CheckCheck,
  AlertTriangle,
  CreditCard,
  MessageSquare,
  Award,
} from 'lucide-react';



export const ProviderHeader: React.FC = () => {
  const {
    isOnline,
    toggleOnline,
    dispatchSimulatedRequest,
    providerProfile,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setRatingModalOpen,
  } = useProviderApp();

  const [showDispatchMenu, setShowDispatchMenu] = useState(false);
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);
  const [notifFilter, setNotifFilter] = useState<'ALL' | 'ASSIGNMENT' | 'SAFETY' | 'RATING' | 'PAYMENT'>('ALL');

  const unreadNotifs = notifications.filter((n) => !n.isRead).length;

  const filteredNotifs = notifications.filter((n) => {
    if (notifFilter === 'ALL') return true;
    if (notifFilter === 'ASSIGNMENT') return n.type.includes('ASSIGNMENT') || n.type.includes('ARRIVAL');
    if (notifFilter === 'SAFETY') return n.type.includes('SAFETY') || n.type.includes('ZONE') || n.type.includes('EMERGENCY');
    if (notifFilter === 'RATING') return n.type.includes('RATING');
    if (notifFilter === 'PAYMENT') return n.type.includes('PAYMENT');
    return true;
  });

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'NEW_ASSIGNMENT':
        return '⚡';
      case 'RATING_RECEIVED':
        return '⭐';
      case 'PAYMENT_UPDATE':
        return '💰';
      case 'SAFE_ZONE_BREACH':
      case 'SAFETY_WARNING':
      case 'EMERGENCY_ALERT':
        return '🚨';
      case 'CUSTOMER_MESSAGE':
        return '💬';
      case 'CUSTOMER_ARRIVAL':
        return '📍';
      default:
        return '🔔';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Branding & Captain Status with Clickable Rating */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 text-sm tracking-tight">PetCare</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-emerald-50 text-emerald-700 border border-emerald-200">
                Captain
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span>{providerProfile.name.split(' ')[0]}</span>
              <span>•</span>
              <button
                onClick={() => setRatingModalOpen(true)}
                className="text-amber-600 font-bold flex items-center gap-0.5 hover:underline"
                title="View Customer Ratings & Reviews"
              >
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>{providerProfile.rating}</span>
                <span className="text-slate-400 font-normal">({providerProfile.totalReviews})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Center / Right: Online Toggle & Actions */}
        <div className="flex items-center gap-2">
          {/* Online/Offline Button */}
          <button
            onClick={toggleOnline}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 shadow-xs ${
              isOnline
                ? 'bg-emerald-500 text-white shadow-emerald-500/20 hover:bg-emerald-600'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isOnline ? 'bg-white animate-pulse' : 'bg-slate-400'
              }`}
            />
            <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
          </button>

          {/* Quick Dispatch Simulator Button */}
          <div className="relative">
            <button
              onClick={() => {
                if (!isOnline) {
                  alert('You are currently OFFLINE. Going ONLINE now to receive dispatches.');
                }
                setShowDispatchMenu(!showDispatchMenu);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200/80 hover:bg-amber-100 transition-colors shadow-xs"
              title="Test Ride-Hailing Dispatch"
            >
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Dispatch</span>
              <ChevronDown className="w-3 h-3 text-amber-700" />
            </button>

            {/* Dispatch Menu Dropdown */}
            {showDispatchMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50 text-xs">
                <div className="px-2 py-1 border-b border-slate-100 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                  ⚡ Simulate Dispatched Job
                </div>
                <button
                  onClick={() => {
                    dispatchSimulatedRequest('DOG_WALKER');
                    setShowDispatchMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-2 hover:bg-slate-50 rounded-lg flex items-center justify-between text-slate-700 font-medium"
                >
                  <span className="flex items-center gap-2">
                    <span>🐕</span> Dog Walk (Bruno · ₹350)
                  </span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1 rounded">2.3km</span>
                </button>
                <button
                  onClick={() => {
                    dispatchSimulatedRequest('DOG_TRAINER');
                    setShowDispatchMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-2 hover:bg-slate-50 rounded-lg flex items-center justify-between text-slate-700 font-medium"
                >
                  <span className="flex items-center gap-2">
                    <span>🎓</span> Dog Training (Rocky · ₹850)
                  </span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1 rounded">3.1km</span>
                </button>
                <button
                  onClick={() => {
                    dispatchSimulatedRequest('PET_GROOMER');
                    setShowDispatchMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-2 hover:bg-slate-50 rounded-lg flex items-center justify-between text-slate-700 font-medium"
                >
                  <span className="flex items-center gap-2">
                    <span>✂️</span> Pet Grooming (Bella · ₹750)
                  </span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1 rounded">1.8km</span>
                </button>
              </div>
            )}
          </div>

          {/* Categorized Notifications Button & Drawer */}
          <div className="relative">
            <button
              onClick={() => setShowNotifDrawer(!showNotifDrawer)}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
              )}
            </button>

            {showNotifDrawer && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 z-50 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">Captain Dispatch Alerts</span>
                    <p className="text-[10px] text-slate-400">{unreadNotifs} unread notifications</p>
                  </div>
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[10px] text-emerald-600 font-bold hover:underline flex items-center gap-1"
                  >
                    <CheckCheck className="w-3 h-3" />
                    <span>Read all</span>
                  </button>
                </div>

                {/* Filter Pills */}
                <div className="flex gap-1 py-2 border-b border-slate-100 overflow-x-auto no-scrollbar">
                  {[
                    { id: 'ALL', label: 'All' },
                    { id: 'ASSIGNMENT', label: 'Jobs' },
                    { id: 'RATING', label: 'Ratings' },
                    { id: 'PAYMENT', label: 'Payouts' },
                    { id: 'SAFETY', label: 'Safety' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setNotifFilter(tab.id as any)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors whitespace-nowrap ${
                        notifFilter === tab.id
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 mt-1">
                  {filteredNotifs.length === 0 ? (
                    <div className="py-6 text-center text-slate-400">
                      No notifications in this filter
                    </div>
                  ) : (
                    filteredNotifs.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          if (n.type === 'RATING_RECEIVED') {
                            setRatingModalOpen(true);
                            setShowNotifDrawer(false);
                          }
                        }}
                        className={`p-2.5 rounded-xl cursor-pointer transition-colors flex items-start gap-2.5 ${
                          n.isRead ? 'opacity-75 hover:bg-slate-50' : 'bg-emerald-50/60 hover:bg-emerald-50'
                        }`}
                      >
                        <span className="text-base flex-shrink-0 mt-0.5">{getNotifIcon(n.type)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between text-[11px] font-bold text-slate-900">
                            <span className="truncate">{n.title}</span>
                            <span className="text-[9px] text-slate-400 font-normal shrink-0 ml-1">{n.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{n.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
