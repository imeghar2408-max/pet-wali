import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Provider, Pet } from '../types/index.ts';

export const BookingScreen: React.FC = () => {
  const {
    activePet,
    setActivePet,
    pets,
    providers,
    createBooking,
    setCurrentTab,
    bookingServiceSlug,
    setBookingServiceSlug,
    services,
    selectedProviderId,
    setSelectedProviderId,
  } = useApp();

  // Step state: 1: Pet -> 2: Provider -> 3: Schedule & Duration -> 4: Safe Zone -> 5: Review & Payment -> 6: Confirmation
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Selected pet (defaults to activePet)
  const [chosenPet, setChosenPet] = useState<Pet>(activePet);

  // Selected Provider
  const availableProviders = providers.filter((p) =>
    p.serviceTypes.some(
      (st) =>
        st.toLowerCase().includes(bookingServiceSlug.replace('-', ' ')) ||
        bookingServiceSlug.includes(st.toLowerCase().replace(' ', '-'))
    )
  );
  const defaultProvider =
    providers.find((p) => p.id === selectedProviderId) ||
    availableProviders[0] ||
    providers[0];
  const [chosenProvider, setChosenProvider] = useState<Provider>(defaultProvider);

  // Schedule & Duration
  const [selectedDuration, setSelectedDuration] = useState<{ min: number; priceMultiplier: number }>({
    min: 45,
    priceMultiplier: 1,
  });
  const [selectedDate, setSelectedDate] = useState<string>('Tomorrow, Oct 25');
  const [selectedTime, setSelectedTime] = useState<string>('11:00 AM');

  // Safe Zone (for walking) or Location Notes
  const [startingLocation, setStartingLocation] = useState<string>('742 Evergreen Terrace, Oakwood Park');
  const [radiusKm, setRadiusKm] = useState<number>(1.0);
  const [radiusDesc, setRadiusDesc] = useState<string>('1.0 km (Neighborhood)');
  const [alertOnExit, setAlertOnExit] = useState<boolean>(true);
  const [accidentDetection, setAccidentDetection] = useState<boolean>(true);
  const [pottyPhotoLogs, setPottyPhotoLogs] = useState<boolean>(true);

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'apple_pay' | 'visa' | 'wallet'>('apple_pay');
  const [promoCode, setPromoCode] = useState<string>('');
  const [promoApplied, setPromoApplied] = useState<boolean>(false);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  // Confirmation state
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const currentService = services.find((s) => s.slug === bookingServiceSlug) || services[0];
  const isWalking = bookingServiceSlug === 'dog-walking';

  // Fee calculation
  const baseRate = chosenProvider ? chosenProvider.hourlyRate : 35;
  const calculatedBaseFee = Math.round((baseRate * (selectedDuration.min / 60)) * 10) / 10;
  const safetyFee = 2.5;
  const discount = promoApplied ? 5.0 : 0;
  const totalAmount = Math.max(0, calculatedBaseFee + safetyFee - discount);

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1 && currentStep < 6) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirmAndPay = async () => {
    setIsProcessing(true);
    try {
      const newBooking = await createBooking({
        petId: chosenPet.id,
        providerId: chosenProvider.id,
        serviceId: currentService.id,
        serviceName: `${currentService.name} (${selectedDuration.min} min with ${chosenProvider.name.split(' ')[0]})`,
        date: selectedDate,
        time: selectedTime,
        durationMinutes: selectedDuration.min,
        baseFee: calculatedBaseFee,
        safetyFee,
        totalAmount,
        status: 'Confirmed',
        specialInstructions: specialInstructions || undefined,
        safeZoneConfig: isWalking
          ? {
              id: `sz_${Date.now()}`,
              petId: chosenPet.id,
              centerAddress: startingLocation,
              centerCoords: { lat: 37.7749, lng: -122.4194 },
              radiusMeters: radiusKm * 1000,
              radiusLabel: radiusDesc,
              alertOnExit,
              accidentDetection,
              pottyPhotoLogs,
            }
          : undefined,
      });

      setConfirmedBookingId(newBooking.id);
      setCurrentStep(6); // Step 6: Confirmation Screen
    } finally {
      setIsProcessing(false);
    }
  };

  const ringSizePx = radiusKm === 0.5 ? 120 : radiusKm === 1.0 ? 160 : 200;

  // STEP 6: DEDICATED BOOKING CONFIRMATION SCREEN (Screen 15)
  if (currentStep === 6) {
    return (
      <div className="flex flex-col w-full max-w-md mx-auto px-5 pb-28 pt-4 space-y-5 animate-in fade-in zoom-in duration-300">
        {/* Celebratory Success Banner */}
        <div className="text-center space-y-3 pt-4">
          <div className="relative mx-auto w-20 h-20 rounded-3xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-lg ring-8 ring-secondary-container/40">
            <span className="material-symbols-outlined text-[44px] text-secondary">
              verified
            </span>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-secondary text-white flex items-center justify-center text-xs font-bold shadow-md">
              ✓
            </div>
          </div>

          <div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-headline text-[11px] font-bold uppercase tracking-wider">
              Booking Confirmed &amp; Protected
            </span>
            <h1 className="font-headline font-bold text-2xl text-primary mt-2">
              You&apos;re All Set!
            </h1>
            <p className="text-xs text-on-surface-variant max-w-xs mx-auto mt-1">
              Your appointment is secured. {chosenProvider.name.split(' ')[0]} has accepted and received {chosenPet.name}&apos;s profile.
            </p>
          </div>
        </div>

        {/* Confirmation Dossier Card */}
        <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-[0_12px_32px_-4px_rgba(30,75,56,0.08)] border border-[#dde2f3]/60 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-container-high/60">
            <div>
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                Booking Reference
              </span>
              <p className="font-mono text-xs font-bold text-primary">
                {confirmedBookingId || '#PC-84920'}
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-secondary-container/60 text-secondary text-xs font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              Active Shield
            </span>
          </div>

          {/* Pet & Provider Summary */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-surface-container-low">
            <div className="flex items-center gap-2.5">
              <img
                src={chosenPet.photoUrl}
                alt={chosenPet.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
              />
              <div className="min-w-0">
                <span className="text-[10px] text-on-surface-variant uppercase font-semibold">Pet</span>
                <p className="font-headline text-xs font-bold text-on-surface truncate">
                  {chosenPet.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <img
                src={chosenProvider.avatar}
                alt={chosenProvider.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-secondary/20"
              />
              <div className="min-w-0">
                <span className="text-[10px] text-on-surface-variant uppercase font-semibold">Specialist</span>
                <p className="font-headline text-xs font-bold text-on-surface truncate">
                  {chosenProvider.name}
                </p>
              </div>
            </div>
          </div>

          {/* Time & Location Details */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-surface-container-high/40">
              <span className="text-on-surface-variant flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-secondary">event</span>
                Date &amp; Time:
              </span>
              <span className="font-semibold text-on-surface">
                {selectedDate} • {selectedTime}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-surface-container-high/40">
              <span className="text-on-surface-variant flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-secondary">timelapse</span>
                Duration:
              </span>
              <span className="font-semibold text-on-surface">{selectedDuration.min} Minutes</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-surface-container-high/40">
              <span className="text-on-surface-variant flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-secondary">place</span>
                Location:
              </span>
              <span className="font-semibold text-on-surface truncate max-w-[180px]">
                {startingLocation}
              </span>
            </div>

            {isWalking && (
              <div className="flex items-center justify-between py-1 border-b border-surface-container-high/40">
                <span className="text-on-surface-variant flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-secondary">shield</span>
                  Safe Zone:
                </span>
                <span className="font-semibold text-secondary">{radiusDesc}</span>
              </div>
            )}

            <div className="flex items-center justify-between py-1.5 text-sm font-bold text-primary">
              <span>Total Paid:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Safety Guarantee Tag */}
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-secondary-container/30 text-secondary text-xs font-medium">
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span>$5,000 Emergency Vet &amp; GPS Telemetry Included</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          {isWalking && (
            <button
              onClick={() => setCurrentTab('live-walk')}
              className="w-full h-12 rounded-2xl bg-secondary text-on-secondary font-headline font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:opacity-95 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">explore</span>
              <span>Open Live GPS Walk Radar</span>
            </button>
          )}

          <button
            onClick={() => setCurrentTab('bookings')}
            className="w-full h-12 rounded-2xl bg-primary text-on-primary font-headline font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:opacity-95 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">calendar_month</span>
            <span>View in My Bookings</span>
          </button>

          <button
            onClick={() => {
              setCurrentStep(1);
              setCurrentTab('home');
            }}
            className="w-full h-11 rounded-2xl bg-surface-container text-on-surface font-headline font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
            <span>Return to Home</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-5 pb-28 pt-2 space-y-4">
      {/* Top Header & Service Chips */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline font-bold text-2xl text-primary tracking-tight">
              Book {currentService.name}
            </h1>
            <p className="text-xs text-on-surface-variant font-body">
              Step-by-step reservation with real-time safety protocols
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-secondary-container text-secondary text-xs font-bold">
            Step {currentStep} of 5
          </span>
        </div>

        {/* Service Switcher Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-5 px-5 no-scrollbar">
          {services.map((s) => (
            <button
              key={s.id}
              onClick={() => setBookingServiceSlug(s.slug)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                bookingServiceSlug === s.slug
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low border border-surface-container-high'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* Step Progress Stepper */}
        <div className="grid grid-cols-5 gap-1.5 pt-1">
          {[
            { num: 1, label: 'Pet' },
            { num: 2, label: 'Specialist' },
            { num: 3, label: 'Schedule' },
            { num: 4, label: isWalking ? 'Safe Zone' : 'Details' },
            { num: 5, label: 'Payment' },
          ].map((s) => {
            const isDone = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <button
                key={s.num}
                onClick={() => setCurrentStep(s.num)}
                className={`flex flex-col items-center gap-1 py-1 rounded-xl transition-all ${
                  isCurrent
                    ? 'text-primary font-bold'
                    : isDone
                    ? 'text-secondary font-semibold'
                    : 'text-outline font-medium opacity-60'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                    isCurrent
                      ? 'bg-primary text-white shadow-xs'
                      : isDone
                      ? 'bg-secondary text-white'
                      : 'bg-surface-container text-outline'
                  }`}
                >
                  {isDone ? '✓' : s.num}
                </div>
                <span className="text-[10px] leading-none truncate">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 1: SELECT PET */}
      {currentStep === 1 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h2 className="font-headline font-bold text-base text-primary">
              1. Select Pet for Service
            </h2>
            <span className="text-xs text-on-surface-variant">
              {pets.length} pets registered
            </span>
          </div>

          <div className="space-y-2.5">
            {pets.map((p) => {
              const isSelected = chosenPet.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    setChosenPet(p);
                    setActivePet(p);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-surface-container-lowest border-primary shadow-sm ring-2 ring-primary/20'
                      : 'bg-surface-container-lowest border-[#dde2f3] hover:bg-surface-container-low'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={p.photoUrl}
                        alt={p.name}
                        className="w-14 h-14 rounded-2xl object-cover shadow-xs"
                      />
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-secondary ring-2 ring-white flex items-center justify-center text-[10px] text-white font-bold">
                        ✓
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-headline font-bold text-sm text-on-surface">
                          {p.name}
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary-container/60 text-secondary font-bold">
                          {p.healthStatus}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        {p.breed} • {p.gender} • {p.weightKg} kg
                      </p>
                      <p className="text-[11px] text-outline mt-0.5 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px] text-secondary">
                          medical_services
                        </span>
                        Microchip #{p.microchipId}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? 'border-primary bg-primary text-white'
                        : 'border-outline-variant bg-surface'
                    }`}
                  >
                    {isSelected && <span className="material-symbols-outlined text-[16px]">check</span>}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleNextStep}
            className="w-full h-12 rounded-2xl bg-primary text-on-primary font-headline font-bold text-sm flex items-center justify-center gap-1 shadow-md hover:opacity-95 active:scale-95 transition-all mt-4"
          >
            <span>Continue to Specialist</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      )}

      {/* STEP 2: SELECT PROVIDER */}
      {currentStep === 2 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline font-bold text-base text-primary">
                2. Select Verified Specialist
              </h2>
              <p className="text-xs text-on-surface-variant">
                Screened &amp; background-checked professionals
              </p>
            </div>
            <span className="text-xs text-secondary font-bold flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[14px]">shield</span>
              100% Verified
            </span>
          </div>

          <div className="space-y-3">
            {(availableProviders.length > 0 ? availableProviders : providers).map((prov) => {
              const isSelected = chosenProvider.id === prov.id;
              return (
                <div
                  key={prov.id}
                  onClick={() => {
                    setChosenProvider(prov);
                    setSelectedProviderId(prov.id);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2.5 ${
                    isSelected
                      ? 'bg-surface-container-lowest border-primary shadow-sm ring-2 ring-primary/20'
                      : 'bg-surface-container-lowest border-[#dde2f3] hover:bg-surface-container-low'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={prov.avatar}
                          alt={prov.name}
                          className="w-12 h-12 rounded-xl object-cover shadow-xs"
                        />
                        <span className="absolute -bottom-1 -right-1 bg-primary text-white p-0.5 rounded-full flex items-center justify-center shadow-xs">
                          <span className="material-symbols-outlined text-[12px]">shield</span>
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-headline font-bold text-sm text-on-surface">
                            {prov.name}
                          </h3>
                          <span className="text-[10px] text-secondary font-bold">
                            ★ {prov.rating}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant">{prov.title}</p>
                        <p className="text-[11px] text-outline">
                          {prov.experienceYears} yrs exp • {prov.reviewsCount} verified jobs
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-headline font-bold text-sm text-primary">
                        ${prov.hourlyRate}
                      </span>
                      <span className="text-[10px] text-on-surface-variant block">/hour</span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1">
                    {prov.badges.map((b) => (
                      <span
                        key={b}
                        className="px-2 py-0.5 rounded-md bg-surface-container-low text-[10px] font-medium text-on-surface-variant"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handlePrevStep}
              className="h-12 px-4 rounded-2xl bg-surface-container text-on-surface font-semibold text-xs flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Back</span>
            </button>
            <button
              onClick={handleNextStep}
              className="flex-1 h-12 rounded-2xl bg-primary text-on-primary font-headline font-bold text-sm flex items-center justify-center gap-1 shadow-md hover:opacity-95 active:scale-95 transition-all"
            >
              <span>Continue to Schedule</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SCHEDULE & DURATION */}
      {currentStep === 3 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div>
            <h2 className="font-headline font-bold text-base text-primary">
              3. Date, Time &amp; Duration
            </h2>
            <p className="text-xs text-on-surface-variant">
              Choose your ideal time slot for {chosenPet.name}
            </p>
          </div>

          {/* Duration Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface uppercase tracking-wider block">
              Session Duration
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { min: 30, mult: 0.67, label: '30 min', sub: 'Quick Relief' },
                { min: 45, mult: 1, label: '45 min', sub: 'Standard Walk', popular: true },
                { min: 60, mult: 1.33, label: '60 min', sub: 'Active Cardio' },
              ].map((dur) => {
                const isSelected = selectedDuration.min === dur.min;
                const durPrice = Math.round(chosenProvider.hourlyRate * dur.mult);
                return (
                  <button
                    key={dur.min}
                    type="button"
                    onClick={() => setSelectedDuration({ min: dur.min, priceMultiplier: dur.mult })}
                    className={`relative p-2.5 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-sm scale-[1.02]'
                        : 'bg-surface-container-lowest border-[#dde2f3] text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    {dur.popular && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.2 rounded-full bg-secondary text-white text-[9px] font-bold uppercase shadow-xs">
                        Popular
                      </span>
                    )}
                    <span className="block font-headline font-bold text-sm">{dur.label}</span>
                    <span className={`text-[10px] block ${isSelected ? 'text-primary-fixed' : 'text-on-surface-variant'}`}>
                      {dur.sub}
                    </span>
                    <span className={`text-xs font-bold mt-1 block ${isSelected ? 'text-white' : 'text-primary'}`}>
                      ${durPrice}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface uppercase tracking-wider block">
              Select Date
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Today', date: 'Today, Oct 24' },
                { label: 'Tomorrow', date: 'Tomorrow, Oct 25' },
                { label: 'Saturday', date: 'Sat, Oct 26' },
              ].map((d) => {
                const isSelected = selectedDate === d.date;
                return (
                  <button
                    key={d.date}
                    type="button"
                    onClick={() => setSelectedDate(d.date)}
                    className={`p-2.5 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? 'bg-primary-container text-on-primary-container border-primary font-bold shadow-xs'
                        : 'bg-surface-container-lowest border-[#dde2f3] text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    <span className="text-[10px] uppercase tracking-wide block opacity-70">
                      {d.label}
                    </span>
                    <span className="font-headline text-xs font-bold block mt-0.5">
                      {d.date.split(', ')[1]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface uppercase tracking-wider block">
              Select Start Time
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['08:30 AM', '11:00 AM', '03:00 PM', '05:30 PM'].map((t) => {
                const isSelected = selectedTime === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTime(t)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-xs'
                        : 'bg-surface-container-lowest border-[#dde2f3] text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handlePrevStep}
              className="h-12 px-4 rounded-2xl bg-surface-container text-on-surface font-semibold text-xs flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Back</span>
            </button>
            <button
              onClick={handleNextStep}
              className="flex-1 h-12 rounded-2xl bg-primary text-on-primary font-headline font-bold text-sm flex items-center justify-center gap-1 shadow-md hover:opacity-95 active:scale-95 transition-all"
            >
              <span>Continue to Safe Zone</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: SAFE ZONE / SERVICE DETAILS */}
      {currentStep === 4 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-[22px]">
                security
              </span>
              <h2 className="font-headline font-bold text-base text-primary">
                4. {isWalking ? 'Safe Zone Geofence & Starting Base' : 'Service Location & Instructions'}
              </h2>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {isWalking
                ? 'Define permitted boundary perimeter. Instant alerts if boundary is breached.'
                : 'Confirm pickup address and special care notes.'}
            </p>
          </div>

          {/* Starting Location Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface uppercase tracking-wider block">
              Pickup &amp; Starting Address
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-3 text-secondary text-[20px]">
                home_pin
              </span>
              <input
                type="text"
                value={startingLocation}
                onChange={(e) => setStartingLocation(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-2xl bg-surface-container-lowest border border-[#dde2f3] text-xs text-on-surface font-medium focus:outline-primary shadow-xs"
              />
            </div>
          </div>

          {isWalking && (
            <>
              {/* Interactive Geofence Map Visualizer */}
              <div className="relative w-full h-52 rounded-2xl overflow-hidden shadow-inner bg-[#dde2f3]/70">
                <div className="w-full h-full bg-[#f1f3ff] relative">
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    fill="none"
                    viewBox="0 0 360 208"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M-10 60 H370" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" />
                    <path d="M-10 140 H370" stroke="#ffffff" strokeWidth="14" strokeLinecap="round" />
                    <path d="M120 -10 V218" stroke="#ffffff" strokeWidth="14" strokeLinecap="round" />
                    <path d="M250 -10 V218" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" />
                    <circle cx="180" cy="104" r="80" fill="#bdedd3" fillOpacity="0.35" />
                  </svg>
                </div>

                {/* Animated Geofence Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div
                    className="absolute rounded-full bg-secondary-fixed/30 animate-ping opacity-60 transition-all duration-300"
                    style={{ width: `${ringSizePx + 20}px`, height: `${ringSizePx + 20}px` }}
                  />
                  <div
                    className="relative rounded-full bg-secondary/15 border-2 border-secondary flex items-center justify-center transition-all duration-300"
                    style={{ width: `${ringSizePx}px`, height: `${ringSizePx}px` }}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg">
                      <span className="material-symbols-outlined text-[16px]">home_pin</span>
                    </div>
                    <div className="absolute -top-3 right-2 bg-surface-container-lowest text-on-surface py-0.5 px-2 rounded-full shadow-md flex items-center gap-1 border border-secondary/20">
                      <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                      <span className="font-headline text-[9px] font-bold text-primary">Walker GPS</span>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-2 left-2 right-2 p-2 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md shadow-sm flex items-center justify-between border border-white/60">
                  <span className="text-[11px] font-bold text-primary truncate">
                    Safe Boundary: {radiusDesc}
                  </span>
                  <span className="px-2 py-0.5 bg-secondary text-white rounded text-[10px] font-bold">
                    GPS Active
                  </span>
                </div>
              </div>

              {/* Radius Selector Pills */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-on-surface">Permitted Radius</label>
                  <span className="text-secondary font-bold">{radiusDesc}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { km: 0.5, label: '500m', desc: '500m (Close proximity)' },
                    { km: 1.0, label: '1.0 km', desc: '1.0 km (Neighborhood)' },
                    { km: 2.0, label: '2.0 km', desc: '2.0 km (Trail & Park)' },
                  ].map((r) => {
                    const isSelected = radiusKm === r.km;
                    return (
                      <button
                        key={r.km}
                        type="button"
                        onClick={() => {
                          setRadiusKm(r.km);
                          setRadiusDesc(r.desc);
                        }}
                        className={`py-2 rounded-xl text-center border transition-all ${
                          isSelected
                            ? 'bg-primary text-white border-primary shadow-xs font-bold'
                            : 'bg-surface-container-lowest border-[#dde2f3] text-on-surface hover:bg-surface-container-low'
                        }`}
                      >
                        <span className="block font-headline text-xs font-bold">{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Safety Toggles */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[18px]">
                      emergency_share
                    </span>
                    <span className="text-xs font-bold text-on-surface">Alert if walker exits safe zone</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAlertOnExit(!alertOnExit)}
                    className={`w-10 h-5 rounded-full p-0.5 transition-colors relative ${
                      alertOnExit ? 'bg-secondary' : 'bg-outline-variant'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        alertOnExit ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[18px]">
                      motion_sensor_active
                    </span>
                    <span className="text-xs font-bold text-on-surface">Fall &amp; accident detection</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAccidentDetection(!accidentDetection)}
                    className={`w-10 h-5 rounded-full p-0.5 transition-colors relative ${
                      accidentDetection ? 'bg-secondary' : 'bg-outline-variant'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        accidentDetection ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Care Instructions Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface block">
              Special Care Instructions for {chosenProvider.name.split(' ')[0]}
            </label>
            <textarea
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder={`e.g. ${chosenPet.name} loves fetch, keep away from squirrels, treats in backpack...`}
              className="w-full text-xs p-3 rounded-2xl border border-[#dde2f3] bg-surface-container-lowest focus:outline-primary"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handlePrevStep}
              className="h-12 px-4 rounded-2xl bg-surface-container text-on-surface font-semibold text-xs flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Back</span>
            </button>
            <button
              onClick={handleNextStep}
              className="flex-1 h-12 rounded-2xl bg-primary text-on-primary font-headline font-bold text-sm flex items-center justify-center gap-1 shadow-md hover:opacity-95 active:scale-95 transition-all"
            >
              <span>Continue to Review &amp; Pay</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: REVIEW & PAYMENT */}
      {currentStep === 5 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div>
            <h2 className="font-headline font-bold text-base text-primary">
              5. Review &amp; Payment
            </h2>
            <p className="text-xs text-on-surface-variant">
              Final summary protected by the PetCare 100% Safety Guarantee
            </p>
          </div>

          {/* Booking Summary Box */}
          <div className="bg-surface-container-lowest rounded-2xl p-4 border border-[#dde2f3] space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container-high/60">
              <div className="flex items-center gap-2.5">
                <img
                  src={chosenPet.photoUrl}
                  alt={chosenPet.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/20"
                />
                <div>
                  <h4 className="font-headline font-bold text-xs text-on-surface">
                    {chosenPet.name} ({chosenPet.breed})
                  </h4>
                  <p className="text-[11px] text-on-surface-variant">
                    {currentService.name} • {selectedDuration.min} min
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-primary">${calculatedBaseFee.toFixed(2)}</span>
            </div>

            <div className="space-y-1.5 text-xs text-on-surface-variant">
              <div className="flex justify-between">
                <span>Specialist:</span>
                <span className="font-semibold text-on-surface">{chosenProvider.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Schedule:</span>
                <span className="font-semibold text-on-surface">{selectedDate} @ {selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span>Base Service Fee:</span>
                <span className="font-semibold text-on-surface">${calculatedBaseFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  PetCare Safety Guarantee:
                  <span className="material-symbols-outlined text-[14px] text-secondary">
                    verified
                  </span>
                </span>
                <span className="font-semibold text-on-surface">${safetyFee.toFixed(2)}</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-secondary font-semibold">
                  <span>Welcome Promo Discount:</span>
                  <span>-$5.00</span>
                </div>
              )}
              <div className="pt-2 border-t border-surface-container-high flex justify-between items-center text-sm font-bold text-primary">
                <span>Total Due:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface uppercase tracking-wider block">
              Payment Method
            </label>

            <div className="space-y-2">
              {[
                {
                  id: 'apple_pay',
                  name: 'Apple Pay',
                  sub: 'Default • Instant & Encrypted',
                  icon: 'phone_iphone',
                },
                {
                  id: 'visa',
                  name: 'Visa ending in 4242',
                  sub: 'Expires 08/28',
                  icon: 'credit_card',
                },
                {
                  id: 'wallet',
                  name: 'PetCare Wallet',
                  sub: 'Balance: $145.00 available',
                  icon: 'account_balance_wallet',
                },
              ].map((method) => {
                const isSelected = paymentMethod === method.id;
                return (
                  <div
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-surface-container-lowest border-primary shadow-xs ring-2 ring-primary/20'
                        : 'bg-surface-container-lowest border-[#dde2f3] hover:bg-surface-container-low'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[18px]">{method.icon}</span>
                      </div>
                      <div>
                        <p className="font-headline font-bold text-xs text-on-surface">
                          {method.name}
                        </p>
                        <p className="text-[10px] text-on-surface-variant">{method.sub}</p>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'border-primary bg-primary text-white'
                          : 'border-outline-variant bg-surface'
                      }`}
                    >
                      {isSelected && <span className="material-symbols-outlined text-[14px]">check</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Promo Code Input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Promo code (try 'PETLOVE')"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 h-10 px-3 rounded-xl border border-[#dde2f3] text-xs bg-surface-container-lowest focus:outline-primary"
            />
            <button
              type="button"
              onClick={() => {
                if (promoCode.trim().toUpperCase() === 'PETLOVE' || promoCode.trim().length > 2) {
                  setPromoApplied(true);
                }
              }}
              className="px-4 h-10 rounded-xl bg-surface-container-low text-primary text-xs font-bold hover:bg-surface-container"
            >
              {promoApplied ? 'Applied ✓' : 'Apply'}
            </button>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handlePrevStep}
              className="h-12 px-4 rounded-2xl bg-surface-container text-on-surface font-semibold text-xs flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Back</span>
            </button>
            <button
              onClick={handleConfirmAndPay}
              disabled={isProcessing}
              className="flex-1 h-12 rounded-2xl bg-primary text-on-primary font-headline font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:opacity-95 active:scale-95 transition-all"
            >
              {isProcessing ? (
                <span>Securing Booking...</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                  <span>Pay ${totalAmount.toFixed(2)} &amp; Confirm</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
