/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useProviderApp } from '../ProviderContext.tsx';
import {
  Scissors,
  CheckCircle2,
  Sparkles,
  Camera,
  ShieldAlert,
  StopCircle,
  Heart,
} from 'lucide-react';

export const LiveGroomingScreen: React.FC = () => {
  const {
    activeAssignment,
    updateGroomingStep,
    endService,
    setEmergencySosOpen,
  } = useProviderApp();

  const [notes, setNotes] = useState('Coat detangled gently. Nails trimmed safely and ears cleaned thoroughly.');
  const [photoUploaded, setPhotoUploaded] = useState(true);

  if (!activeAssignment || !activeAssignment.groomingProgress) return null;

  const steps = activeAssignment.groomingProgress.steps;
  const completedCount = steps.filter((s) => s.completed).length;

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4 pb-24">
      {/* Top Banner */}
      <div className="bg-teal-600 text-white p-5 rounded-3xl shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
            <Scissors className="w-7 h-7 text-teal-200" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-teal-200 block">
              Active Grooming Session
            </span>
            <h2 className="text-xl font-black">{activeAssignment.pet.name}</h2>
            <p className="text-xs text-teal-100">
              {activeAssignment.pet.breed} • {activeAssignment.durationMinutes} min Groom
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black font-mono">
            {completedCount}/{steps.length}
          </span>
          <span className="text-[10px] text-teal-200 block">Steps Done</span>
        </div>
      </div>

      {/* Hygiene & Grooming Stages */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-teal-600" />
          <span>Grooming Checklist</span>
        </h4>

        <div className="space-y-2.5">
          {steps.map((step) => (
            <label
              key={step.id}
              onClick={() => updateGroomingStep(step.id, !step.completed)}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                step.completed
                  ? 'bg-teal-50/60 border-teal-200 text-teal-900'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <input
                type="checkbox"
                checked={step.completed}
                onChange={() => {}}
                className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
              />
              <span className="text-xs font-semibold flex-1">{step.name}</span>
              {step.completed && (
                <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">
                  Complete
                </span>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Photo Proof & Notes */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
        <span className="text-xs font-bold text-slate-800 block">After Grooming Photo Proof</span>
        <div className="flex items-center gap-3">
          <img
            src={activeAssignment.pet.photoUrl}
            alt="Groomed pet"
            className="w-16 h-16 rounded-xl object-cover border border-slate-200"
          />
          <div className="text-xs text-slate-600">
            <span className="font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> High-res photo captured
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">Attached to booking receipt for customer</p>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1">
            Groomer's Care & Skin Observations
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Note any skin sensitivities, tick checks, or ear hygiene..."
          />
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setEmergencySosOpen(true)}
          className="py-3 px-4 rounded-2xl bg-rose-50 text-rose-700 font-bold text-xs border border-rose-200 flex items-center gap-1.5"
        >
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <span>SOS</span>
        </button>

        <button
          onClick={endService}
          className="flex-1 py-4 px-6 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-base transition-all shadow-md shadow-teal-600/30 flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <StopCircle className="w-5 h-5 text-teal-200" />
          <span>COMPLETE GROOMING SESSION</span>
        </button>
      </div>
    </div>
  );
};
