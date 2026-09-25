/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useProviderApp } from '../ProviderContext.tsx';
import { ProviderServiceType } from '../types.ts';
import {
  ShieldCheck,
  Star,
  CheckCircle2,
  Clock,
  FileText,
  Upload,
  Sliders,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Sparkles,
  AlertCircle,
  Award,
  Layers,
  Lock,
  MessageSquare,
} from 'lucide-react';

export const ProviderProfileScreen: React.FC = () => {
  const {
    providerProfile,
    updateProfile,
    uploadDocument,
    setOnboardingModalOpen,
    setRatingModalOpen,
  } = useProviderApp();

  const [serviceRadius, setServiceRadius] = useState(providerProfile.serviceAreaRadiusKm);
  const [selectedServices, setSelectedServices] = useState<ProviderServiceType[]>(providerProfile.serviceTypes);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocType, setNewDocType] = useState('Govt ID');

  const toggleService = (type: ProviderServiceType) => {
    setSelectedServices((prev) =>
      prev.includes(type) ? prev.filter((s) => s !== type) : [...prev, type]
    );
  };

  const handleSaveProfile = () => {
    updateProfile({
      serviceAreaRadiusKm: serviceRadius,
      serviceTypes: selectedServices,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleUploadDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName) return;
    uploadDocument(newDocName, newDocType);
    setNewDocName('');
    setShowUploadModal(false);
  };

  const serviceCatalog: { id: ProviderServiceType; label: string; icon: string; rateKey: keyof typeof providerProfile.basePricing }[] = [
    { id: 'DOG_WALKER', label: 'Dog Walker', icon: '🐕', rateKey: 'dogWalking' },
    { id: 'DOG_TRAINER', label: 'Dog Trainer', icon: '🎓', rateKey: 'dogTraining' },
    { id: 'PET_GROOMER', label: 'Pet Groomer', icon: '✂️', rateKey: 'petGrooming' },
  ];

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4 pb-24">
      {/* 1. Captain Header Profile Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="relative">
            <img
              src={providerProfile.avatar}
              alt={providerProfile.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
            />
            <span className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-1 rounded-full border-2 border-white shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg font-black text-slate-900 truncate">{providerProfile.name}</h2>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-800">
                Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Certified Canine Partner • {providerProfile.experienceYears} Years Exp
            </p>

            <div className="flex items-center gap-3 mt-2 text-xs">
              <button
                onClick={() => setRatingModalOpen(true)}
                className="flex items-center gap-1 text-amber-600 font-bold hover:underline"
              >
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{providerProfile.rating}</span>
                <span className="text-slate-400 font-normal">({providerProfile.totalReviews} reviews)</span>
              </button>
              <span className="text-slate-300">•</span>
              <span className="text-slate-700 font-semibold">
                {providerProfile.totalCompletedJobs} trips
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700 font-semibold">
                {providerProfile.acceptanceRatePct}% accept
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-600 mt-3.5 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
          "{providerProfile.bio}"
        </p>

        <div className="mt-3 flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Indiranagar, Bengaluru</span>
          </div>
          <button
            onClick={() => setOnboardingModalOpen(true)}
            className="text-emerald-700 font-bold hover:underline"
          >
            Edit Profile Setup
          </button>
        </div>
      </div>

      {/* 2. Customer Ratings & Reputation Dossier (Prompt Explicit Requirement) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Customer Rating & Reputation
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-slate-900 flex items-center gap-1">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                {providerProfile.rating}
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                Total Reviews: {providerProfile.totalReviews}
              </span>
            </div>
          </div>

          <button
            onClick={() => setRatingModalOpen(true)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1"
          >
            <span>Recent Reviews</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Rating Categories */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-slate-500 text-[11px] block">👔 Professionalism</span>
            <span className="text-sm font-black text-slate-800">
              ★ {providerProfile.categoryRatings.professionalism} / 5.0
            </span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-slate-500 text-[11px] block">🐕 Pet Handling</span>
            <span className="text-sm font-black text-slate-800">
              ★ {providerProfile.categoryRatings.petHandling} / 5.0
            </span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-slate-500 text-[11px] block">⏱️ Punctuality</span>
            <span className="text-sm font-black text-slate-800">
              ★ {providerProfile.categoryRatings.punctuality} / 5.0
            </span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-slate-500 text-[11px] block">🏆 Service Quality</span>
            <span className="text-sm font-black text-slate-800">
              ★ {providerProfile.categoryRatings.serviceQuality} / 5.0
            </span>
          </div>
        </div>

        {/* Lock note */}
        <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
          <Lock className="w-3.5 h-3.5 text-slate-400" />
          <span>
            Ratings are submitted by customers post-service. Providers can view but cannot edit or manipulate them.
          </span>
        </div>
      </div>

      {/* 3. Verification Status & Documents Section */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Verification Status
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-sm font-bold text-slate-900">
                {providerProfile.verificationStatus}
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Document</span>
          </button>
        </div>

        <div className="space-y-2">
          {providerProfile.documents.map((doc) => (
            <div
              key={doc.id}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{doc.name}</h4>
                  <span className="text-[10px] text-slate-400">Uploaded {doc.uploadDate}</span>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  doc.status === 'Verified'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {doc.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Service Type Selection (Strictly Walker, Trainer, Groomer, Training and grooming) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Services Offered</h3>
          <p className="text-xs text-slate-500">
            Select the services you are certified to accept assignments for.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {serviceCatalog.map((item) => {
            const isSelected = selectedServices.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => toggleService(item.id)}
                className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-emerald-50/70 border-emerald-500 text-emerald-950 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{item.icon}</span>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                </div>
                <h4 className="text-xs font-bold text-slate-900 mt-2">{item.label}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Base rate: ₹{providerProfile.basePricing[item.rateKey]}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Service Area & Dispatch Radius */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Service Coverage Radius</h3>
            <p className="text-xs text-slate-500">
              Only receive assignments within this travel distance.
            </p>
          </div>
          <span className="text-base font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl">
            {serviceRadius} km
          </span>
        </div>

        <input
          type="range"
          min="1"
          max="15"
          step="0.5"
          value={serviceRadius}
          onChange={(e) => setServiceRadius(Number(e.target.value))}
          className="w-full accent-emerald-600 cursor-pointer"
        />

        <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
          <span>1 km (Hyperlocal)</span>
          <span>6 km (Recommended)</span>
          <span>15 km (Citywide)</span>
        </div>
      </div>

      {/* Save Settings Button */}
      <div className="pt-2">
        <button
          onClick={handleSaveProfile}
          className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm transition-all shadow-md shadow-emerald-600/20 active:scale-[0.98]"
        >
          {saveSuccess ? 'PROFILE PREFERENCES SAVED ✓' : 'SAVE PREFERENCES'}
        </button>
      </div>

      {/* Document Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleUploadDoc}
            className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Upload Verification Document</h3>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Document Name / Title
              </label>
              <input
                type="text"
                required
                value={newDocName}
                onChange={(e) => setNewDocName(e.target.value)}
                placeholder="E.g., Canine First Aid Certificate"
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Document Category
              </label>
              <select
                value={newDocType}
                onChange={(e) => setNewDocType(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="IDENTITY_PROOF">Government Identity Proof</option>
                <option value="PET_CERTIFICATION">Canine Training & Handling Certificate</option>
                <option value="BACKGROUND_CHECK">Police Clearance Certificate</option>
                <option value="ADDRESS_PROOF">Residential Address Proof</option>
              </select>
            </div>

            <div className="p-4 border-2 border-dashed border-slate-200 rounded-2xl text-center text-xs text-slate-500">
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <span>Click or drop file (PDF or JPG, Max 5MB)</span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
            >
              SUBMIT FOR VERIFICATION
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
