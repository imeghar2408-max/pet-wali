/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useProviderApp } from '../ProviderContext.tsx';
import {
  CheckCircle2,
  XCircle,
  AlertOctagon,
  Calendar,
  Clock,
  Star,
  ShieldCheck,
  MapPin,
  ChevronRight,
  Info,
} from 'lucide-react';

export const AssignmentHistoryScreen: React.FC = () => {
  const { assignmentHistory, historyFilter, setHistoryFilter, setSelectedScheduleDetail } = useProviderApp();

  const filteredHistory = assignmentHistory.filter((job) => job.status === historyFilter);

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4 pb-24">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-slate-900">Service Assignment History</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Audit trail of all dispatched assignments: completed services, customer cancellations, and declined requests.
        </p>
      </div>

      {/* Tabs: Completed, Cancelled, Declined */}
      <div className="flex bg-slate-100 p-1 rounded-2xl">
        <button
          onClick={() => setHistoryFilter('COMPLETED')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            historyFilter === 'COMPLETED'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Completed</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-semibold">
            {assignmentHistory.filter((j) => j.status === 'COMPLETED').length}
          </span>
        </button>

        <button
          onClick={() => setHistoryFilter('CANCELLED')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            historyFilter === 'CANCELLED'
              ? 'bg-white text-amber-800 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>Cancelled</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-semibold">
            {assignmentHistory.filter((j) => j.status === 'CANCELLED').length}
          </span>
        </button>

        <button
          onClick={() => setHistoryFilter('DECLINED')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            historyFilter === 'DECLINED'
              ? 'bg-white text-rose-800 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>Declined</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-semibold">
            {assignmentHistory.filter((j) => j.status === 'DECLINED').length}
          </span>
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredHistory.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 text-center space-y-2">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">No {historyFilter.toLowerCase()} records</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Any {historyFilter.toLowerCase()} assignments will automatically appear in this ledger.
            </p>
          </div>
        ) : (
          filteredHistory.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3"
            >
              {/* Pet & Owner Top Row */}
              <div className="flex items-start justify-between pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <img
                    src={job.pet.photoUrl}
                    alt={job.pet.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{job.pet.name}</span>
                      <span className="text-xs font-normal text-slate-500">({job.pet.breed})</span>
                    </h3>
                    <p className="text-xs text-slate-600 font-medium">{job.serviceTitle}</p>
                    <span className="text-[11px] text-slate-400">
                      Customer: <strong className="text-slate-700">{job.customer.name}</strong>
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-black text-slate-900">₹{job.estimatedEarnings}</span>
                  <span
                    className={`text-[10px] font-bold block px-2 py-0.5 rounded-full mt-0.5 uppercase ${
                      job.status === 'COMPLETED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : job.status === 'CANCELLED'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
              </div>

              {/* Timing & Location */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{job.scheduledDate} · {job.scheduledTime}</span>
                </div>
                <div className="flex items-center gap-1.5 justify-end">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Safe Zone: 100%</span>
                </div>
              </div>

              <div className="flex items-start gap-1.5 text-xs text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-1">{job.pickupAddress}</span>
              </div>

              {/* Customer Rating Section (if Completed) */}
              {job.status === 'COMPLETED' && (
                <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-xl p-2.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                      Customer Rating Received
                    </span>
                    <span className="text-xs font-black text-amber-600 flex items-center gap-0.5">
                      ★ {job.ratingReceived || 5.0} / 5.0
                    </span>
                  </div>
                  {job.reviewComment && (
                    <p className="text-[11px] text-slate-700 italic">
                      "{job.reviewComment}"
                    </p>
                  )}
                </div>
              )}

              {/* Cancellation / Decline Reason */}
              {(job.status === 'CANCELLED' || job.status === 'DECLINED') && job.cancellationReason && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700">
                  <strong className="text-slate-900 block font-semibold mb-0.5">
                    {job.status === 'CANCELLED' ? 'Cancellation Details:' : 'Decline Reason:'}
                  </strong>
                  <span>{job.cancellationReason}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Transparent Dispatch Policy */}
      <div className="bg-slate-100 border border-slate-200/80 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-slate-600">
        <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>PetCare Fairness Assurance:</strong> Customer cancellations within 15 minutes of scheduled pickup automatically credit a Captain convenience fee to your wallet.
        </p>
      </div>
    </div>
  );
};
