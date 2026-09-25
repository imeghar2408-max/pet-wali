/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useProviderApp } from '../ProviderContext.tsx';
import {
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Navigation,
  DollarSign,
  ChevronRight,
  Info,
} from 'lucide-react';

export const IncomingRequestModal: React.FC = () => {
  const { activeRequest, requestCountdown, acceptRequest, declineRequest } = useProviderApp();

  if (!activeRequest) return null;

  // Icon and tag styling based on service type
  const getServiceBadge = () => {
    switch (activeRequest.serviceType) {
      case 'DOG_WALKER':
        return { label: 'NEW WALK REQUEST', icon: '🐕', bg: 'bg-emerald-500 text-white' };
      case 'DOG_TRAINER':
        return { label: 'NEW TRAINING REQUEST', icon: '🎓', bg: 'bg-blue-600 text-white' };
      case 'PET_GROOMER':
        return { label: 'NEW GROOMING REQUEST', icon: '✂️', bg: 'bg-teal-600 text-white' };
      default:
        return { label: 'NEW SERVICE ASSIGNMENT', icon: '🐾', bg: 'bg-slate-800 text-white' };
    }
  };

  const badge = getServiceBadge();
  const countdownPct = (requestCountdown / 15) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Top Header with Pulsing Dispatch Bar */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
              {badge.label}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Dispatched by</span>
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1">
              PetCare Backend Match
            </span>
          </div>
        </div>

        {/* 15-Second Animated Time Countdown Bar */}
        <div className="w-full bg-slate-100 h-2 overflow-hidden relative">
          <div
            className={`h-full transition-all duration-1000 ease-linear ${
              requestCountdown <= 5 ? 'bg-rose-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${countdownPct}%` }}
          />
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Urgent Acceptance Banner */}
          <div className="flex items-center justify-between bg-amber-50 border border-amber-200/80 rounded-2xl px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
              <span className="text-xs font-medium text-amber-900">
                Accept within <strong className="text-amber-700 font-bold">{requestCountdown} seconds</strong>
              </span>
            </div>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full">
              Time-Sensitive
            </span>
          </div>

          {/* Pet & Service Card */}
          <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex items-start gap-4">
            <img
              src={activeRequest.pet.photoUrl}
              alt={activeRequest.pet.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-1.5">
                  <span>{badge.icon}</span>
                  <span>{activeRequest.pet.name}</span>
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {activeRequest.durationMinutes >= 60
                    ? `${activeRequest.durationMinutes / 60} hr`
                    : `${activeRequest.durationMinutes} min`}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                {activeRequest.pet.breed} • {activeRequest.pet.ageYears} yrs • {activeRequest.pet.weightKg} kg
              </p>
              <div className="mt-2 text-xs font-semibold text-slate-800 flex items-center gap-1">
                <span className="text-slate-500 font-normal">Service:</span>
                <span>{activeRequest.serviceTitle}</span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1 italic mt-0.5">
                "{activeRequest.pet.temperament}"
              </p>
            </div>
          </div>

          {/* Trip / Pickup & Customer Metrics */}
          <div className="grid grid-cols-2 gap-3">
            {/* Customer Details */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Customer
              </span>
              <div className="flex items-center gap-2 mt-1">
                <img
                  src={activeRequest.customer.avatar}
                  alt={activeRequest.customer.name}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{activeRequest.customer.name}</h4>
                  <p className="text-[10px] text-amber-600 font-semibold">
                    ★ {activeRequest.customer.rating} ({activeRequest.customer.totalBookings} orders)
                  </p>
                </div>
              </div>
            </div>

            {/* Estimated Earnings */}
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block tracking-wider">
                Estimated Earnings
              </span>
              <div className="mt-0.5 flex items-baseline gap-1">
                <span className="text-2xl font-black text-emerald-900">₹{activeRequest.estimatedEarnings}</span>
                <span className="text-[10px] text-emerald-600 font-medium">
                  (Base ₹{activeRequest.baseEarnings} + ₹{activeRequest.distanceBonus} bonus)
                </span>
              </div>
            </div>
          </div>

          {/* Location & Time ETA */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Pickup Location</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {activeRequest.distanceKm} km away • ~{activeRequest.estimatedArrivalMin} min ETA
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  {activeRequest.pickupAddress}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Service Time: <strong>{activeRequest.scheduledDate} · {activeRequest.scheduledTime}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Safe-zone: {(activeRequest.safeZoneRadiusMeters / 1000).toFixed(1)} km</span>
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          {activeRequest.pet.specialInstructions && (
            <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-2.5 flex items-start gap-2 text-xs text-amber-900">
              <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">Special Instructions: </strong>
                <span>{activeRequest.pet.specialInstructions}</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons: Big DECLINE and ACCEPT */}
        <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex items-center gap-3">
          <button
            onClick={() => declineRequest('Declined by Captain')}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-white border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-100 transition-colors shadow-xs active:scale-[0.98]"
          >
            DECLINE
          </button>
          <button
            onClick={acceptRequest}
            className="flex-2 py-3.5 px-4 rounded-2xl bg-emerald-600 text-white font-extrabold text-base hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>ACCEPT ASSIGNMENT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
