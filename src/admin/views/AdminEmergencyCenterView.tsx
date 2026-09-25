import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { EmergencyIncident } from '../../types/index.ts';

export const AdminEmergencyCenterView: React.FC = () => {
  const {
    emergencies,
    acknowledgeEmergency,
    startEmergencyResponse,
    resolveEmergency,
    dispatchEmergency,
    pets,
    users,
    providers,
  } = useApp();

  const [selectedIncident, setSelectedIncident] = useState<EmergencyIncident | null>(
    emergencies[0] || null
  );
  const [resolutionNote, setResolutionNote] = useState('');
  const [showResolveModal, setShowResolveModal] = useState(false);

  const activeIncidents = emergencies.filter(
    (e) => e.status !== 'Resolved' && e.status !== 'Cancelled'
  );
  const historicalIncidents = emergencies.filter(
    (e) => e.status === 'Resolved' || e.status === 'Cancelled'
  );

  const handleResolve = async () => {
    if (!selectedIncident) return;
    await resolveEmergency(selectedIncident.id, resolutionNote || 'Incident closed by Platform Administrator.');
    setShowResolveModal(false);
    setResolutionNote('');
  };

  return (
    <div className="space-y-6">
      {/* Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-rose-500 animate-ping" />
            Emergency Operations Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            24/7 Incident triage, field responder dispatch, and veterinarian emergency routing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold">
            {activeIncidents.length} Unresolved Incidents
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incidents Queue (1 Col) */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Incident Queue ({emergencies.length})
          </span>

          <div className="space-y-2">
            {emergencies.map((inc) => {
              const isSelected = selectedIncident?.id === inc.id;
              const isUnresolved = inc.status !== 'Resolved' && inc.status !== 'Cancelled';

              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-rose-500 shadow-md ring-1 ring-rose-500/30'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400">#{inc.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        inc.status === 'Triggered'
                          ? 'bg-rose-500 text-white animate-pulse'
                          : inc.status === 'Acknowledged'
                          ? 'bg-amber-500/20 text-amber-400'
                          : inc.status === 'In Progress'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {inc.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mt-1.5 leading-snug">{inc.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{inc.description}</p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 mt-3 border-t border-slate-800 font-mono">
                    <span>{new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="text-slate-300 font-semibold">{inc.emergencyType.replace('_', ' ')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Incident Command Dossier (2 Cols) */}
        {selectedIncident ? (
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
            {/* Header & Status Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-rose-500 text-white uppercase font-mono">
                    {selectedIncident.emergencyType}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Incident #{selectedIncident.id}</span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1">{selectedIncident.title}</h2>
                <span className="text-xs text-slate-400">{selectedIncident.location.address}</span>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center gap-2">
                {selectedIncident.status === 'Triggered' && (
                  <button
                    onClick={() => acknowledgeEmergency(selectedIncident.id)}
                    className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                  >
                    Acknowledge
                  </button>
                )}

                {selectedIncident.status !== 'Resolved' && (
                  <>
                    <button
                      onClick={() => dispatchEmergency(selectedIncident.id)}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                    >
                      Start Response
                    </button>
                    <button
                      onClick={() => setShowResolveModal(true)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                    >
                      Mark Resolved
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Incident Context Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 uppercase font-bold text-[10px] block">Pet Details</span>
                <span className="text-white font-bold block text-sm">Milo (Golden Retriever)</span>
                <span className="text-rose-400 font-semibold block">Allergy: Mild Bee Venom (EpiPen in harness)</span>
              </div>

              <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 uppercase font-bold text-[10px] block">Walker &amp; Caretaker</span>
                <span className="text-white font-bold block text-sm">Sarah Jenkins (Canine First Responder)</span>
                <a href="tel:+15552348901" className="text-emerald-400 font-mono block hover:underline">
                  +1 (555) 234-8901 [Call Walker]
                </a>
              </div>
            </div>

            {/* Emergency Contacts & Veterinary Routing */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider">
                Emergency Responder Dispatch Network
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-white font-bold block">David Miller (Husband)</span>
                    <span className="text-[11px] text-slate-400 font-mono">+1 (555) 0199</span>
                  </div>
                  <a href="tel:+15550199" className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-emerald-400 font-bold">
                    Call
                  </a>
                </div>

                <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-white font-bold block">{selectedIncident.vetClinic.name}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{selectedIncident.vetClinic.phone} • {selectedIncident.vetClinic.distance}</span>
                  </div>
                  <a href={`tel:${selectedIncident.vetClinic.phone}`} className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-emerald-400 font-bold">
                    Call ER
                  </a>
                </div>
              </div>
            </div>

            {/* Incident Description & Resolution History */}
            <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <span className="text-slate-400 uppercase font-bold text-[10px] block">Sensor Log / Incident Chronology</span>
              <p className="text-slate-300 leading-relaxed">{selectedIncident.description}</p>
              {selectedIncident.resolutionNote && (
                <div className="mt-2 pt-2 border-t border-slate-800 text-emerald-400 font-medium">
                  Resolution Note: {selectedIncident.resolutionNote}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* Resolve Incident Modal */}
      {showResolveModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Resolve Emergency Incident</h3>
            <p className="text-xs text-slate-400">
              Document resolution notes for platform safety logs. This will immediately synchronize and inform the pet owner and walker.
            </p>
            <textarea
              rows={3}
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              placeholder="e.g. Verbal confirmation from Walker Sarah Jenkins, Milo checked safe and hydrated..."
              className="w-full text-xs p-3 rounded-xl bg-slate-800 text-white border border-slate-700 focus:outline-emerald-500"
            />
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setShowResolveModal(false)}
                className="h-10 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleResolve}
                className="h-10 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Mark Safe &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
