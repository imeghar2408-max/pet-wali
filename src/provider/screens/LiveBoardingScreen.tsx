/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useProviderApp } from '../ProviderContext.tsx';
import {
  Home,
  CheckCircle2,
  Clock,
  Utensils,
  Activity,
  Heart,
  ShieldAlert,
  StopCircle,
} from 'lucide-react';

export const LiveBoardingScreen: React.FC = () => {
  const {
    activeAssignment,
    endService,
    setEmergencySosOpen,
  } = useProviderApp();

  const [meals, setMeals] = useState([
    { time: '8:00 AM', label: 'Morning Kibble (1 cup)', given: true },
    { time: '1:00 PM', label: 'Fresh Water & Chew Toy', given: true },
    { time: '7:30 PM', label: 'Evening Kibble & Yard Walk', given: true },
  ]);

  const [exerciseMin, setExerciseMin] = useState(45);
  const [notes, setNotes] = useState('Milo settled in well, had all meals happily, relaxed sleep overnight in secure play area.');

  if (!activeAssignment || !activeAssignment.boardingProgress) return null;

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4 pb-24">
      {/* Top Banner */}
      <div className="bg-indigo-600 text-white p-5 rounded-3xl shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
            <Home className="w-7 h-7 text-indigo-200" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-200 block">
              Active Overnight Boarding
            </span>
            <h2 className="text-xl font-black">{activeAssignment.pet.name}</h2>
            <p className="text-xs text-indigo-100">
              Check-in: {activeAssignment.boardingProgress.checkInTime} • Secure Facility
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black font-mono">24h</span>
          <span className="text-[10px] text-indigo-200 block">Duration</span>
        </div>
      </div>

      {/* Feeding Schedule & Care Checklist */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <Utensils className="w-4 h-4 text-indigo-600" />
          <span>Diet & Medication Log</span>
        </h4>

        <div className="space-y-2.5">
          {meals.map((meal, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  {meal.time}
                </span>
                <span className="text-xs font-medium text-slate-800">{meal.label}</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Served
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Exercise & Yard Play Activity */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800">Playtime & Yard Exercise</span>
          <span className="text-xs font-black text-indigo-600">{exerciseMin} mins total</span>
        </div>
        <div className="flex gap-2">
          {[30, 45, 60, 90].map((mins) => (
            <button
              key={mins}
              onClick={() => setExerciseMin(mins)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                exerciseMin === mins
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {mins}m
            </button>
          ))}
        </div>
      </div>

      {/* Boarding Notes */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-2">
        <label className="text-xs font-bold text-slate-800 block">
          Check-Out Handover Notes for Pet Parents
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
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
          className="flex-1 py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <StopCircle className="w-5 h-5 text-indigo-200" />
          <span>CHECK-OUT & COMPLETE BOARDING</span>
        </button>
      </div>
    </div>
  );
};
