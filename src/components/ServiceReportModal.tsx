/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  MapPin,
  Clock,
  Calendar,
  Share2,
  CheckCircle2,
  Droplets,
  Award,
  ChevronRight,
  TrendingUp,
  Scissors,
  Home,
  Compass,
  Image as ImageIcon,
  Heart,
  AlertTriangle,
  Sparkles,
  Info,
  Sliders,
  Send,
  Download,
} from 'lucide-react';
import {
  ServiceReport,
  WalkReport,
  TrainingReport,
  GroomingReport,
  BoardingReport,
} from '../types/reports.ts';
import { useApp } from '../context/AppContext.tsx';

interface ServiceReportModalProps {
  report: ServiceReport | null;
  initialTab?: string;
  onClose: () => void;
}

export const ServiceReportModal: React.FC<ServiceReportModalProps> = ({
  report,
  initialTab = 'overview',
  onClose,
}) => {
  const { rateServiceReport } = useApp();
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [showShareToast, setShowShareToast] = useState(false);

  // Rating state
  const [ratingScore, setRatingScore] = useState<number>(report?.rating || 5);
  const [reviewText, setReviewText] = useState<string>(report?.reviewComment || '');
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [ratingSubmittedSuccess, setRatingSubmittedSuccess] = useState(!!report?.rating);

  // Before / After Grooming slider or toggle state
  const [groomingCompareMode, setGroomingCompareMode] = useState<'side-by-side' | 'toggle'>('side-by-side');
  const [groomingActiveToggle, setGroomingActiveToggle] = useState<'before' | 'after'>('after');

  if (!report) return null;

  const handleShare = () => {
    const text = `PetCare Verified Report for ${report.petName} (${report.serviceTitle}) by ${report.providerName} on ${report.date}. Status: Completed 100% Safe.`;
    navigator.clipboard?.writeText(text);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2500);
  };

  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    setIsSubmittingRating(true);
    try {
      await rateServiceReport(report.id, ratingScore, reviewText.trim());
      setRatingSubmittedSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const getServiceBadge = () => {
    switch (report.serviceType) {
      case 'DOG_WALKER':
        return {
          icon: Compass,
          label: 'Dog Walk Report',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
      case 'DOG_TRAINER':
        return {
          icon: Award,
          label: 'Training Session Report',
          bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
        };
      case 'PET_GROOMER':
        return {
          icon: Scissors,
          label: 'Grooming & Spa Report',
          bg: 'bg-purple-50 text-purple-800 border-purple-200',
        };
      case 'PET_BOARDING':
        return {
          icon: Home,
          label: 'Boarding Care Report',
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
        };
    }
  };

  const badge = getServiceBadge();

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Top Header Bar */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between relative shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-emerald-400/60 shadow-md">
              <img src={report.petPhotoUrl} alt={report.petName} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">{report.petName}</h2>
                <span className="text-[11px] font-bold text-slate-300">({report.petBreed})</span>
              </div>
              <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Service Report · {report.date}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              title="Share Report"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors active:scale-95"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title="Close"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {showShareToast && (
            <div className="absolute top-16 right-5 bg-emerald-600 text-white text-xs px-3 py-1.5 rounded-xl shadow-lg animate-fade-in flex items-center gap-1.5 z-20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Report link copied!</span>
            </div>
          )}
        </div>

        {/* Provider Dossier Strip */}
        <div className="bg-slate-50 border-b border-slate-200/80 px-5 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <img
              src={report.providerAvatar}
              alt={report.providerName}
              className="w-9 h-9 rounded-full object-cover border border-slate-200"
            />
            <div>
              <span className="text-xs font-bold text-slate-900 block leading-tight">
                {report.providerName}
              </span>
              <span className="text-[11px] text-slate-500">{report.providerRoleTitle}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 ${badge.bg}`}
            >
              <badge.icon className="w-3 h-3" />
              <span>{badge.label}</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">#{report.bookingRef}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-white border-b border-slate-100 px-4 pt-2 gap-1 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview &amp; Metrics
          </button>

          {report.serviceType === 'DOG_WALKER' && (
            <>
              <button
                onClick={() => setActiveTab('route')}
                className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1 ${
                  activeTab === 'route'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>View Route</span>
              </button>

              <button
                onClick={() => setActiveTab('photos')}
                className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1 ${
                  activeTab === 'photos'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>View Photos ({report.photos.length})</span>
              </button>
            </>
          )}

          {report.serviceType === 'DOG_TRAINER' && (
            <>
              <button
                onClick={() => setActiveTab('progress')}
                className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1 ${
                  activeTab === 'progress'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Training Progress</span>
              </button>

              <button
                onClick={() => setActiveTab('homework')}
                className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                  activeTab === 'homework'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Homework &amp; Drills
              </button>
            </>
          )}

          {report.serviceType === 'PET_GROOMER' && (
            <>
              <button
                onClick={() => setActiveTab('before-after')}
                className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1 ${
                  activeTab === 'before-after'
                    ? 'border-purple-600 text-purple-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>Before &amp; After</span>
              </button>

              <button
                onClick={() => setActiveTab('treatments')}
                className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                  activeTab === 'treatments'
                    ? 'border-purple-600 text-purple-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Care &amp; Coat Health
              </button>
            </>
          )}

          {report.serviceType === 'PET_BOARDING' && (
            <>
              <button
                onClick={() => setActiveTab('meals-activities')}
                className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1 ${
                  activeTab === 'meals-activities'
                    ? 'border-amber-600 text-amber-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Meals &amp; Routine</span>
              </button>

              <button
                onClick={() => setActiveTab('photos')}
                className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1 ${
                  activeTab === 'photos'
                    ? 'border-amber-600 text-amber-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Photos ({report.photos.length})</span>
              </button>
            </>
          )}

          <button
            onClick={() => setActiveTab('rating')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'rating'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>{report.rating ? 'Walker Rating ★' : 'Rate Provider'}</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: OVERVIEW & SERVICE-SPECIFIC METRICS */}
          {activeTab === 'overview' && (
            <div className="space-y-4 animate-fade-in">
              {/* DOG WALK OVERVIEW */}
              {report.serviceType === 'DOG_WALKER' && (
                <>
                  <div className="grid grid-cols-4 gap-2 text-center bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Distance</span>
                      <span className="text-xl font-black text-slate-900">{(report as WalkReport).distanceKm}</span>
                      <span className="text-[10px] text-slate-500 block">km walked</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Duration</span>
                      <span className="text-xl font-black text-slate-900">{report.durationMinutes}</span>
                      <span className="text-[10px] text-slate-500 block">minutes</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg Pace</span>
                      <span className="text-xl font-black text-slate-900">{(report as WalkReport).avgPace}</span>
                      <span className="text-[10px] text-slate-500 block">steady walk</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Safe-Zone</span>
                      <span className="text-xl font-black text-emerald-600">
                        {(report as WalkReport).safeZoneCompliancePct}%
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold block">0 Breaches</span>
                    </div>
                  </div>

                  {/* Water & Potty Events Bar */}
                  <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-2xl p-3.5 flex items-center justify-between text-xs text-emerald-900">
                    <div className="flex items-center gap-1.5">
                      <Droplets className="w-4 h-4 text-emerald-600" />
                      <span>
                        Water breaks: <strong>{(report as WalkReport).waterBreaks}x</strong> (hydrated)
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>
                        💧 Pee: <strong>{(report as WalkReport).pottyEvents.pee}</strong>
                      </span>
                      <span>
                        💩 Poop: <strong>{(report as WalkReport).pottyEvents.poop}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Route Map Preview Box */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                    <div className="bg-slate-100 p-2.5 px-3 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Route Trail · {(report as WalkReport).route.startAddress}</span>
                      </span>
                      <button
                        onClick={() => setActiveTab('route')}
                        className="text-emerald-700 font-bold hover:underline flex items-center gap-0.5"
                      >
                        <span>Full Radar</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="relative h-44 bg-slate-100 flex items-center justify-center overflow-hidden">
                      {/* Interactive Route SVG Vector */}
                      <svg className="w-full h-full" viewBox="0 0 400 160" fill="none">
                        <defs>
                          <radialGradient id="safeZoneGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#88f9b0" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#006d3c" stopOpacity="0.05" />
                          </radialGradient>
                        </defs>
                        {/* Safe Zone circle */}
                        <circle cx="200" cy="80" r="70" fill="url(#safeZoneGlow)" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" />
                        {/* Street lines */}
                        <path d="M20 40 L380 40" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
                        <path d="M20 120 L380 120" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
                        <path d="M120 10 L120 150" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
                        <path d="M280 10 L280 150" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
                        {/* Walker path trail */}
                        <path
                          d="M120 120 Q 160 120, 180 80 T 240 60 T 280 100 T 200 80 T 120 120"
                          stroke="#059669"
                          strokeWidth="4"
                          strokeLinecap="round"
                          fill="none"
                        />
                        {/* Waypoint pins */}
                        <circle cx="120" cy="120" r="6" fill="#047857" stroke="#ffffff" strokeWidth="2" />
                        <circle cx="180" cy="80" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                        <circle cx="240" cy="60" r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                        <circle cx="200" cy="80" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                      </svg>

                      <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] text-slate-700 font-bold border border-slate-200">
                        1.42 km · 100% inside safe zone
                      </div>
                      <div className="absolute top-2 right-2 bg-emerald-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                        Start 05:30 PM → End 06:02 PM
                      </div>
                    </div>
                  </div>

                  {/* Walker Notes */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-1.5">
                    <span className="text-xs font-bold text-slate-900 block">Walker Notes &amp; Observations</span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {(report as WalkReport).walkNotes}
                    </p>
                  </div>
                </>
              )}

              {/* DOG TRAINER OVERVIEW */}
              {report.serviceType === 'DOG_TRAINER' && (
                <>
                  <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-300">
                        Session #{(report as TrainingReport).sessionNumber} of {(report as TrainingReport).totalSessions}
                      </span>
                      <h3 className="text-base font-black mt-0.5">{(report as TrainingReport).moduleTitle}</h3>
                      <p className="text-xs text-slate-300 mt-1">Duration: {report.durationMinutes} min intense training</p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex flex-col items-center justify-center border border-white/20">
                      <Award className="w-6 h-6 text-amber-300" />
                      <span className="text-[10px] font-bold text-white mt-0.5">Passed</span>
                    </div>
                  </div>

                  {/* Quick Skill Scores */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Key Skill Mastery &amp; Growth
                      </h4>
                      <button
                        onClick={() => setActiveTab('progress')}
                        className="text-xs text-indigo-600 font-bold hover:underline"
                      >
                        View Full History &gt;
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {(report as TrainingReport).skillProgress.map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-bold text-slate-800">{item.skill}</span>
                            <span className="font-black text-indigo-700">
                              {item.currentPercent}%{' '}
                              <span className="text-[10px] text-emerald-600 font-bold">
                                (+{item.currentPercent - item.previousPercent}%)
                              </span>
                            </span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                            <div
                              className="bg-indigo-600 rounded-full transition-all duration-500"
                              style={{ width: `${item.currentPercent}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Trainer Notes */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-1.5">
                    <span className="text-xs font-bold text-slate-900 block">Trainer Notes</span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {(report as TrainingReport).trainerNotes}
                    </p>
                  </div>
                </>
              )}

              {/* PET GROOMER OVERVIEW */}
              {report.serviceType === 'PET_GROOMER' && (
                <>
                  <div className="bg-purple-50/70 border border-purple-200/70 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-700">
                        Spa &amp; Styling Summary
                      </span>
                      <h3 className="text-base font-black text-purple-950 mt-0.5">{report.serviceTitle}</h3>
                      <p className="text-xs text-purple-800 mt-1">
                        Completed in {report.durationMinutes} min • Coat Condition: <strong>{(report as GroomingReport).coatCondition.condition}</strong>
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('before-after')}
                      className="px-3 py-2 rounded-xl bg-purple-700 text-white font-bold text-xs hover:bg-purple-800 flex items-center gap-1 shadow-xs"
                    >
                      <Scissors className="w-3.5 h-3.5" />
                      <span>Before / After</span>
                    </button>
                  </div>

                  {/* Completed Treatments Checklist */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Services &amp; Treatments Completed
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {(report as GroomingReport).servicesCompleted.map((srv, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                          <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                          <span className="text-slate-800 font-medium">{srv}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Coat Health Assessment */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-2">
                    <span className="text-xs font-bold text-slate-900 block">Coat &amp; Skin Observation</span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {(report as GroomingReport).specialObservations}
                    </p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Nails: <strong>{(report as GroomingReport).nailTrimming.method}</strong></span>
                      <span>Ears: <strong>{(report as GroomingReport).earCleaning.condition}</strong></span>
                      <span>Shedding: <strong>{(report as GroomingReport).coatCondition.sheddingLevel}</strong></span>
                    </div>
                  </div>
                </>
              )}

              {/* PET BOARDING OVERVIEW */}
              {report.serviceType === 'PET_BOARDING' && (
                <>
                  <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Stay</span>
                      <span className="text-xl font-black text-amber-600">{(report as BoardingReport).totalStayHours}</span>
                      <span className="text-[10px] text-slate-500 block">hours</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Meals Logged</span>
                      <span className="text-xl font-black text-slate-900">{(report as BoardingReport).meals.length}</span>
                      <span className="text-[10px] text-slate-500 block">100% eaten</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Walks &amp; Play</span>
                      <span className="text-xl font-black text-slate-900">
                        {(report as BoardingReport).walks.length + (report as BoardingReport).activities.length}
                      </span>
                      <span className="text-[10px] text-slate-500 block">sessions</span>
                    </div>
                  </div>

                  <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-3.5 text-xs text-amber-900 space-y-1">
                    <div className="flex justify-between font-bold">
                      <span>Check-In: {(report as BoardingReport).checkIn}</span>
                      <span>Check-Out: {(report as BoardingReport).checkOut}</span>
                    </div>
                    <p className="text-[11px] text-amber-800">
                      Suite: <strong>{(report as BoardingReport).suiteType}</strong> • All feedings, walks, and medications administered on schedule.
                    </p>
                  </div>

                  {/* Host Caregiver Notes */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-1.5">
                    <span className="text-xs font-bold text-slate-900 block">Caregiver Stay Notes</span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {(report as BoardingReport).caregiverNotes}
                    </p>
                  </div>
                </>
              )}

              {/* Action Buttons Row */}
              <div className="pt-2 flex items-center gap-2">
                {report.serviceType === 'DOG_WALKER' && (
                  <button
                    onClick={() => setActiveTab('route')}
                    className="flex-1 py-3 px-4 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-800 active:scale-98 transition-all"
                  >
                    <Compass className="w-4 h-4 text-emerald-400" />
                    <span>View Route</span>
                  </button>
                )}

                {report.serviceType === 'DOG_TRAINER' && (
                  <button
                    onClick={() => setActiveTab('progress')}
                    className="flex-1 py-3 px-4 rounded-xl bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-indigo-800 active:scale-98 transition-all"
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>View Progress History</span>
                  </button>
                )}

                {report.serviceType === 'PET_GROOMER' && (
                  <button
                    onClick={() => setActiveTab('before-after')}
                    className="flex-1 py-3 px-4 rounded-xl bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-purple-800 active:scale-98 transition-all"
                  >
                    <Scissors className="w-4 h-4" />
                    <span>View Before/After Photos</span>
                  </button>
                )}

                {report.serviceType === 'PET_BOARDING' && (
                  <button
                    onClick={() => setActiveTab('meals-activities')}
                    className="flex-1 py-3 px-4 rounded-xl bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-amber-800 active:scale-98 transition-all"
                  >
                    <Home className="w-4 h-4" />
                    <span>View Care Routine</span>
                  </button>
                )}

                <button
                  onClick={() => setActiveTab('rating')}
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-98 transition-all shadow-xs"
                >
                  <Star className="w-4 h-4 fill-slate-950" />
                  <span>{report.rating ? 'Edit Review ★' : 'Rate Walker / Provider'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ROUTE MAP (FOR DOG WALKS) */}
          {activeTab === 'route' && report.serviceType === 'DOG_WALKER' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Interactive Walk Route GPS</h3>
                  <p className="text-xs text-slate-500">High-precision geofenced track recorded by collar telemetry</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  100% Safe Zone Compliance
                </span>
              </div>

              {/* Large Route Radar Map */}
              <div className="relative h-64 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 500 240" fill="none">
                  {/* Grid lines */}
                  <defs>
                    <pattern id="radarGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="500" height="240" fill="#0f172a" />
                  <rect width="500" height="240" fill="url(#radarGrid)" />

                  {/* 1.0 km Safe Zone boundary */}
                  <circle cx="250" cy="120" r="100" fill="#064e3b" fillOpacity="0.2" stroke="#10b981" strokeWidth="2" strokeDasharray="5 5" />
                  <text x="250" y="35" textAnchor="middle" fill="#10b981" fontSize="11" fontWeight="bold">
                    Approved Geofence Boundary (1.0 km radius)
                  </text>

                  {/* Streets */}
                  <path d="M 40 60 L 460 60" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
                  <path d="M 40 180 L 460 180" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
                  <path d="M 160 20 L 160 220" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
                  <path d="M 340 20 L 340 220" stroke="#334155" strokeWidth="6" strokeLinecap="round" />

                  {/* Route track line */}
                  <path
                    d="M 160 180 Q 210 180, 230 140 T 300 100 T 340 140 T 260 120 T 160 180"
                    stroke="#10b981"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />

                  {/* Waypoint Markers */}
                  {/* Start Point */}
                  <circle cx="160" cy="180" r="8" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                  <text x="160" y="202" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                    Start (05:30)
                  </text>

                  {/* Water Break */}
                  <circle cx="230" cy="140" r="7" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                  <text x="230" y="125" textAnchor="middle" fill="#93c5fd" fontSize="9" fontWeight="bold">
                    💧 Water Break (05:45)
                  </text>

                  {/* Potty Break */}
                  <circle cx="340" cy="140" r="7" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                  <text x="340" y="160" textAnchor="middle" fill="#fcd34d" fontSize="9" fontWeight="bold">
                    💩 Potty (05:54)
                  </text>

                  {/* End Handover */}
                  <circle cx="260" cy="120" r="7" fill="#ec4899" stroke="#ffffff" strokeWidth="2" />
                  <text x="260" y="105" textAnchor="middle" fill="#f472b6" fontSize="9" fontWeight="bold">
                    Finish 1.42 km (06:02)
                  </text>
                </svg>

                <div className="absolute top-3 left-3 bg-slate-800/80 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-lg border border-slate-700">
                  GPS Altitude: 42m · Satellite Sync: 99.4%
                </div>
              </div>

              {/* Waypoint Timeline */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Waypoints &amp; Telemetry Events
                </h4>
                <div className="space-y-2.5">
                  {(report as WalkReport).route.waypoints.map((wp, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="font-bold text-slate-900 block">{wp.label}</span>
                          <span className="text-[11px] text-slate-400">Lat: {wp.lat.toFixed(4)}, Lng: {wp.lng.toFixed(4)}</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-semibold text-slate-600 bg-white px-2 py-1 rounded-md border border-slate-200">
                        {wp.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: PHOTOS GALLERY */}
          {activeTab === 'photos' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Service Photo Log</h3>
                  <p className="text-xs text-slate-500">Photos uploaded live during {report.petName}&apos;s session</p>
                </div>
                <span className="text-xs text-slate-500 font-bold">
                  {('photos' in report && report.photos.length) || 0} photos
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {('photos' in report ? report.photos : []).map((photo, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
                    <div className="relative h-44 bg-slate-200">
                      <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                      <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-md">
                        {photo.time}
                      </span>
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-slate-700 font-medium">{photo.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: TRAINING PROGRESS & MULTI-SESSION TREND */}
          {activeTab === 'progress' && report.serviceType === 'DOG_TRAINER' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Multi-Session Training Progress</h3>
                  <p className="text-xs text-slate-500">Mastery trajectory across Sessions 1, 2, and 3</p>
                </div>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                  Session 3 of 6
                </span>
              </div>

              {/* Progress Comparison Bars */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-4 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Command Proficiency Comparison
                </h4>

                {(report as TrainingReport).skillProgress.map((item, idx) => {
                  const gain = item.currentPercent - item.previousPercent;
                  return (
                    <div key={idx} className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900">{item.skill}</span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            +{gain}% this session
                          </span>
                        </div>
                        <span className="text-sm font-black text-indigo-900">{item.currentPercent}%</span>
                      </div>

                      {/* Stacked comparison bar */}
                      <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex">
                        <div
                          className="bg-indigo-300 transition-all duration-500"
                          style={{ width: `${item.previousPercent}%` }}
                          title={`Previous Session: ${item.previousPercent}%`}
                        />
                        <div
                          className="bg-indigo-600 transition-all duration-500"
                          style={{ width: `${gain}%` }}
                          title={`New Gain: +${gain}%`}
                        />
                      </div>

                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Session 2: {item.previousPercent}%</span>
                        <span>Current Target: {item.targetPercent}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Session History Audit Table */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Previous Training Session History
                </h4>

                <div className="space-y-2">
                  {(report as TrainingReport).sessionHistory.map((sess) => (
                    <div key={sess.sessionNumber} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>Session #{sess.sessionNumber} · {sess.date}</span>
                        <span className="text-indigo-600">{sess.durationMinutes} min</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{sess.summary}</p>
                      <div className="flex gap-2 pt-1 text-[10px] font-semibold text-slate-600">
                        {sess.skills.map((s, i) => (
                          <span key={i} className="bg-white px-2 py-0.5 rounded border border-slate-200">
                            {s.skill}: {s.score}%
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: HOMEWORK & DRILLS (FOR TRAINING) */}
          {activeTab === 'homework' && report.serviceType === 'DOG_TRAINER' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recommended Parent Homework</h3>
                <p className="text-xs text-slate-500">Reinforce training goals between sessions with 5-minute drills</p>
              </div>

              <div className="bg-indigo-50/70 border border-indigo-200/70 rounded-2xl p-4 space-y-3">
                {(report as TrainingReport).homeworkRecommendations.map((hw, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-indigo-950">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed font-medium">{hw}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-2">
                <h4 className="text-xs font-bold text-slate-900">Detailed Drills Executed Today</h4>
                <div className="space-y-2">
                  {(report as TrainingReport).exercisesCompleted.map((ex) => (
                    <div key={ex.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                      <div className="flex justify-between font-bold">
                        <span className="text-slate-900">{ex.name}</span>
                        <span className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                          {ex.status} ({ex.accuracyPercent}%)
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px]">Goal: {ex.target}</p>
                      <p className="text-slate-700 text-[11px] italic">Notes: {ex.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: BEFORE & AFTER (FOR GROOMING) */}
          {activeTab === 'before-after' && report.serviceType === 'PET_GROOMER' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Before &amp; After Transformation</h3>
                  <p className="text-xs text-slate-500">Visual comparison of {report.petName}&apos;s grooming styling</p>
                </div>

                <div className="flex bg-slate-100 p-0.5 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setGroomingCompareMode('side-by-side')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      groomingCompareMode === 'side-by-side' ? 'bg-white shadow-xs text-purple-700' : 'text-slate-500'
                    }`}
                  >
                    Side by Side
                  </button>
                  <button
                    onClick={() => setGroomingCompareMode('toggle')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      groomingCompareMode === 'toggle' ? 'bg-white shadow-xs text-purple-700' : 'text-slate-500'
                    }`}
                  >
                    Interactive Toggle
                  </button>
                </div>
              </div>

              {groomingCompareMode === 'side-by-side' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Before Box */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
                    <div className="relative h-56 bg-slate-200">
                      <img
                        src={(report as GroomingReport).beforePhotos[0]?.url}
                        alt="Before Grooming"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2.5 left-2.5 bg-rose-600 text-white font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded-full shadow-md">
                        Before Grooming
                      </span>
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-slate-600">
                        {(report as GroomingReport).beforePhotos[0]?.description}
                      </p>
                    </div>
                  </div>

                  {/* After Box */}
                  <div className="bg-purple-50/50 border border-purple-200/80 rounded-2xl overflow-hidden shadow-xs">
                    <div className="relative h-56 bg-slate-200">
                      <img
                        src={(report as GroomingReport).afterPhotos[0]?.url}
                        alt="After Grooming"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2.5 left-2.5 bg-purple-700 text-white font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded-full shadow-md">
                        After Grooming ✨
                      </span>
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-purple-950 font-medium">
                        {(report as GroomingReport).afterPhotos[0]?.description}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs p-4 space-y-3">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => setGroomingActiveToggle('before')}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                        groomingActiveToggle === 'before'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200'
                      }`}
                    >
                      Show Before Photo
                    </button>
                    <button
                      onClick={() => setGroomingActiveToggle('after')}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                        groomingActiveToggle === 'after'
                          ? 'bg-purple-700 text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200'
                      }`}
                    >
                      Show After Photo ✨
                    </button>
                  </div>

                  <div className="relative h-64 rounded-xl overflow-hidden bg-slate-200 shadow-inner">
                    <img
                      src={
                        groomingActiveToggle === 'before'
                          ? (report as GroomingReport).beforePhotos[0]?.url
                          : (report as GroomingReport).afterPhotos[0]?.url
                      }
                      alt={groomingActiveToggle}
                      className="w-full h-full object-cover transition-all duration-300"
                    />
                    <div className="absolute bottom-2 inset-x-2 bg-black/60 backdrop-blur-xs text-white p-2 rounded-lg text-xs">
                      {groomingActiveToggle === 'before'
                        ? (report as GroomingReport).beforePhotos[0]?.description
                        : (report as GroomingReport).afterPhotos[0]?.description}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: CARE & TREATMENTS (FOR GROOMING) */}
          {activeTab === 'treatments' && report.serviceType === 'PET_GROOMER' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Coat &amp; Health Treatments Detailed Log</h3>
                <p className="text-xs text-slate-500">Inspection breakdown by certified groomer</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Bath &amp; Shampoo</span>
                  <span className="font-bold text-slate-900 block">{(report as GroomingReport).bath.shampoo}</span>
                  <span className="text-[11px] text-emerald-700">Hypoallergenic ✓ Conditioned ✓</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Nail Trimming</span>
                  <span className="font-bold text-slate-900 block">{(report as GroomingReport).nailTrimming.method}</span>
                  <span className="text-[11px] text-emerald-700">Paw Balm Applied ✓</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Haircut Contour</span>
                  <span className="font-bold text-slate-900 block">{(report as GroomingReport).haircut.style}</span>
                  <span className="text-[11px] text-slate-500">{(report as GroomingReport).haircut.guardLength}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Ear Cleaning</span>
                  <span className="font-bold text-slate-900 block">{(report as GroomingReport).earCleaning.condition}</span>
                  <span className="text-[11px] text-slate-500">{(report as GroomingReport).earCleaning.notes}</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-1.5">
                <span className="text-xs font-bold text-slate-900 block">Groomer Professional Notes</span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {(report as GroomingReport).groomerNotes}
                </p>
              </div>
            </div>
          )}

          {/* TAB: MEALS & ACTIVITIES (FOR BOARDING) */}
          {activeTab === 'meals-activities' && report.serviceType === 'PET_BOARDING' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Daily Care Routine &amp; Nutrition Log</h3>
                <p className="text-xs text-slate-500">Logged activities during the 31.5-hour stay</p>
              </div>

              {/* Meals log */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  Nutrition &amp; Meal Schedule
                </h4>
                <div className="space-y-2">
                  {(report as BoardingReport).meals.map((meal, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900">{meal.mealType}</span>
                          <span className="text-[10px] text-slate-400">({meal.time})</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{meal.foodType}</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {meal.portionsEatenPct}% Eaten
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Walks Log */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Daily Exercise Walks
                </h4>
                <div className="space-y-2">
                  {(report as BoardingReport).walks.map((w, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">{w.time}</span>
                        <span className="text-[11px] text-slate-500">Walker: {w.walkerName}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-700 block">{w.distanceKm} km ({w.durationMinutes} min)</span>
                        <span className="text-[10px] text-emerald-600">100% Safe Zone</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: RATE WALKER / PROVIDER */}
          {activeTab === 'rating' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 text-center space-y-2">
                <span className="text-xs uppercase font-extrabold tracking-widest text-amber-800">
                  Rate {report.providerName}
                </span>
                <h3 className="text-lg font-black text-amber-950">How was your experience?</h3>
                <p className="text-xs text-amber-800/90 max-w-sm mx-auto">
                  Your feedback influences provider reputation, platform dispatch matching, and keeps pet care safe.
                </p>

                {/* Star Selector */}
                <div className="flex items-center justify-center gap-2 py-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRatingScore(s)}
                      className="p-1.5 transition-transform hover:scale-110 active:scale-95"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          s <= ratingScore
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-black text-amber-900 block">
                  {ratingScore === 5
                    ? '5.0 ★ Exceptional Service'
                    : ratingScore === 4
                    ? '4.0 ★ Very Good'
                    : `${ratingScore}.0 ★ Satisfactory`}
                </span>
              </div>

              {/* Review Form */}
              <form onSubmit={handleRatingSubmit} className="space-y-3">
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-2">
                  <label className="text-xs font-bold text-slate-800 block">
                    Write your review for {report.providerName}
                  </label>
                  <textarea
                    rows={3}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="e.g. Vikram was extremely punctual, sent great photos, and took care of Bruno like his own dog!"
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1 text-emerald-700 font-medium">
                      ✓ Professionalism: 5.0
                    </span>
                    <span className="flex items-center gap-1 text-emerald-700 font-medium">
                      ✓ Pet handling: 5.0
                    </span>
                    <span className="flex items-center gap-1 text-emerald-700 font-medium">
                      ✓ Punctuality: 5.0
                    </span>
                    <span className="flex items-center gap-1 text-emerald-700 font-medium">
                      ✓ Service quality: 5.0
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingRating || !reviewText.trim()}
                  className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 active:scale-98 transition-all shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmittingRating
                      ? 'SUBMITTING REVIEW...'
                      : ratingSubmittedSuccess
                      ? 'UPDATE REVIEW'
                      : 'SUBMIT PROVIDER REVIEW ★'}
                  </span>
                </button>

                {ratingSubmittedSuccess && (
                  <p className="text-center text-xs text-emerald-700 font-bold flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Review saved and published to {report.providerName}&apos;s profile!</span>
                  </p>
                )}
              </form>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>PetCare Guaranteed · Microchip #{report.petId}</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
            <span>•</span>
            <button
              onClick={onClose}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
