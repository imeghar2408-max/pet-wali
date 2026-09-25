import React from 'react';
import { useApp } from '../context/AppContext.tsx';

export const DigitalPetIdModal: React.FC = () => {
  const { petIdModalPet, setPetIdModalPet, user } = useApp();

  if (!petIdModalPet) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#2a303d]/60 backdrop-blur-sm flex items-center justify-center p-5 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-surface-container-lowest rounded-2xl p-6 shadow-2xl flex flex-col gap-4 border border-[#dde2f3]/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">verified_user</span>
            <h3 className="font-headline font-semibold text-headline-sm text-on-surface">
              Digital ID: {petIdModalPet.name}
            </h3>
          </div>
          <button
            onClick={() => setPetIdModalPet(null)}
            className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-surface-container-low text-center">
          <div className="p-3 bg-white rounded-xl shadow-xs">
            <svg className="w-36 h-36" fill="currentColor" viewBox="0 0 100 100">
              {/* Corner Finder 1 */}
              <rect className="text-primary" x="5" y="5" width="26" height="26" rx="2" />
              <rect fill="#FFFFFF" x="9" y="9" width="18" height="18" rx="1" />
              <rect className="text-primary" x="13" y="13" width="10" height="10" rx="1" />
              {/* Corner Finder 2 */}
              <rect className="text-primary" x="69" y="5" width="26" height="26" rx="2" />
              <rect fill="#FFFFFF" x="73" y="9" width="18" height="18" rx="1" />
              <rect className="text-primary" x="77" y="13" width="10" height="10" rx="1" />
              {/* Corner Finder 3 */}
              <rect className="text-primary" x="5" y="69" width="26" height="26" rx="2" />
              <rect fill="#FFFFFF" x="9" y="73" width="18" height="18" rx="1" />
              <rect className="text-primary" x="13" y="77" width="10" height="10" rx="1" />
              {/* Pattern Representation */}
              <rect className="text-secondary" x="36" y="8" width="6" height="6" />
              <rect className="text-primary" x="46" y="8" width="6" height="6" />
              <rect className="text-secondary" x="56" y="14" width="6" height="6" />
              <rect className="text-primary" x="36" y="22" width="6" height="6" />
              <rect className="text-primary" x="46" y="26" width="6" height="6" />
              <rect className="text-primary" x="10" y="38" width="6" height="6" />
              <rect className="text-secondary" x="22" y="44" width="6" height="6" />
              <rect className="text-primary" x="34" y="38" width="6" height="6" />
              <rect className="text-secondary" x="44" y="42" width="6" height="6" />
              <rect className="text-primary" x="54" y="38" width="6" height="6" />
              <rect className="text-secondary" x="64" y="44" width="6" height="6" />
              <rect className="text-primary" x="76" y="40" width="6" height="6" />
              <rect className="text-primary" x="86" y="46" width="6" height="6" />
              <rect className="text-secondary" x="36" y="54" width="6" height="6" />
              <rect className="text-primary" x="46" y="60" width="6" height="6" />
              <rect className="text-secondary" x="56" y="54" width="6" height="6" />
              <rect className="text-primary" x="68" y="68" width="6" height="6" />
              <rect className="text-secondary" x="78" y="74" width="6" height="6" />
              <rect className="text-primary" x="86" y="84" width="6" height="6" />
              <rect className="text-secondary" x="40" y="76" width="6" height="6" />
              <rect className="text-primary" x="50" y="82" width="6" height="6" />
            </svg>
          </div>
          <span className="font-headline text-[13px] text-on-surface mt-1 font-bold">
            AKC #{petIdModalPet.microchipId}
          </span>
          <span className="text-[12px] text-on-surface-variant">
            Scan in case of rescue or veterinary triage
          </span>
        </div>

        {/* Identity Details */}
        <div className="flex flex-col gap-2 text-body-sm text-on-surface-variant">
          <div className="flex justify-between items-center py-1 border-b border-surface-container-high/60">
            <span>Primary Parent:</span>
            <span className="font-semibold text-on-surface">{user.name}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-surface-container-high/60">
            <span>Emergency Phone:</span>
            <span className="font-semibold text-on-surface">{user.phone}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-surface-container-high/60">
            <span>Breed & Gender:</span>
            <span className="font-semibold text-on-surface">
              {petIdModalPet.breed} • {petIdModalPet.gender}
            </span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span>Registered Location:</span>
            <span className="font-semibold text-on-surface">{user.city}</span>
          </div>
        </div>

        <button
          onClick={() => setPetIdModalPet(null)}
          className="w-full h-11 rounded-xl bg-primary text-on-primary font-headline font-semibold text-body-md shadow-sm active:scale-98 transition-transform"
        >
          Done
        </button>
      </div>
    </div>
  );
};
