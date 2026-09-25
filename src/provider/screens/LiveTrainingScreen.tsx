/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useProviderApp } from '../ProviderContext.tsx';
import {
  GraduationCap,
  CheckCircle2,
  Clock,
  Award,
  Sparkles,
  ShieldAlert,
  StopCircle,
  Activity,
  HeartHandshake,
} from 'lucide-react';

export const LiveTrainingScreen: React.FC = () => {
  const {
    activeAssignment,
    updateTrainingDrill,
    endService,
    setEmergencySosOpen,
  } = useProviderApp();

  const [temperament, setTemperament] = useState(8);
  const [sessionNotes, setSessionNotes] = useState('Rocky responded great to high-value rewards. Leash pulling reduced significantly.');

  if (!activeAssignment || !activeAssignment.trainingProgress) return null;

  const drills = activeAssignment.trainingProgress.drills;
  const completedCount = drills.filter((d) => d.completed).length;

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4 pb-24">
      {/* Top Banner */}
      <div className="bg-blue-600 text-white p-5 rounded-3xl shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
            <GraduationCap className="w-7 h-7 text-blue-200" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-blue-200 block">
              Active Training Session
            </span>
            <h2 className="text-xl font-black">{activeAssignment.pet.name}</h2>
            <p className="text-xs text-blue-100">
              {activeAssignment.pet.breed} • {activeAssignment.durationMinutes} min Session
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black font-mono">
            {completedCount}/{drills.length}
          </span>
          <span className="text-[10px] text-blue-200 block">Drills Done</span>
        </div>
      </div>

      {/* Training Goals Checklist */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-blue-600" />
            <span>Behavior & Command Drills</span>
          </h4>
          <span className="text-xs text-slate-500">Tap to mark complete</span>
        </div>

        <div className="space-y-2.5">
          {drills.map((drill) => (
            <label
              key={drill.id}
              onClick={() => updateTrainingDrill(drill.id, !drill.completed)}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                drill.completed
                  ? 'bg-blue-50/60 border-blue-200 text-blue-900'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <input
                type="checkbox"
                checked={drill.completed}
                onChange={() => {}}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span className="text-xs font-semibold flex-1">{drill.name}</span>
              {drill.completed && (
                <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                  Passed
                </span>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Temperament Score & Energy Meter */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800">Pet Focus & Responsiveness</span>
          <span className="text-sm font-black text-blue-600">{temperament} / 10</span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={temperament}
          onChange={(e) => setTemperament(Number(e.target.value))}
          className="w-full accent-blue-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
          <span>Distracted</span>
          <span>Moderate Focus</span>
          <span>Exceptional Focus</span>
        </div>
      </div>

      {/* Trainer Notes for Customer */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-2">
        <label className="text-xs font-bold text-slate-800 block">
          Session Notes & Homework for Pet Parent
        </label>
        <textarea
          rows={3}
          value={sessionNotes}
          onChange={(e) => setSessionNotes(e.target.value)}
          className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="E.g., Practiced loose leash walks, recall is improving..."
        />
      </div>

      {/* Emergency & Complete Session Actions */}
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
          className="flex-1 py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <StopCircle className="w-5 h-5 text-blue-200" />
          <span>COMPLETE TRAINING SESSION</span>
        </button>
      </div>
    </div>
  );
};
