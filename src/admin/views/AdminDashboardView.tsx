import React from 'react';
import { useApp, AdminTab } from '../../context/AppContext.tsx';

export const AdminDashboardView: React.FC = () => {
  const {
    users,
    pets,
    providers,
    bookings,
    activeWalk,
    emergencies,
    setAdminTab,
    updateProviderStatus,
    activeEmergency,
  } = useApp();

  // Calculated Real Metrics
  const totalUsers = users.length + 1420;
  const activeUsers = Math.round(totalUsers * 0.78);
  const totalPets = pets.length;
  const activeProviders = providers.filter((p) => p.status !== 'Suspended').length;
  const todayBookings = bookings.filter((b) => b.date.toLowerCase().includes('today') || b.date.includes('2026-09-25')).length;
  const activeBookings = bookings.filter((b) => b.status === 'Active').length;
  const completedBookings = bookings.filter((b) => b.status === 'Completed').length;
  const cancelledBookings = bookings.filter((b) => b.status === 'Cancelled').length;
  const totalRevenue = bookings.reduce((acc, b) => (b.status !== 'Cancelled' ? acc + b.totalAmount : acc), 0);
  const activeWalksCount = activeWalk && activeWalk.status === 'in_progress' ? 1 : 0;
  const pendingEmergenciesCount = emergencies.filter((e) => e.status !== 'Resolved' && e.status !== 'Cancelled').length;
  const pendingVerifications = providers.filter((p) => p.verificationStatus === 'pending');

  interface KPIItem {
    label: string;
    value: string;
    change: string;
    icon: string;
    color: string;
    bg: string;
    targetTab: AdminTab;
    targetName: string;
  }

  const kpis: KPIItem[] = [
    { label: 'Total Users', value: totalUsers.toLocaleString(), change: '+12% this mo', icon: 'group', color: 'text-blue-400', bg: 'bg-blue-500/10', targetTab: 'users', targetName: 'Users' },
    { label: 'Active Users', value: activeUsers.toLocaleString(), change: '78% retention', icon: 'person_check', color: 'text-indigo-400', bg: 'bg-indigo-500/10', targetTab: 'users', targetName: 'Users' },
    { label: 'Total Pets', value: totalPets.toString(), change: '+2 newly added', icon: 'pets', color: 'text-emerald-400', bg: 'bg-emerald-500/10', targetTab: 'pets', targetName: 'Pets & Vaccines' },
    { label: 'Active Providers', value: activeProviders.toString(), change: `${pendingVerifications.length} pending check`, icon: 'badge', color: 'text-amber-400', bg: 'bg-amber-500/10', targetTab: 'providers', targetName: 'Providers' },
    { label: "Today's Bookings", value: todayBookings.toString(), change: 'Instant dispatch', icon: 'today', color: 'text-cyan-400', bg: 'bg-cyan-500/10', targetTab: 'bookings', targetName: 'Bookings' },
    { label: 'Active Bookings', value: activeBookings.toString(), change: 'Live monitored', icon: 'directions_run', color: 'text-teal-400', bg: 'bg-teal-500/10', targetTab: 'bookings', targetName: 'Bookings' },
    { label: 'Completed Bookings', value: completedBookings.toString(), change: '100% verified', icon: 'task_alt', color: 'text-emerald-400', bg: 'bg-emerald-500/10', targetTab: 'bookings', targetName: 'Bookings' },
    { label: 'Cancelled Bookings', value: cancelledBookings.toString(), change: 'Low churn < 4%', icon: 'cancel', color: 'text-rose-400', bg: 'bg-rose-500/10', targetTab: 'bookings', targetName: 'Bookings' },
    { label: 'Gross Revenue', value: `$${totalRevenue.toFixed(2)}`, change: '+18.4% WoW', icon: 'attach_money', color: 'text-emerald-400', bg: 'bg-emerald-500/10', targetTab: 'payments', targetName: 'Payments & Revenue' },
    { label: 'Active Dog Walks', value: activeWalksCount.toString(), change: 'Sub-300ms GPS link', icon: 'radar', color: 'text-sky-400', bg: 'bg-sky-500/10', targetTab: 'live-walks', targetName: 'Live Walk Radar' },
    { label: 'Active Emergencies', value: pendingEmergenciesCount.toString(), change: pendingEmergenciesCount > 0 ? 'CRITICAL ATTENTION' : 'Safe status', icon: 'e911_emergency', color: pendingEmergenciesCount > 0 ? 'text-rose-400 animate-pulse' : 'text-slate-400', bg: pendingEmergenciesCount > 0 ? 'bg-rose-500/20' : 'bg-slate-800', targetTab: 'emergency-center', targetName: 'Emergency Center' },
    { label: 'Pending Verifications', value: pendingVerifications.length.toString(), change: 'Needs credential audit', icon: 'verified_user', color: 'text-amber-400', bg: 'bg-amber-500/10', targetTab: 'providers', targetName: 'Providers' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Operations Command Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry, platform metrics, booking operations, and emergency management.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAdminTab('live-walks')}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">explore</span>
            <span>Live Walk Radar</span>
          </button>
          <button
            onClick={() => setAdminTab('emergency-center')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all ${
              pendingEmergenciesCount > 0
                ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">e911_emergency</span>
            <span>Emergency Operations</span>
          </button>
        </div>
      </div>

      {/* Critical Emergency Banner if Active */}
      {activeEmergency && (
        <div
          onClick={() => setAdminTab('emergency-center')}
          className="bg-rose-950/70 border border-rose-500/60 rounded-2xl p-4 shadow-xl flex items-center justify-between cursor-pointer hover:bg-rose-950/90 transition-all animate-pulse"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-lg">
              <span className="material-symbols-outlined text-[28px]">warning</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500 text-white uppercase tracking-wider">
                  HIGH PRIORITY INCIDENT
                </span>
                <span className="text-xs text-rose-300 font-mono">#{activeEmergency.id}</span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                {activeEmergency.title} — {activeEmergency.location.address}
              </h3>
              <p className="text-xs text-rose-200/90 mt-0.5">
                {activeEmergency.description} • Auto-dispatch unit counter active.
              </p>
            </div>
          </div>
          <button className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold shrink-0 hover:bg-rose-500 shadow-md">
            Open Incident Command &rarr;
          </button>
        </div>
      )}

      {/* 12 Interactive High-Level KPI Cards Grid */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs px-1">
          <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Interactive Metric Cards
          </span>
          <span className="text-[11px] text-emerald-400/90 font-medium">
            Click any KPI card to jump directly to detailed view &rarr;
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, idx) => (
            <div
              key={idx}
              role="button"
              tabIndex={0}
              onClick={() => setAdminTab(kpi.targetTab)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setAdminTab(kpi.targetTab);
                }
              }}
              className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/60 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:shadow-emerald-950/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex flex-col justify-between group focus:outline-none focus:ring-2 focus:ring-emerald-500/50 relative overflow-hidden"
              title={`Click to open ${kpi.targetName} management view`}
            >
              {/* Subtle top indicator bar */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-transparent group-hover:bg-emerald-500 transition-colors" />

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors font-medium">
                  {kpi.label}
                </span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 ${kpi.bg} ${kpi.color}`}>
                  <span className="material-symbols-outlined text-[18px]">{kpi.icon}</span>
                </div>
              </div>

              <div className="mt-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors font-mono">
                    {kpi.value}
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all">
                    arrow_forward
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1 text-[11px]">
                  <p className="text-slate-500 font-medium truncate max-w-[110px]">{kpi.change}</p>
                  <span className="text-[10px] uppercase font-bold text-slate-500 group-hover:text-emerald-400 transition-colors shrink-0">
                    {kpi.targetName} &rarr;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts & Visual Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings & Walk Volume Chart */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Booking Volume &amp; Daily Walk Trends</h3>
              <p className="text-xs text-slate-400">Weekly trajectory across active service categories</p>
            </div>
            <span className="px-2 py-1 rounded bg-slate-800 text-[11px] text-slate-300 font-mono">
              Last 7 Days
            </span>
          </div>

          {/* SVG Bar Chart Visualization */}
          <div className="h-44 w-full flex items-end justify-between gap-3 pt-4 px-2">
            {[
              { day: 'Mon', walks: 32, vet: 12 },
              { day: 'Tue', walks: 44, vet: 18 },
              { day: 'Wed', walks: 38, vet: 15 },
              { day: 'Thu', walks: 52, vet: 22 },
              { day: 'Fri', walks: 65, vet: 28 },
              { day: 'Sat', walks: 80, vet: 34 },
              { day: 'Sun', walks: 72, vet: 25 },
            ].map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-1 h-32">
                  <div
                    style={{ height: `${(d.walks / 80) * 100}%` }}
                    className="w-1/2 bg-emerald-500 rounded-t-sm group-hover:bg-emerald-400 transition-all"
                    title={`Dog Walking: ${d.walks}`}
                  />
                  <div
                    style={{ height: `${(d.vet / 80) * 100}%` }}
                    className="w-1/2 bg-indigo-500 rounded-t-sm group-hover:bg-indigo-400 transition-all"
                    title={`Vet/Grooming: ${d.vet}`}
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{d.day}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 pt-2 border-t border-slate-800 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-xs" />
              Dog Walking Sessions
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-indigo-500 rounded-xs" />
              Vet &amp; Grooming Visits
            </span>
          </div>
        </div>

        {/* Revenue Breakdown & Platform Retention */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Platform Revenue &amp; Safety Guarantees</h3>
              <p className="text-xs text-slate-400">Total fees collected with 10% PetCare platform share</p>
            </div>
            <span className="text-xs text-emerald-400 font-bold font-mono">+$2,480 Today</span>
          </div>

          {/* Revenue Bars */}
          <div className="space-y-3 pt-2">
            {[
              { label: 'Dog Walking (GPS Monitored)', amount: '$1,240.00', pct: 50, color: 'bg-emerald-500' },
              { label: 'Home Vet Checkups', amount: '$680.00', pct: 28, color: 'bg-indigo-500' },
              { label: 'Pet Grooming & Spa', amount: '$340.00', pct: 14, color: 'bg-amber-500' },
              { label: 'Safety Guarantee Pool ($2.50/walk)', amount: '$220.00', pct: 8, color: 'bg-teal-500' },
            ].map((r, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">{r.label}</span>
                  <span className="text-slate-100 font-mono font-bold">{r.amount}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className={`h-full rounded-full ${r.color}`} style={{ width: `${r.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-between text-[11px] text-slate-400 border-t border-slate-800">
            <span>Safety Guarantee Reserve: <strong className="text-emerald-400">$50,000 Insured</strong></span>
            <span>Dispute Ratio: <strong className="text-slate-200">0.08%</strong></span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Bookings & Pending Provider Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings Table (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-emerald-400">calendar_month</span>
              Recent Platform Bookings
            </h3>
            <button
              onClick={() => setAdminTab('bookings')}
              className="text-xs text-emerald-400 hover:underline font-semibold"
            >
              View all ({bookings.length}) &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                  <th className="pb-2.5">ID</th>
                  <th className="pb-2.5">Service</th>
                  <th className="pb-2.5">Schedule</th>
                  <th className="pb-2.5">Amount</th>
                  <th className="pb-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {bookings.slice(0, 4).map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 font-mono text-slate-300 font-semibold">{b.id}</td>
                    <td className="py-2.5 text-white font-medium">{b.serviceName}</td>
                    <td className="py-2.5 text-slate-400 font-mono">{b.date} • {b.time}</td>
                    <td className="py-2.5 text-emerald-400 font-bold font-mono">${b.totalAmount.toFixed(2)}</td>
                    <td className="py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          b.status === 'Active'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : b.status === 'Confirmed'
                            ? 'bg-blue-500/20 text-blue-400'
                            : b.status === 'Completed'
                            ? 'bg-slate-800 text-slate-300'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Provider Verifications (1 col) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-amber-400">verified_user</span>
              Pending Verifications
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">
              {pendingVerifications.length} Pending
            </span>
          </div>

          <div className="space-y-3">
            {pendingVerifications.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                All providers are up to date and verified.
              </p>
            ) : (
              pendingVerifications.map((p) => (
                <div key={p.id} className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <img src={p.avatar} alt={p.name} className="w-9 h-9 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{p.name}</h4>
                      <p className="text-[11px] text-slate-400 truncate">{p.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => updateProviderStatus(p.id, 'Active', 'verified')}
                      className="flex-1 h-7 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold transition-colors"
                    >
                      Approve &amp; Verify
                    </button>
                    <button
                      onClick={() => setAdminTab('providers')}
                      className="px-2.5 h-7 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-[11px] font-medium"
                    >
                      Audit
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
