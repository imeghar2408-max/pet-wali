import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Payment } from '../../types/index.ts';

export const AdminPaymentsView: React.FC = () => {
  const { payments, refundPayment, users } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'succeeded' | 'pending' | 'failed' | 'refunded'>('all');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showRefundConfirm, setShowRefundConfirm] = useState<Payment | null>(null);

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.transactionId.toLowerCase().includes(search.toLowerCase()) ||
      p.bookingId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleConfirmRefund = async () => {
    if (!showRefundConfirm) return;
    await refundPayment(showRefundConfirm.id);
    setShowRefundConfirm(null);
  };

  const totalProcessed = payments
    .filter((p) => p.status === 'succeeded')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-5">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Payment &amp; Settlement Ledger
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tracking customer card payments, Apple Pay transactions, and PetCare guarantee reserves.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400 font-bold">
            Settled Volume: ${totalProcessed.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Dev Environment Notice */}
      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
        <span className="material-symbols-outlined text-amber-400 text-[18px]">info</span>
        <span>
          Payment Gateway: <strong>Sandbox / Development Mock Mode</strong>. Live credit cards will not be charged real funds.
        </span>
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
            placeholder="Search by transaction ID or booking ID..."
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-slate-800 text-xs text-white placeholder:text-slate-500 border border-slate-700 focus:outline-none focus:border-emerald-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
          {(['all', 'succeeded', 'pending', 'failed', 'refunded'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all uppercase ${
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

      {/* Payments Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-semibold uppercase tracking-wider bg-slate-950/40">
                <th className="p-3.5">Transaction ID</th>
                <th className="p-3.5">Booking</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Method</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPayments.map((p) => {
                const customer = users.find((u) => u.id === p.userId) || { name: 'Elena Miller' };

                return (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-white">{p.transactionId}</td>
                    <td className="p-3.5 font-mono text-slate-400">{p.bookingId}</td>
                    <td className="p-3.5 text-slate-300 font-medium">{customer.name}</td>
                    <td className="p-3.5 font-bold font-mono text-emerald-400">
                      ${p.amount.toFixed(2)} {p.currency}
                    </td>
                    <td className="p-3.5 text-slate-300 capitalize font-medium">
                      {p.paymentMethod.replace('_', ' ')}
                    </td>
                    <td className="p-3.5 text-slate-400 font-mono">
                      {new Date(p.timestamp).toLocaleDateString()}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          p.status === 'succeeded'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : p.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-400'
                            : p.status === 'refunded'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5">
                      {p.status === 'succeeded' && (
                        <button
                          onClick={() => setShowRefundConfirm(p)}
                          className="px-2.5 py-1 text-rose-400 hover:bg-rose-500/10 rounded-lg text-xs font-semibold"
                        >
                          Refund
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

      {/* Refund Confirmation Modal */}
      {showRefundConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">payments</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Refund Transaction?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Issue full refund of <strong className="text-white">${showRefundConfirm.amount.toFixed(2)}</strong> for transaction <code className="font-mono text-emerald-400">{showRefundConfirm.transactionId}</code>?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setShowRefundConfirm(null)}
                className="h-10 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRefund}
                className="h-10 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Execute Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
