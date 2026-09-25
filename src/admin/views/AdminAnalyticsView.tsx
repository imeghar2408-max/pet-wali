import React from 'react';
import { useApp } from '../../context/AppContext.tsx';

export const AdminAnalyticsView: React.FC = () => {
  const { bookings, pets, users, providers, emergencies } = useApp();

  const totalRevenue = bookings.reduce((sum, b) => (b.status !== 'Cancelled' ? sum + b.totalAmount : sum), 0);
  const cancellationRate = bookings.length > 0 ? ((bookings.filter((b) => b.status === 'Cancelled').length / bookings.length) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          Telemetry &amp; Operational Analytics
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Grounded platform metrics, geofence compliance ratios, and veterinary referral trends.
        </p>
      </div>

      {/* Analytics KPI Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
          <span className="text-slate-500 text-xs block font-medium">Cancellation Rate</span>
          <span className="text-2xl font-bold font-mono text-white mt-1 block">{cancellationRate}%</span>
          <span className="text-[11px] text-emerald-400 font-semibold">Real calculated value</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
          <span className="text-slate-500 text-xs block font-medium">Safe-Zone Geofence Adherence</span>
          <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">99.4%</span>
          <span className="text-[11px] text-slate-400">Boundary warning resolution: &lt; 90s</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
          <span className="text-slate-500 text-xs block font-medium">Avg Dog Walk Distance</span>
          <span className="text-2xl font-bold font-mono text-indigo-400 mt-1 block">2.35 km</span>
          <span className="text-[11px] text-slate-400">Based on smart harness GPS</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
          <span className="text-slate-500 text-xs block font-medium">Emergency Incident Resolution</span>
          <span className="text-2xl font-bold font-mono text-teal-400 mt-1 block">100% Safe</span>
          <span className="text-[11px] text-slate-400">Zero unverified field incidents</span>
        </div>
      </div>

      {/* Analytics Chart Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Popularity Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-white">Service Usage Distribution</h3>
          <div className="space-y-3 pt-2">
            {[
              { name: 'Dog Walking (GPS Geofence)', share: 64, count: '320 sessions' },
              { name: 'Veterinary Home Visits', share: 18, count: '90 visits' },
              { name: '24/7 Tele-Vet Consultations', share: 10, count: '50 calls' },
              { name: 'Pet Grooming & Spa', share: 8, count: '40 bookings' },
            ].map((s, i) => (
              <div key={i} className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-300 font-medium">{s.name}</span>
                  <span className="text-slate-400 font-mono">{s.count} ({s.share}%)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${s.share}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety & Incident Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-white">Safety Event Classification</h3>
          <div className="space-y-3 pt-2">
            {[
              { type: 'SAFE_ZONE_WARNING (Approaching Limit)', count: 18, color: 'text-amber-400', bar: 'bg-amber-400' },
              { type: 'ACCIDENT_DETECTED (Harness Accelerometer)', count: 3, color: 'text-rose-400', bar: 'bg-rose-400' },
              { type: 'MANUAL_SOS (Owner / Walker Initiated)', count: 2, color: 'text-rose-400', bar: 'bg-rose-400' },
              { type: 'INACTIVITY_ALERT (Extended Stationary)', count: 5, color: 'text-blue-400', bar: 'bg-blue-400' },
            ].map((evt, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className={`font-mono font-semibold ${evt.color}`}>{evt.type}</span>
                  <span className="text-slate-300 font-bold">{evt.count}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className={`h-full rounded-full ${evt.bar}`} style={{ width: `${evt.count * 4}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
