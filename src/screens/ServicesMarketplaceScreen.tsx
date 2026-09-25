import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ServiceCategory, Provider } from '../types/index.ts';

export const ServicesMarketplaceScreen: React.FC = () => {
  const {
    services,
    providers,
    reviews,
    setBookingServiceSlug,
    setCurrentTab,
    setSelectedProviderId,
    selectedProviderId,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'services' | 'providers'>('services');

  // Filter state for Provider Search
  const [maxRate, setMaxRate] = useState<number>(100);
  const [minRating, setMinRating] = useState<number>(4.5);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(true);
  const [selectedServiceDetail, setSelectedServiceDetail] = useState<ServiceCategory | null>(null);

  // Category filters
  const categories = [
    { id: 'all', label: 'All Services', icon: 'grid_view' },
    { id: 'dog-walking', label: 'Dog Walking', icon: 'directions_walk' },
    { id: 'grooming', label: 'Grooming', icon: 'content_cut' },
    { id: 'tele-vet', label: 'Tele-Vet', icon: 'video_call' },
    { id: 'home-vet', label: 'Home Vet', icon: 'home_health' },
    { id: 'boarding', label: 'Boarding', icon: 'apartment' },
    { id: 'training', label: 'Training', icon: 'sports_score' },
    { id: 'adoption', label: 'Adoption', icon: 'favorite' },
    { id: 'mating', label: 'Pet Mating', icon: 'diversity_1' },
  ];

  // Filtered Services
  const filteredServices = services.filter((srv) => {
    const matchesCat = activeCategory === 'all' || srv.slug === activeCategory;
    const matchesSearch =
      srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Filtered Providers
  const filteredProviders = providers.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.serviceTypes.some((st) => st.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRate = p.hourlyRate <= maxRate;
    const matchesRating = p.rating >= minRating;
    const matchesVerified = !verifiedOnly || p.verificationStatus === 'verified';
    return matchesSearch && matchesRate && matchesRating && matchesVerified;
  });

  // Active Selected Provider for Profile Modal
  const activeProvider = providers.find((p) => p.id === selectedProviderId) || null;

  const handleBookService = (slug: string, providerId?: string) => {
    setBookingServiceSlug(slug);
    if (providerId) {
      setSelectedProviderId(providerId);
    }
    setCurrentTab('service-booking');
  };

  return (
    <div className="pb-32 px-5 space-y-6 max-w-md mx-auto animate-in fade-in duration-200">
      {/* Title & View Switcher */}
      <div className="pt-2 flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-headline text-primary tracking-tight">
              Services &amp; Caregivers
            </h1>
            <p className="text-xs text-on-surface-variant mt-0.5 font-body">
              Discover verified pet-care specialists &amp; book instantly
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3.5 top-3 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={viewMode === 'services' ? 'Search services (walking, vet, grooming...)' : 'Search providers by name, skill...'}
            className="w-full h-11 pl-10 pr-4 rounded-2xl bg-surface-container-lowest border border-[#dde2f3] text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-outline hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[18px]">cancel</span>
            </button>
          )}
        </div>

        {/* View Toggle Tabs */}
        <div className="flex rounded-2xl bg-surface-container-high p-1 border border-outline-variant/30">
          <button
            onClick={() => setViewMode('services')}
            className={`flex-1 h-9 rounded-xl text-xs font-headline font-semibold flex items-center justify-center gap-1.5 transition-all ${
              viewMode === 'services'
                ? 'bg-surface text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">category</span>
            <span>All Services ({filteredServices.length})</span>
          </button>
          <button
            onClick={() => setViewMode('providers')}
            className={`flex-1 h-9 rounded-xl text-xs font-headline font-semibold flex items-center justify-center gap-1.5 transition-all ${
              viewMode === 'providers'
                ? 'bg-surface text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">badge</span>
            <span>Caregiver Directory ({filteredProviders.length})</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: SERVICES MARKETPLACE */}
      {viewMode === 'services' && (
        <div className="space-y-4">
          {/* Category Carousel Pills */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 py-1">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`h-9 px-3.5 rounded-full text-xs font-headline font-semibold shrink-0 flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Services List Grid */}
          <div className="space-y-3.5">
            {filteredServices.map((service) => {
              const matchedProviders = providers.filter((p) =>
                p.serviceTypes.some((st) => st.toLowerCase().includes(service.slug.replace('-', ' ')))
              );

              return (
                <div
                  key={service.id}
                  className="bg-surface-container-lowest rounded-3xl p-5 border border-[#dde2f3]/80 shadow-[0_4px_16px_rgba(26,32,44,0.03)] hover:border-primary/40 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-primary-container text-primary-fixed flex items-center justify-center shrink-0 shadow-xs">
                        <span className="material-symbols-outlined text-[26px]">{service.icon}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-headline font-bold text-base text-on-surface">
                            {service.name}
                          </h3>
                          {service.tag && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-error-container text-on-error-container">
                              {service.tag}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-secondary font-semibold flex items-center gap-1 mt-0.5">
                          <span className="material-symbols-outlined text-[14px]">verified</span>
                          <span>PetCare Safety Guaranteed</span>
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] text-on-surface-variant block">From</span>
                      <span className="font-headline font-bold text-lg text-primary">
                        ${service.startingPrice}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-on-surface-variant leading-relaxed font-body">
                    {service.description}
                  </p>

                  {/* Duration Options Chips */}
                  {service.durationOptions && service.durationOptions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {service.durationOptions.map((opt, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-xl bg-surface-container-low text-on-surface text-[11px] font-medium border border-outline-variant/30 flex items-center gap-1"
                        >
                          <span>{opt.label}</span>
                          <strong className="text-primary">${opt.price}</strong>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-surface-container-high">
                    <button
                      onClick={() => setSelectedServiceDetail(service)}
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      <span>Explore Details</span>
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </button>

                    <button
                      onClick={() => handleBookService(service.slug)}
                      className="h-9 px-4 rounded-xl bg-primary text-on-primary font-headline font-bold text-xs flex items-center gap-1.5 shadow-xs hover:bg-primary-container transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                      <span>Book Now</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: PROVIDER SEARCH & DIRECTORY */}
      {viewMode === 'providers' && (
        <div className="space-y-4">
          {/* Filter Bar Controls */}
          <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/40 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-on-surface">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">tune</span>
                <span>Filters</span>
              </span>
              <button
                onClick={() => {
                  setMaxRate(100);
                  setMinRating(4.5);
                  setVerifiedOnly(true);
                }}
                className="text-[11px] text-primary hover:underline font-normal"
              >
                Reset
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-on-surface-variant block mb-1">
                  Max Hourly: <strong className="text-on-surface">${maxRate}/hr</strong>
                </label>
                <input
                  type="range"
                  min="20"
                  max="120"
                  step="5"
                  value={maxRate}
                  onChange={(e) => setMaxRate(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div>
                <label className="text-[11px] text-on-surface-variant block mb-1">
                  Min Rating: <strong className="text-on-surface">{minRating}★+</strong>
                </label>
                <input
                  type="range"
                  min="4.0"
                  max="5.0"
                  step="0.1"
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-on-surface">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded text-primary focus:ring-primary w-4 h-4 accent-primary"
                />
                <span>PetCare Verified Caregivers Only</span>
              </label>
              <span className="text-[11px] text-on-surface-variant">{filteredProviders.length} available</span>
            </div>
          </div>

          {/* Providers List Cards */}
          <div className="space-y-3">
            {filteredProviders.map((prov) => (
              <div
                key={prov.id}
                className="bg-surface-container-lowest rounded-3xl p-4.5 border border-[#dde2f3] shadow-xs flex flex-col space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={prov.avatar}
                        alt={prov.name}
                        className="w-13 h-13 rounded-2xl object-cover ring-2 ring-primary/10"
                      />
                      {prov.verificationStatus === 'verified' && (
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-secondary text-white flex items-center justify-center shadow-xs">
                          <span className="material-symbols-outlined text-[13px]">check</span>
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-headline font-bold text-sm text-on-surface leading-tight">
                        {prov.name}
                      </h4>
                      <span className="text-xs text-on-surface-variant block">{prov.title}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="flex items-center text-xs font-bold text-primary">
                          <span className="material-symbols-outlined text-[15px] text-tertiary-fixed-dim mr-0.5">
                            star
                          </span>
                          {prov.rating}
                        </span>
                        <span className="text-[11px] text-on-surface-variant">
                          ({prov.reviewsCount} reviews)
                        </span>
                        <span className="text-[11px] text-on-surface-variant">• {prov.experienceYears}y exp</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-headline font-bold text-base text-primary block">
                      ${prov.hourlyRate}
                    </span>
                    <span className="text-[10px] text-on-surface-variant">per session</span>
                  </div>
                </div>

                <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                  {prov.bio}
                </p>

                {/* Specialties Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {prov.badges.map((badge, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-surface-container text-on-surface-variant text-[10px] font-medium"
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-surface-container-high">
                  <button
                    onClick={() => setSelectedProviderId(prov.id)}
                    className="flex-1 h-9 rounded-xl bg-surface-container text-on-surface font-headline font-semibold text-xs flex items-center justify-center gap-1 hover:bg-surface-container-high transition-colors"
                  >
                    <span>View Profile &amp; Reviews</span>
                  </button>

                  <button
                    onClick={() => handleBookService('dog-walking', prov.id)}
                    className="h-9 px-4 rounded-xl bg-primary text-on-primary font-headline font-bold text-xs flex items-center justify-center gap-1 shadow-xs hover:bg-primary-container transition-colors"
                  >
                    <span>Book</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 11. SERVICE DETAILS MODAL */}
      {selectedServiceDetail && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
          <div className="w-full max-w-md bg-surface rounded-t-3xl sm:rounded-3xl shadow-2xl border border-outline-variant/30 max-h-[88vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
            {/* Header */}
            <div className="p-5 border-b border-surface-container-high flex items-center justify-between shrink-0 bg-surface">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">{selectedServiceDetail.icon}</span>
                </div>
                <div>
                  <h3 className="text-base font-bold font-headline text-primary">
                    {selectedServiceDetail.name}
                  </h3>
                  <span className="text-[11px] text-secondary font-semibold">Verified Service Guarantee</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedServiceDetail(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-5 overflow-y-auto space-y-4 no-scrollbar">
              <div>
                <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-1">
                  Service Description
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {selectedServiceDetail.description}
                </p>
              </div>

              {/* Safety Features */}
              <div className="p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/30 space-y-2">
                <span className="text-xs font-bold text-primary block">Included Safety Innovations</span>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-on-surface-variant">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
                    <span>$1M Property &amp; Pet Insurance</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">radar</span>
                    <span>Live GPS Telemetry</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">local_hospital</span>
                    <span>24/7 ER Vet Hotline</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">photo_camera</span>
                    <span>Potty &amp; Hydration Photo Logs</span>
                  </span>
                </div>
              </div>

              {/* Duration & Pricing Tiers */}
              {selectedServiceDetail.durationOptions && (
                <div>
                  <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
                    Duration &amp; Tariff Options
                  </h4>
                  <div className="space-y-2">
                    {selectedServiceDetail.durationOptions.map((opt, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/30"
                      >
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px] text-primary">schedule</span>
                          <span className="text-xs font-semibold text-on-surface">{opt.label}</span>
                          {opt.isPopular && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-secondary-container text-on-secondary-container">
                              Most Popular
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-bold text-primary">${opt.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Customer Reviews Snippet */}
              <div>
                <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
                  Recent Verified Reviews
                </h4>
                <div className="space-y-2">
                  {reviews.slice(0, 2).map((rev) => (
                    <div
                      key={rev.id}
                      className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-on-surface">{rev.userName}</span>
                        <div className="flex items-center text-amber-500">
                          {'★'.repeat(rev.rating)}
                        </div>
                      </div>
                      <p className="text-on-surface-variant text-[11px] leading-relaxed">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Booking CTA */}
            <div className="p-4 border-t border-surface-container-high bg-surface shrink-0">
              <button
                onClick={() => {
                  const s = selectedServiceDetail;
                  setSelectedServiceDetail(null);
                  handleBookService(s.slug);
                }}
                className="w-full h-11 rounded-xl bg-primary text-on-primary font-headline font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:bg-primary-container transition-colors"
              >
                <span>Proceed to Book {selectedServiceDetail.name}</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 13. PROVIDER PROFILE MODAL */}
      {activeProvider && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
          <div className="w-full max-w-md bg-surface rounded-t-3xl sm:rounded-3xl shadow-2xl border border-outline-variant/30 max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
            {/* Header */}
            <div className="p-5 border-b border-surface-container-high flex items-center justify-between shrink-0 bg-surface">
              <div className="flex items-center gap-3">
                <img
                  src={activeProvider.avatar}
                  alt={activeProvider.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-primary/20"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold font-headline text-primary">
                      {activeProvider.name}
                    </h3>
                    <span className="material-symbols-outlined text-secondary text-[16px]">
                      verified
                    </span>
                  </div>
                  <span className="text-xs text-on-surface-variant">{activeProvider.title}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedProviderId(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Scrollable Details */}
            <div className="p-5 overflow-y-auto space-y-4 no-scrollbar">
              {/* Verification & Background Pill */}
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">shield</span>
                </div>
                <div className="text-[11px] text-emerald-900 leading-snug">
                  <strong className="block font-bold">100% Background Check Cleared</strong>
                  Identity verified, insured, and certified in animal first aid CPR.
                </div>
              </div>

              {/* Bio & Experience */}
              <div>
                <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-1">
                  About Caregiver
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {activeProvider.bio}
                </p>
              </div>

              {/* Rating & Stats Strip */}
              <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-2xl bg-surface-container-low border border-outline-variant/30">
                <div>
                  <span className="text-sm font-bold text-primary flex items-center justify-center gap-0.5">
                    <span className="material-symbols-outlined text-[16px] text-tertiary-fixed-dim">
                      star
                    </span>
                    {activeProvider.rating}
                  </span>
                  <span className="text-[10px] text-on-surface-variant">Rating</span>
                </div>
                <div>
                  <span className="text-sm font-bold text-primary">{activeProvider.reviewsCount}</span>
                  <span className="text-[10px] text-on-surface-variant">Walks / Bookings</span>
                </div>
                <div>
                  <span className="text-sm font-bold text-primary">{activeProvider.experienceYears} Years</span>
                  <span className="text-[10px] text-on-surface-variant">Experience</span>
                </div>
              </div>

              {/* Services Offered */}
              <div>
                <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                  Services Offered
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeProvider.serviceTypes.map((st, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-xl bg-surface-container text-xs font-medium text-primary border border-outline-variant/30"
                    >
                      {st}
                    </span>
                  ))}
                </div>
              </div>

              {/* Weekly Availability */}
              <div>
                <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                  Typical Weekly Availability
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeProvider.availability.map((day, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-surface-container-low text-[11px] font-semibold text-on-surface border border-outline-variant/40"
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reviews List */}
              <div>
                <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
                  Customer Testimonials
                </h4>
                <div className="space-y-2">
                  {reviews
                    .filter((r) => r.providerId === activeProvider.id || r.providerName?.includes(activeProvider.name))
                    .map((r) => (
                      <div
                        key={r.id}
                        className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-on-surface">{r.userName}</span>
                          <span className="text-amber-500 font-bold">★ {r.rating}</span>
                        </div>
                        <p className="text-on-surface-variant text-[11px] leading-relaxed">"{r.comment}"</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-surface-container-high bg-surface shrink-0 flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedProviderId(null);
                  setCurrentTab('messages');
                }}
                className="h-11 px-3.5 rounded-xl bg-surface-container text-primary font-headline font-semibold text-xs flex items-center justify-center gap-1 hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>Message</span>
              </button>

              <button
                onClick={() => {
                  const pId = activeProvider.id;
                  setSelectedProviderId(null);
                  handleBookService('dog-walking', pId);
                }}
                className="flex-1 h-11 rounded-xl bg-primary text-on-primary font-headline font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:bg-primary-container transition-colors"
              >
                <span>Book with {activeProvider.name.split(' ')[0]} (${activeProvider.hourlyRate})</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
