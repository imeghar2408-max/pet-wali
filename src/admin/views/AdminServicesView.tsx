import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { ServiceCategory } from '../../types/index.ts';

export const AdminServicesView: React.FC = () => {
  const { services, updateService, providers } = useApp();

  const [selectedService, setSelectedService] = useState<ServiceCategory | null>(null);
  const [editingPrice, setEditingPrice] = useState<number>(0);
  const [editingDescription, setEditingDescription] = useState<string>('');

  const handleOpenEdit = (srv: ServiceCategory) => {
    setSelectedService(srv);
    setEditingPrice(srv.startingPrice);
    setEditingDescription(srv.description);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    await updateService(selectedService.id, {
      startingPrice: editingPrice,
      description: editingDescription,
    });
    setSelectedService(null);
  };

  const handleToggleActive = async (srv: ServiceCategory) => {
    const newActiveState = srv.isActive !== false ? false : true;
    await updateService(srv.id, { isActive: newActiveState });
  };

  return (
    <div className="space-y-5">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Service Catalog &amp; Tariff Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure all 8 core marketplace services, base tariffs, and provider assignments.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((srv) => {
          const matchingProviders = providers.filter((p) => p.serviceTypes.includes(srv.slug));
          const isEnabled = srv.isActive !== false;

          return (
            <div
              key={srv.id}
              className={`bg-slate-900 border rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between transition-all ${
                isEnabled ? 'border-slate-800' : 'border-slate-800/40 opacity-60'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400">
                    <span className="material-symbols-outlined text-[24px]">{srv.icon}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        isEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {isEnabled ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{srv.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Starting Tariff:</span>
                  <span className="text-emerald-400 font-bold font-mono text-sm">
                    ${srv.startingPrice.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Active Providers:</span>
                  <span className="text-slate-300 font-semibold font-mono">
                    {matchingProviders.length} Verified
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(srv)}
                  className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
                >
                  Edit Tariff
                </button>
                <button
                  onClick={() => handleToggleActive(srv)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                    isEnabled
                      ? 'text-rose-400 hover:bg-rose-500/10'
                      : 'text-emerald-400 hover:bg-emerald-500/10'
                  }`}
                >
                  {isEnabled ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Service Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Edit {selectedService.name}</h3>
            <form onSubmit={handleSaveService} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Starting Price ($USD)</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={editingPrice}
                  onChange={(e) => setEditingPrice(Number(e.target.value))}
                  className="w-full h-9 px-3 rounded-xl bg-slate-800 text-white border border-slate-700 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Service Description</label>
                <textarea
                  rows={3}
                  value={editingDescription}
                  onChange={(e) => setEditingDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 text-white border border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="h-10 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
