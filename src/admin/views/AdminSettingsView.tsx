import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';

export const AdminSettingsView: React.FC = () => {
  const { platformSettings, updatePlatformSettings, auditLogs, user } = useApp();

  const [warningThreshold, setWarningThreshold] = useState(platformSettings.safeZoneWarningThresholdMeters);
  const [emergencyCountdown, setEmergencyCountdown] = useState(platformSettings.emergencyCountdownDurationSeconds);
  const [accidentTimeout, setAccidentTimeout] = useState(platformSettings.accidentDetectionTimeoutSeconds);
  const [commissionPct, setCommissionPct] = useState(platformSettings.platformCommissionPercent);
  const [autoDispatch, setAutoDispatch] = useState(platformSettings.autoDispatchUnits);
  const [hotline, setHotline] = useState(platformSettings.supportEmergencyHotline);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updatePlatformSettings({
      safeZoneWarningThresholdMeters: Number(warningThreshold),
      emergencyCountdownDurationSeconds: Number(emergencyCountdown),
      accidentDetectionTimeoutSeconds: Number(accidentTimeout),
      platformCommissionPercent: Number(commissionPct),
      autoDispatchUnits: autoDispatch,
      supportEmergencyHotline: hotline,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          Platform Architecture &amp; Safety Parameters
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Adjust centralized safety thresholds, emergency countdown delays, and administrative audit policies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Safety Configuration Form (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-[20px]">security</span>
                Safety &amp; Geofencing Configuration
              </h3>
              <p className="text-xs text-slate-400">
                These thresholds govern satellite boundary alerts and hardware accelerometer triggers.
              </p>
            </div>
            {saveSuccess && (
              <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-lg">
                Saved &amp; Synchronized! ✓
              </span>
            )}
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Safe-Zone Warning Proximity (meters)
                </label>
                <input
                  type="number"
                  min="20"
                  max="500"
                  value={warningThreshold}
                  onChange={(e) => setWarningThreshold(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-xl bg-slate-800 text-white border border-slate-700 font-mono focus:outline-emerald-500"
                />
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Triggers YELLOW status when pet approaches boundary.
                </span>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Emergency Auto-Dispatch Countdown (seconds)
                </label>
                <input
                  type="number"
                  min="10"
                  max="120"
                  value={emergencyCountdown}
                  onChange={(e) => setEmergencyCountdown(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-xl bg-slate-800 text-white border border-slate-700 font-mono focus:outline-emerald-500"
                />
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Timer before automated responder unit dispatch.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Smart Harness Fall Detection Timeout (seconds)
                </label>
                <input
                  type="number"
                  min="5"
                  max="60"
                  value={accidentTimeout}
                  onChange={(e) => setAccidentTimeout(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-xl bg-slate-800 text-white border border-slate-700 font-mono focus:outline-emerald-500"
                />
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Timeout before user prompts escalate to full SOS.
                </span>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Platform Commission Fee (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={commissionPct}
                  onChange={(e) => setCommissionPct(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-xl bg-slate-800 text-white border border-slate-700 font-mono focus:outline-emerald-500"
                />
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Standard platform service revenue cut.
                </span>
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Emergency Priority Hotline Number
              </label>
              <input
                type="text"
                value={hotline}
                onChange={(e) => setHotline(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-800 text-white border border-slate-700 font-mono focus:outline-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-800/40 rounded-xl border border-slate-800">
              <div>
                <span className="font-bold text-white block">Auto-Dispatch Emergency Field Units</span>
                <span className="text-[11px] text-slate-400">
                  Automatically alert nearby animal first responders when countdown hits zero.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAutoDispatch(!autoDispatch)}
                className={`w-12 h-6 rounded-full p-0.5 transition-colors relative ${
                  autoDispatch ? 'bg-emerald-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    autoDispatch ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <button
              type="submit"
              className="h-11 px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              <span>Save &amp; Propagate Configuration</span>
            </button>
          </form>
        </div>

        {/* Admin Profile & Audit Logs (1 col) */}
        <div className="space-y-4">
          {/* Admin Profile Tile */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-white">Administrator Credentials</h3>
            <div className="flex items-center gap-3">
              <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/50" />
              <div>
                <span className="font-bold text-white block text-sm">{user.name}</span>
                <span className="text-xs text-slate-400">{user.email}</span>
                <span className="text-[10px] text-emerald-400 font-mono block mt-0.5">Role: {user.role} (Superadmin)</span>
              </div>
            </div>
          </div>

          {/* Audit Logs */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-white">System Audit Log</h3>
            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span className="text-emerald-400 font-bold">{log.action}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-snug">{log.details}</p>
                  <span className="text-[10px] text-slate-500 block">By: {log.adminName}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
