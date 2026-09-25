import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { User } from '../../types/index.ts';

export const AdminUsersView: React.FC = () => {
  const { users, pets, bookings, payments, emergencies, updateUserStatus } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Suspended'>('All');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [confirmStatusToggle, setConfirmStatusToggle] = useState<User | null>(null);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || (u.status || 'Active') === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = async (userToToggle: User) => {
    const newStatus = (userToToggle.status || 'Active') === 'Active' ? 'Suspended' : 'Active';
    await updateUserStatus(userToToggle.id, newStatus);
    setConfirmStatusToggle(null);
    if (selectedUser?.id === userToToggle.id) {
      setSelectedUser({ ...userToToggle, status: newStatus });
    }
  };

  return (
    <div className="space-y-5">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            User Account Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Auditing {users.length} registered pet owners and platform account states.
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
            placeholder="Search by name, email, or user ID..."
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-slate-800 text-xs text-white placeholder:text-slate-500 border border-slate-700 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {(['All', 'Active', 'Suspended'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === s
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-semibold uppercase tracking-wider bg-slate-950/40">
                <th className="p-3.5">User</th>
                <th className="p-3.5">Contact</th>
                <th className="p-3.5">Pets</th>
                <th className="p-3.5">Bookings</th>
                <th className="p-3.5">Registered</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((u) => {
                const userPets = pets.filter((p) => p.userId === u.id);
                const userBookings = bookings.filter((b) => b.userId === u.id);
                const status = u.status || 'Active';

                return (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                        <div>
                          <span className="font-bold text-white block">{u.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{u.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-300">
                      <div>{u.email}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{u.phone}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold font-mono">
                        {userPets.length} {userPets.length === 1 ? 'Pet' : 'Pets'}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold font-mono">
                        {userBookings.length} {userBookings.length === 1 ? 'Booking' : 'Bookings'}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400 font-mono">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          status === 'Active'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => setConfirmStatusToggle(u)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                          status === 'Active'
                            ? 'text-rose-400 hover:bg-rose-500/20'
                            : 'text-emerald-400 hover:bg-emerald-500/20'
                        }`}
                      >
                        {status === 'Active' ? 'Suspend' : 'Reactivate'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <img src={selectedUser.avatar} alt={selectedUser.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h3 className="text-base font-bold text-white">{selectedUser.name}</h3>
                  <span className="text-xs text-slate-400">{selectedUser.email} • ID: {selectedUser.id}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Profile Overview */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 block">Phone:</span>
                <span className="text-slate-200 font-mono">{selectedUser.phone}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Address:</span>
                <span className="text-slate-200">{selectedUser.address}, {selectedUser.city}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Emergency Contact:</span>
                <span className="text-slate-200">
                  {selectedUser.emergencyContact?.name} ({selectedUser.emergencyContact?.relationship}) - {selectedUser.emergencyContact?.phone}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Account Status:</span>
                <span className="font-bold text-emerald-400">{selectedUser.status || 'Active'}</span>
              </div>
            </div>

            {/* User's Registered Pets */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Registered Pets</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {pets
                  .filter((p) => p.userId === selectedUser.id)
                  .map((pet) => (
                    <div key={pet.id} className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center gap-3">
                      <img src={pet.photoUrl} alt={pet.name} className="w-10 h-10 rounded-full object-cover" />
                      <div className="min-w-0">
                        <span className="font-bold text-white text-xs block truncate">{pet.name}</span>
                        <span className="text-[11px] text-slate-400 block truncate">{pet.breed} • {pet.healthStatus}</span>
                        <span className="text-[10px] text-slate-500 font-mono">Microchip: {pet.microchipId}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* User's Bookings & Transactions History */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Booking Ledger History</h4>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {bookings
                  .filter((b) => b.userId === selectedUser.id)
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

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Suspend / Reactivate */}
      {confirmStatusToggle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">warning</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {(confirmStatusToggle.status || 'Active') === 'Active' ? 'Suspend User Account?' : 'Reactivate User Account?'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Are you sure you want to change the status for <strong className="text-white">{confirmStatusToggle.name}</strong>?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setConfirmStatusToggle(null)}
                className="h-10 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleToggleStatus(confirmStatusToggle)}
                className="h-10 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
