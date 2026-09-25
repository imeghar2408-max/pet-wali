import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Booking } from '../../types/index.ts';

export const AdminBookingsView: React.FC = () => {
  const { bookings, cancelBooking, users, pets, providers } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.serviceName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-5">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Platform Booking Operations
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tracking {bookings.length} reservations across dog walking, home vet, and grooming.
          </p>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-500 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search booking ID or service name..."
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-slate-800 text-xs text-white placeholder:text-slate-500 border border-slate-700 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
          {['All', 'Active', 'Confirmed', 'Pending', 'Completed', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-semibold uppercase tracking-wider bg-slate-950/40">
                <th className="p-3.5">Booking ID</th>
                <th className="p-3.5">Service</th>
                <th className="p-3.5">User &amp; Pet</th>
                <th className="p-3.5">Provider</th>
                <th className="p-3.5">Date &amp; Time</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredBookings.map((b) => {
                const userObj = users.find((u) => u.id === b.userId);
                const petObj = pets.find((p) => p.id === b.petId);
                const providerObj = providers.find((p) => p.id === b.providerId);

                return (
                  <tr key={b.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3.5 font-mono text-slate-300 font-bold">{b.id}</td>
                    <td className="p-3.5">
                      <span className="font-bold text-white block">{b.serviceName}</span>
                      <span className="text-[11px] text-slate-500">{b.durationMinutes} min session</span>
                    </td>
                    <td className="p-3.5">
                      <span className="text-white block font-medium">{userObj?.name || 'Elena Miller'}</span>
                      <span className="text-[11px] text-emerald-400 font-semibold">{petObj?.name || 'Milo'}</span>
                    </td>
                    <td className="p-3.5 text-slate-300">
                      {providerObj?.name || 'Sarah Jenkins'}
                    </td>
                    <td className="p-3.5 text-slate-400 font-mono">
                      {b.date} • {b.time}
                    </td>
                    <td className="p-3.5 text-emerald-400 font-bold font-mono">
                      ${b.totalAmount.toFixed(2)}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
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
                    <td className="p-3.5 text-right space-x-1.5">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Booking Ledger</span>
                <h3 className="text-base font-bold text-white font-mono">{selectedBooking.id}</h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Service:</span>
                <span className="text-white font-bold">{selectedBooking.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Schedule:</span>
                <span className="text-slate-200 font-mono">{selectedBooking.date} at {selectedBooking.time} ({selectedBooking.durationMinutes} min)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="text-emerald-400 font-bold uppercase">{selectedBooking.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Base Service Fee:</span>
                <span className="text-slate-200 font-mono">${selectedBooking.baseFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">PetCare Safety Guarantee:</span>
                <span className="text-slate-200 font-mono">${selectedBooking.safetyFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-700 font-bold text-sm">
                <span className="text-white">Total Amount:</span>
                <span className="text-emerald-400 font-mono">${selectedBooking.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Safe Zone Configuration info */}
            {selectedBooking.safeZoneConfig && (
              <div className="bg-emerald-500/5 border border-emerald-500/20 p-3.5 rounded-xl text-xs space-y-1">
                <span className="text-emerald-400 font-bold block uppercase tracking-wider text-[10px]">
                  Configured Safe Zone Geofence
                </span>
                <p className="text-slate-300">
                  Radius: <strong>{selectedBooking.safeZoneConfig.radiusLabel}</strong>
                </p>
                <p className="text-slate-400 text-[11px]">
                  Center: {selectedBooking.safeZoneConfig.centerAddress}
                </p>
              </div>
            )}

            {selectedBooking.specialInstructions && (
              <div className="bg-slate-800/30 p-3 rounded-xl text-xs text-slate-400">
                Special Notes: {selectedBooking.specialInstructions}
              </div>
            )}

            <div className="pt-2 flex justify-between items-center border-t border-slate-800">
              {selectedBooking.status === 'Confirmed' && (
                <button
                  onClick={async () => {
                    await cancelBooking(selectedBooking.id, 'Administrative cancellation');
                    setSelectedBooking(null);
                  }}
                  className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-xl text-xs font-semibold"
                >
                  Admin Cancel Booking
                </button>
              )}
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold ml-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
