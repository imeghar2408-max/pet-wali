/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useProviderApp } from '../ProviderContext.tsx';
import {
  Wallet,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Building,
  CheckCircle2,
  Calendar,
  Sparkles,
  Award,
  ChevronRight,
  ShieldCheck,
  Clock,
  FileText,
} from 'lucide-react';

export const ProviderEarningsScreen: React.FC = () => {
  const { earningsSummary, requestPayout, providerProfile } = useProviderApp();

  const [timeFilter, setTimeFilter] = useState<'today' | 'weekly' | 'monthly'>('today');
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState(earningsSummary.availableForPayout);
  const [payoutSuccess, setPayoutSuccess] = useState(false);

  const handleCashout = () => {
    if (payoutAmount <= 0) return;
    requestPayout(payoutAmount);
    setPayoutSuccess(true);
    setTimeout(() => {
      setPayoutSuccess(false);
      setPayoutModalOpen(false);
    }, 1500);
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4 pb-24">
      {/* Wallet Balance & Instant Cashout Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-400" />
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
              Available For Payout
            </span>
          </div>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-full">
            Instant IMPS Active
          </span>
        </div>

        <div className="mt-3 flex items-baseline gap-1">
          <span className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            ₹{earningsSummary.availableForPayout.toLocaleString()}
          </span>
          <span className="text-xs text-slate-400 ml-1">in PetCare Wallet</span>
        </div>

        <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
          <span>Pending Clearing: <strong className="text-amber-400">₹{earningsSummary.pendingPayouts}</strong></span>
          <span>•</span>
          <span>HDFC Bank (••4912)</span>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-3">
          <button
            onClick={() => {
              setPayoutAmount(earningsSummary.availableForPayout);
              setPayoutModalOpen(true);
            }}
            disabled={earningsSummary.availableForPayout <= 0}
            className="flex-1 py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-black text-xs transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
          >
            <ArrowDownLeft className="w-4 h-4 stroke-[3]" />
            <span>INSTANT CASH OUT (IMPS)</span>
          </button>
        </div>
      </div>

      {/* Time Horizon Selector: Today, Weekly, Monthly */}
      <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold">
        <button
          onClick={() => setTimeFilter('today')}
          className={`flex-1 py-2 rounded-xl transition-all ${
            timeFilter === 'today' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
          }`}
        >
          Today's Earnings
        </button>
        <button
          onClick={() => setTimeFilter('weekly')}
          className={`flex-1 py-2 rounded-xl transition-all ${
            timeFilter === 'weekly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
          }`}
        >
          Weekly Earnings
        </button>
        <button
          onClick={() => setTimeFilter('monthly')}
          className={`flex-1 py-2 rounded-xl transition-all ${
            timeFilter === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
          }`}
        >
          Monthly Earnings
        </button>
      </div>

      {/* Selected Time Horizon Summary */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              {timeFilter === 'today'
                ? "Today's Earnings"
                : timeFilter === 'weekly'
                ? "This Week's Earnings"
                : "This Month's Earnings"}
            </span>
            <span className="text-2xl font-black text-slate-900 mt-0.5 block">
              ₹
              {timeFilter === 'today'
                ? earningsSummary.todayTotal.toLocaleString()
                : timeFilter === 'weekly'
                ? earningsSummary.weeklyTotal.toLocaleString()
                : earningsSummary.monthlyTotal.toLocaleString()}
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
              {timeFilter === 'today'
                ? `${earningsSummary.todayJobsCount} trips completed`
                : timeFilter === 'weekly'
                ? `${earningsSummary.todayJobsCount + 18} trips completed`
                : `${providerProfile.totalCompletedJobs} trips completed`}
            </span>
            <span className="text-[10px] text-slate-400 block mt-1">100% On-time Payouts</span>
          </div>
        </div>

        {/* Today Breakdown */}
        {timeFilter === 'today' && (
          <div className="grid grid-cols-3 gap-2 text-center divide-x divide-slate-100 pt-2 border-t border-slate-100">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Base Pay</span>
              <span className="text-lg font-black text-slate-900">₹{earningsSummary.todayBase}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Trip Bonus</span>
              <span className="text-lg font-black text-emerald-600">+₹{earningsSummary.todayBonus}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Tips & Gratuity</span>
              <span className="text-lg font-black text-amber-600">+₹{earningsSummary.todayTips}</span>
            </div>
          </div>
        )}

        {/* Weekly Chart */}
        {timeFilter !== 'today' && (
          <div className="h-28 flex items-end justify-between gap-2 pt-3 px-1 border-t border-slate-100">
            {earningsSummary.dailyEarnings.map((d, idx) => {
              const heightPct = Math.min(100, Math.round((d.amount / 3000) * 100));
              const isToday = d.day.includes('Today') || idx === 4;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <span className="text-[8px] font-bold text-slate-600">₹{d.amount}</span>
                  <div
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      isToday ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className={`text-[9px] font-semibold ${isToday ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {d.day.slice(0, 3)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Transaction History & Ledgers */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Transaction History
          </h3>
          <span className="text-[11px] text-slate-500">Live IMPS Ledger</span>
        </div>

        <div className="divide-y divide-slate-100">
          {earningsSummary.transactions.map((tx) => (
            <div key={tx.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                    tx.type === 'WITHDRAWAL'
                      ? 'bg-slate-100 text-slate-700'
                      : 'bg-emerald-50 text-emerald-700'
                  }`}
                >
                  {tx.type === 'WITHDRAWAL' ? '🏦' : '🐕'}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{tx.serviceTitle}</h4>
                  <p className="text-[11px] text-slate-500">
                    {tx.petName} • {tx.date}
                  </p>
                  <span className="text-[10px] font-mono text-slate-400">{tx.bookingRef}</span>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`text-sm font-black ${
                    tx.type === 'WITHDRAWAL' ? 'text-slate-700' : 'text-emerald-600'
                  }`}
                >
                  {tx.type === 'WITHDRAWAL' ? '-' : '+'}₹{tx.amount.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 block font-semibold">
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cashout Modal */}
      {payoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Instant IMPS Cash Out</h3>
              <button
                onClick={() => setPayoutModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {payoutSuccess ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="text-base font-bold text-slate-900">Transfer Successful!</h4>
                <p className="text-xs text-slate-500">
                  ₹{payoutAmount} dispatched to HDFC Bank (••4912) via IMPS.
                </p>
              </div>
            ) : (
              <>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                  <span className="text-[11px] text-slate-500 block uppercase font-bold">
                    Destination Account
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <Building className="w-5 h-5 text-emerald-600" />
                    <div>
                      <span className="text-xs font-bold text-slate-900">HDFC Bank Ltd</span>
                      <p className="text-[11px] text-slate-500">A/C: ••••••••••4912 (Vikram Sharma)</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Withdrawal Amount (₹)
                  </label>
                  <input
                    type="number"
                    max={earningsSummary.availableForPayout}
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(Number(e.target.value))}
                    className="w-full text-xl font-bold p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Available: ₹{earningsSummary.availableForPayout} (Zero IMPS fee for verified captains)
                  </span>
                </div>

                <button
                  onClick={handleCashout}
                  className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm transition-all shadow-md active:scale-95"
                >
                  CONFIRM TRANSFER
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
