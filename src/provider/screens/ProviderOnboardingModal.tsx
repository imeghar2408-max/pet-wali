/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useProviderApp } from '../ProviderContext.tsx';
import { ProviderServiceType } from '../types.ts';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  Upload,
  User,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Award,
} from 'lucide-react';

export const ProviderOnboardingModal: React.FC = () => {
  const { onboardingModalOpen, setOnboardingModalOpen, providerProfile, updateProfile } = useProviderApp();

  const [step, setStep] = useState<'splash' | 'auth' | 'services' | 'profile' | 'verification'>('splash');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [phoneNumber, setPhoneNumber] = useState(providerProfile.phone);
  const [otpCode, setOtpCode] = useState('4912');
  const [otpSent, setOtpSent] = useState(false);

  // Form states
  const [name, setName] = useState(providerProfile.name);
  const [email, setEmail] = useState(providerProfile.email);
  const [address, setAddress] = useState(providerProfile.address);
  const [bio, setBio] = useState(providerProfile.bio);
  const [experience, setExperience] = useState(providerProfile.experienceYears);
  const [selectedServices, setSelectedServices] = useState<ProviderServiceType[]>(providerProfile.serviceTypes);

  if (!onboardingModalOpen) return null;

  const toggleService = (type: ProviderServiceType) => {
    setSelectedServices((prev) =>
      prev.includes(type) ? prev.filter((s) => s !== type) : [...prev, type]
    );
  };

  const handleFinish = () => {
    updateProfile({
      name,
      email,
      phone: phoneNumber,
      address,
      bio,
      experienceYears: experience,
      serviceTypes: selectedServices,
    });
    setOnboardingModalOpen(false);
  };

  const serviceOptions: { id: ProviderServiceType; label: string; icon: string; desc: string }[] = [
    { id: 'DOG_WALKER', label: 'Dog Walking', icon: '🐕', desc: 'GPS-tracked neighborhood safe walks' },
    { id: 'DOG_TRAINER', label: 'Dog Training', icon: '🎓', desc: 'Obedience, recall & behavioral drills' },
    { id: 'PET_GROOMER', label: 'Pet Grooming', icon: '✂️', desc: 'Bathing, coat trims, nails & hygiene' },
    { id: 'PET_BOARDING', label: 'Pet Boarding', icon: '🏠', desc: 'Overnight hosting & dedicated pet care' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Top Bar with Step Progress */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
              PetCare Captain Onboarding
            </span>
          </div>
          <button
            onClick={() => setOnboardingModalOpen(false)}
            className="text-slate-400 hover:text-white font-bold text-sm"
          >
            ✕
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-5 py-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-[11px] font-bold text-slate-500">
          <span className={step === 'splash' ? 'text-emerald-700 font-extrabold' : ''}>1. Welcome</span>
          <span>→</span>
          <span className={step === 'auth' ? 'text-emerald-700 font-extrabold' : ''}>2. Auth</span>
          <span>→</span>
          <span className={step === 'services' ? 'text-emerald-700 font-extrabold' : ''}>3. Services</span>
          <span>→</span>
          <span className={step === 'profile' ? 'text-emerald-700 font-extrabold' : ''}>4. Profile</span>
          <span>→</span>
          <span className={step === 'verification' ? 'text-emerald-700 font-extrabold' : ''}>5. Verify</span>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* STEP 1: SPLASH */}
          {step === 'splash' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white mx-auto flex items-center justify-center shadow-lg shadow-emerald-600/30">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">PetCare Provider</h3>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-0.5">
                  Verified Captain Platform
                </p>
                <p className="text-xs text-slate-600 max-w-xs mx-auto mt-2 leading-relaxed">
                  Join India's premier verified network for professional dog walkers, trainers, groomers, and boarding providers. Automatic ride-style job dispatches with guaranteed weekly payouts.
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1.5 text-left max-w-xs mx-auto">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Push dispatch model (no browsing listings)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Real-time GPS safe-zone geofence tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Instant IMPS wallet cashout anytime</span>
                </div>
              </div>

              <button
                onClick={() => setStep('auth')}
                className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>GET STARTED / SIGN IN</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: AUTH (Login / Sign Up) */}
          {step === 'auth' && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-black text-slate-900">
                  {authMode === 'signup' ? 'Captain Registration' : 'Partner Sign In'}
                </h3>
                <p className="text-xs text-slate-500">
                  Enter your mobile number to receive a secure one-time verification code.
                </p>
              </div>

              <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold">
                <button
                  onClick={() => setAuthMode('signup')}
                  className={`flex-1 py-2 rounded-xl transition-all ${
                    authMode === 'signup' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Sign Up
                </button>
                <button
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-2 rounded-xl transition-all ${
                    authMode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Login
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Mobile Number (India +91)
                </label>
                <div className="flex gap-2">
                  <span className="px-3 py-2.5 rounded-xl bg-slate-100 border border-slate-300 text-xs font-bold text-slate-700">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-medium"
                    placeholder="98450 12890"
                  />
                </div>
              </div>

              {otpSent ? (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Enter OTP Code (Default: 4912)
                  </label>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full text-center tracking-widest text-lg font-mono font-bold p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    onClick={() => setStep('services')}
                    className="w-full mt-3 py-3.5 rounded-2xl bg-emerald-600 text-white font-extrabold text-xs shadow-md"
                  >
                    VERIFY & CONTINUE
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setOtpSent(true)}
                  className="w-full py-3.5 rounded-2xl bg-slate-900 text-white font-extrabold text-xs shadow-md"
                >
                  SEND VERIFICATION CODE
                </button>
              )}
            </div>
          )}

          {/* STEP 3: SERVICE TYPE SELECTION */}
          {step === 'services' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">What service do you provide?</h3>
                <p className="text-xs text-slate-500">
                  Select one or multiple services you are qualified to provide:
                </p>
              </div>

              <div className="space-y-2.5">
                {serviceOptions.map((opt) => {
                  const isChecked = selectedServices.includes(opt.id);
                  return (
                    <div
                      key={opt.id}
                      onClick={() => toggleService(opt.id)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        isChecked
                          ? 'bg-emerald-50/70 border-emerald-500 text-emerald-950 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{opt.icon}</span>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{opt.label}</h4>
                          <p className="text-xs text-slate-500">{opt.desc}</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="w-5 h-5 text-emerald-600 rounded"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600">
                🔒 Note: Veterinary, hospital, and medical consultation services are not supported on PetCare Provider.
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep('auth')}
                  className="py-3.5 px-4 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep('profile')}
                  disabled={selectedServices.length === 0}
                  className="flex-1 py-3.5 rounded-2xl bg-emerald-600 disabled:bg-slate-200 text-white font-extrabold text-xs shadow-md"
                >
                  CONTINUE TO PROFILE SETUP
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: PROFILE SETUP */}
          {step === 'profile' && (
            <div className="space-y-3.5">
              <div>
                <h3 className="text-lg font-black text-slate-900">Captain Profile Details</h3>
                <p className="text-xs text-slate-500">
                  Visible to pet parents when an assignment is accepted.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    value={experience}
                    onChange={(e) => setExperience(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Residential Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Bio & Canine Handling Philosophy</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setStep('services')}
                  className="py-3.5 px-4 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep('verification')}
                  className="flex-1 py-3.5 rounded-2xl bg-emerald-600 text-white font-extrabold text-xs shadow-md"
                >
                  CONTINUE TO VERIFICATION
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: VERIFICATION STATUS */}
          {step === 'verification' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-2">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Document Verification</h3>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full inline-block mt-1">
                  Status: Verified Partner
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                  <span className="text-slate-600">Govt ID (Aadhaar / Passport)</span>
                  <span className="font-bold text-emerald-600">✓ Verified</span>
                </div>
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                  <span className="text-slate-600">Canine Certification</span>
                  <span className="font-bold text-emerald-600">✓ Verified</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Police Background Check</span>
                  <span className="font-bold text-emerald-600">✓ Cleared</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 text-center">
                Your profile is active and verified to receive customer service dispatches.
              </p>

              <button
                onClick={handleFinish}
                className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md"
              >
                ENTER CAPTAIN DASHBOARD
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
