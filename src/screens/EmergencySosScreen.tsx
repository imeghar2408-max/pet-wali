import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';

export const EmergencySosScreen: React.FC = () => {
  const {
    activeEmergency,
    resolveEmergency,
    dispatchEmergency,
    activePet,
    user,
    activeWalk,
    setCurrentTab,
  } = useApp();

  const [countdown, setCountdown] = useState<number>(38);
  const [resolvedStatus, setResolvedStatus] = useState<boolean>(false);
  const [dispatchedStatus, setDispatchedStatus] = useState<boolean>(false);
  const [copiedCoords, setCopiedCoords] = useState<boolean>(false);
  const [vetNotified, setVetNotified] = useState<boolean>(false);

  useEffect(() => {
    if (resolvedStatus || dispatchedStatus) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setDispatchedStatus(true);
          if (activeEmergency) {
            dispatchEmergency(activeEmergency.id);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resolvedStatus, dispatchedStatus, activeEmergency, dispatchEmergency]);

  const handleResolveAlarm = async () => {
    if (activeEmergency) {
      await resolveEmergency(activeEmergency.id, 'False alarm marked by owner Elena Miller.');
    }
    setResolvedStatus(true);
  };

  const handleDispatchNow = async () => {
    if (activeEmergency) {
      await dispatchEmergency(activeEmergency.id);
    }
    setDispatchedStatus(true);
  };

  const handleCopyCoords = () => {
    navigator.clipboard?.writeText('37.7749, -122.4194');
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  const handleNotifyVet = () => {
    setVetNotified(true);
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-5 pb-16 pt-2 space-y-4">
      {/* Incident Alert Banner / Warning Card */}
      <div
        className={`relative w-full rounded-2xl p-4 shadow-lg overflow-hidden transition-all duration-300 ${
          resolvedStatus
            ? 'bg-secondary-container text-on-secondary-container'
            : 'bg-error-container text-on-error-container'
        }`}
      >
        {!resolvedStatus && (
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-error/15 animate-ping pointer-events-none" />
        )}

        {resolvedStatus ? (
          <div className="flex items-center gap-3 py-2">
            <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">verified</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-headline-sm text-secondary">
                Incident Marked Safe
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                False alarm logged. Walker Sarah Jenkins has been notified to resume regular walk protocol.
              </p>
              <button
                onClick={() => setCurrentTab('live-walk')}
                className="mt-2 text-xs font-bold text-secondary underline"
              >
                Return to Live Walk
              </button>
            </div>
          </div>
        ) : (
          <div className="relative z-10 flex flex-col space-y-3">
            {/* Status Badge & Live Timer */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-error text-on-error font-headline text-[11px] font-bold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-on-error animate-pulse"></span>
                INCIDENT DETECTED
              </span>
              <div className="flex items-center gap-1 bg-surface-container-lowest/80 backdrop-blur-xs px-2.5 py-1 rounded-full text-on-surface">
                <span className="material-symbols-outlined text-[16px] text-error">timer</span>
                <span className="font-headline font-bold text-xs tracking-tight">
                  {dispatchedStatus
                    ? 'DISPATCHED'
                    : `00:${countdown < 10 ? '0' : ''}${countdown}`}
                </span>
              </div>
            </div>

            {/* Incident Heading */}
            <div className="pt-0.5">
              <h2 className="font-headline text-headline-sm font-bold text-on-error-container flex items-center gap-1.5">
                <span className="material-symbols-outlined text-error text-[22px]">warning</span>
                {activeEmergency?.title || 'Sudden Stop Detected'}
              </h2>
              <p className="text-xs text-on-surface-variant mt-1 leading-snug">
                {activeEmergency?.description ||
                  'Walker Sarah & Milo stopped unexpectedly near 4th & Elm St for > 4 minutes. Collision/drop sensor triggered.'}
              </p>
            </div>

            {/* Dynamic Micro Feedback Bar */}
            <div className="w-full bg-surface-container-highest/60 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-error h-full rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${(countdown / 38) * 100}%` }}
              />
            </div>

            <p className="text-[11px] text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">cell_tower</span>
              Auto-dispatching field unit if safe status unconfirmed.
            </p>

            {/* Immediate Action Split */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleResolveAlarm}
                className="w-full h-12 flex items-center justify-center gap-1.5 rounded-xl bg-surface-container-lowest text-on-surface font-headline font-semibold text-xs active:scale-95 transition-all shadow-xs hover:bg-surface-container-low"
              >
                <span className="material-symbols-outlined text-[18px] text-secondary">check_circle</span>
                <span>I&apos;m OK / False Alarm</span>
              </button>

              <button
                type="button"
                onClick={handleDispatchNow}
                className={`w-full h-12 flex items-center justify-center gap-1.5 rounded-xl font-headline font-bold text-xs shadow-md active:scale-95 transition-transform ${
                  dispatchedStatus ? 'bg-secondary text-on-secondary' : 'bg-error text-on-error'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">e911_emergency</span>
                <span>{dispatchedStatus ? 'DISPATCH SENT ✓' : 'DISPATCH SOS'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Live Location & Scene Telemetry Card */}
      <div className="w-full bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-[#dde2f3]/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-container/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">fmd_good</span>
            </div>
            <div>
              <span className="text-[10px] text-outline uppercase tracking-wider block font-semibold">
                Incident Coordinates
              </span>
              <span className="font-headline font-bold text-headline-sm text-on-surface">
                Oakwood Park South Entrance
              </span>
            </div>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
            GPS Active
          </span>
        </div>

        {/* Map Preview Canvas */}
        <div className="w-full h-36 bg-[#dde2f3] rounded-xl relative overflow-hidden flex items-end p-2.5 shadow-inner">
          {/* Simulated Street Map Graphic */}
          <div className="absolute inset-0 bg-[#e8eeff] opacity-90">
            <svg className="w-full h-full" viewBox="0 0 320 144" fill="none">
              <rect width="320" height="144" fill="#dde2f3" />
              <path d="M0 40 H320" stroke="#ffffff" strokeWidth="12" />
              <path d="M0 100 H320" stroke="#ffffff" strokeWidth="16" />
              <path d="M100 0 V144" stroke="#ffffff" strokeWidth="14" />
              <path d="M220 0 V144" stroke="#ffffff" strokeWidth="12" />
              <circle cx="160" cy="72" r="8" fill="#ba1a1a" />
              <circle cx="160" cy="72" r="18" fill="#ba1a1a" fillOpacity="0.2" className="animate-ping" />
            </svg>
          </div>

          {/* Location Float Capsule */}
          <div className="relative z-10 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center justify-between w-full shadow-xs border border-white/60">
            <div className="flex items-center gap-1.5 truncate">
              <span className="material-symbols-outlined text-error text-[16px]">location_on</span>
              <span className="text-on-surface truncate text-xs font-semibold">
                37.7749° N, 122.4194° W
              </span>
            </div>
            <button
              onClick={handleCopyCoords}
              className="text-secondary text-xs font-bold flex items-center gap-0.5 active:opacity-70 shrink-0 ml-2"
            >
              <span className="material-symbols-outlined text-[14px]">content_copy</span>
              <span>{copiedCoords ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-0.5">
          <span className="text-xs text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-outline">near_me</span>
            Last ping recorded 12s ago
          </span>
          <a
            className="text-xs font-bold text-secondary flex items-center gap-0.5 hover:underline"
            href="https://maps.google.com/?q=37.7749,-122.4194"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open external map
            <span className="material-symbols-outlined text-[15px]">open_in_new</span>
          </a>
        </div>
      </div>

      {/* Primary Instant Emergency Connect Buttons */}
      <div className="space-y-2">
        <span className="text-[10px] text-outline uppercase tracking-wider block font-bold px-1">
          Instant Emergency Lines
        </span>

        {/* 1-Tap: Call Walker Direct */}
        <a
          href={`tel:${activeWalk?.walkerPhone || '+15552348901'}`}
          className="w-full min-h-[58px] bg-secondary text-on-secondary rounded-2xl px-4 py-3 flex items-center justify-between shadow-xs active:scale-[0.99] transition-transform"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-container-lowest/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">call</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-headline font-bold text-headline-sm leading-tight">
                Call Walker Directly
              </span>
              <span className="text-xs opacity-90">
                Sarah Jenkins • +1 (555) 234-8901
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[22px]">arrow_forward</span>
        </a>

        {/* 1-Tap: 24/7 Safety Dispatch */}
        <button
          onClick={handleDispatchNow}
          className="w-full min-h-[58px] bg-error text-on-error rounded-2xl px-4 py-3 flex items-center justify-between shadow-md active:scale-[0.99] transition-transform"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-container-lowest/25 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">shield</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-headline font-bold text-headline-sm leading-tight">
                PetCare 24/7 Priority Dispatch
              </span>
              <span className="text-xs opacity-95">Direct line to Animal First Responder unit</span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest/20 text-xs font-bold uppercase tracking-wide">
            SOS
          </span>
        </button>

        {/* 1-Tap: Nearest Vet Hospital */}
        <div className="w-full bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-[#dde2f3]/40 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
              <span className="material-symbols-outlined text-[24px]">local_hospital</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-headline-sm text-on-surface">
                VCA North Bay Emergency Vet
              </h3>
              <p className="text-xs text-on-surface-variant">
                1.2 miles away • Open 24 Hours • Trauma Ready
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href="tel:+15559874411"
              className="h-11 flex items-center justify-center gap-1 rounded-xl bg-surface-container text-on-surface font-headline font-semibold text-xs active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">call</span>
              <span>Call Clinic</span>
            </a>
            <a
              href="https://maps.google.com/?q=VCA+Emergency+Vet+Oakwood"
              target="_blank"
              rel="noopener noreferrer"
              className="h-11 flex items-center justify-center gap-1 rounded-xl bg-primary text-on-primary font-headline font-semibold text-xs active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">directions_car</span>
              <span>Route 4 Min</span>
            </a>
          </div>
        </div>
      </div>

      {/* Pet & Walker Vitals Dossier Split */}
      <div className="grid grid-cols-1 gap-2.5">
        {/* Pet Critical Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-[#dde2f3]/40 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                className="w-12 h-12 rounded-full object-cover shadow-xs"
                src={activePet.photoUrl}
                alt={activePet.name}
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-headline font-bold text-headline-sm text-on-surface">
                    {activePet.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-semibold">
                    {activePet.weightKg} kg
                  </span>
                </div>
                <span className="text-xs text-outline">
                  {activePet.breed} • Microchip #{activePet.microchipId}
                </span>
              </div>
            </div>
            <span className="px-2 py-1 rounded bg-error-container text-error text-[11px] font-bold">
              ALLERGY ALERT
            </span>
          </div>

          <div className="mt-1 p-2.5 rounded-xl bg-surface-container-low text-on-surface text-xs flex items-start gap-2">
            <span className="material-symbols-outlined text-tertiary text-[18px] shrink-0 mt-0.5">
              medication
            </span>
            <div>
              <span className="font-semibold block text-on-surface">
                Medical Note: Mild Bee Venom Allergy
              </span>
              <span className="text-on-surface-variant text-[11px]">
                EpiPen carried in walker safety pouch (Side mesh #2). Insurance: HealthyPaws Policy #HP-99824.
              </span>
            </div>
          </div>
        </div>

        {/* Certified Walker Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-[#dde2f3]/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              className="w-11 h-11 rounded-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdCnDj9UXoshuVpXxccbD6O7aeFplIH9w00k-LBBfw_D_o6Lx2fLtX3TxBOwlpb_O61NCvD60Cgw11r8jtjALMfLUx0N3nhb0nBh6u1muDjV7wXbrzMz2A0GedMyBt1nE9pYSs716kIX0G-aHEF3_vdf9R33Uruz7p1M-35wMhOvp2s-SuUwM1k8nFuATXmQ-VOyZ0d5H3bB-wt_opQ6q8jlgnuI2Io1t33O6qU3hX1bhuIh-4b5-x"
              alt="Sarah Jenkins"
            />
            <div>
              <div className="flex items-center gap-1">
                <span className="font-headline font-bold text-headline-sm text-on-surface">
                  Sarah Jenkins
                </span>
                <span
                  className="material-symbols-outlined text-[16px] text-secondary material-symbols-fill"
                  title="Verified Responder"
                >
                  verified
                </span>
              </div>
              <span className="text-xs text-on-surface-variant block">
                Certified Canine First Responder
              </span>
              <span className="text-[11px] text-secondary font-medium">
                Walk ID #WK-8842 • 4.9★ (340 walks)
              </span>
            </div>
          </div>
          <a
            href="tel:+15552348901"
            className="w-11 h-11 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-[20px]">phone_in_talk</span>
          </a>
        </div>
      </div>

      {/* Auto-Broadcast Status Indicator */}
      <div className="w-full bg-surface-container-low rounded-2xl p-4 flex items-center justify-between border border-[#dde2f3]/40">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">send</span>
          </div>
          <div className="truncate">
            <div className="flex items-center gap-1.5">
              <span className="font-headline font-semibold text-xs text-on-surface truncate">
                {user.emergencyContact.name} ({user.emergencyContact.relationship})
              </span>
              <span className="text-secondary text-[11px] font-bold">Delivered ✓</span>
            </div>
            <p className="text-[11px] text-on-surface-variant truncate">
              Emergency SMS &amp; GPS live stream link received
            </p>
          </div>
        </div>
        <button
          onClick={handleNotifyVet}
          className="px-2.5 py-1.5 rounded-lg bg-surface-container-highest text-on-surface text-xs font-semibold hover:bg-surface-variant active:scale-95 shrink-0 transition-colors"
        >
          {vetNotified ? 'Vet Notified ✓' : '+ Notify Vet'}
        </button>
      </div>

      {/* Safety Affirmation Note */}
      <div className="text-center pt-2">
        <p className="text-[11px] text-outline">
          PetCare SOS System v4.2 • Encrypted GPS Stream • High Priority Channel
        </p>
      </div>
    </div>
  );
};
