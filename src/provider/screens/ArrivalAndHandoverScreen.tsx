/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useProviderApp } from '../ProviderContext.tsx';
import {
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  AlertCircle,
  Play,
  User,
  HeartPulse,
} from 'lucide-react';

export const ArrivalAndHandoverScreen: React.FC = () => {
  const { activeAssignment, startService } = useProviderApp();

  const [checklist, setChecklist] = useState({
    petReceived: true,
    leashSecured: true,
    conditionChecked: true,
    safeZoneVerified: true,
  });

  if (!activeAssignment) return null;

  const allChecked = Object.values(checklist).every(Boolean);

  const toggleItem = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getStartButtonLabel = () => {
    switch (activeAssignment.serviceType) {
      case 'DOG_WALKER':
        return 'START WALK';
      case 'DOG_TRAINER':
        return 'START TRAINING SESSION';
      case 'PET_GROOMER':
        return 'START GROOMING SESSION';
      default:
        return 'START SERVICE';
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4 pb-24">
      {/* Top Banner: You've Arrived */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 text-center shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white mx-auto flex items-center justify-center shadow-md shadow-emerald-600/20 mb-2">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full">
          Status: Arrived
        </span>
        <h2 className="text-2xl font-black text-slate-900 mt-2">YOU'VE ARRIVED!</h2>
        <p className="text-xs text-slate-600 max-w-xs mx-auto mt-1">
          Greet {activeAssignment.customer.name} and complete the verification checklist before starting the service.
        </p>
      </div>

      {/* Handover Dossier */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <img
              src={activeAssignment.pet.photoUrl}
              alt={activeAssignment.pet.name}
              className="w-12 h-12 rounded-xl object-cover border border-slate-200"
            />
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <span>{activeAssignment.pet.name}</span>
                <span>🐕</span>
              </h3>
              <p className="text-xs text-slate-500">
                {activeAssignment.pet.breed} • {activeAssignment.pet.ageYears} yrs • {activeAssignment.pet.weightKg} kg
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-slate-800">{activeAssignment.durationMinutes} min</span>
            <span className="text-[10px] text-slate-400 block">{activeAssignment.serviceTitle}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-slate-700 pt-1">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Owner / Customer
            </span>
            <span className="font-semibold text-slate-800">{activeAssignment.customer.name}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Safe Zone Radius
            </span>
            <span className="font-semibold text-emerald-700 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {(activeAssignment.safeZoneRadiusMeters / 1000).toFixed(1)} km radius
            </span>
          </div>
        </div>

        {activeAssignment.pet.specialInstructions && (
          <div className="bg-amber-50/80 border border-amber-200/60 rounded-xl p-3 text-xs text-amber-900">
            <strong className="font-semibold">Special Care Note: </strong>
            <span>{activeAssignment.pet.specialInstructions}</span>
          </div>
        )}
      </div>

      {/* Pre-Service Verification Checklist */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Pre-Service Safety Checklist</span>
          </h4>
          <span className="text-[11px] font-semibold text-emerald-600">
            {Object.values(checklist).filter(Boolean).length}/4 Verified
          </span>
        </div>

        <div className="space-y-2.5">
          <label
            onClick={() => toggleItem('petReceived')}
            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
              checklist.petReceived
                ? 'bg-emerald-50/60 border-emerald-200 text-slate-900'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <input
              type="checkbox"
              checked={checklist.petReceived}
              onChange={() => {}}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
            />
            <div className="flex-1 text-xs">
              <strong className="block font-semibold">Pet received from owner</strong>
              <span className="text-[11px] text-slate-500">Handover verified at customer address</span>
            </div>
          </label>

          <label
            onClick={() => toggleItem('leashSecured')}
            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
              checklist.leashSecured
                ? 'bg-emerald-50/60 border-emerald-200 text-slate-900'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <input
              type="checkbox"
              checked={checklist.leashSecured}
              onChange={() => {}}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
            />
            <div className="flex-1 text-xs">
              <strong className="block font-semibold">Leash & harness firmly secured</strong>
              <span className="text-[11px] text-slate-500">Double-check clip, collar tension & ID tag</span>
            </div>
          </label>

          <label
            onClick={() => toggleItem('conditionChecked')}
            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
              checklist.conditionChecked
                ? 'bg-emerald-50/60 border-emerald-200 text-slate-900'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <input
              type="checkbox"
              checked={checklist.conditionChecked}
              onChange={() => {}}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
            />
            <div className="flex-1 text-xs">
              <strong className="block font-semibold">Pet physical condition checked</strong>
              <span className="text-[11px] text-slate-500">Alert, hydrated, paws clean and healthy</span>
            </div>
          </label>

          <label
            onClick={() => toggleItem('safeZoneVerified')}
            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
              checklist.safeZoneVerified
                ? 'bg-emerald-50/60 border-emerald-200 text-slate-900'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <input
              type="checkbox"
              checked={checklist.safeZoneVerified}
              onChange={() => {}}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
            />
            <div className="flex-1 text-xs">
              <strong className="block font-semibold">Safe Zone radius confirmed</strong>
              <span className="text-[11px] text-slate-500">
                {(activeAssignment.safeZoneRadiusMeters / 1000).toFixed(1)} km boundary loaded into active GPS tracking
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Start Service CTA */}
      <div className="pt-2">
        <button
          onClick={startService}
          disabled={!allChecked}
          className={`w-full py-4 px-6 rounded-2xl font-extrabold text-base transition-all shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] ${
            allChecked
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          <Play className="w-5 h-5 fill-current" />
          <span>{getStartButtonLabel()}</span>
        </button>
        {!allChecked && (
          <p className="text-center text-[11px] text-rose-500 font-medium mt-2">
            Please complete all 4 safety checklist items before starting
          </p>
        )}
      </div>
    </div>
  );
};
