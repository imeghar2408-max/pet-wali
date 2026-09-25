/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useProviderApp } from '../ProviderContext.tsx';
import {
  CheckCircle2,
  ShieldCheck,
  Award,
  Wallet,
  Clock,
  Navigation,
  Sparkles,
  Heart,
  Droplets,
  DollarSign,
  Star,
  Send,
  MessageSquare,
} from 'lucide-react';

export const ServiceCompletionSummary: React.FC = () => {
  const { activeAssignment, completeAssignmentAndCreditEarnings } = useProviderApp();

  const [notes, setNotes] = useState(
    'Bruno was joyful, well-behaved on leash, stayed safely inside the 1.0km perimeter, and enjoyed his water break.'
  );
  const [tipAmount, setTipAmount] = useState<number>(50);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!activeAssignment) return null;

  const durationMin = activeAssignment.liveWalkTelemetry
    ? Math.max(1, Math.round(activeAssignment.liveWalkTelemetry.durationSeconds / 60))
    : activeAssignment.durationMinutes;

  const distanceKm = activeAssignment.liveWalkTelemetry
    ? activeAssignment.liveWalkTelemetry.distanceWalkedKm.toFixed(2)
    : activeAssignment.distanceKm.toFixed(1);

  const compliance = activeAssignment.liveWalkTelemetry?.safeZoneCompliancePct || 100;
  const totalPayout = activeAssignment.estimatedEarnings + tipAmount;

  const handleComplete = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      completeAssignmentAndCreditEarnings(notes, tipAmount);
    }, 400);
  };

  const getPrimaryButtonLabel = () => {
    switch (activeAssignment.serviceType) {
      case 'DOG_WALKER':
        return 'COMPLETE WALK';
      case 'DOG_TRAINER':
        return 'COMPLETE TRAINING';
      case 'PET_GROOMER':
        return 'COMPLETE GROOMING';
      case 'PET_BOARDING':
        return 'COMPLETE BOARDING';
      default:
        return 'COMPLETE SERVICE';
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4 pb-24">
      {/* Top Completion Header */}
      <div className="bg-gradient-to-tr from-emerald-600 to-teal-700 text-white rounded-3xl p-6 text-center shadow-lg shadow-emerald-700/20">
        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center mb-3">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-200">
          Service Completed ✓
        </span>
        <h2 className="text-2xl font-black mt-1">₹{totalPayout} Added to Earnings</h2>
        <p className="text-xs text-emerald-100 max-w-xs mx-auto mt-1">
          Trip successfully finalized. Guaranteed payout is being credited to your Captain wallet.
        </p>
      </div>

      {/* Pet Dossier Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex items-center gap-4">
        <img
          src={activeAssignment.pet.photoUrl}
          alt={activeAssignment.pet.name}
          className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-100"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">{activeAssignment.pet.name}</h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Completed
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Owner: <strong className="text-slate-700">{activeAssignment.customer.name}</strong> • {activeAssignment.serviceTitle}
          </p>
          <span className="text-[11px] text-slate-400 block mt-1">
            Ref: {activeAssignment.bookingRef}
          </span>
        </div>
      </div>

      {/* Performance & Safety Metrics Grid */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Trip & Safety Metrics
        </h4>
        <div className="grid grid-cols-3 gap-2 text-center divide-x divide-slate-100">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Duration</span>
            <span className="text-xl font-black text-slate-900">{durationMin} min</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Distance</span>
            <span className="text-xl font-black text-emerald-600">{distanceKm} km</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Safe Zone</span>
            <span className="text-xl font-black text-emerald-600">{compliance}%</span>
            <span className="text-[9px] text-emerald-700 font-semibold block">100% Compliant</span>
          </div>
        </div>

        {activeAssignment.liveWalkTelemetry && (
          <div className="pt-2 border-t border-slate-100 flex items-center justify-around text-xs text-slate-600">
            <span>💧 Water: <strong>{activeAssignment.liveWalkTelemetry.hydrationCount}x</strong></span>
            <span>💧 Pee: <strong>{activeAssignment.liveWalkTelemetry.peeCount}</strong></span>
            <span>💩 Poop: <strong>{activeAssignment.liveWalkTelemetry.poopCount}</strong></span>
          </div>
        )}
      </div>

      {/* Customer Rating Flow Banner */}
      <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-amber-950">Customer Rating Triggered</span>
          </div>
          <span className="text-[10px] text-amber-700 font-semibold bg-amber-100 px-2 py-0.5 rounded-full">
            Automated Prompt
          </span>
        </div>
        <p className="text-xs text-amber-900 leading-snug">
          {activeAssignment.customer.name} is now prompted: <em>"How was your experience?"</em> ★★★★★
        </p>
        <div className="grid grid-cols-2 gap-1.5 text-[11px] text-amber-800 pt-1">
          <span>• Professionalism</span>
          <span>• Pet handling</span>
          <span>• Punctuality</span>
          <span>• Service quality</span>
        </div>
      </div>

      {/* Optional Walk / Service Notes */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-2">
        <label className="text-xs font-bold text-slate-800 block">
          Add Walk Notes for {activeAssignment.customer.name} (Optional)
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="E.g., Great energy, stopped for water at the park..."
          className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Payout Breakdown Card */}
      <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-bold text-emerald-800 tracking-wider">
            Total Trip Payout
          </span>
          <span className="text-2xl font-black text-emerald-950">₹{totalPayout}</span>
        </div>

        <div className="text-xs text-emerald-800 space-y-1 pt-1 border-t border-emerald-200/60">
          <div className="flex justify-between">
            <span>Base Service Rate</span>
            <span>₹{activeAssignment.baseEarnings}</span>
          </div>
          <div className="flex justify-between">
            <span>Distance & Arrival Bonus</span>
            <span>₹{activeAssignment.distanceBonus}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Customer Gratuity / Tip</span>
            <span>+₹{tipAmount}</span>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="pt-2">
        <button
          onClick={handleComplete}
          disabled={isSubmitting}
          className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <Wallet className="w-5 h-5" />
          <span>{isSubmitting ? 'CREDITING WALLET...' : getPrimaryButtonLabel()}</span>
        </button>
        <p className="text-center text-[11px] text-slate-400 mt-2">
          Completes trip, credits ₹{totalPayout} to wallet, and opens customer review window
        </p>
      </div>
    </div>
  );
};
