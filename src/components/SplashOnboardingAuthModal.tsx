import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { initialUser, initialAdminUser } from '../server/db.ts';

export const SplashOnboardingAuthModal: React.FC = () => {
  const {
    showSplash,
    setShowSplash,
    showOnboarding,
    setShowOnboarding,
    showAuthModal,
    setShowAuthModal,
    switchActiveUser,
    user,
    addPet,
    setCurrentTab,
  } = useApp();

  // Onboarding slide index
  const [onboardingStep, setOnboardingStep] = useState(0);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('elena.miller@petcare.internal');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');
  const [loginError, setLoginError] = useState('');

  // Sign up form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [firstPetName, setFirstPetName] = useState('');
  const [firstPetSpecies, setFirstPetSpecies] = useState<'Dog' | 'Cat'>('Dog');
  const [firstPetBreed, setFirstPetBreed] = useState('');

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // If nothing is requested, return null
  if (!showSplash && !showOnboarding && !showAuthModal) {
    return null;
  }

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      setLoginError('Please enter your email');
      return;
    }

    if (loginEmail.toLowerCase().includes('admin')) {
      await switchActiveUser(initialAdminUser);
    } else {
      await switchActiveUser(initialUser);
    }

    setShowAuthModal(null);
    setShowSplash(false);
  };

  // Quick Demo Login
  const handleQuickDemoLogin = async (asAdmin: boolean) => {
    if (asAdmin) {
      await switchActiveUser(initialAdminUser);
    } else {
      await switchActiveUser(initialUser);
    }
    setShowAuthModal(null);
    setShowSplash(false);
  };

  // Handle Sign Up
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupEmail.trim()) return;

    // Create custom user session
    const newUser = {
      ...initialUser,
      id: `usr_${Date.now()}`,
      name: signupName,
      email: signupEmail,
      phone: signupPhone || '+1 (555) 0123',
    };

    await switchActiveUser(newUser);

    // If first pet was specified, add it
    if (firstPetName.trim()) {
      await addPet({
        name: firstPetName,
        species: firstPetSpecies,
        breed: firstPetBreed || (firstPetSpecies === 'Dog' ? 'Labrador Retriever' : 'Domestic Shorthair'),
        ageYears: 2,
        ageMonths: 4,
        gender: 'Male (Neutered)',
        weightKg: firstPetSpecies === 'Dog' ? 24 : 4.5,
        photoUrl:
          firstPetSpecies === 'Dog'
            ? 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400'
            : 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400',
        healthStatus: 'Healthy',
        microchipId: `98514100${Math.floor(100000 + Math.random() * 900000)}`,
        activeStatusNote: 'Resting comfortably at home',
        safetyProfile: {
          safeZoneName: 'Primary Neighborhood Zone',
          safeZoneRadiusKm: 1.0,
          walkerNotes: 'Friendly, loves belly rubs and outdoor sniffing.',
          allowedTreats: 'Natural beef bites',
          allergies: 'None',
          dietaryNotes: 'Standard portion twice daily.',
        },
        emergencyContacts: [
          {
            name: signupName,
            role: 'Primary Parent',
            phone: signupPhone || '+1 (555) 0123',
            isPrimary: true,
          },
          {
            name: 'Oakwood Emergency Animal Hospital',
            role: '24/7 ER Clinic',
            phone: '+1 (555) 0192',
            is24_7Vet: true,
          },
        ],
        vaccinations: [
          {
            name: firstPetSpecies === 'Dog' ? 'DHPP Core Canine' : 'FVRCP Core Feline',
            validUntil: 'Nov 2026',
            status: 'Up to Date',
          },
          {
            name: 'Rabies Annual',
            validUntil: 'Aug 2026',
            status: 'Up to Date',
          },
        ],
      });
    }

    setShowAuthModal(null);
    setShowOnboarding(false);
    setShowSplash(false);
    setCurrentTab('home');
  };

  const onboardingSlides = [
    {
      title: 'Strictly Verified Caregivers',
      subtitle: 'Background-Checked & Insured',
      description:
        'Every dog walker, groomer, and veterinarian on PetCare undergoes rigorous background verification, clinical vetting, and identity screening.',
      icon: 'verified_user',
      badge: '100% Background-Vetted',
      color: 'bg-emerald-500/10 text-emerald-700',
      illustration: (
        <div className="w-full h-48 bg-gradient-to-br from-emerald-100/70 to-teal-50 rounded-2xl flex items-center justify-center p-6 border border-emerald-200/50">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-primary text-secondary-fixed flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-[36px]">shield</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface text-primary text-xs font-bold shadow-xs">
              <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
              <span>PetCare Guarantee Protected</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Real-Time Safe Zones & Radar',
      subtitle: 'Live Telemetry & Geofencing',
      description:
        'Define customized safety perimeters for walks. Track your pet in real time with sub-300ms GPS synchronization and sudden-stop alert sensors.',
      icon: 'radar',
      badge: 'Live Sub-Second GPS',
      color: 'bg-teal-500/10 text-teal-800',
      illustration: (
        <div className="w-full h-48 bg-gradient-to-br from-teal-100/80 to-emerald-50 rounded-2xl flex items-center justify-center p-6 border border-teal-200/50 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="w-44 h-44 rounded-full border-2 border-primary animate-ping" />
            <div className="w-32 h-32 rounded-full border-2 border-primary" />
          </div>
          <div className="relative z-10 flex flex-col items-center text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-primary text-secondary-fixed flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-[32px]">explore</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-bold">
              SAFE ZONE ACTIVE • 1.0 km
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'Unified Health & Microchip Dossier',
      subtitle: 'Digital Pet ID & Vax Alerts',
      description:
        'Digital Pet ID with scannable QR code, AKC Reunite microchip synchronization, automatic vaccination schedules, and direct emergency vet hotline access.',
      icon: 'badge',
      badge: 'AKC Reunite Integrated',
      color: 'bg-indigo-500/10 text-indigo-800',
      illustration: (
        <div className="w-full h-48 bg-gradient-to-br from-indigo-100/80 to-blue-50 rounded-2xl flex items-center justify-center p-6 border border-indigo-200/50">
          <div className="w-full max-w-xs bg-surface p-4 rounded-xl shadow-md border border-indigo-200 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">qr_code_2</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-primary truncate">Digital ID: Milo Miller</span>
              <span className="text-[10px] text-on-surface-variant truncate">AKC #98514100482910</span>
              <span className="text-[10px] text-secondary font-semibold mt-0.5">Vaccinations: Up to Date</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      {/* 1. SPLASH / BRAND INTRO SCREEN */}
      {showSplash && !showOnboarding && !showAuthModal && (
        <div className="w-full max-w-md bg-surface rounded-3xl shadow-2xl overflow-hidden border border-outline-variant/30 flex flex-col my-auto animate-in fade-in zoom-in duration-200">
          {/* Top Brand Banner */}
          <div className="bg-primary text-on-primary p-8 text-center relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-secondary-container/20 rounded-full blur-2xl" />
            <div className="relative z-10 flex flex-col items-center">
              {/* Green Paw Logo */}
              <div className="w-16 h-16 rounded-2xl bg-surface text-primary flex items-center justify-center shadow-xl mb-4">
                <svg className="w-10 h-10 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-4.5 1c-.83 0-1.5.67-1.5 1.5S6.67 14 7.5 14s1.5-.67 1.5-1.5S8.33 11 7.5 11zm9 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM12 15c-1.66 0-3 1.34-3 3 0 .7.26 1.34.69 1.83.39.44.93.73 1.54.84.25.04.51.06.77.06s.52-.02.77-.06c.61-.11 1.15-.4 1.54-.84.43-.49.69-1.13.69-1.83 0-1.66-1.34-3-3-3z"/>
                  <circle cx="8" cy="7" r="1.5" />
                  <circle cx="12" cy="5.5" r="1.5" />
                  <circle cx="16" cy="7" r="1.5" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold tracking-tight font-headline">PetCare</h1>
              <p className="text-xs text-primary-fixed mt-1 font-body">
                Premium Pet Care Marketplace &amp; Live GPS Safety Radar
              </p>
            </div>
          </div>

          {/* Intro Body */}
          <div className="p-6 space-y-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-surface-container-low border border-outline-variant/30">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-on-surface">Verified Caregiver Fleet</h4>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    Background-cleared dog walkers, certified DVM veterinarians, and groomers.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-surface-container-low border border-outline-variant/30">
                <div className="w-8 h-8 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[18px]">radar</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-on-surface">Geofenced Live Walk Radar</h4>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    Real-time distance-to-boundary metrics, potty logs, and sudden-stop detection.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => {
                  setShowSplash(false);
                  setShowOnboarding(true);
                }}
                className="w-full h-12 rounded-2xl bg-primary text-on-primary font-headline font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:bg-primary-container transition-all"
              >
                <span>Get Started &amp; Explore</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>

              <button
                onClick={() => {
                  setShowSplash(false);
                  setShowAuthModal('login');
                }}
                className="w-full h-11 rounded-2xl bg-surface-container text-primary font-headline font-semibold text-xs flex items-center justify-center gap-2 hover:bg-surface-container-high transition-colors"
              >
                <span>Sign In to Existing Account</span>
              </button>

              <button
                onClick={() => setShowSplash(false)}
                className="w-full text-center text-xs text-on-surface-variant hover:text-on-surface py-1 font-medium"
              >
                Continue directly as <strong className="text-primary">{user.name}</strong>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. ONBOARDING WALKTHROUGH CAROUSEL */}
      {showOnboarding && (
        <div className="w-full max-w-md bg-surface rounded-3xl shadow-2xl overflow-hidden border border-outline-variant/30 flex flex-col my-auto animate-in fade-in zoom-in duration-200">
          {/* Header with Skip */}
          <div className="px-6 pt-5 pb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[14px]">pets</span>
              </div>
              <span className="text-xs font-bold font-headline text-primary">PetCare Intro</span>
            </div>
            <button
              onClick={() => {
                setShowOnboarding(false);
                setShowSplash(false);
              }}
              className="text-xs font-semibold text-on-surface-variant hover:text-on-surface"
            >
              Skip
            </button>
          </div>

          {/* Current Slide Content */}
          <div className="p-6 space-y-5">
            {onboardingSlides[onboardingStep].illustration}

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary-container text-primary-fixed uppercase tracking-wider">
                  {onboardingSlides[onboardingStep].badge}
                </span>
                <span className="text-[10px] text-on-surface-variant font-medium">
                  Step {onboardingStep + 1} of {onboardingSlides.length}
                </span>
              </div>
              <h2 className="text-xl font-bold font-headline text-primary">
                {onboardingSlides[onboardingStep].title}
              </h2>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {onboardingSlides[onboardingStep].description}
              </p>
            </div>

            {/* Stepper Dots */}
            <div className="flex items-center gap-2 pt-2">
              {onboardingSlides.map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => setOnboardingStep(idx)}
                  className={`h-2 rounded-full cursor-pointer transition-all ${
                    idx === onboardingStep ? 'w-8 bg-primary' : 'w-2 bg-outline-variant/60'
                  }`}
                />
              ))}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center gap-3 pt-3">
              {onboardingStep > 0 && (
                <button
                  onClick={() => setOnboardingStep((prev) => prev - 1)}
                  className="h-11 px-4 rounded-xl bg-surface-container text-on-surface font-headline font-semibold text-xs"
                >
                  Back
                </button>
              )}

              {onboardingStep < onboardingSlides.length - 1 ? (
                <button
                  onClick={() => setOnboardingStep((prev) => prev + 1)}
                  className="flex-1 h-11 rounded-xl bg-primary text-on-primary font-headline font-semibold text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Next</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowOnboarding(false);
                    setShowAuthModal('signup');
                  }}
                  className="flex-1 h-11 rounded-xl bg-primary text-on-primary font-headline font-bold text-xs flex items-center justify-center gap-2 shadow-md"
                >
                  <span>Create Account &amp; Add Pet</span>
                  <span className="material-symbols-outlined text-[16px]">check</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. LOGIN MODAL */}
      {showAuthModal === 'login' && (
        <div className="w-full max-w-md bg-surface rounded-3xl shadow-2xl overflow-hidden border border-outline-variant/30 flex flex-col my-auto animate-in fade-in zoom-in duration-200">
          <div className="p-6 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-headline text-primary">Welcome Back</h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Sign in to manage your pets and active bookings
                </p>
              </div>
              <button
                onClick={() => setShowAuthModal(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Quick Demo Switcher */}
            <div className="bg-surface-container-low p-3 rounded-2xl border border-outline-variant/40 space-y-2">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">
                Quick Demo Accounts (1-Click)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin(false)}
                  className="p-2.5 rounded-xl bg-surface hover:bg-emerald-50 border border-outline-variant/40 text-left transition-colors flex items-center gap-2"
                >
                  <img
                    src={initialUser.avatar}
                    alt="Elena"
                    className="w-7 h-7 rounded-full object-cover shrink-0"
                  />
                  <div className="truncate">
                    <span className="text-xs font-bold text-primary block leading-none">Elena Miller</span>
                    <span className="text-[10px] text-on-surface-variant">Pet Owner</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin(true)}
                  className="p-2.5 rounded-xl bg-surface hover:bg-slate-100 border border-outline-variant/40 text-left transition-colors flex items-center gap-2"
                >
                  <div className="w-7 h-7 rounded-full bg-slate-900 text-emerald-400 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                  </div>
                  <div className="truncate">
                    <span className="text-xs font-bold text-slate-900 block leading-none">Marcus Vance</span>
                    <span className="text-[10px] text-on-surface-variant">Administrator</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              {loginError && (
                <div className="p-3 bg-error-container text-on-error-container text-xs rounded-xl font-medium">
                  {loginError}
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-on-surface block mb-1">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">
                    mail
                  </span>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-outline-variant bg-surface text-xs text-on-surface focus:outline-none focus:border-primary"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-on-surface">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowAuthModal('forgot')}
                    className="text-[11px] font-semibold text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">
                    lock
                  </span>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-outline-variant bg-surface text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-primary text-on-primary font-headline font-bold text-xs shadow-md hover:bg-primary-container transition-colors"
              >
                Sign In
              </button>

              {/* Biometric Face ID Simulation */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin(false)}
                className="w-full h-10 rounded-xl bg-surface-container text-primary font-headline font-semibold text-xs flex items-center justify-center gap-2 hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">fingerprint</span>
                <span>Sign in with Biometrics / Face ID</span>
              </button>
            </form>

            {/* Switch to Sign Up */}
            <div className="text-center pt-2 border-t border-outline-variant/30">
              <span className="text-xs text-on-surface-variant">Don't have an account? </span>
              <button
                type="button"
                onClick={() => setShowAuthModal('signup')}
                className="text-xs font-bold text-primary hover:underline"
              >
                Create one now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. SIGN UP MODAL */}
      {showAuthModal === 'signup' && (
        <div className="w-full max-w-md bg-surface rounded-3xl shadow-2xl overflow-hidden border border-outline-variant/30 flex flex-col my-auto animate-in fade-in zoom-in duration-200 max-h-[90vh]">
          <div className="p-6 space-y-4 overflow-y-auto no-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-headline text-primary">Join PetCare</h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Set up your owner profile and add your beloved pet
                </p>
              </div>
              <button
                onClick={() => setShowAuthModal(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-on-surface block mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jessica Adams"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-outline-variant bg-surface text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="jessica@mail.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-outline-variant bg-surface text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 0122"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-outline-variant bg-surface text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface block mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Create secure password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-outline-variant bg-surface text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              {/* Quick Pet Section */}
              <div className="p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/40 space-y-2.5">
                <div className="flex items-center gap-1.5 text-primary font-bold text-xs">
                  <span className="material-symbols-outlined text-[16px]">pets</span>
                  <span>Add Your First Pet</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFirstPetSpecies('Dog')}
                    className={`h-9 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                      firstPetSpecies === 'Dog'
                        ? 'bg-primary text-white border-primary shadow-xs'
                        : 'bg-surface text-on-surface-variant border-outline-variant/40'
                    }`}
                  >
                    <span>🐶</span>
                    <span>Dog</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFirstPetSpecies('Cat')}
                    className={`h-9 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                      firstPetSpecies === 'Cat'
                        ? 'bg-primary text-white border-primary shadow-xs'
                        : 'bg-surface text-on-surface-variant border-outline-variant/40'
                    }`}
                  >
                    <span>🐱</span>
                    <span>Cat</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Pet Name (e.g. Bella)"
                    value={firstPetName}
                    onChange={(e) => setFirstPetName(e.target.value)}
                    className="h-9 px-3 rounded-xl border border-outline-variant bg-surface text-xs text-on-surface focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Breed (e.g. Poodle)"
                    value={firstPetBreed}
                    onChange={(e) => setFirstPetBreed(e.target.value)}
                    className="h-9 px-3 rounded-xl border border-outline-variant bg-surface text-xs text-on-surface focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-primary text-on-primary font-headline font-bold text-xs shadow-md hover:bg-primary-container transition-colors"
              >
                Complete Registration
              </button>
            </form>

            {/* Switch to Login */}
            <div className="text-center pt-2 border-t border-outline-variant/30">
              <span className="text-xs text-on-surface-variant">Already have an account? </span>
              <button
                type="button"
                onClick={() => setShowAuthModal('login')}
                className="text-xs font-bold text-primary hover:underline"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. FORGOT PASSWORD MODAL */}
      {showAuthModal === 'forgot' && (
        <div className="w-full max-w-sm bg-surface rounded-3xl shadow-2xl overflow-hidden border border-outline-variant/30 flex flex-col my-auto animate-in fade-in zoom-in duration-200">
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold font-headline text-primary">Reset Password</h3>
              <button
                onClick={() => setShowAuthModal('login')}
                className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            {forgotSent ? (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
                <span className="material-symbols-outlined text-emerald-600 text-[32px]">mark_email_read</span>
                <h4 className="text-xs font-bold text-emerald-800">Password Reset Email Dispatched</h4>
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  We sent instructions to <strong>{forgotEmail || 'your email address'}</strong>. Click the link in the message to reset your credentials.
                </p>
                <button
                  onClick={() => setShowAuthModal('login')}
                  className="mt-2 w-full h-9 rounded-xl bg-primary text-white text-xs font-semibold"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-on-surface-variant">
                  Enter your registered PetCare account email. We'll send an authentication recovery link immediately.
                </p>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-outline-variant bg-surface text-xs text-on-surface"
                />
                <button
                  type="button"
                  onClick={() => setForgotSent(true)}
                  className="w-full h-10 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:bg-primary-container transition-colors"
                >
                  Send Recovery Link
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
