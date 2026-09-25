import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Provider } from '../../types/index.ts';

export const AdminProvidersView: React.FC = () => {
  const { providers, updateProviderStatus, bookings, reviews } = useApp();

  const [search, setSearch] = useState('');
  const [serviceFilter, setServiceFilter] = useState<string>('All');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [actionConfirm, setActionConfirm] = useState<{
    provider: Provider;
    action: 'Approve' | 'Reject' | 'Suspend' | 'Reactivate';
  } | null>(null);

  const filteredProviders = providers.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.title.toLowerCase().includes(search.toLowerCase());
    const matchesService =
      serviceFilter === 'All' || p.serviceTypes.includes(serviceFilter);
    return matchesSearch && matchesService;
  });

  const handleExecuteAction = async () => {
    if (!actionConfirm) return;
    const { provider, action } = actionConfirm;

    if (action === 'Approve') {
      await updateProviderStatus(provider.id, 'Active', 'verified');
    } else if (action === 'Reject') {
      await updateProviderStatus(provider.id, 'Suspended', 'pending');
    } else if (action === 'Suspend') {
      await updateProviderStatus(provider.id, 'Suspended');
    } else if (action === 'Reactivate') {
      await updateProviderStatus(provider.id, 'Active');
    }

    setActionConfirm(null);
    if (selectedProvider?.id === provider.id) {
      setSelectedProvider(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Service Provider Operations &amp; Verification
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Managing certified walkers, veterinary medical directors, and groomers.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-500 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search provider by name or title..."
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-slate-800 text-xs text-white placeholder:text-slate-500 border border-slate-700 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar">
          {['All', 'dog-walking', 'tele-vet', 'home-vet', 'grooming', 'training'].map((st) => (
            <button
              key={st}
              onClick={() => setServiceFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                serviceFilter === st
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {st === 'All' ? 'All Services' : st.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Providers Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-semibold uppercase tracking-wider bg-slate-950/40">
                <th className="p-3.5">Provider</th>
                <th className="p-3.5">Services</th>
                <th className="p-3.5">Verification</th>
                <th className="p-3.5">Rating &amp; Jobs</th>
                <th className="p-3.5">Hourly Rate</th>
                <th className="p-3.5">Account Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProviders.map((p) => {
                const status = p.status || 'Active';
                return (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img src={p.avatar} alt={p.name} className="w-9 h-9 rounded-xl object-cover shrink-0" />
                        <div>
                          <span className="font-bold text-white block">{p.name}</span>
                          <span className="text-[11px] text-slate-400">{p.title}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="flex flex-wrap gap-1">
                        {p.serviceTypes.map((st) => (
                          <span key={st} className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-medium capitalize">
                            {st.replace('-', ' ')}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          p.verificationStatus === 'verified'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          {p.verificationStatus === 'verified' ? 'verified' : 'hourglass_top'}
                        </span>
                        {p.verificationStatus}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-300 font-mono">
                      {p.rating > 0 ? (
                        <span className="flex items-center gap-1">
                          <span className="text-amber-400">★</span> {p.rating} ({p.reviewsCount} jobs)
                        </span>
                      ) : (
                        <span className="text-slate-500">New Applicant</span>
                      )}
                    </td>
                    <td className="p-3.5 text-emerald-400 font-bold font-mono">
                      ${p.hourlyRate}/hr
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          status === 'Active'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : status === 'Pending'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5">
                      <button
                        onClick={() => setSelectedProvider(p)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
                      >
                        Dossier
                      </button>
                      {p.verificationStatus === 'pending' ? (
                        <button
                          onClick={() => setActionConfirm({ provider: p, action: 'Approve' })}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                        >
                          Approve
                        </button>
                      ) : status === 'Active' ? (
                        <button
                          onClick={() => setActionConfirm({ provider: p, action: 'Suspend' })}
                          className="px-2.5 py-1 text-rose-400 hover:bg-rose-500/20 rounded-lg text-xs font-semibold"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => setActionConfirm({ provider: p, action: 'Reactivate' })}
                          className="px-2.5 py-1 text-emerald-400 hover:bg-emerald-500/20 rounded-lg text-xs font-semibold"
                        >
                          Reactivate
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provider Details Drawer / Modal */}
      {selectedProvider && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <img src={selectedProvider.avatar} alt={selectedProvider.name} className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-500/30" />
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                    {selectedProvider.name}
                    <span className="material-symbols-outlined text-emerald-400 text-[18px]">verified</span>
                  </h3>
                  <span className="text-xs text-slate-400">{selectedProvider.title} • {selectedProvider.location}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedProvider(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider">Professional Bio</span>
              <p className="text-xs text-slate-400 bg-slate-800/40 p-3 rounded-xl leading-relaxed">
                {selectedProvider.bio}
              </p>
            </div>

            {/* Badges & Trust Accreditations */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider">Accreditations &amp; Certifications</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedProvider.badges.map((b) => (
                  <span key={b} className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs font-medium">
                    {b}
                  </span>
                ))}
              </div>
            </div>

            {/* Provider Bookings History */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider">Bookings &amp; Service Deliveries</span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {bookings
                  .filter((b) => b.providerId === selectedProvider.id)
                  .map((bk) => (
                    <div key={bk.id} className="p-2.5 bg-slate-800/40 rounded-lg flex items-center justify-between text-xs">
                      <div>
                        <span className="font-medium text-white block">{bk.serviceName}</span>
                        <span className="text-[11px] text-slate-400">{bk.date} at {bk.time}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-400 font-mono">${bk.totalAmount.toFixed(2)}</span>
                        <span className="text-[10px] block text-slate-400 uppercase font-bold">{bk.status}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-slate-800">
              <div className="text-xs text-slate-400">
                Contact Phone: <strong className="text-slate-200 font-mono">{selectedProvider.phone}</strong>
              </div>
              <button
                onClick={() => setSelectedProvider(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Destructive / Verification Actions */}
      {actionConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">gavel</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {actionConfirm.action} Provider {actionConfirm.provider.name}?
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Confirming this action will update their verification status and permissions across the PetCare network.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setActionConfirm(null)}
                className="h-10 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteAction}
                className="h-10 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Confirm {actionConfirm.action}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
