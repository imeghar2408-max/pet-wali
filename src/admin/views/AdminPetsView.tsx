import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Pet } from '../../types/index.ts';

export const AdminPetsView: React.FC = () => {
  const { pets, users, bookings, emergencies } = useApp();

  const [search, setSearch] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState<'All' | 'Dog' | 'Cat'>('All');
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  const filteredPets = pets.filter((p) => {
    const owner = users.find((u) => u.id === p.userId)?.name || '';
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.breed.toLowerCase().includes(search.toLowerCase()) ||
      p.microchipId.toLowerCase().includes(search.toLowerCase()) ||
      owner.toLowerCase().includes(search.toLowerCase());
    const matchesSpecies = speciesFilter === 'All' || p.species === speciesFilter;
    return matchesSearch && matchesSpecies;
  });

  return (
    <div className="space-y-5">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Pet Dossier Registry
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tracking {pets.length} active registered pets with telemetry and health profiles.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-500 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by pet name, breed, microchip, or owner..."
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-slate-800 text-xs text-white placeholder:text-slate-500 border border-slate-700 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {(['All', 'Dog', 'Cat'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSpeciesFilter(s)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                speciesFilter === s
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Pets Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-semibold uppercase tracking-wider bg-slate-950/40">
                <th className="p-3.5">Pet</th>
                <th className="p-3.5">Owner</th>
                <th className="p-3.5">Species / Breed</th>
                <th className="p-3.5">Age &amp; Weight</th>
                <th className="p-3.5">Health Status</th>
                <th className="p-3.5">Vaccination</th>
                <th className="p-3.5">Microchip</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPets.map((p) => {
                const owner = users.find((u) => u.id === p.userId) || { name: 'Elena Miller', email: 'elena@example.com' };
                const isAllVaccinesUpToDate = p.vaccinations.every((v) => v.status === 'Up to Date');

                return (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img src={p.photoUrl} alt={p.name} className="w-9 h-9 rounded-full object-cover shrink-0 ring-2 ring-emerald-500/30" />
                        <div>
                          <span className="font-bold text-white block">{p.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{p.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="text-white font-medium block">{owner.name}</span>
                      <span className="text-[10px] text-slate-500">{owner.email}</span>
                    </td>
                    <td className="p-3.5 text-slate-300">
                      <span className="block font-medium">{p.species}</span>
                      <span className="text-[11px] text-slate-400">{p.breed}</span>
                    </td>
                    <td className="p-3.5 text-slate-300 font-mono">
                      {p.ageYears}y {p.ageMonths}m • {p.weightKg}kg
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                        {p.healthStatus}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isAllVaccinesUpToDate
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {isAllVaccinesUpToDate ? 'Up to Date' : 'Booster Due'}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                      {p.microchipId}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setSelectedPet(p)}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
                      >
                        Open Dossier
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pet Details Modal */}
      {selectedPet && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <img src={selectedPet.photoUrl} alt={selectedPet.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/40" />
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    {selectedPet.name}
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 font-bold uppercase">
                      {selectedPet.healthStatus}
                    </span>
                  </h3>
                  <span className="text-xs text-slate-400">
                    {selectedPet.breed} • Microchip #{selectedPet.microchipId}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedPet(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Monthly Distance</span>
                <span className="text-emerald-400 font-bold font-mono text-sm">{selectedPet.monthlyStats.kmWalked} km</span>
              </div>
              <div className="bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Walk Sessions</span>
                <span className="text-indigo-400 font-bold font-mono text-sm">{selectedPet.monthlyStats.sessions}</span>
              </div>
              <div className="bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Safe Zone Rate</span>
                <span className="text-emerald-400 font-bold font-mono text-sm">{selectedPet.monthlyStats.safeZonePercent}%</span>
              </div>
            </div>

            {/* Safety & Caregiver Notes */}
            <div className="bg-slate-800/30 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1.5">
              <span className="font-bold text-slate-200 block uppercase tracking-wider text-[10px]">
                Caregiver Instructions &amp; Safe Zone
              </span>
              <p className="text-slate-400 leading-relaxed">{selectedPet.safetyProfile.walkerNotes}</p>
              <div className="flex gap-4 pt-1 text-[11px]">
                <span className="text-slate-500">Allowed Treats: <strong className="text-slate-300">{selectedPet.safetyProfile.allowedTreats}</strong></span>
                <span className="text-slate-500">Allergies: <strong className="text-rose-400">{selectedPet.safetyProfile.allergies}</strong></span>
              </div>
            </div>

            {/* Vaccinations */}
            <div className="space-y-2">
              <span className="font-bold text-white text-xs block uppercase tracking-wider">
                Vaccination Ledger
              </span>
              <div className="space-y-1.5">
                {selectedPet.vaccinations.map((vac, i) => (
                  <div key={i} className="p-2.5 bg-slate-800/50 rounded-lg flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-200 font-medium">{vac.name}</span>
                      <span className="text-slate-500 block text-[10px] font-mono">{vac.validUntil}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                      {vac.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Associated Bookings */}
            <div className="space-y-2">
              <span className="font-bold text-white text-xs block uppercase tracking-wider">
                Associated Bookings &amp; Service History
              </span>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {bookings
                  .filter((b) => b.petId === selectedPet.id)
                  .map((bk) => (
                    <div key={bk.id} className="p-2 bg-slate-800/40 rounded-lg flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">{bk.serviceName}</span>
                      <span className="text-emerald-400 font-mono font-bold">${bk.totalAmount.toFixed(2)}</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedPet(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
