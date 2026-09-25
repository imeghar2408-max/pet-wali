import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { AdminBroadcastNotification } from '../../types/index.ts';

export const AdminNotificationsView: React.FC = () => {
  const { adminBroadcasts, createAdminBroadcast } = useApp();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<AdminBroadcastNotification['category']>('Safety');
  const [targetAudience, setTargetAudience] = useState<AdminBroadcastNotification['targetAudience']>('ALL_USERS');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    await createAdminBroadcast({
      title,
      message,
      category,
      targetAudience,
      status: 'Sent',
    });

    setTitle('');
    setMessage('');
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          Platform Notification &amp; Satellite Dispatch Hub
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Broadcast emergency weather bulletins, safety mandates, and system announcements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Broadcast Form (1 col) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-emerald-400">campaign</span>
            Compose Platform Broadcast
          </h3>

          {sentSuccess && (
            <div className="p-3 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-semibold text-center">
              Broadcast dispatched successfully to active push channels! ✓
            </div>
          )}

          <form onSubmit={handleBroadcast} className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Broadcast Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Extreme Heatwave Protocol"
                className="w-full h-9 px-3 rounded-xl bg-slate-800 text-white border border-slate-700 focus:outline-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full h-9 px-2 rounded-xl bg-slate-800 text-white border border-slate-700"
                >
                  <option value="Safety">Safety</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Service">Service</option>
                  <option value="Booking">Booking</option>
                  <option value="System">System</option>
                  <option value="Announcement">Announcement</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Target Audience</label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value as any)}
                  className="w-full h-9 px-2 rounded-xl bg-slate-800 text-white border border-slate-700"
                >
                  <option value="ALL_USERS">All Users (Owners)</option>
                  <option value="ACTIVE_WALKERS">Active Walkers</option>
                  <option value="VETERINARIANS">Veterinarians</option>
                  <option value="ALL_PROVIDERS">All Providers</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Message Content *</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your push notification message..."
                className="w-full p-2.5 rounded-xl bg-slate-800 text-white border border-slate-700 focus:outline-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full h-10 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>Send Broadcast Push</span>
            </button>
          </form>
        </div>

        {/* Broadcast History (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Broadcast History</h3>
            <span className="text-xs text-slate-400 font-mono">{adminBroadcasts.length} Sent</span>
          </div>

          <div className="space-y-3">
            {adminBroadcasts.map((b) => (
              <div key={b.id} className="p-4 bg-slate-800/40 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        b.category === 'Emergency'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : b.category === 'Safety'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {b.category}
                    </span>
                    <h4 className="text-sm font-bold text-white">{b.title}</h4>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{b.message}</p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800 font-mono">
                  <span>Audience: <strong className="text-slate-300">{b.targetAudience.replace('_', ' ')}</strong></span>
                  <span className="text-emerald-400 font-bold">{b.sentCount.toLocaleString()} Delivered</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
