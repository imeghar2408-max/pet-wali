/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useProviderApp } from '../ProviderContext.tsx';
import { SafeZoneState } from '../types.ts';
import {
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  Flame,
  Droplets,
  Camera,
  Activity,
  Navigation,
  Clock,
  BatteryCharging,
  Radio,
  StopCircle,
  HelpCircle,
} from 'lucide-react';

export const LiveWalkScreen: React.FC = () => {
  const {
    activeAssignment,
    toggleSafeZoneState,
    logPotty,
    logHydration,
    endService,
    setEmergencySosOpen,
    triggerAccidentDetectionSim,
  } = useProviderApp();

  const [poopPhotoModal, setPoopPhotoModal] = useState(false);

  if (!activeAssignment || !activeAssignment.liveWalkTelemetry) return null;

  const {
    distanceWalkedKm,
    durationSeconds,
    currentPace,
    safeZoneState,
    distanceToBoundaryM,
    hydrationCount,
    peeCount,
    poopCount,
    safeZoneCompliancePct,
  } = activeAssignment.liveWalkTelemetry;

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  // Safe zone status config
  const getSafeZoneUI = () => {
    switch (safeZoneState) {
      case 'GREEN':
        return {
          bannerBg: 'bg-emerald-500 text-white',
          badgeText: '🟢 SAFE • INSIDE APPROVED AREA',
          subText: `${distanceToBoundaryM}m inside 1.0 km safe boundary`,
          borderRing: 'stroke-emerald-400',
        };
      case 'YELLOW':
        return {
          bannerBg: 'bg-amber-500 text-white animate-pulse',
          badgeText: '🟡 WARNING • APPROACHING BOUNDARY',
          subText: `Only ${distanceToBoundaryM}m from boundary! Turn back inwards`,
          borderRing: 'stroke-amber-400',
        };
      case 'RED':
        return {
          bannerBg: 'bg-rose-600 text-white animate-bounce',
          badgeText: '🔴 BREACH • OUTSIDE APPROVED SAFE ZONE',
          subText: 'Return inside perimeter immediately. Safety team alerted.',
          borderRing: 'stroke-rose-500',
        };
    }
  };

  const zoneUI = getSafeZoneUI();

  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)] pb-24">
      {/* Dynamic Safe Zone Banner */}
      <div className={`${zoneUI.bannerBg} px-4 py-2.5 shadow-md flex items-center justify-between transition-colors duration-300`}>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 flex-shrink-0" />
          <div>
            <span className="font-extrabold text-xs tracking-wider block">{zoneUI.badgeText}</span>
            <span className="text-[11px] opacity-90">{zoneUI.subText}</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono font-bold bg-white/20 px-2 py-0.5 rounded-full">
            {safeZoneCompliancePct}% Safe
          </span>
        </div>
      </div>

      {/* Topographical Map with GPS & Safe Zone Geofence */}
      <div className="relative w-full h-72 sm:h-84 bg-slate-900 overflow-hidden flex flex-col justify-between p-4">
        {/* SVG Topographic Geofence Map */}
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 400 300"
        >
          <defs>
            <radialGradient id="safeZoneGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
              <stop offset="70%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
            </radialGradient>
            <radialGradient id="warnZoneGrad" cx="50%" cy="50%" r="50%">
              <stop offset="85%" stopColor="#f59e0b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.5" />
            </radialGradient>
          </defs>

          {/* Map Grid / Streets */}
          <line x1="0" y1="60" x2="400" y2="60" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="0" y1="150" x2="400" y2="150" stroke="#334155" strokeWidth="1.5" />
          <line x1="0" y1="240" x2="400" y2="240" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="90" y1="0" x2="90" y2="300" stroke="#334155" strokeWidth="1.5" />
          <line x1="200" y1="0" x2="200" y2="300" stroke="#334155" strokeWidth="1.5" />
          <line x1="310" y1="0" x2="310" y2="300" stroke="#334155" strokeWidth="1.5" />

          {/* Green Park Area */}
          <rect x="110" y="80" width="80" height="60" rx="8" fill="#064e3b" opacity="0.4" />
          <text x="150" y="115" fill="#34d399" fontSize="9" fontWeight="bold" textAnchor="middle">
            PARK TRAIL
          </text>

          {/* 1.0 km Safe Zone Circle */}
          <circle
            cx="200"
            cy="150"
            r="110"
            fill="url(#safeZoneGrad)"
            className={zoneUI.borderRing}
            strokeWidth="2.5"
            strokeDasharray="6 3"
          />

          {/* Home / Starting Pin */}
          <circle cx="200" cy="150" r="6" fill="#3b82f6" />
          <text x="200" y="140" fill="#93c5fd" fontSize="9" fontWeight="bold" textAnchor="middle">
            HOME (PICKUP)
          </text>

          {/* Walked Trail Breadcrumb */}
          <path
            d="M 200 150 Q 170 140 150 120 T 130 160 T 160 190 T 210 200"
            fill="none"
            stroke="#10b981"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Current Walker GPS Marker based on state */}
          {safeZoneState === 'GREEN' && (
            <g transform="translate(210, 200)">
              <circle cx="0" cy="0" r="14" fill="#10b981" opacity="0.25" className="animate-ping" />
              <circle cx="0" cy="0" r="9" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
              <text x="0" y="-12" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                🐕 Bruno & Vikram
              </text>
            </g>
          )}

          {safeZoneState === 'YELLOW' && (
            <g transform="translate(285, 205)">
              <circle cx="0" cy="0" r="14" fill="#f59e0b" opacity="0.3" className="animate-ping" />
              <circle cx="0" cy="0" r="9" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
              <text x="0" y="-12" fill="#fef08a" fontSize="9" fontWeight="bold" textAnchor="middle">
                ⚠️ Near Boundary
              </text>
            </g>
          )}

          {safeZoneState === 'RED' && (
            <g transform="translate(330, 240)">
              <circle cx="0" cy="0" r="18" fill="#ef4444" opacity="0.4" className="animate-ping" />
              <circle cx="0" cy="0" r="10" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
              <text x="0" y="-14" fill="#fca5a5" fontSize="9" fontWeight="bold" textAnchor="middle">
                🚨 ZONE BREACH!
              </text>
            </g>
          )}
        </svg>

        {/* Map Header Status: Telemetry & Hardware status */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">GPS LIVE</span>
            <span className="text-[10px] text-slate-400">±1.2m</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700">
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-white font-medium">94%</span>
            <span className="text-slate-400">• Collar 98%</span>
          </div>
        </div>

        {/* Map Bottom: Safe Zone Simulation Switcher (For user testing!) */}
        <div className="relative z-10 bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-2xl p-2 flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-300 pl-2">
            Simulate Safe Zone:
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => toggleSafeZoneState('GREEN')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                safeZoneState === 'GREEN'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              🟢 Safe
            </button>
            <button
              onClick={() => toggleSafeZoneState('YELLOW')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                safeZoneState === 'YELLOW'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              🟡 Warning
            </button>
            <button
              onClick={() => toggleSafeZoneState('RED')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                safeZoneState === 'RED'
                  ? 'bg-rose-600 text-white shadow-xs animate-pulse'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              🔴 Breach
            </button>
          </div>
        </div>
      </div>

      {/* Main Walk Metrics & Logging Panel */}
      <div className="p-4 space-y-4 max-w-xl mx-auto w-full">
        {/* Core Live Telemetry Dashboard */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs">
          <div className="grid grid-cols-3 gap-2 text-center divide-x divide-slate-100">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Duration
              </span>
              <span className="text-2xl font-black text-slate-900 font-mono">
                {formatTime(durationSeconds)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Target: {activeAssignment.durationMinutes} min
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Distance
              </span>
              <span className="text-2xl font-black text-emerald-600 font-mono">
                {distanceWalkedKm.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">kilometers</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Current Pace
              </span>
              <span className="text-xl font-black text-slate-800 font-mono mt-0.5 block">
                {currentPace}
              </span>
              <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">
                3.4 km/h steady
              </span>
            </div>
          </div>
        </div>

        {/* Pet Activity Quick Actions: Pee, Poop, Hydration */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Activity & Potty Logs
            </h4>
            <span className="text-[11px] text-emerald-600 font-medium">Shared live with owner</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Pee Counter */}
            <button
              onClick={() => logPotty('pee')}
              className="p-3 rounded-2xl bg-amber-50 border border-amber-200/70 hover:bg-amber-100 transition-colors flex flex-col items-center justify-center text-center shadow-xs active:scale-95"
            >
              <span className="text-2xl">💧</span>
              <span className="text-xs font-bold text-amber-900 mt-1">Pee Break</span>
              <span className="text-xs font-black text-amber-700 bg-white px-2 py-0.5 rounded-full mt-1 border border-amber-200">
                {peeCount} Logged
              </span>
            </button>

            {/* Poop Counter */}
            <button
              onClick={() => {
                logPotty('poop');
                setPoopPhotoModal(true);
              }}
              className="p-3 rounded-2xl bg-orange-50 border border-orange-200/70 hover:bg-orange-100 transition-colors flex flex-col items-center justify-center text-center shadow-xs active:scale-95"
            >
              <span className="text-2xl">💩</span>
              <span className="text-xs font-bold text-orange-900 mt-1">Poop Break</span>
              <span className="text-xs font-black text-orange-700 bg-white px-2 py-0.5 rounded-full mt-1 border border-orange-200">
                {poopCount} Logged
              </span>
            </button>

            {/* Hydration Counter */}
            <button
              onClick={logHydration}
              className="p-3 rounded-2xl bg-blue-50 border border-blue-200/70 hover:bg-blue-100 transition-colors flex flex-col items-center justify-center text-center shadow-xs active:scale-95"
            >
              <span className="text-2xl">🥤</span>
              <span className="text-xs font-bold text-blue-900 mt-1">Water Given</span>
              <span className="text-xs font-black text-blue-700 bg-white px-2 py-0.5 rounded-full mt-1 border border-blue-200">
                {hydrationCount} Times
              </span>
            </button>
          </div>
        </div>

        {/* Safety Tools & Fall Detection Trigger Bar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setEmergencySosOpen(true)}
            className="flex-1 py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-rose-600/20 active:scale-95 transition-all"
          >
            <ShieldAlert className="w-5 h-5 animate-pulse" />
            <span>EMERGENCY SOS</span>
          </button>

          <button
            onClick={triggerAccidentDetectionSim}
            className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 border border-slate-700 active:scale-95 transition-all"
            title="Simulate sudden fall or accelerometer impact"
          >
            <Activity className="w-4 h-4 text-amber-400" />
            <span>Test Fall Detection</span>
          </button>
        </div>

        {/* Primary Action: END WALK */}
        <div className="pt-2">
          <button
            onClick={endService}
            className="w-full py-4 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-base transition-all shadow-xl flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <StopCircle className="w-5 h-5 text-emerald-400" />
            <span>END WALK & COMPLETE</span>
          </button>
          <p className="text-center text-[11px] text-slate-400 mt-2">
            Ensures safe handover back to customer and calculates trip earnings
          </p>
        </div>
      </div>
    </div>
  );
};
