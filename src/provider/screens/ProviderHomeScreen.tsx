/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useProviderApp } from '../ProviderContext.tsx';
import { ProviderServiceType } from '../types.ts';
import {
  Power,
  Zap,
  TrendingUp,
  Clock,
  Star,
  Award,
  ShieldCheck,
  ChevronRight,
  MapPin,
  Calendar,
  CheckCircle2,
  Navigation,
  Sparkles,
  Info,
  Layers,
  ArrowUpRight,
  Lock,
} from 'lucide-react';

export const ProviderHomeScreen: React.FC = () => {
  const {
    isOnline,
    toggleOnline,
    setIsOnline,
    providerProfile,
    earningsSummary,
    activeAssignment,
    scheduledAssignments,
    assignmentHistory,
    dispatchSimulatedRequest,
    setSubView,
    setCurrentTab,
    setRatingModalOpen,
  } = useProviderApp();

  const nextUpcoming = scheduledAssignments[0];

  const handleSimulateDispatch = (type: ProviderServiceType) => {
    if (!isOnline) {
      setIsOnline(true);
    }
    dispatchSimulatedRequest(type);
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4 pb-24">
      {/* 1. Large Primary Online / Offline Captain Control */}
      <div
        className={`rounded-3xl p-5 border transition-all duration-300 shadow-sm ${
          isOnline
            ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-emerald-500/50 shadow-emerald-700/20'
            : 'bg-slate-900 text-slate-100 border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform ${
                isOnline ? 'bg-white/20 text-white scale-105' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Power className={`w-6 h-6 ${isOnline ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isOnline ? 'bg-emerald-300 animate-ping' : 'bg-slate-500'
                  }`}
                />
                <h2 className="text-xl font-black tracking-tight">
                  {isOnline ? 'YOU ARE ONLINE' : 'YOU ARE OFFLINE'}
                </h2>
              </div>
              <p className={`text-xs mt-0.5 ${isOnline ? 'text-emerald-100' : 'text-slate-400'}`}>
                {isOnline
                  ? "You're available for new service requests."
                  : 'Provider is not available for new assignments.'}
              </p>
            </div>
          </div>

          <button
            onClick={toggleOnline}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all shadow-md active:scale-95 ${
              isOnline
                ? 'bg-white text-emerald-800 hover:bg-emerald-50'
                : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/30'
            }`}
          >
            {isOnline ? 'GO OFFLINE' : 'GO ONLINE'}
          </button>
        </div>

        {/* Dispatch Mechanism Explainer Pill */}
        {isOnline && (
          <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-emerald-100">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span>Smart matching active: High priority dispatch</span>
            </div>
            <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full font-semibold">
              Radar Active
            </span>
          </div>
        )}
      </div>

      {/* 2. Simulation Trigger Banner */}
      <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3.5 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold text-amber-900">Interactive Dispatch Simulator</span>
          </div>
          <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
            Test Captain Push
          </span>
        </div>
        <p className="text-[11px] text-amber-800 leading-snug mb-2.5">
          Trigger an incoming time-sensitive request to experience the driver acceptance and navigation flow:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => handleSimulateDispatch('DOG_WALKER')}
            className="py-2 px-2.5 rounded-xl bg-white border border-amber-200 text-slate-800 hover:bg-amber-100/50 text-[11px] font-bold text-center transition-colors shadow-xs"
          >
            🐕 Walk (Bruno)
          </button>
          <button
            onClick={() => handleSimulateDispatch('DOG_TRAINER')}
            className="py-2 px-2.5 rounded-xl bg-white border border-amber-200 text-slate-800 hover:bg-amber-100/50 text-[11px] font-bold text-center transition-colors shadow-xs"
          >
            🎓 Train (Rocky)
          </button>
          <button
            onClick={() => handleSimulateDispatch('PET_GROOMER')}
            className="py-2 px-2.5 rounded-xl bg-white border border-amber-200 text-slate-800 hover:bg-amber-100/50 text-[11px] font-bold text-center transition-colors shadow-xs"
          >
            ✂️ Groom (Bella)
          </button>
          <button
            onClick={() => handleSimulateDispatch('PET_BOARDING')}
            className="py-2 px-2.5 rounded-xl bg-white border border-amber-200 text-slate-800 hover:bg-amber-100/50 text-[11px] font-bold text-center transition-colors shadow-xs"
          >
            🏠 Board (Milo)
          </button>
        </div>
      </div>

      {/* 3. Today's Summary & KPI Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Today's Earnings */}
        <div
          onClick={() => setCurrentTab('earnings')}
          className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs hover:border-slate-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] uppercase font-bold tracking-wider">Today's Earnings</span>
            <ArrowUpRight className="w-4 h-4 group-hover:text-emerald-600 transition-colors" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900">₹{earningsSummary.todayTotal}</span>
            <span className="text-xs text-emerald-600 font-bold">+{earningsSummary.todayBonus} bonus</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-0.5">
            {earningsSummary.todayJobsCount} completed jobs today
          </span>
        </div>

        {/* Customer Rating Dossier Link */}
        <div
          onClick={() => setRatingModalOpen(true)}
          className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs hover:border-slate-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] uppercase font-bold tracking-wider">Your Rating</span>
            <ArrowUpRight className="w-4 h-4 group-hover:text-amber-500 transition-colors" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900 flex items-center gap-1">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span>{providerProfile.rating}</span>
            </span>
            <span className="text-xs text-slate-400 font-medium">/ 5.0</span>
          </div>
          <span className="text-[11px] text-amber-700 font-semibold block mt-0.5">
            {providerProfile.totalReviews} Total Reviews (View feedback)
          </span>
        </div>
      </div>

      {/* 4. Active Ongoing Assignment (If Accepted / In Service) */}
      {activeAssignment && (
        <div className="bg-emerald-50 border-2 border-emerald-500/80 rounded-3xl p-4 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-800">
                Current Active Assignment
              </span>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
              {activeAssignment.status.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <img
              src={activeAssignment.pet.photoUrl}
              alt={activeAssignment.pet.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-xs"
            />
            <div className="flex-1">
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <span>{activeAssignment.pet.name}</span>
                <span className="text-xs font-medium text-slate-500">({activeAssignment.pet.breed})</span>
              </h4>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                {activeAssignment.serviceTitle} • ₹{activeAssignment.estimatedEarnings}
              </p>
              <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-emerald-600" />
                <span className="line-clamp-1">{activeAssignment.pickupAddress}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (activeAssignment.status === 'ACCEPTED' || activeAssignment.status === 'NAVIGATING_TO_CUSTOMER') {
                setSubView('navigation');
              } else if (activeAssignment.status === 'ARRIVED_AT_CUSTOMER') {
                setSubView('handover');
              } else if (activeAssignment.status === 'IN_SERVICE') {
                setSubView('live-service');
              }
            }}
            className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Navigation className="w-4 h-4" />
            <span>RESUME ASSIGNMENT VIEW</span>
          </button>
        </div>
      )}

      {/* 5. Next Dispatched Assignment */}
      {nextUpcoming && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
              Upcoming Assigned Job
            </span>
            <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
              {nextUpcoming.scheduledDate} · {nextUpcoming.scheduledTime}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <img
              src={nextUpcoming.pet.photoUrl}
              alt={nextUpcoming.pet.name}
              className="w-12 h-12 rounded-xl object-cover border border-slate-200"
            />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>{nextUpcoming.pet.name}</span>
                <span className="text-xs font-normal text-slate-500">({nextUpcoming.pet.breed})</span>
              </h4>
              <p className="text-xs text-slate-600">{nextUpcoming.serviceTitle}</p>
              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                Customer: {nextUpcoming.customer.name} • {nextUpcoming.distanceKm} km away
              </p>
            </div>
            <div className="text-right">
              <span className="text-base font-black text-emerald-700">₹{nextUpcoming.estimatedEarnings}</span>
              <span className="text-[10px] text-slate-400 block">{nextUpcoming.durationMinutes} min</span>
            </div>
          </div>
        </div>
      )}

      {/* 6. Service History Ledger Link */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Service History Ledger
            </h4>
            <span className="text-xs font-semibold text-slate-800">
              {assignmentHistory.filter((j) => j.status === 'COMPLETED').length} Completed • {assignmentHistory.filter((j) => j.status === 'CANCELLED').length} Cancelled
            </span>
          </div>
          <button
            onClick={() => setCurrentTab('history')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5"
          >
            <span>View Ledger</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {assignmentHistory.slice(0, 3).map((job) => (
            <div key={job.id} className="py-2.5 flex items-center justify-between first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <img
                  src={job.pet.photoUrl}
                  alt={job.pet.name}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-100"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">{job.pet.name}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        job.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {job.serviceTitle} • Customer: {job.customer.name}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-slate-900">₹{job.estimatedEarnings}</span>
                {job.ratingReceived && (
                  <span className="text-[10px] text-amber-600 block font-bold">★ {job.ratingReceived}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Centralized Marketplace Model Notice */}
      <div className="bg-slate-100/80 border border-slate-200/60 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-slate-600">
        <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-slate-800 font-semibold block">PetCare Centralized Dispatch Model</strong>
          Providers do not browse customer listings. The PetCare backend matches and dispatches requests based on provider availability, service types, proximity, and your {providerProfile.rating} rating.
        </div>
      </div>
    </div>
  );
};
