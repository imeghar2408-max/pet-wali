import React from 'react';
import { useApp } from '../context/AppContext.tsx';

interface QuickPetSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAddPet: () => void;
}

export const QuickPetSettingsModal: React.FC<QuickPetSettingsModalProps> = ({
  isOpen,
  onClose,
  onOpenAddPet,
}) => {
  const {
    pets,
    activePet,
    setActivePet,
    isWalkingSimulationActive,
    toggleWalkingSimulation,
    triggerAccidentDetectionSim,
  } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-surface-container-lowest rounded-3xl p-5 shadow-2xl flex flex-col gap-4 border border-[#dde2f3]">
        <div className="flex items-center justify-between border-b border-surface-container-high pb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
            <h3 className="font-headline font-bold text-headline-sm text-on-surface">
              Pet &amp; Safety Controls
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        {/* Switch Active Pet */}
        <div>
          <span className="text-xs font-bold text-on-surface block mb-2">Switch Active Pet</span>
          <div className="space-y-2">
            {pets.map((p) => {
              const isSelected = p.id === activePet.id;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    setActivePet(p);
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary-fixed/30 border-primary text-primary font-bold'
                      : 'bg-surface-container-low border-surface-container-high text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img className="w-9 h-9 rounded-full object-cover" src={p.photoUrl} alt={p.name} />
                    <div className="flex flex-col">
                      <span className="text-xs">{p.name}</span>
                      <span className="text-[10px] text-on-surface-variant font-normal">
                        {p.breed} • {p.activeStatusNote}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="material-symbols-outlined text-[18px] text-secondary">
                      check_circle
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenAddPet();
            }}
            className="w-full mt-2 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-primary flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Add Another Pet</span>
          </button>
        </div>

        {/* Live Walk Simulation & Sensors Toggle */}
        <div className="pt-2 border-t border-surface-container-high space-y-2">
          <span className="text-xs font-bold text-on-surface block">Live Telemetry Simulation</span>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low text-xs">
            <div>
              <span className="font-semibold block text-on-surface">Auto-telemetry Ticking</span>
              <span className="text-[11px] text-on-surface-variant">Simulates walk distance &amp; GPS</span>
            </div>
            <button
              onClick={toggleWalkingSimulation}
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                isWalkingSimulationActive ? 'bg-secondary text-on-secondary' : 'bg-outline-variant text-on-surface'
              }`}
            >
              {isWalkingSimulationActive ? 'Active' : 'Paused'}
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              triggerAccidentDetectionSim();
            }}
            className="w-full py-2 rounded-xl bg-error-container/60 hover:bg-error-container text-error text-xs font-bold flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">warning</span>
            <span>Simulate Harness Fall Detection</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full h-10 rounded-xl bg-primary text-on-primary font-headline text-xs font-bold"
        >
          Done
        </button>
      </div>
    </div>
  );
};
