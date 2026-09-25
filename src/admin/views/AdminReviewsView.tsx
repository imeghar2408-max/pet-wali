import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Review } from '../../types/index.ts';

export const AdminReviewsView: React.FC = () => {
  const { reviews, flagReview, resolveReviewReport } = useApp();

  const [filter, setFilter] = useState<'All' | 'Reported' | 'Published' | 'Hidden'>('All');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const filteredReviews = reviews.filter((r) => {
    if (filter === 'All') return true;
    return (r.status || 'Published') === filter;
  });

  const handleResolve = async (revId: string, action: 'keep' | 'hide') => {
    await resolveReviewReport(revId, action);
    setSelectedReview(null);
  };

  const reportedCount = reviews.filter((r) => r.status === 'Reported').length;

  return (
    <div className="space-y-5">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Reviews &amp; Grievance Reports Moderation
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Audit customer feedback, provider ratings, and reported complaints.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {reportedCount > 0 && (
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold animate-pulse">
              {reportedCount} Action Required
            </span>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-slate-900/80 p-2 rounded-2xl border border-slate-800 w-fit">
        {(['All', 'Reported', 'Published', 'Hidden'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === tab
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Reviews Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-semibold uppercase tracking-wider bg-slate-950/40">
                <th className="p-3.5">Rating</th>
                <th className="p-3.5">Reviewer</th>
                <th className="p-3.5">Provider &amp; Service</th>
                <th className="p-3.5">Review Details</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredReviews.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3.5">
                    <span className="flex items-center gap-1 font-bold font-mono text-amber-400">
                      <span>★</span> {r.rating}.0
                    </span>
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-2">
                      <img src={r.userAvatar} alt={r.userName} className="w-7 h-7 rounded-full object-cover" />
                      <span className="text-white font-medium">{r.userName}</span>
                    </div>
                  </td>
                  <td className="p-3.5 text-slate-300">
                    <span className="font-semibold block text-white">{r.providerName || 'Sarah Jenkins'}</span>
                    <span className="text-[11px] text-slate-400">{r.serviceName || 'Dog Walking'}</span>
                  </td>
                  <td className="p-3.5 text-slate-300 max-w-xs">
                    <p className="line-clamp-2">{r.comment}</p>
                    {r.reportedReason && (
                      <span className="text-[10px] text-amber-400 block mt-1">
                        Report: {r.reportedReason}
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-slate-400 font-mono">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        r.status === 'Reported'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                          : r.status === 'Hidden'
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {r.status || 'Published'}
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-1.5">
                    {r.status === 'Reported' ? (
                      <button
                        onClick={() => setSelectedReview(r)}
                        className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold"
                      >
                        Triage Complaint
                      </button>
                    ) : (
                      <button
                        onClick={() => flagReview(r.id, 'Flagged for moderation by administrator.')}
                        className="px-2 py-1 text-slate-400 hover:text-amber-400 rounded-lg text-xs"
                      >
                        Flag
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Triage Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Review Complaint Triage</h3>
            <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Reviewer:</span>
                <span className="text-white font-bold">{selectedReview.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Provider:</span>
                <span className="text-white">{selectedReview.providerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Rating:</span>
                <span className="text-amber-400 font-bold">★ {selectedReview.rating}.0</span>
              </div>
              <div className="p-2.5 bg-slate-900/80 rounded-lg text-slate-300">
                &ldquo;{selectedReview.comment}&rdquo;
              </div>
              {selectedReview.reportedReason && (
                <div className="text-amber-400 text-[11px]">
                  Report Reason: {selectedReview.reportedReason}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => handleResolve(selectedReview.id, 'hide')}
                className="h-10 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold"
              >
                Hide / Censor Review
              </button>
              <button
                onClick={() => handleResolve(selectedReview.id, 'keep')}
                className="h-10 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
              >
                Keep &amp; Dismiss Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
