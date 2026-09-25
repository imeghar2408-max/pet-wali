import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';

export const LiveWalkScreen: React.FC = () => {
  const {
    activeWalk,
    incrementPotty,
    logHydrationBreak,
    updateWalkTelemetry,
    setCurrentTab,
    triggerSOS,
    activePet,
  } = useApp();

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [mapMode, setMapMode] = useState<'streets' | 'satellite'>('streets');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [showPoopPhoto, setShowPoopPhoto] = useState<boolean>(false);

  if (!activeWalk) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-primary mb-3">
          <span className="material-symbols-outlined text-[32px]">directions_walk</span>
        </div>
        <h3 className="font-headline font-bold text-headline-sm text-on-surface">No Walk In Progress</h3>
        <p className="text-xs text-on-surface-variant max-w-xs mt-1">
          There is currently no active dog walking session running for {activePet.name}.
        </p>
        <button
          onClick={() => setCurrentTab('service-booking')}
          className="mt-4 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-headline text-xs font-bold"
        >
          Schedule a Walk
        </button>
      </div>
    );
  }

  const formatActiveTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleShareLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Simulate boundary approach for safety demo
  const handleSimulateBoundary = () => {
    if (activeWalk.safeZoneState === 'GREEN') {
      updateWalkTelemetry({
        safeZoneState: 'YELLOW',
        distanceToBoundaryM: 80,
      });
    } else if (activeWalk.safeZoneState === 'YELLOW') {
      updateWalkTelemetry({
        safeZoneState: 'RED',
        distanceToBoundaryM: 0,
      });
    } else {
      updateWalkTelemetry({
        safeZoneState: 'GREEN',
        distanceToBoundaryM: 380,
      });
    }
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto pb-28">
      {/* Map Canvas Container */}
      <div className="relative w-full h-[460px] overflow-hidden bg-surface-container-high select-none">
        {/* SVG Vector Map Surface */}
        <svg
          className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})` }}
          fill="none"
          viewBox="0 0 400 480"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient cx="0.4" cy="0.45" id="parkGlow" r="0.45">
              <stop offset="0%" stopColor="#bdedd3" stopOpacity={mapMode === 'satellite' ? '0.2' : '0.4'} />
              <stop offset="100%" stopColor="#dde2f3" stopOpacity="0.1" />
            </radialGradient>
            <radialGradient cx="0.5" cy="0.5" id="geofenceFill" r="0.5">
              <stop offset="70%" stopColor="#88f9b0" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#006d3c" stopOpacity="0.04" />
            </radialGradient>
            <filter id="gpsGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Neighborhood Background */}
          <rect width="400" height="480" fill={mapMode === 'satellite' ? '#1e2822' : '#f1f3ff'} />

          {/* Park Area */}
          <path
            d="M 60 90 Q 130 50 250 80 T 380 180 T 320 340 T 140 360 T 40 250 Z"
            fill="url(#parkGlow)"
          />

          {/* Streets */}
          <path d="M-10 140 H410" stroke={mapMode === 'satellite' ? '#35433a' : '#ffffff'} strokeWidth="14" strokeLinecap="round" />
          <path d="M-10 280 H410" stroke={mapMode === 'satellite' ? '#35433a' : '#ffffff'} strokeWidth="12" strokeLinecap="round" />
          <path d="M 120 -10 V490" stroke={mapMode === 'satellite' ? '#35433a' : '#ffffff'} strokeWidth="16" strokeLinecap="round" />
          <path d="M 290 -10 V490" stroke={mapMode === 'satellite' ? '#35433a' : '#ffffff'} strokeWidth="14" strokeLinecap="round" />

          {/* Park Trails */}
          <path
            d="M 90 290 Q 150 250 170 200 T 260 170 T 330 110"
            stroke={mapMode === 'satellite' ? '#4f6155' : '#ffffff'}
            strokeWidth="6"
            strokeDasharray="2 4"
            strokeLinecap="round"
          />

          {/* Geofence Safe Zone Circle */}
          <circle
            cx="210"
            cy="235"
            r="160"
            fill="url(#geofenceFill)"
            opacity={activeWalk.safeZoneState === 'RED' ? '0.4' : '0.8'}
            stroke={activeWalk.safeZoneState === 'RED' ? '#ba1a1a' : activeWalk.safeZoneState === 'YELLOW' ? '#ee9f22' : '#006d3c'}
            strokeWidth="2.5"
            strokeDasharray="6 6"
          />

          {/* Breadcrumb Trail */}
          <path
            d="M 120 380 L 120 280 Q 120 220 165 210 T 225 180 L 255 195"
            stroke={activeWalk.safeZoneState === 'RED' ? '#ba1a1a' : '#006d3c'}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#gpsGlow)"
          />
          <path
            d="M 120 380 L 120 280 Q 120 220 165 210 T 225 180 L 255 195"
            stroke={activeWalk.safeZoneState === 'RED' ? '#ffdad6' : '#88f9b0'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Start Point Pin */}
          <circle cx="120" cy="380" r="5" fill="#023423" />
          <circle cx="120" cy="380" r="10" stroke="#023423" strokeWidth="1.5" opacity="0.3" />
        </svg>

        {/* Safe Zone Tag on Canvas */}
        <div className="absolute top-[82px] right-3 bg-surface-container-lowest/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-xs pointer-events-none flex items-center gap-1.5 border border-white/50">
          <span
            className={`w-2 h-2 rounded-full ${
              activeWalk.safeZoneState === 'RED'
                ? 'bg-error animate-ping'
                : activeWalk.safeZoneState === 'YELLOW'
                ? 'bg-tertiary-container animate-pulse'
                : 'bg-secondary'
            }`}
          />
          <span
            className={`font-headline text-[11px] font-semibold ${
              activeWalk.safeZoneState === 'RED'
                ? 'text-error font-bold'
                : activeWalk.safeZoneState === 'YELLOW'
                ? 'text-tertiary-container font-bold'
                : 'text-secondary'
            }`}
          >
            {activeWalk.safeZoneState === 'RED'
              ? 'PERIMETER BREACH'
              : activeWalk.safeZoneState === 'YELLOW'
              ? 'Approaching Limit'
              : 'Safe Zone (1.0 km)'}
          </span>
        </div>

        {/* Live GPS Active Position Pin (Milo & Walker) */}
        <div className="absolute top-[182px] left-[242px] -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group">
          <div className="absolute -inset-3 bg-secondary-fixed rounded-full animate-ping opacity-60"></div>
          <div className="relative flex items-center bg-surface-container-lowest px-2 py-1 rounded-full shadow-md gap-1.5 transition-transform active:scale-95 border border-secondary/20">
            <div className="relative w-7 h-7 rounded-full overflow-hidden bg-primary-fixed flex items-center justify-center shrink-0">
              <img
                className="w-full h-full object-cover"
                src={activeWalk.petAvatar}
                alt={activeWalk.petName}
              />
            </div>
            <div className="flex flex-col pr-1">
              <div className="flex items-center gap-1">
                <span className="font-headline text-[12px] leading-tight text-on-surface font-bold">
                  {activeWalk.petName}
                </span>
                <span className="text-[10px]">🐾</span>
              </div>
              <span className="text-[9px] text-secondary font-bold leading-none">Walking</span>
            </div>
          </div>
        </div>

        {/* Floating Safe Zone Status Banner at Top */}
        <div className="absolute top-3 inset-x-4 z-10 flex flex-col items-center">
          <div className="w-full bg-surface-container-lowest/95 backdrop-blur-md rounded-2xl p-2.5 px-3.5 shadow-md flex items-center justify-between border border-white/60">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`relative flex items-center justify-center w-7 h-7 rounded-full ${
                  activeWalk.safeZoneState === 'RED'
                    ? 'bg-error-container text-error'
                    : 'bg-secondary-container text-on-secondary-container'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {activeWalk.safeZoneState === 'RED' ? 'warning' : 'verified_user'}
                </span>
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`font-headline text-xs font-bold tracking-wider ${
                      activeWalk.safeZoneState === 'RED' ? 'text-error' : 'text-secondary'
                    }`}
                  >
                    {activeWalk.safeZoneState === 'RED' ? 'BREACH ALERT' : 'SAFE ZONE ACTIVE'}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                </div>
                <p className="text-xs text-on-surface-variant truncate">
                  Oakwood Perimeter · {activeWalk.distanceToBoundaryM}m to boundary
                </p>
              </div>
            </div>

            <button
              aria-label="Recentralize GPS location"
              onClick={() => setZoomLevel(1)}
              className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-primary hover:bg-secondary-fixed transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">my_location</span>
            </button>
          </div>
        </div>

        {/* Floating Map Controls (Right edge) */}
        <div className="absolute right-4 bottom-6 z-10 flex flex-col gap-2">
          <button
            aria-label="Toggle Satellite View"
            onClick={() => setMapMode(mapMode === 'streets' ? 'satellite' : 'streets')}
            className={`w-10 h-10 rounded-xl backdrop-blur-md shadow-md flex items-center justify-center transition-colors ${
              mapMode === 'satellite' ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest/90 text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">layers</span>
          </button>
          <div className="bg-surface-container-lowest/90 backdrop-blur-md rounded-xl shadow-md flex flex-col overflow-hidden">
            <button
              aria-label="Zoom in"
              onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2))}
              className="w-10 h-9 flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
            <div className="h-px bg-surface-container-high w-full"></div>
            <button
              aria-label="Zoom out"
              onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
              className="w-10 h-9 flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">remove</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Floating Interaction & Telemetry Area */}
      <div className="relative w-full -mt-4 bg-surface rounded-t-[28px] px-5 pt-4 pb-8 flex flex-col gap-4 shadow-xl z-20">
        {/* Tactile Drawer Drag Handle */}
        <div className="w-full flex justify-center py-0.5">
          <div className="w-10 h-1.5 bg-outline-variant/60 rounded-full"></div>
        </div>

        {/* Walker & Live Pet Connection Pill Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-3.5 shadow-xs border border-[#dde2f3]/40 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative">
                <img
                  className="w-11 h-11 rounded-full object-cover"
                  src={activeWalk.walkerAvatar}
                  alt={activeWalk.walkerName}
                />
                <span className="absolute -bottom-1 -right-1 bg-secondary text-on-secondary rounded-full p-0.5 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[12px]">verified</span>
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-headline font-bold text-headline-sm text-on-surface truncate">
                  {activeWalk.walkerName}
                </span>
                <span className="text-xs text-on-surface-variant truncate">
                  Walking {activeWalk.petName} ({activePet.breed})
                </span>
              </div>
            </div>

            {/* Quick Contact Actions */}
            <div className="flex items-center gap-2">
              <a
                href={`tel:${activeWalk.walkerPhone}`}
                aria-label="Call Walker"
                className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary active:scale-95 transition-transform hover:bg-primary-fixed"
              >
                <span className="material-symbols-outlined text-[20px]">call</span>
              </a>
              <div className="relative">
                <button
                  aria-label="Message Walker"
                  onClick={() => setCurrentTab('messages')}
                  className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary active:scale-95 transition-transform hover:bg-primary-container"
                >
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                </button>
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-secondary-container rounded-full border-2 border-surface-container-lowest"></span>
              </div>
            </div>
          </div>

          {/* Live Device Hardware Telemetry */}
          <div className="flex items-center justify-between pt-2 bg-surface-container-low px-3 py-2 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[16px]">smartphone</span>
              <span className="text-xs text-on-surface-variant">Walker:</span>
              <span className="text-xs text-on-surface font-bold">{activeWalk.walkerBatteryPct}%</span>
            </div>
            <div className="h-3 w-px bg-outline-variant/50"></div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[16px]">pets</span>
              <span className="text-xs text-on-surface-variant">{activeWalk.petName} Collar GPS:</span>
              <div className="flex items-center gap-1">
                <span className="text-xs text-secondary font-bold">{activeWalk.collarBatteryPct}%</span>
                <span className="material-symbols-outlined text-secondary text-[14px]">
                  battery_charging_full
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Walk Telemetry Bar */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-[#dde2f3]/40 flex flex-col gap-3.5">
          <div className="grid grid-cols-3 gap-2 divide-x divide-surface-container-high text-center">
            <div className="flex flex-col items-center">
              <span className="font-headline font-bold text-headline-sm text-on-surface">
                {activeWalk.distanceKm}
              </span>
              <span className="text-[10px] text-on-surface-variant uppercase font-medium tracking-wider">
                Distance (km)
              </span>
            </div>
            <div className="flex flex-col items-center pl-2">
              <span className="font-headline font-bold text-headline-sm text-secondary">
                {formatActiveTime(activeWalk.activeDurationSeconds)}
              </span>
              <span className="text-[10px] text-on-surface-variant uppercase font-medium tracking-wider">
                Active Time
              </span>
            </div>
            <div className="flex flex-col items-center pl-2">
              <span className="font-headline font-bold text-headline-sm text-on-surface">
                {activeWalk.avgPace}
              </span>
              <span className="text-[10px] text-on-surface-variant uppercase font-medium tracking-wider">
                Avg Pace /km
              </span>
            </div>
          </div>

          {/* Bathroom & Activity Micro-Log Bar */}
          <div className="flex items-center justify-between pt-1 gap-2">
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-full">
                <span className="text-sm">💦</span>
                <span className="text-xs text-on-surface font-bold">
                  {activeWalk.pottyCounts.pee} Pee
                </span>
              </div>
              <button
                onClick={() => setShowPoopPhoto(!showPoopPhoto)}
                className="flex items-center gap-1.5 bg-surface-container px-2.5 py-1.5 rounded-full hover:bg-surface-container-high transition-colors"
              >
                <span className="text-sm">💩</span>
                <span className="text-xs text-on-surface font-bold">
                  {activeWalk.pottyCounts.poop} Poop
                </span>
                <div className="w-4 h-4 rounded-full overflow-hidden ml-0.5">
                  <img
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuBCnSGTDRC6kdes9cbLwJS88qiYBnc9EBttyfLwU5WEAIJBIAQbvZTEHhY6CB_JPunpVBYNfwzzWCu8exaM-vMAEXb4SAS-zvz714BrVUYRW79kI9vLc3QJX_EUk2_Rqgeih2OOdModVoUVWHk67ZqjITbBCN_lEVF3GgQf_nW4HAOp4S1eA6EFNeh67ELgAPxtFDB8MkhBgRi2v6d36k90eWB4RSrkNI6-i0FBxkxBIYcynP2ViC"
                    alt="Clean grassy park photo"
                  />
                </div>
              </button>
            </div>

            <div className="flex items-center gap-1 text-secondary text-xs font-semibold shrink-0 bg-secondary-container/40 px-2.5 py-1 rounded-lg">
              <span className="material-symbols-outlined text-[14px]">water_drop</span>
              <span>Hydrated</span>
            </div>
          </div>

          {/* Expanded photo thumbnail preview if toggled */}
          {showPoopPhoto && (
            <div className="p-2.5 bg-surface-container-low rounded-xl flex items-center gap-3">
              <img
                className="w-14 h-14 rounded-lg object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuBCnSGTDRC6kdes9cbLwJS88qiYBnc9EBttyfLwU5WEAIJBIAQbvZTEHhY6CB_JPunpVBYNfwzzWCu8exaM-vMAEXb4SAS-zvz714BrVUYRW79kI9vLc3QJX_EUk2_Rqgeih2OOdModVoUVWHk67ZqjITbBCN_lEVF3GgQf_nW4HAOp4S1eA6EFNeh67ELgAPxtFDB8MkhBgRi2v6d36k90eWB4RSrkNI6-i0FBxkxBIYcynP2ViC"
                alt="Potty log detail"
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-on-surface">GPS Photo Stamp Verified</span>
                <span className="text-[11px] text-on-surface-variant">
                  Cleaned with compostable bag at Oakwood trail marker #4.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Live Activity Journey Feed */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-[#dde2f3]/40 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-headline font-bold text-headline-sm text-on-surface">
              Live Activity Stream
            </h2>
            <span className="text-xs text-secondary font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              Live updating
            </span>
          </div>

          <div className="flex flex-col gap-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-container">
            {activeWalk.timeline.map((evt) => (
              <div key={evt.id} className="flex items-start gap-3 relative">
                <div className="w-7 h-7 rounded-full bg-surface-container-high text-primary flex items-center justify-center shrink-0 z-10 shadow-xs">
                  <span className="material-symbols-outlined text-[15px]">{evt.icon}</span>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-on-surface">{evt.title}</span>
                    <span className="text-[10px] text-on-surface-variant">{evt.time}</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant">{evt.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety & Critical Action Center */}
        <div className="flex flex-col gap-3 pt-1">
          {/* EMERGENCY SOS TRIGGER BUTTON */}
          <button
            type="button"
            onClick={() =>
              triggerSOS({
                type: 'MANUAL_SOS',
                title: 'Live Dog Walk SOS Alert',
                description: `Emergency button triggered during active walk with Sarah Jenkins. Coords: 37.7749° N, 122.4194° W.`,
              })
            }
            className="w-full h-14 bg-error text-on-error rounded-2xl flex items-center justify-between px-5 font-headline shadow-md active:scale-[0.98] transition-transform relative overflow-hidden group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-surface-container-lowest/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px] animate-pulse">emergency</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="tracking-wide uppercase font-bold text-sm">EMERGENCY SOS</span>
                <span className="text-[11px] font-normal opacity-90 leading-tight">
                  Instant 24/7 Vet Support &amp; Walker Alert
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[22px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>

          {/* Secondary Share Live Tracking Link */}
          <button
            type="button"
            onClick={handleShareLink}
            className="w-full h-12 bg-surface-container-lowest text-primary rounded-xl flex items-center justify-center gap-2 font-headline font-semibold text-xs shadow-xs hover:bg-surface-container transition-colors active:scale-[0.98] border border-[#dde2f3]/40"
          >
            <span className="material-symbols-outlined text-[18px]">share_location</span>
            <span>
              {copiedLink ? 'Link Copied to Clipboard! ✓' : 'Share Live Walk Link with Family'}
            </span>
          </button>
        </div>

        {/* Live Simulation Controls for Walker / Pet */}
        <div className="p-3 bg-surface-container-low/60 rounded-xl border border-outline-variant/30 flex flex-col gap-2">
          <span className="text-[10px] uppercase font-bold text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px] text-secondary">tune</span>
            Walker Telemetry &amp; Event Simulation
          </span>
          <div className="grid grid-cols-4 gap-1.5">
            <button
              onClick={() => incrementPotty('pee')}
              className="py-1 px-1 bg-surface-container-lowest rounded text-[11px] font-semibold text-on-surface hover:bg-surface-container"
            >
              +1 Pee 💦
            </button>
            <button
              onClick={() => incrementPotty('poop')}
              className="py-1 px-1 bg-surface-container-lowest rounded text-[11px] font-semibold text-on-surface hover:bg-surface-container"
            >
              +1 Poop 💩
            </button>
            <button
              onClick={() => logHydrationBreak()}
              className="py-1 px-1 bg-surface-container-lowest rounded text-[11px] font-semibold text-secondary hover:bg-surface-container"
            >
              + Water 🥤
            </button>
            <button
              onClick={handleSimulateBoundary}
              className="py-1 px-1 bg-surface-container-lowest rounded text-[10px] font-semibold text-error hover:bg-surface-container truncate"
            >
              Zone Breach
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
