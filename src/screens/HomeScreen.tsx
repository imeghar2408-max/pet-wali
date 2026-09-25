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
  


  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const services: { id: string; name: string; icon: string; active?: boolean }[] = [
    { id: 'dog-walking', name: 'Dog Walking', icon: 'directions_walk', active: true },
    { id: 'grooming', name: 'Grooming', icon: 'content_cut' },
    { id: 'training', name: 'Training', icon: 'sports_score' },
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

      {activeWalk ? (
        <section className="rounded-2xl border border-[#dde2f3]/50 bg-white p-5">
          <h2 className="font-headline font-bold text-on-surface">Walk in progress</h2>
          <p className="text-sm text-on-surface-variant mt-1">Live tracking is available for this active walk.</p>
          <button onClick={() => setCurrentTab('live-walk')} className="mt-3 text-sm font-semibold text-primary">Open walk tracking</button>
        </section>
      ) : (
        <section className="rounded-2xl border border-[#dde2f3]/50 bg-white p-5">
          <h2 className="font-headline font-bold text-on-surface">No active service</h2>
          <p className="text-sm text-on-surface-variant mt-1">Choose a service to request care for your pet.</p>
        </section>
      )}

      {/* Services & Care Grid */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <h2 className="font-headline text-headline-sm text-on-surface font-bold">Services</h2>
            <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-headline text-[10px] font-bold">
              Verified
            </span>
          </div>
          <button
            onClick={() => {
              setCurrentTab('bookings');
            }}
            className="text-xs text-secondary font-semibold hover:underline"
          >
            View bookings
          </button>
        </div>

        {/* 4x2 Grid */}
        <div className="grid grid-cols-3 gap-2.5">
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
                    : 'bg-surface-container text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-[24px]">{srv.icon}</span>
                {srv.active && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-secondary text-on-secondary rounded-full flex items-center justify-center text-[9px] font-bold">
                    ✓
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
