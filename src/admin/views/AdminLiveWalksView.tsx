import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';

export const AdminLiveWalksView: React.FC = () => {
  const { activeWalk, users, setAdminTab } = useApp();

  const [selectedWalkId, setSelectedWalkId] = useState<string | null>(activeWalk?.id || null);

  const owner = users.find((u) => u.id === 'usr_elena_miller') || {
    name: 'Elena Miller',
    phone: '+1 (555) 0144',
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-5">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Live Walk Fleet Monitoring Radar
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time GPS geofence tracking, speed telemetry, and safe-zone perimeter compliance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium">1 Active Session</span>
          </div>
        </div>
      </div>

      {!activeWalk || activeWalk.status !== 'in_progress' ? (
        <div className="p-12 bg-slate-900/80 border border-slate-800 rounded-2xl text-center space-y-3">
          <span className="material-symbols-outlined text-[48px] text-slate-600">radar</span>
          <h3 className="text-base font-bold text-white">No Walks Currently in Progress</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            All dog walking sessions have completed or are scheduled for later departure windows.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Walks List & Fleet Cards (1 Col) */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Active Sessions ({1})
            </span>

            <div
              onClick={() => setSelectedWalkId(activeWalk.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedWalkId === activeWalk.id
                  ? 'bg-slate-900 border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
                  : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/40'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={activeWalk.petAvatar}
                    alt={activeWalk.petName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/40"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      {activeWalk.petName}
                      <span className="text-xs text-slate-400 font-normal">w/ {activeWalk.walkerName}</span>
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Booking #{activeWalk.bookingId}
                    </span>
                  </div>
                </div>

                {/* Safe Zone Status Pill */}
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    activeWalk.safeZoneState === 'RED'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                      : activeWalk.safeZoneState === 'YELLOW'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}
                >
                  {activeWalk.safeZoneState === 'RED'
                    ? 'RED: BREACH'
                    : activeWalk.safeZoneState === 'YELLOW'
                    ? 'YELLOW: WARNING'
                    : 'GREEN: NORMAL'}
                </span>
              </div>

              {/* Telemetry Strip */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800 text-center font-mono">
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase">Distance</span>
                  <span className="text-emerald-400 font-bold text-sm">{activeWalk.distanceKm} km</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase">Active Time</span>
                  <span className="text-slate-200 font-bold text-sm">{formatTimer(activeWalk.activeDurationSeconds)}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase">Speed</span>
                  <span className="text-slate-200 font-bold text-sm">{activeWalk.currentSpeedKmH} km/h</span>
                </div>
              </div>

              {/* Hardware Battery */}
              <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                <span>Walker Battery: <strong className="text-white">{activeWalk.walkerBatteryPct}%</strong></span>
                <span>Collar GPS: <strong className="text-emerald-400">{activeWalk.collarBatteryPct}%</strong></span>
              </div>
            </div>

            {/* Quick Dispatch / SOS Alert Link */}
            <div className="p-3.5 bg-slate-900/60 rounded-2xl border border-slate-800 text-xs space-y-2">
              <span className="text-slate-400 font-bold block uppercase text-[10px]">
                Incident Escalation Hotline
              </span>
              <p className="text-slate-400 text-[11px]">
                In case of perimeter breach or collar disconnection, administrators can dispatch priority field units.
              </p>
              <button
                onClick={() => setAdminTab('emergency-center')}
                className="w-full py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">e911_emergency</span>
                <span>Open Emergency Center</span>
              </button>
            </div>
          </div>

          {/* Interactive Radar Map View (2 Cols) */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Oakwood Park Perimeter Telemetry</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300 font-mono">
                    Lat: {activeWalk.currentLocation.lat.toFixed(4)}, Lng: {activeWalk.currentLocation.lng.toFixed(4)}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Radius: {activeWalk.safeZoneRadiusM / 1000} km • {activeWalk.distanceToBoundaryM}m to perimeter border
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-mono">
                  GPS Refresh: 1Hz Live
                </span>
              </div>
            </div>

            {/* Map Canvas */}
            <div className="relative w-full h-[360px] rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
              <svg className="w-full h-full" viewBox="0 0 500 360" fill="none">
                {/* Background Grid */}
                <rect width="500" height="360" fill="#090d16" />
                <path d="M0 80 H500" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M0 180 H500" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M0 280 H500" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M125 0 V360" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M250 0 V360" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M375 0 V360" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />

                {/* Park Zone Area */}
                <circle cx="250" cy="180" r="140" fill="#064e3b" fillOpacity="0.2" />

                {/* Safe Zone Geofence Circle */}
                <circle
                  cx="250"
                  cy="180"
                  r="130"
                  fill="none"
                  stroke={activeWalk.safeZoneState === 'RED' ? '#f43f5e' : activeWalk.safeZoneState === 'YELLOW' ? '#f59e0b' : '#10b981'}
                  strokeWidth="2.5"
                  strokeDasharray="6 6"
                />

                {/* GPS Breadcrumb Trail */}
                <path
                  d="M160 280 L180 230 Q200 170 250 160 T310 145"
                  stroke={activeWalk.safeZoneState === 'RED' ? '#f43f5e' : '#10b981'}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Home Anchor */}
                <circle cx="160" cy="280" r="6" fill="#0284c7" />

                {/* Live Walker & Pet Marker */}
                <g transform="translate(310, 145)">
                  <circle className="animate-ping" cx="0" cy="0" r="18" fill="#10b981" fillOpacity="0.3" />
                  <circle cx="0" cy="0" r="9" fill="#10b981" />
                  <circle cx="0" cy="0" r="4" fill="#ffffff" />
                </g>
              </svg>

              {/* Floating Map Status Overlay */}
              <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-xs flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white font-semibold">Milo (Golden Retriever)</span>
                </div>
                <div className="h-4 w-px bg-slate-700" />
                <span className="text-slate-400">Walker: {activeWalk.walkerName}</span>
                <div className="h-4 w-px bg-slate-700" />
                <span className="text-slate-400 font-mono">Pace: {activeWalk.avgPace}</span>
              </div>
            </div>

            {/* Live Activity Feed Stream */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider">
                Telemetry Log Stream
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {activeWalk.timeline.slice(0, 3).map((evt) => (
                  <div key={evt.id} className="p-2.5 bg-slate-800/40 rounded-xl border border-slate-800 text-xs">
                    <div className="flex items-center justify-between text-slate-400 font-mono text-[10px]">
                      <span>{evt.time}</span>
                      <span className="text-emerald-400 font-bold uppercase">{evt.type}</span>
                    </div>
                    <span className="text-white font-semibold block mt-0.5 truncate">{evt.title}</span>
                    <span className="text-slate-400 text-[11px] block truncate">{evt.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
