import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Pet } from '../types/index.ts';

interface PetProfileScreenProps {
  onOpenEditPet: (pet: Pet) => void;
}

export const PetProfileScreen: React.FC<PetProfileScreenProps> = ({ onOpenEditPet }) => {
  const {
    activePet,
    pets,
    setActivePet,
    setPetIdModalPet,
    setCurrentTab,
    setBookingServiceSlug,
    user,
    getReportsForPet,
    openReportModal,
  } = useApp();

  const [shareSuccess, setShareSuccess] = useState<boolean>(false);
  const [activityFilter, setActivityFilter] = useState<'ALL' | 'DOG_WALKER' | 'DOG_TRAINER' | 'PET_GROOMER'>('ALL');

  const handleShareDossier = () => {
    navigator.clipboard?.writeText(
      `PetCare Medical Dossier: ${activePet.name} (${activePet.breed}), Microchip #${activePet.microchipId}. Parent: ${user.name} (${user.phone})`
    );
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2000);
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-5 pb-28 pt-2 space-y-4">
      {/* Multi-Pet Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-5 px-5 no-scrollbar">
        {pets.map((pet) => {
          const isSelected = activePet.id === pet.id;
          return (
            <button
              key={pet.id}
              onClick={() => setActivePet(pet)}
              className={`h-10 px-3 rounded-2xl flex items-center gap-2 shrink-0 transition-all border ${
                isSelected
                  ? 'bg-primary text-on-primary border-primary shadow-xs'
                  : 'bg-surface-container-lowest text-on-surface-variant border-[#dde2f3] hover:bg-surface-container-low'
              }`}
            >
              <img
                src={pet.photoUrl}
                alt={pet.name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-xs font-bold font-headline">{pet.name}</span>
              <span className="text-[10px] opacity-80">({pet.species})</span>
            </button>
          );
        })}
      </div>

      {/* Pet Profile Hero Card */}
      <div className="w-full bg-surface-container-lowest rounded-2xl p-4 shadow-[0_4px_20px_-2px_rgba(30,75,56,0.06)] border border-[#dde2f3]/40 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24 rounded-full p-1 bg-surface-container-low shrink-0">
            <div className="w-full h-full rounded-full overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={activePet.photoUrl}
                alt={activePet.name}
              />
            </div>
            <div className="absolute bottom-0 right-1 w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-[14px] material-symbols-fill">
                check
              </span>
            </div>
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <span className="font-headline text-headline-lg font-bold text-on-surface truncate">
                {activePet.name}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-headline text-[11px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                {activePet.healthStatus}
              </span>
            </div>
            <span className="text-sm text-on-surface-variant">{activePet.breed}</span>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded">
                {activePet.ageYears}y {activePet.ageMonths}m
              </span>
              <span className="text-[11px] font-semibold text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded">
                {activePet.weightKg} kg
              </span>
              <span className="text-[11px] font-semibold text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded">
                {activePet.gender}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 -mx-1 px-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setPetIdModalPet(activePet)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-primary-container text-on-primary font-headline text-xs font-semibold shrink-0 shadow-xs active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[16px]">badge</span>
            <span>Digital Pet ID</span>
          </button>

          <button
            type="button"
            onClick={handleShareDossier}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-surface-container-low text-on-surface font-headline text-xs font-semibold shrink-0 hover:bg-surface-container transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">
              {shareSuccess ? 'check' : 'share'}
            </span>
            <span>{shareSuccess ? 'Copied Link' : 'Share Dossier'}</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenEditPet(activePet)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-surface-container-low text-on-surface font-headline text-xs font-semibold shrink-0 hover:bg-surface-container transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
            <span>Edit</span>
          </button>
        </div>
      </div>

      {/* Monthly Walk & Health Telemetry Card */}
      <div className="w-full bg-surface-container-lowest rounded-2xl p-4 shadow-[0_4px_20px_-2px_rgba(30,75,56,0.06)] border border-[#dde2f3]/40 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">insights</span>
            <span className="font-headline font-bold text-headline-sm text-on-surface">
              Monthly Activity
            </span>
          </div>
          <span className="text-xs text-on-surface-variant font-medium">
            {activePet.monthlyStats.month}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-1">
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-container-low">
            <span className="font-headline font-bold text-headline-md text-primary">
              {activePet.monthlyStats.kmWalked}
            </span>
            <span className="text-[10px] text-on-surface-variant uppercase font-medium mt-0.5">
              km Walked
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-container-low">
            <span className="font-headline font-bold text-headline-md text-secondary">
              {activePet.monthlyStats.sessions}
            </span>
            <span className="text-[10px] text-on-surface-variant uppercase font-medium mt-0.5">
              Sessions
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-container-low">
            <span className="font-headline font-bold text-headline-md text-secondary">
              {activePet.monthlyStats.safeZonePercent}%
            </span>
            <span className="text-[10px] text-on-surface-variant uppercase font-medium mt-0.5">
              In Safe Zone
            </span>
          </div>
        </div>
      </div>

      {/* Activity History Section */}
      <div className="w-full bg-surface-container-lowest rounded-2xl p-4 shadow-[0_4px_20px_-2px_rgba(30,75,56,0.06)] border border-[#dde2f3]/40 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">history</span>
            <div>
              <h3 className="font-headline font-bold text-headline-sm text-on-surface">
                Activity History
              </h3>
              <p className="text-[11px] text-on-surface-variant">
                Verified post-service reports &amp; telemetry
              </p>
            </div>
          </div>

          <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            {getReportsForPet(activePet.id).length} Reports
          </span>
        </div>

        {/* Service Type Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar">
          {(
            [
              { key: 'ALL', label: 'All' },
              { key: 'DOG_WALKER', label: '🦮 Dog Walk' },
              { key: 'DOG_TRAINER', label: '🎓 Training' },
              { key: 'PET_GROOMER', label: '✂️ Grooming' },
            ] as const
          ).map((tab) => {
            const isSelected = activityFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActivityFilter(tab.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Reports List or Empty State */}
        {(() => {
          const petReports = getReportsForPet(activePet.id);
          const filtered = petReports.filter((r) => {
            if (activityFilter === 'ALL') return true;
            return r.serviceType === activityFilter;
          });

          if (filtered.length === 0) {
            return (
              <div className="text-center py-8 px-4 rounded-xl bg-surface-container-low/70 border border-[#dde2f3]/60 flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-outline-variant">
                  <span className="material-symbols-outlined text-[26px]">history_toggle_off</span>
                </div>
                <h4 className="font-headline font-bold text-sm text-on-surface mt-1">
                  No activity history yet for {activePet.name}
                </h4>
                <p className="text-xs text-on-surface-variant max-w-xs leading-relaxed">
                  Completed walking, training, and grooming services will generate care reports here.
                </p>
                <button
                  onClick={() => {
                    setBookingServiceSlug('dog-walking');
                    setCurrentTab('service-booking');
                  }}
                  className="mt-2 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-xs active:scale-95 transition-transform"
                >
                  Book First Service for {activePet.name}
                </button>
              </div>
            );
          }

          return (
            <div className="space-y-2.5">
              {filtered.map((report) => {
                const getServiceSnippet = () => {
                  switch (report.serviceType) {
                    case 'DOG_WALKER': {
                      const w = report as any;
                      return {
                        icon: '🦮',
                        category: 'Dog Walk',
                        headline: `${w.distanceKm} km · ${w.durationMinutes} min`,
                        subtext: `${w.safeZoneCompliancePct}% Safe Zone · ${w.waterBreaks}x water`,
                        provider: w.providerName,
                        date: w.date,
                        accent: 'border-l-emerald-600',
                      };
                    }
                    case 'DOG_TRAINER': {
                      const t = report as any;
                      return {
                        icon: '🎓',
                        category: 'Training',
                        headline: 'Recall · Stay · Heel',
                        subtext: `Session #${t.sessionNumber} · Recall ${t.skillProgress?.[0]?.currentPercent || 70}% · Passed`,
                        provider: t.providerName,
                        date: t.date,
                        accent: 'border-l-indigo-600',
                      };
                    }
                    case 'PET_GROOMER': {
                      const g = report as any;
                      return {
                        icon: '✂️',
                        category: 'Grooming',
                        headline: 'Bath · Haircut · Nails',
                        subtext: `${g.coatCondition?.condition || 'Healthy'} · Before/After Available`,
                        provider: g.providerName,
                        date: g.date,
                        accent: 'border-l-purple-600',
                      };
                    }
                    default:
                      return { icon: 'pets', category: 'Pet care', headline: 'Service report', subtext: '', provider: '', date: '', accent: 'border-l-slate-400' };
                  }
                };

                const snippet = getServiceSnippet();

                return (
                  <div
                    key={report.id}
                    onClick={() => openReportModal(report)}
                    className={`p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container border border-[#dde2f3]/70 border-l-4 ${snippet.accent} flex items-center justify-between gap-3 cursor-pointer transition-all active:scale-[0.99] shadow-2xs`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="text-2xl shrink-0 mt-0.5">{snippet.icon}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-on-surface">
                            {snippet.category}
                          </span>
                          <span className="text-[11px] text-on-surface-variant font-mono">
                            · {snippet.date}
                          </span>
                        </div>
                        <h4 className="font-headline font-bold text-sm text-primary truncate mt-0.5">
                          {snippet.headline}
                        </h4>
                        <p className="text-[11px] text-on-surface-variant truncate">
                          {snippet.subtext}
                        </p>
                        <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                          Caregiver: <strong>{snippet.provider}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openReportModal(report);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-primary border border-primary/20 text-xs font-bold hover:bg-primary hover:text-white transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        <span>View Report</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>

                      {report.rating && (
                        <div className="flex items-center gap-0.5 text-amber-600 text-[11px] font-bold">
                          <span>★</span>
                          <span>{report.rating}.0</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>

      {/* Safety & Walking Profile */}
      <div className="w-full bg-surface-container-lowest rounded-2xl p-4 shadow-[0_4px_20px_-2px_rgba(30,75,56,0.06)] border border-[#dde2f3]/40 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px] material-symbols-fill">
              shield_with_heart
            </span>
            <span className="font-headline font-bold text-headline-sm text-on-surface">
              Safety &amp; Walking Profile
            </span>
          </div>
          <button
            onClick={() => setCurrentTab('service-booking')}
            className="text-xs text-secondary font-bold hover:underline"
          >
            Customize
          </button>
        </div>

        {/* Safe Zone Preview Map Box */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-on-surface">
            <span className="text-xs font-bold">Active Geofence</span>
            <span className="text-xs text-secondary font-bold">
              {activePet.safetyProfile.safeZoneRadiusKm} km radius
            </span>
          </div>
          <div className="relative w-full h-32 rounded-xl bg-[#dde2f3] overflow-hidden flex items-end p-2.5 shadow-inner">
            <div className="absolute inset-0 bg-[#f1f3ff]">
              <svg className="w-full h-full" viewBox="0 0 320 120" fill="none">
                <rect width="320" height="120" fill="#dde2f3" />
                <circle cx="160" cy="60" r="45" fill="#88f9b0" fillOpacity="0.3" stroke="#006d3c" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M0 60 H320" stroke="#ffffff" strokeWidth="8" />
                <circle cx="160" cy="60" r="5" fill="#023423" />
              </svg>
            </div>
            <div className="relative z-10 w-full bg-surface-container-lowest/90 backdrop-blur-md rounded-lg px-2.5 py-1.5 flex items-center justify-between border border-white/60">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2 h-2 rounded-full bg-secondary shrink-0"></span>
                <span className="text-xs text-on-surface font-bold truncate">
                  {activePet.safetyProfile.safeZoneName}
                </span>
              </div>
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant">tune</span>
            </div>
          </div>
        </div>

        {/* Walker Instructions & Habits */}
        <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-surface-container-low">
          <div className="flex items-center gap-1.5 text-on-surface">
            <span className="material-symbols-outlined text-[18px] text-tertiary-container">
              psychology
            </span>
            <span className="text-xs font-bold">Caregiver &amp; Walker Notes</span>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {activePet.safetyProfile.walkerNotes}
          </p>
        </div>

        {/* Emergency Contacts */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-on-surface">Emergency Contacts</span>
          <div className="flex flex-col gap-1.5">
            {activePet.emergencyContacts.map((contact, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      contact.is24_7Vet
                        ? 'bg-error-container text-error'
                        : 'bg-primary-fixed text-on-primary-fixed-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {contact.is24_7Vet ? 'local_hospital' : 'person'}
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-on-surface truncate">
                      {contact.name}
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      {contact.phone} {contact.is24_7Vet ? '(24/7 ER)' : ''}
                    </span>
                  </div>
                </div>
                <a
                  href={`tel:${contact.phone}`}
                  className="w-8 h-8 rounded-full bg-surface-container-lowest text-secondary flex items-center justify-center shadow-xs active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px]">call</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Health, Vaccines & Microchip Summary */}
      <div className="w-full bg-surface-container-lowest rounded-2xl p-4 shadow-[0_4px_20px_-2px_rgba(30,75,56,0.06)] border border-[#dde2f3]/40 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">
              medical_services
            </span>
            <span className="font-headline font-bold text-headline-sm text-on-surface">
              Health &amp; Vaccinations
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-headline text-[10px] font-bold">
            Verified
          </span>
        </div>

        {/* Vaccine Timeline List */}
        <div className="flex flex-col gap-2">
          {activePet.vaccinations.map((vac, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-2.5 rounded-xl ${
                vac.isDue ? 'bg-tertiary-fixed/40' : 'bg-surface-container-low'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`material-symbols-outlined text-[18px] ${
                    vac.isDue ? 'text-tertiary-container' : 'text-secondary'
                  }`}
                >
                  {vac.isDue ? 'warning' : 'verified'}
                </span>
                <div className="flex flex-col">
                  <span
                    className={`text-xs font-bold ${
                      vac.isDue ? 'text-tertiary' : 'text-on-surface'
                    }`}
                  >
                    {vac.name}
                  </span>
                  <span
                    className={`text-[11px] ${
                      vac.isDue ? 'text-tertiary font-medium' : 'text-on-surface-variant'
                    }`}
                  >
                    {vac.validUntil}
                  </span>
                </div>
              </div>
              <span className="text-xs text-secondary font-bold">{vac.status}</span>
            </div>
          ))}
        </div>

        {/* Dietary & Medical Notes */}
        <div className="p-3 rounded-xl bg-surface-container-low flex flex-col gap-1">
          <span className="text-xs font-bold text-on-surface">Allergies &amp; Dietary Restrictions</span>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {activePet.safetyProfile.allergies}. {activePet.safetyProfile.dietaryNotes}
          </p>
        </div>

        {/* Microchip Card Row */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/10">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="material-symbols-outlined text-primary text-[22px]">contactless</span>
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-primary font-bold truncate">AKC Reunite Microchip</span>
              <span className="text-[11px] text-on-surface-variant truncate">
                #{activePet.microchipId}
              </span>
            </div>
          </div>
          <button
            onClick={() => setPetIdModalPet(activePet)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-container text-on-primary text-xs font-semibold shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
            <span>View</span>
          </button>
        </div>
      </div>

      {/* Quick Booking Section for this Pet */}
      <div className="w-full bg-primary text-on-primary rounded-2xl p-4 shadow-[0_12px_32px_-4px_rgba(30,75,56,0.16)] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-headline font-bold text-headline-sm text-on-primary">
              Book for {activePet.name}
            </span>
            <span className="text-xs text-on-primary-container">
              Verified specialists assigned automatically
            </span>
          </div>
          <span className="material-symbols-outlined text-primary-fixed text-[28px] material-symbols-fill">
            pets
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => {
              setBookingServiceSlug('dog-walking');
              setCurrentTab('service-booking');
            }}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/10 hover:bg-white/15 transition-colors text-center active:scale-95"
          >
            <span className="material-symbols-outlined text-primary-fixed text-[24px]">
              directions_walk
            </span>
            <span className="text-xs text-on-primary font-semibold">Dog Walk</span>
          </button>

          <button
            onClick={() => {
              setBookingServiceSlug('grooming');
              setCurrentTab('service-booking');
            }}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/10 hover:bg-white/15 transition-colors text-center active:scale-95"
          >
            <span className="material-symbols-outlined text-primary-fixed text-[24px]">
              content_cut
            </span>
            <span className="text-xs text-on-primary font-semibold">Grooming</span>
          </button>
        </div>

        <button
          onClick={() => {
            setBookingServiceSlug('dog-walking');
            setCurrentTab('service-booking');
          }}
          className="w-full h-[50px] rounded-xl bg-secondary-fixed text-on-secondary-fixed font-headline text-headline-sm flex items-center justify-center gap-2 active:scale-98 transition-transform font-bold shadow-xs"
        >
          <span>Schedule Next Walk</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
