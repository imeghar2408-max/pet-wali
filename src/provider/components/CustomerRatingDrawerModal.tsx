/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useProviderApp } from '../ProviderContext.tsx';
import {
  Star,
  ShieldCheck,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  Lock,
  X,
  MessageSquare,
  TrendingUp,
} from 'lucide-react';

export const CustomerRatingDrawerModal: React.FC = () => {
  const { ratingModalOpen, setRatingModalOpen, providerProfile, reviews } = useProviderApp();

  if (!ratingModalOpen) return null;

  const { categoryRatings } = providerProfile;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              <Star className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="text-base font-black">Customer Ratings & Reputation</h3>
              <p className="text-[11px] text-slate-400">Verified reviews submitted by pet parents</p>
            </div>
          </div>
          <button
            onClick={() => setRatingModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center font-bold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Top Score Banner */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-3xl p-5 text-center shadow-xs">
            <span className="text-[11px] uppercase font-extrabold tracking-widest text-amber-800">
              Overall Captain Rating
            </span>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-4xl font-black text-slate-900">{providerProfile.rating}</span>
              <div className="flex flex-col text-left">
                <div className="flex text-amber-500">
                  {'★'.repeat(5)}
                </div>
                <span className="text-xs font-bold text-slate-500">
                  Based on {providerProfile.totalReviews} verified reviews
                </span>
              </div>
            </div>
            <p className="text-xs text-amber-900 mt-2 max-w-xs mx-auto">
              Top 2% Captain in Bengaluru. High rating grants priority matching for nearby dog walk and training requests.
            </p>
          </div>

          {/* Transparent System Notice */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-slate-600">
            <Lock className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-slate-800 font-semibold block">Verified Customer Rating System</strong>
              Ratings are submitted directly by pet owners upon service completion answering: <em>"How was your experience?"</em> Providers can view feedback but cannot edit or manipulate reviews.
            </div>
          </div>

          {/* 4-Category Performance Breakdown */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Rating Category Breakdown
            </h4>

            <div className="space-y-3">
              {/* Professionalism */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span>👔</span> Professionalism
                  </span>
                  <span className="text-amber-600">★ {categoryRatings.professionalism} / 5.0</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(categoryRatings.professionalism / 5) * 100}%` }} />
                </div>
              </div>

              {/* Pet Handling */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span>🐕</span> Pet Handling & Safety
                  </span>
                  <span className="text-emerald-600">★ {categoryRatings.petHandling} / 5.0</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(categoryRatings.petHandling / 5) * 100}%` }} />
                </div>
              </div>

              {/* Punctuality */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span>⏱️</span> Punctuality & Arrival
                  </span>
                  <span className="text-blue-600">★ {categoryRatings.punctuality} / 5.0</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${(categoryRatings.punctuality / 5) * 100}%` }} />
                </div>
              </div>

              {/* Service Quality */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span>🏆</span> Service Quality & Care
                  </span>
                  <span className="text-teal-600">★ {categoryRatings.serviceQuality} / 5.0</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full rounded-full" style={{ width: `${(categoryRatings.serviceQuality / 5) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Reviews List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Recent Verified Reviews
            </h4>

            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={rev.customerAvatar}
                      alt={rev.customerName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">{rev.customerName}</h5>
                      <span className="text-[10px] text-slate-400">
                        {rev.serviceTitle} ({rev.petName}) • {rev.date}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-amber-600 flex items-center gap-0.5">
                      ★ {rev.rating}
                    </span>
                    <span className="text-[9px] text-emerald-600 font-bold block">Verified Job</span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                  "{rev.comment}"
                </p>

                {rev.tags && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {rev.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100"
                      >
                        ✓ {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <button
            onClick={() => setRatingModalOpen(false)}
            className="w-full py-3.5 rounded-2xl bg-slate-900 text-white font-bold text-xs"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
