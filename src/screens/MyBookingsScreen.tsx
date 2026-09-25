import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Booking } from '../types/index.ts';

export const MyBookingsScreen: React.FC = () => {
  const {
    bookings,
    cancelBooking,
    setCurrentTab,
    setBookingServiceSlug,
    setReviewModalBooking,
    getReportForBooking,
    openReportModal,
  } = useApp();
  const [filter, setFilter] = useState<'All' | 'Upcoming' | 'Active' | 'Completed' | 'Cancelled'>('All');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('');
  const [showCancelPrompt, setShowCancelPrompt] = useState<boolean>(false);

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'All') return true;
    if (filter === 'Upcoming') return b.status === 'Confirmed' || b.status === 'Pending';
    if (filter === 'Active') return b.status === 'Active';
    if (filter === 'Completed') return b.status === 'Completed';
    if (filter === 'Cancelled') return b.status === 'Cancelled';
    return true;
  });

  const handleConfirmCancel = async () => {
    if (!selectedBooking) return;
    await cancelBooking(selectedBooking.id, cancelReason || 'Cancelled by user request');
    setShowCancelPrompt(false);
    setSelectedBooking(null);
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-5 pb-28 pt-2 space-y-4">
      {/* Title & Filter Tabs */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline font-bold text-headline-lg text-primary tracking-tight">
            My Bookings
          </h1>
          <p className="text-xs text-on-surface-variant">
            {bookings.length} reservations &amp; service logs
          </p>
        </div>
        <button
          onClick={() => {
            setBookingServiceSlug('dog-walking');
            setCurrentTab('service-booking');
          }}
          className="px-3 py-1.5 rounded-full bg-primary text-on-primary text-xs font-semibold flex items-center gap-1 shadow-xs"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>New</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-5 px-5 no-scrollbar">
        {(['All', 'Active', 'Upcoming', 'Completed', 'Cancelled'] as const).map((tab) => {
          const isSelected = filter === tab;
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-primary-container text-on-primary shadow-xs'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low border border-surface-container-high'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Bookings List */}
      <div className="space-y-3">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12 bg-surface-container-lowest rounded-2xl border border-surface-container-high p-6">
            <span className="material-symbols-outlined text-[36px] text-outline-variant mb-2">
              event_busy
            </span>
            <p className="font-headline font-bold text-sm text-on-surface">No bookings in this tab</p>
            <p className="text-xs text-on-surface-variant mt-1">
              Select another filter or book a verified service.
            </p>
          </div>
        ) : (
          filteredBookings.map((b) => {
            const getStatusColor = () => {
              switch (b.status) {
                case 'Active':
                  return 'bg-secondary-fixed/40 text-secondary border-secondary/30';
                case 'Confirmed':
                  return 'bg-primary-fixed text-primary border-primary/20';
                case 'Completed':
                  return 'bg-surface-container-high text-on-surface-variant border-surface-variant';
                case 'Cancelled':
                  return 'bg-error-container/60 text-error border-error/20';
                default:
                  return 'bg-tertiary-fixed text-tertiary-container border-tertiary/20';
              }
            };

            return (
              <div
                key={b.id}
                className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-[#dde2f3]/40 flex flex-col gap-3 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor()}`}
                      >
                        {b.status}
                      </span>
                      {b.isHomeVisit && (
                        <span className="text-[10px] bg-surface-container px-2 py-0.5 rounded font-semibold text-on-surface">
                          Home Visit
                        </span>
                      )}
                    </div>
                    <h3 className="font-headline font-bold text-sm text-on-surface mt-1.5">
                      {b.serviceName}
                    </h3>
                  </div>
                  <span className="font-headline font-bold text-sm text-primary">
                    ${b.totalAmount.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-secondary">
                      calendar_today
                    </span>
                    <span>{b.date}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-secondary">
                      schedule
                    </span>
                    <span>{b.time}</span>
                  </div>
                  <span>•</span>
                  <span>{b.durationMinutes} min</span>
                </div>

                {/* Safe zone info snippet */}
                {b.safeZoneConfig && (
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-surface-container-low text-[11px] text-on-surface-variant">
                    <span className="material-symbols-outlined text-[14px] text-secondary">
                      shield
                    </span>
                    <span className="truncate">
                      Safe Zone: {b.safeZoneConfig.radiusLabel} ({b.safeZoneConfig.centerAddress})
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1 border-t border-surface-container-high/60">
                  {b.status === 'Active' ? (
                    <button
                      onClick={() => setCurrentTab('live-walk')}
                      className="flex-1 h-9 rounded-xl bg-secondary text-on-secondary text-xs font-bold flex items-center justify-center gap-1 shadow-xs hover:opacity-95"
                    >
                      <span className="material-symbols-outlined text-[16px]">explore</span>
                      <span>Open Live GPS Radar</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedBooking(b)}
                      className="flex-1 h-9 rounded-xl bg-surface-container-low text-primary text-xs font-bold hover:bg-surface-container"
                    >
                      View Receipt &amp; Details
                    </button>
                  )}

                  {b.status === 'Completed' && (
                    <>
                      {(() => {
                        const rep = getReportForBooking(b.id);
                        if (!rep) return null;
                        return (
                          <button
                            onClick={() => openReportModal(rep)}
                            className="px-3 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs active:scale-95 transition-all"
                          >
                            <span className="material-symbols-outlined text-[15px]">description</span>
                            <span>View Report</span>
                          </button>
                        );
                      })()}

                      <button
                        onClick={() => setReviewModalBooking(b)}
                        className="px-3 h-9 rounded-xl bg-amber-500/10 text-amber-800 border border-amber-500/30 text-xs font-bold flex items-center gap-1 hover:bg-amber-500/20 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[15px] text-amber-600">rate_review</span>
                        <span>Review</span>
                      </button>
                    </>
                  )}

                  {b.status === 'Confirmed' && (
                    <button
                      onClick={() => {
                        setSelectedBooking(b);
                        setShowCancelPrompt(true);
                      }}
                      className="px-3 h-9 rounded-xl text-error bg-error-container/40 text-xs font-semibold hover:bg-error-container"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Details & Cancellation Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-surface-container-lowest rounded-2xl p-5 shadow-2xl flex flex-col gap-3.5 border border-[#dde2f3]">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-2">
              <h3 className="font-headline font-bold text-sm text-on-surface">
                {showCancelPrompt ? 'Cancel Booking' : 'Booking Dossier'}
              </h3>
              <button
                onClick={() => {
                  setSelectedBooking(null);
                  setShowCancelPrompt(false);
                }}
                className="w-7 h-7 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            {showCancelPrompt ? (
              <div className="space-y-3">
                <p className="text-xs text-on-surface-variant">
                  Are you sure you want to cancel this booking? Cancellations made &gt; 2 hours prior are 100% free of charge under the PetCare Guarantee.
                </p>
                <div>
                  <label className="text-[11px] font-semibold text-on-surface block mb-1">
                    Reason for cancellation (optional):
                  </label>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="e.g. Schedule change, pet unwell..."
                    rows={2}
                    className="w-full text-xs p-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => setShowCancelPrompt(false)}
                    className="h-10 rounded-xl bg-surface-container text-xs font-semibold text-on-surface"
                  >
                    Keep Booking
                  </button>
                  <button
                    onClick={handleConfirmCancel}
                    className="h-10 rounded-xl bg-error text-on-error text-xs font-bold shadow-xs"
                  >
                    Confirm Cancellation
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 text-xs text-on-surface-variant">
                <div className="p-3 bg-surface-container-low rounded-xl flex flex-col gap-1">
                  <span className="font-headline font-bold text-sm text-primary">
                    {selectedBooking.serviceName}
                  </span>
                  <span>
                    Status: <strong className="text-on-surface">{selectedBooking.status}</strong>
                  </span>
                  <span>Date &amp; Time: {selectedBooking.date} • {selectedBooking.time}</span>
                  <span>Duration: {selectedBooking.durationMinutes} min</span>
                </div>

                <div className="flex justify-between py-1 border-b border-surface-container-high">
                  <span>Base Service Fee:</span>
                  <span className="font-semibold text-on-surface">
                    ${selectedBooking.baseFee.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-surface-container-high">
                  <span>Safety Guarantee:</span>
                  <span className="font-semibold text-on-surface">
                    ${selectedBooking.safetyFee.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-1 text-sm font-bold text-primary">
                  <span>Total Billed:</span>
                  <span>${selectedBooking.totalAmount.toFixed(2)}</span>
                </div>

                {selectedBooking.status === 'Completed' && (
                  <div className="pt-2 flex flex-col gap-2">
                    {(() => {
                      const rep = getReportForBooking(selectedBooking.id);
                      if (!rep) return null;
                      return (
                        <button
                          onClick={() => {
                            const r = rep;
                            setSelectedBooking(null);
                            openReportModal(r);
                          }}
                          className="w-full h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-headline text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-98 transition-all"
                        >
                          <span className="material-symbols-outlined text-[16px]">description</span>
                          <span>View Verified Service Report</span>
                        </button>
                      );
                    })()}
                    <span className="inline-flex items-center justify-center gap-1 text-secondary font-bold text-xs">
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      Service Completed &amp; Verified
                    </span>
                  </div>
                )}

                <button
                  onClick={() => setSelectedBooking(null)}
                  className="w-full h-10 mt-2 rounded-xl bg-primary text-on-primary font-headline text-xs font-bold"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
