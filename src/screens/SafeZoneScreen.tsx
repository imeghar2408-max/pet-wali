import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { SafeZoneState } from '../types/index.ts';

export const SafeZoneScreen: React.FC = () => {
  const { activePet, activeWalk, updatePet, updateWalkTelemetry, setCurrentTab } = useApp();

  const [startingAddress, setStartingAddress] = useState(
    activePet.safetyProfile.safeZoneName || 'Oakwood Park Perimeter, Seattle'
  );
  const [radiusKm, setRadiusKm] = useState<number>(activePet.safetyProfile.safeZoneRadiusKm || 1.0);
  const [alertOnExit, setAlertOnExit] = useState<boolean>(true);
  const [accidentDetection, setAccidentDetection] = useState<boolean>(true);
  const [pottyPhotoLogs, setPottyPhotoLogs] = useState<boolean>(true);

  // Safety State Simulator for Demonstration
  const [simulatedState, setSimulatedState] = useState<SafeZoneState>(
    activeWalk?.safeZoneState || 'GREEN'
  );
  const [saveSuccess, setSaveSuccess] = useState(false);

  const radiusMeters = Math.round(radiusKm * 1000);

  const handleSaveSafeZone = async () => {
    await updatePet(activePet.id, {
      safetyProfile: {
        ...activePet.safetyProfile,
        safeZoneName: startingAddress,
        safeZoneRadiusKm: radiusKm,
      },
    });

    if (activeWalk) {
      await updateWalkTelemetry({
        safeZoneRadiusM: radiusMeters,
        safeZoneState: simulatedState,
      });
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2200);
  };

  const getStateDetails = (state: SafeZoneState) => {
    switch (state) {
      case 'GREEN':
        return {
          label: 'INSIDE SAFE ZONE',
          sub: 'Walker & Pet fully within authorized perimeter',
          bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-800',
          dot: 'bg-emerald-500',
          distance: '380m to boundary',
        };
      case 'YELLOW':
        return {
          label: 'APPROACHING BOUNDARY',
          sub: 'Walker is within 85m of safe zone perimeter edge',
          bg: 'bg-amber-500/15 border-amber-500/40 text-amber-900',
          dot: 'bg-amber-500 animate-pulse',
          distance: '65m to boundary',
        };
      case 'RED':
        return {
          label: 'OUTSIDE SAFE ZONE',
          sub: 'Perimeter breached! Immediate alert dispatched to caregiver',
          bg: 'bg-rose-500/15 border-rose-500/40 text-rose-900',
          dot: 'bg-rose-500 animate-ping',
          distance: 'Perimeter Breached (-40m)',
        };
    }
  };

  const stateInfo = getStateDetails(simulatedState);

  // Radius circle scale mapping for SVG
  const circleRadiusPx = radiusKm === 0.5 ? 65 : radiusKm === 1.0 ? 95 : 125;

  return (
    <div className="pb-32 px-5 space-y-5 max-w-md mx-auto animate-in fade-in duration-200">
      {/* Title & Back to Live Walk */}
      <div className="pt-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-headline text-primary tracking-tight">
            Safe Zone Radar
          </h1>
          <p className="text-xs text-on-surface-variant font-body">
            Geofence boundary configuration for <strong className="text-primary">{activePet.name}</strong>
          </p>
        </div>

        {activeWalk && (
          <button
            onClick={() => setCurrentTab('live-walk')}
            className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-semibold flex items-center gap-1 shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">radar</span>
            <span>Live Walk</span>
          </button>
        )}
      </div>

      {/* Safety State Alert Banner */}
      <div className={`p-3.5 rounded-2xl border transition-all ${stateInfo.bg}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${stateInfo.dot}`} />
            <span className="text-xs font-bold uppercase tracking-wider">{stateInfo.label}</span>
          </div>
          <span className="text-[11px] font-mono font-bold">{stateInfo.distance}</span>
        </div>
        <p className="text-[11px] mt-1 opacity-90">{stateInfo.sub}</p>
      </div>

      {/* Interactive Map Visualizer */}
      <div className="relative w-full h-72 rounded-3xl overflow-hidden border border-[#dde2f3] shadow-md bg-[#e3ecdf]">
        {/* Topographic Background Simulation */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="safeZoneGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#006d3c" stopOpacity="0.18" />
              <stop offset="80%" stopColor="#006d3c" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#006d3c" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Park paths & terrain lines */}
          <path d="M 0,90 Q 120,60 220,120 T 400,100" fill="none" stroke="#cfdfcc" strokeWidth="18" />
          <path d="M 50,280 Q 180,180 200,80 T 360,20" fill="none" stroke="#cfdfcc" strokeWidth="14" />
          <path d="M 120,290 Q 200,240 280,270" fill="none" stroke="#e8f3e5" strokeWidth="10" />

          {/* Safe Zone Boundary Circle */}
          <circle
            cx="50%"
            cy="50%"
            r={circleRadiusPx}
            fill="url(#safeZoneGlow)"
            stroke={simulatedState === 'GREEN' ? '#006d3c' : simulatedState === 'YELLOW' ? '#d97706' : '#dc2626'}
            strokeWidth="2.5"
            strokeDasharray={simulatedState === 'YELLOW' ? '6 4' : 'none'}
            className="transition-all duration-300"
          />

          {/* Center Safe Zone Pin (Home / Starting Base) */}
          <g transform="translate(195, 134)">
            <circle cx="10" cy="10" r="14" fill="#023423" />
            <circle cx="10" cy="10" r="6" fill="#88f9b0" />
          </g>
        </svg>

        {/* Floating Top Pill */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-[10px] font-bold text-primary shadow-xs border border-outline-variant/30">
            Center: {startingAddress.split(',')[0]}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-primary text-secondary-fixed text-[10px] font-bold shadow-xs">
            Radius: {radiusKm} km ({radiusMeters}m)
          </span>
        </div>

        {/* Floating Walker Pin */}
        <div
          className={`absolute transition-all duration-500 ${
            simulatedState === 'GREEN'
              ? 'top-[42%] left-[46%]'
              : simulatedState === 'YELLOW'
              ? 'top-[26%] left-[62%]'
              : 'top-[12%] left-[80%]'
          }`}
        >
          <div className="relative flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg ring-2 ring-white">
              <span className="material-symbols-outlined text-[16px]">pets</span>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-surface text-[9px] font-bold shadow-xs mt-0.5 text-primary border border-outline-variant/30">
              {activePet.name}
            </span>
          </div>
        </div>

        {/* Bottom Map Controls */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-1.5">
          <button
            onClick={() => setRadiusKm((r) => Math.min(2.0, r + 0.5))}
            className="w-8 h-8 rounded-xl bg-surface shadow-md flex items-center justify-center text-primary font-bold hover:bg-surface-container-high"
            title="Increase radius"
          >
            +
          </button>
          <button
            onClick={() => setRadiusKm((r) => Math.max(0.5, r - 0.5))}
            className="w-8 h-8 rounded-xl bg-surface shadow-md flex items-center justify-center text-primary font-bold hover:bg-surface-container-high"
            title="Decrease radius"
          >
            -
          </button>
        </div>
      </div>

      {/* Starting Location Address Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-on-surface block">
          Anchor Starting Location
        </label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-primary text-[18px]">
            location_on
          </span>
          <input
            type="text"
            value={startingAddress}
            onChange={(e) => setStartingAddress(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs text-on-surface focus:outline-none focus:border-primary shadow-xs"
            placeholder="Enter home or park address..."
          />
        </div>
      </div>

      {/* Radius Boundary Selector Pills */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-on-surface block">
          Geofence Boundary Radius
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { km: 0.5, label: '500m', desc: 'Dense Urban' },
            { km: 1.0, label: '1.0 km', desc: 'Standard Park' },
            { km: 2.0, label: '2.0 km', desc: 'Extended Trail' },
          ].map((item) => {
            const isSelected = radiusKm === item.km;
            return (
              <button
                key={item.km}
                type="button"
                onClick={() => setRadiusKm(item.km)}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  isSelected
                    ? 'bg-primary-container text-white border-primary shadow-sm'
                    : 'bg-surface-container-lowest text-on-surface border-outline-variant/40 hover:bg-surface-container-low'
                }`}
              >
                <span className="font-headline font-bold text-sm block leading-none">
                  {item.label}
                </span>
                <span
                  className={`text-[10px] mt-1 block ${
                    isSelected ? 'text-primary-fixed' : 'text-on-surface-variant'
                  }`}
                >
                  {item.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Safety State Interactive Demo Simulator */}
      <div className="p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/40 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-primary flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">sensors</span>
            <span>Safety State Live Simulation</span>
          </span>
          <span className="text-[10px] text-on-surface-variant">Tap to test radar alert</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => setSimulatedState('GREEN')}
            className={`py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
              simulatedState === 'GREEN'
                ? 'bg-emerald-600 text-white border-emerald-700'
                : 'bg-surface text-emerald-800 border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            GREEN (Safe)
          </button>
          <button
            type="button"
            onClick={() => setSimulatedState('YELLOW')}
            className={`py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
              simulatedState === 'YELLOW'
                ? 'bg-amber-500 text-white border-amber-600'
                : 'bg-surface text-amber-800 border-amber-200 hover:bg-amber-50'
            }`}
          >
            YELLOW (Edge)
          </button>
          <button
            type="button"
            onClick={() => setSimulatedState('RED')}
            className={`py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
              simulatedState === 'RED'
                ? 'bg-rose-600 text-white border-rose-700'
                : 'bg-surface text-rose-800 border-rose-200 hover:bg-rose-50'
            }`}
          >
            RED (Breach)
          </button>
        </div>
      </div>

      {/* Safety Rules Toggles */}
      <div className="space-y-2 pt-1">
        <label className="text-xs font-bold text-on-surface block">Automatic Safety Actions</label>
        <div className="space-y-2 bg-surface-container-lowest p-3.5 rounded-2xl border border-[#dde2f3]">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-on-surface block">Exit Perimeter Push Alert</span>
              <span className="text-[10px] text-on-surface-variant">
                Notify parent within 15 seconds if walker leaves zone
              </span>
            </div>
            <input
              type="checkbox"
              checked={alertOnExit}
              onChange={(e) => setAlertOnExit(e.target.checked)}
              className="accent-primary w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-surface-container-high">
            <div>
              <span className="text-xs font-semibold text-on-surface block">Sudden-Stop Sensor</span>
              <span className="text-[10px] text-on-surface-variant">
                Alert if collar accelerometer detects abrupt halt &gt; 90s
              </span>
            </div>
            <input
              type="checkbox"
              checked={accidentDetection}
              onChange={(e) => setAccidentDetection(e.target.checked)}
              className="accent-primary w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-surface-container-high">
            <div>
              <span className="text-xs font-semibold text-on-surface block">Photo Log Enforcement</span>
              <span className="text-[10px] text-on-surface-variant">
                Require potty &amp; water photo verification in stream
              </span>
            </div>
            <input
              type="checkbox"
              checked={pottyPhotoLogs}
              onChange={(e) => setPottyPhotoLogs(e.target.checked)}
              className="accent-primary w-4 h-4 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSaveSafeZone}
        className="w-full h-11 rounded-2xl bg-primary text-on-primary font-headline font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:bg-primary-container transition-all"
      >
        {saveSuccess ? (
          <>
            <span className="material-symbols-outlined text-[18px] text-secondary-fixed">check_circle</span>
            <span>Safe Zone Perimeter Calibrated!</span>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[18px]">save</span>
            <span>Save Safe Zone Preferences</span>
          </>
        )}
      </button>
    </div>
  );
};
