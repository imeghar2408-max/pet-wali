import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Pet } from '../types/index.ts';

interface HomeScreenProps {
  onOpenAddPet: () => void;
  onOpenQuickSettings: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onOpenAddPet,
  onOpenQuickSettings,
}) => {
  const {
    user,
    pets,
    activePet,
    setActivePet,
    activeWalk,
    setCurrentTab,
    setBookingServiceSlug,
    triggerAccidentDetectionSim,
    triggerSOS,
    activeEmergency,
  } = useApp();

  const [dismissTip, setDismissTip] = useState(false);
  const [liveSeconds, setLiveSeconds] = useState(28 * 60 + 18);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const services = [
    { id: 'dog-walking', name: 'Dog Walking', icon: 'directions_walk', active: true },
    { id: 'grooming', name: 'Grooming', icon: 'content_cut' },
    { id: 'tele-vet', name: 'Tele-Vet', icon: 'video_call', badge: '24/7' },
    { id: 'home-vet', name: 'Home Vet', icon: 'home_health' },
    { id: 'boarding', name: 'Boarding', icon: 'apartment' },
    { id: 'training', name: 'Training', icon: 'sports_score' },
    { id: 'adoption', name: 'Adoption', icon: 'favorite' },
    { id: 'mating', name: 'Pet Mating', icon: 'diversity_1' },
  ];

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-5 pb-28 pt-2 space-y-6">
      {/* Top Greeting & Dynamic Pet Switcher */}
      <section className="flex flex-col gap-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-body text-xs text-on-surface-variant font-medium flex items-center gap-1.5">
              <span>Tuesday, Oct 24</span>
              <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
              <span>Sunny, 19°C</span>
            </span>
            <h1 className="font-headline text-headline-lg font-bold text-primary tracking-tight mt-0.5">
              Good morning, {user.name.split(' ')[0]} 👋
            </h1>
          </div>
          <button
            aria-label="Quick pet settings"
            onClick={onOpenQuickSettings}
            className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary active:scale-95 transition-transform hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>
        </div>

        {/* Pet Quick Selector Carousel */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 -mx-5 px-5 no-scrollbar">
          {pets.map((p) => {
            const isSelected = activePet.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActivePet(p)}
                className={`flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 rounded-full shrink-0 transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-primary text-on-primary shadow-sm ring-2 ring-primary/20'
                    : 'bg-surface-container-lowest text-on-surface-variant shadow-xs hover:bg-surface-container-low'
                }`}
              >
                <div
                  className={`relative w-8 h-8 rounded-full overflow-hidden ${
                    isSelected ? 'bg-primary-fixed' : 'bg-surface-container-high'
                  }`}
                >
                  <img
                    className="w-full h-full object-cover"
                    src={p.photoUrl}
                    alt={p.name}
                  />
                  {p.activeStatusNote.includes('walk') && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-secondary-fixed rounded-full ring-2 ring-primary animate-pulse" />
                  )}
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-headline text-[13px] leading-tight font-semibold flex items-center gap-1">
                    {p.name}
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed"></span>}
                  </span>
                  <span
                    className={`font-body text-[10px] leading-none ${
                      isSelected ? 'text-primary-fixed' : 'text-on-surface-variant'
                    }`}
                  >
                    {p.activeStatusNote}
                  </span>
                </div>
              </button>
            );
          })}

          {/* Add New Pet Button */}
          <button
            onClick={onOpenAddPet}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-surface-container-lowest text-on-surface-variant font-body text-xs font-semibold shadow-xs shrink-0 active:scale-95 transition-transform hover:bg-surface-container-low"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Add Pet</span>
          </button>
        </div>
      </section>

      {/* EMERGENCY ALERT BANNER IF ACTIVE */}
      {activeEmergency && (
        <div
          onClick={() => setCurrentTab('emergency-sos')}
          className="relative bg-error-container text-on-error-container rounded-2xl p-4 shadow-md flex items-center justify-between cursor-pointer animate-pulse border border-error/30"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-error text-on-error flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">warning</span>
            </div>
            <div>
              <span className="font-headline font-bold text-sm text-error block">
                ACTIVE INCIDENT: {activeEmergency.title}
              </span>
              <span className="text-xs text-on-error-container">
                Click to open emergency command center & auto-dispatch
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-error text-[20px]">chevron_right</span>
        </div>
      )}

      {/* LIVE WALK IN PROGRESS HERO CARD */}
      <section className="relative bg-surface-container-lowest rounded-[24px] p-5 shadow-[0_12px_32px_-4px_rgba(30,75,56,0.08),0_4px_12px_-2px_rgba(26,32,44,0.04)] border border-[#dde2f3]/40 flex flex-col gap-4">
        {/* Card Header with Real-Time Badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-fixed/40 text-secondary font-headline text-[10px] font-bold tracking-wide uppercase w-fit">
              <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
              <span>Live Walk in Progress</span>
            </div>
            <h2 className="font-headline text-headline-md font-bold text-on-surface mt-0.5">
              Morning Park Trek
            </h2>
          </div>

          {/* Safe Zone Pill */}
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-headline text-[11px] font-semibold shrink-0 ${
              activeWalk?.safeZoneState === 'RED'
                ? 'bg-error-container text-error'
                : activeWalk?.safeZoneState === 'YELLOW'
                ? 'bg-tertiary-fixed text-tertiary-container'
                : 'bg-secondary/10 text-secondary'
            }`}
          >
            <span className="material-symbols-outlined text-[14px] material-symbols-fill">
              {activeWalk?.safeZoneState === 'RED' ? 'gpp_bad' : 'verified_user'}
            </span>
            <span>
              {activeWalk?.safeZoneState === 'RED'
                ? 'Breach Alert'
                : activeWalk?.safeZoneState === 'YELLOW'
                ? 'Near Boundary'
                : 'Inside Safe Zone'}
            </span>
          </div>
        </div>

        {/* Walker Profile Strip */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-container-low">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-full overflow-hidden bg-surface-variant shrink-0">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvLQZ9XGwOgAVvOM3ycuKCVRQ48p7OnpbcY4SgeyQBnNYjs2Xn91xwerGyvI1Ig-2br3AWEmHi_QUd317pryZHcYO6hU0WeSttSYxNX5D4J5rQFef8MwLrA4xdyBeRxgRVy0krTSr5tGjggyIAanz2bJc18zmJ8KnoK-P7KPyKWSczQ4GzhIXnFMd5DugFIyPk1b9wedznI-aA-qKjXz-4oOVTX2jUrsW8DalNAZwCCIM-hq8u1lx-"
                alt="Sarah Jenkins"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-secondary rounded-full ring-2 ring-surface-container-low flex items-center justify-center">
                <span className="material-symbols-outlined text-[9px] text-on-secondary">check</span>
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-headline font-bold text-sm text-on-surface">
                  Sarah Jenkins
                </span>
                <span className="material-symbols-outlined text-[14px] text-secondary material-symbols-fill">
                  verified
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant font-medium">
                <span className="flex items-center text-on-tertiary-container font-semibold">
                  <span className="material-symbols-outlined text-[13px] mr-0.5 material-symbols-fill">
                    star
                  </span>
                  4.9
                </span>
                <span>•</span>
                <span>420+ walks logged</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href="tel:+15552348901"
              aria-label="Call Walker"
              className="w-9 h-9 rounded-full bg-surface-container-lowest text-primary flex items-center justify-center shadow-xs active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[18px]">call</span>
            </a>
            <button
              onClick={() => setCurrentTab('messages')}
              aria-label="Send Message to Walker"
              className="w-9 h-9 rounded-full bg-surface-container-lowest text-primary flex items-center justify-center shadow-xs active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[18px]">sms</span>
            </button>
          </div>
        </div>

        {/* Interactive Visual Live Map Preview with Telemetry */}
        <div
          onClick={() => setCurrentTab('live-walk')}
          className="relative w-full h-44 rounded-2xl overflow-hidden bg-surface-container flex flex-col justify-end p-2.5 cursor-pointer group"
        >
          {/* Simulated Vector Map Layer */}
          <div className="absolute inset-0 w-full h-full bg-[#f1f3ff]">
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              fill="none"
              viewBox="0 0 340 176"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Park contour */}
              <path
                d="M-10 140 C60 120, 110 90, 180 110 C240 130, 290 80, 360 70"
                opacity="0.75"
                stroke="#bdedd3"
                strokeLinecap="round"
                strokeWidth="10"
              />
              <path
                d="M30 160 C80 110, 150 140, 220 80 C270 40, 320 60, 360 20"
                opacity="0.6"
                stroke="#bdedd3"
                strokeDasharray="6 6"
                strokeLinecap="round"
                strokeWidth="6"
              />
              {/* Safe Zone Circle */}
              <circle
                cx="170"
                cy="88"
                fill="#88f9b0"
                fillOpacity="0.18"
                r="62"
                stroke="#006d3c"
                strokeDasharray="4 3"
                strokeWidth="1.5"
              />
              {/* Walker Route */}
              <path
                d="M125 125 Q145 95 168 85 T195 72"
                stroke="#006d3c"
                strokeLinecap="round"
                strokeWidth="3.5"
              />
              {/* Milo Pin */}
              <g transform="translate(195, 72)">
                <circle className="animate-ping" cx="0" cy="0" fill="#006d3c" fillOpacity="0.25" r="14" />
                <circle cx="0" cy="0" fill="#006d3c" r="8" />
                <circle cx="0" cy="0" fill="#ffffff" r="3.5" />
              </g>
              {/* Walker Pin */}
              <g transform="translate(182, 78)">
                <circle cx="0" cy="0" fill="#5f3b00" r="5" />
                <circle cx="0" cy="0" fill="#ffddb6" r="2" />
              </g>
              {/* Safe Perimeter Pill Tag */}
              <g transform="translate(132, 38)">
                <rect
                  fill="#ffffff"
                  fillOpacity="0.95"
                  filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))"
                  height="18"
                  rx="9"
                  width="76"
                />
                <text
                  fill="#023423"
                  fontFamily="Plus Jakarta Sans"
                  fontSize="8.5"
                  fontWeight="700"
                  textAnchor="middle"
                  x="38"
                  y="12"
                >
                  SAFE PERIMETER
                </text>
              </g>
            </svg>
          </div>

          {/* Floating Indicators */}
          <div className="absolute top-2.5 left-2.5 bg-surface-container-lowest/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span className="font-headline text-[10px] text-primary font-bold tracking-wider uppercase">
              GPS Connected • 5G
            </span>
          </div>

          <div className="absolute top-2.5 right-2.5 bg-surface-container-lowest/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-xs">
            <span className="material-symbols-outlined text-[13px] text-secondary">speed</span>
            <span className="font-headline text-[10px] font-bold text-on-surface">
              {activeWalk?.currentSpeedKmH || 3.4} km/h
            </span>
          </div>

          {/* Telemetry Floating Glass Strip */}
          <div className="relative w-full bg-surface-container-lowest/95 backdrop-blur-md rounded-xl p-2.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2 px-1">
              <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[16px]">distance</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline font-bold text-[15px] text-on-surface leading-none">
                  {activeWalk?.distanceKm || 1.8}
                </span>
                <span className="text-[10px] text-on-surface-variant font-medium">Distance (km)</span>
              </div>
            </div>

            <div className="h-6 w-px bg-outline-variant/30"></div>

            <div className="flex items-center gap-2 px-1">
              <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[16px]">timer</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline font-bold text-[15px] text-on-surface leading-none">
                  {formatTimer(liveSeconds)}
                </span>
                <span className="text-[10px] text-on-surface-variant font-medium">Active (min)</span>
              </div>
            </div>

            <div className="h-6 w-px bg-outline-variant/30"></div>

            <div className="flex items-center gap-2 px-1">
              <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[16px]">potted_plant</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 leading-none font-headline font-bold text-[15px] text-on-surface">
                  <span>{activeWalk?.pottyCounts.pee || 2}💧</span>
                  <span className="text-[12px] opacity-75">{activeWalk?.pottyCounts.poop || 1}💩</span>
                </div>
                <span className="text-[10px] text-on-surface-variant font-medium">Potty breaks</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action: Full Map Expander */}
        <button
          onClick={() => setCurrentTab('live-walk')}
          className="w-full h-[48px] bg-primary text-on-primary rounded-xl font-headline text-sm font-bold flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform hover:opacity-95"
        >
          <span className="material-symbols-outlined text-[19px]">explore</span>
          <span>Expand Live GPS Radar</span>
          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
        </button>
      </section>

      {/* Services & Care Grid */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <h2 className="font-headline text-headline-sm text-on-surface font-bold">Services &amp; Care</h2>
            <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-headline text-[10px] font-bold">
              Verified
            </span>
          </div>
          <button
            onClick={() => {
              setBookingServiceSlug('dog-walking');
              setCurrentTab('service-booking');
            }}
            className="text-xs text-secondary font-semibold hover:underline"
          >
            See all (8)
          </button>
        </div>

        {/* 4x2 Grid */}
        <div className="grid grid-cols-4 gap-2.5">
          {services.map((srv) => (
            <button
              key={srv.id}
              onClick={() => {
                setBookingServiceSlug(srv.id);
                setCurrentTab('service-booking');
              }}
              className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-surface-container-lowest shadow-xs hover:shadow-md transition-all active:scale-95 group text-center border border-[#dde2f3]/40"
            >
              <div
                className={`relative w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform ${
                  srv.active
                    ? 'bg-secondary-fixed/40 text-secondary'
                    : srv.badge
                    ? 'bg-tertiary-fixed text-tertiary-container'
                    : 'bg-surface-container text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-[24px]">{srv.icon}</span>
                {srv.active && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-secondary text-on-secondary rounded-full flex items-center justify-center text-[9px] font-bold">
                    ✓
                  </span>
                )}
                {srv.badge && (
                  <span className="absolute -top-1 -right-1 px-1 rounded-full bg-error text-on-error text-[8px] font-bold">
                    {srv.badge}
                  </span>
                )}
              </div>
              <span className="font-body text-[11px] font-semibold text-on-surface leading-tight line-clamp-1">
                {srv.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* UPCOMING VET APPOINTMENT CARD */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h2 className="font-headline text-headline-sm text-on-surface font-bold">Upcoming Care</h2>
          <span className="text-xs text-on-surface-variant font-medium">1 scheduled</span>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-[#dde2f3]/40 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">calendar_today</span>
              <span className="font-headline font-bold text-sm text-on-surface">Tomorrow, 10:30 AM</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-headline text-[10px] font-bold">
              Home Visit
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-surface-container shrink-0">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsG3EEUK_BjsZhFaqbIiim_XuKPuVi47F9q6psv_TWdRwhDBrrGtr4AmktKapY1XZB-Wg-KH6aYTw7vOGa7Bkpg2nM3PnAbH0u0wWV9IV5bKHIc9jDr7Pz-5MZlQXaQ9hMjne9NawK7U03qgZ0rZLAjhM3ZOVCe5KPWWfCysPaKsv_hukiQ0eJiov9_idbi70tHT3gIWUcmLTrUuxm4U-MK-okF5noR-rBginmjHxWuEkGqqfjRPc-"
                alt="Dr. Aris Thorne"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <h3 className="font-headline font-bold text-sm text-on-surface truncate">
                Dr. Aris Thorne, DVM
              </h3>
              <p className="text-xs text-on-surface-variant truncate">
                Annual Health Checkup &amp; Rabies Booster
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                <span className="text-[11px] text-on-surface-variant">For Milo • Confirmed</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => setCurrentTab('bookings')}
              className="flex-1 h-10 rounded-xl bg-surface-container-low text-primary font-headline text-xs font-bold hover:bg-surface-container transition-colors"
            >
              Reschedule
            </button>
            <button
              onClick={() => setCurrentTab('pets')}
              className="flex-1 h-10 rounded-xl bg-primary text-on-primary font-headline text-xs font-bold hover:opacity-95 transition-opacity"
            >
              View Dossier
            </button>
          </div>
        </div>
      </section>

      {/* DAILY WELLNESS & HEALTH INSIGHT TIP */}
      {!dismissTip && (
        <section className="bg-gradient-to-r from-tertiary-fixed/40 via-surface-container-lowest to-surface-container-lowest rounded-2xl p-4 shadow-xs border border-[#dde2f3]/40 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-full bg-tertiary-fixed text-tertiary-container flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[22px]">wb_sunny</span>
          </div>
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="font-headline text-[10px] font-bold tracking-wider uppercase text-tertiary-container">
                Hydration &amp; Weather Advisory
              </span>
              <button
                aria-label="Dismiss tip"
                onClick={() => setDismissTip(true)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
            <p className="font-headline font-semibold text-xs text-on-surface">
              Midday heat index is rising in your area
            </p>
            <p className="text-[12px] text-on-surface-variant leading-relaxed">
              Ensure Milo pauses every 20 minutes for cool water. Walker Sarah carries a fresh hydration flask.
            </p>
          </div>
        </section>
      )}

      {/* DEVELOPER SIMULATION CONTROLS BAR (For testing accident detection & boundary alerts) */}
      <section className="bg-surface-container-low/70 rounded-2xl p-3 border border-outline-variant/30 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-headline text-[11px] font-bold text-on-surface uppercase tracking-wide flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-secondary">science</span>
            Safety Sim Lab (Dev / Demo)
          </span>
          <span className="text-[10px] text-on-surface-variant">Simulate Sensors & SOS</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={triggerAccidentDetectionSim}
            className="py-1.5 px-2 bg-surface-container-lowest hover:bg-surface-container rounded-lg text-[11px] font-semibold text-error flex items-center justify-center gap-1 shadow-xs border border-error/20"
          >
            <span className="material-symbols-outlined text-[14px]">motion_sensor_active</span>
            Test Fall / Collision
          </button>
          <button
            onClick={() =>
              triggerSOS({
                type: 'MANUAL_SOS',
                title: 'Manual Emergency Trigger',
                description: 'User initiated high-priority SOS alert from mobile app.',
              })
            }
            className="py-1.5 px-2 bg-error text-on-error rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs"
          >
            <span className="material-symbols-outlined text-[14px]">emergency</span>
            Trigger SOS
          </button>
        </div>
      </section>
    </div>
  );
};
