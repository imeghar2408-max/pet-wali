/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useProviderApp } from '../ProviderContext.tsx';
import { ProviderAssignment } from '../types.ts';
import {
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  ChevronRight,
  Phone,
  MessageSquare,
  Sparkles,
  Info,
} from 'lucide-react';

export const ProviderScheduleScreen: React.FC = () => {
  const { scheduledAssignments } = useProviderApp();

  const [activeTab, setActiveTab] = useState<'today' | 'tomorrow' | 'upcoming'>('today');
  const [selectedBooking, setSelectedBooking] = useState<ProviderAssignment | null>(null);

  // Group scheduled items
  const filteredAssignments = scheduledAssignments.filter((job) => {
    if (activeTab === 'today') return job.scheduledDate.toLowerCase().includes('today');
    if (activeTab === 'tomorrow') return job.scheduledDate.toLowerCase().includes('tomorrow');
    return !job.scheduledDate.toLowerCase().includes('today') && !job.scheduledDate.toLowerCase().includes('tomorrow');
  });

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4 pb-24">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-slate-900">Dispatched Schedule</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Confirmed assignments pre-scheduled and assigned by the PetCare platform.
        </p>
      </div>

      {/* Tabs: Today, Tomorrow, Upcoming */}
      <div className="flex bg-slate-100 p-1 rounded-2xl">
        <button
          onClick={() => setActiveTab('today')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'today'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Today
        </button>
        <button
          onClick={() => setActiveTab('tomorrow')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'tomorrow'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Tomorrow
        </button>
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'upcoming'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Upcoming
        </button>
      </div>

      {/* Bookings List */}
      <div className="space-y-3">
        {filteredAssignments.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 text-center space-y-2">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">No Assignments For {activeTab}</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Stay online during peak morning and evening hours to receive new dispatched service requests.
            </p>
          </div>
        ) : (
          filteredAssignments.map((booking) => (
            <div
              key={booking.id}
              onClick={() => setSelectedBooking(booking)}
              className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs hover:border-slate-300 transition-all cursor-pointer space-y-3"
            >
              {/* Pet & Owner Row */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <img
                    src={booking.pet.photoUrl}
                    alt={booking.pet.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{booking.pet.name}</span>
                      <span className="text-xs font-normal text-slate-500">({booking.pet.breed})</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Owner: <strong className="text-slate-700">{booking.customer.name}</strong>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-black text-emerald-700">₹{booking.estimatedEarnings}</span>
                  <span className="text-[10px] text-slate-400 block font-mono">{booking.durationMinutes} min</span>
                </div>
              </div>

              {/* Service & Time & Location */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{booking.scheduledDate} · {booking.scheduledTime}</span>
                </div>
                <div className="flex items-center gap-1.5 text-right justify-end">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Safe Zone: {(booking.safeZoneRadiusMeters / 1000).toFixed(1)} km</span>
                </div>
              </div>

              <div className="flex items-start gap-1.5 text-xs text-slate-600 pt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-1">{booking.pickupAddress}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 border border-slate-100 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                  Assignment Dossier
                </span>
                <h3 className="text-lg font-black text-slate-900">{selectedBooking.serviceTitle}</h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Pet Card */}
            <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3 border border-slate-200/80">
              <img
                src={selectedBooking.pet.photoUrl}
                alt={selectedBooking.pet.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div>
                <h4 className="text-base font-bold text-slate-900">{selectedBooking.pet.name}</h4>
                <p className="text-xs text-slate-600">
                  {selectedBooking.pet.breed} • {selectedBooking.pet.ageYears} yrs • {selectedBooking.pet.weightKg} kg
                </p>
                <p className="text-[11px] text-slate-500 italic mt-0.5">
                  "{selectedBooking.pet.temperament}"
                </p>
              </div>
            </div>

            {/* Customer & Contact */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between shadow-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Owner / Customer</span>
                <h4 className="text-sm font-bold text-slate-900">{selectedBooking.customer.name}</h4>
                <p className="text-xs text-amber-600 font-semibold">★ {selectedBooking.customer.rating}</p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${selectedBooking.customer.phone}`}
                  className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Pickup & Safe-Zone */}
            <div className="bg-slate-50 rounded-2xl p-3.5 space-y-2 text-xs text-slate-700">
              <div>
                <strong className="block text-slate-900">Pickup Address:</strong>
                <span>{selectedBooking.pickupAddress}</span>
              </div>
              <div>
                <strong className="block text-slate-900">Scheduled Timing:</strong>
                <span>{selectedBooking.scheduledDate} at {selectedBooking.scheduledTime} ({selectedBooking.durationMinutes} min)</span>
              </div>
              <div>
                <strong className="block text-slate-900">Safe Zone Radius:</strong>
                <span>{(selectedBooking.safeZoneRadiusMeters / 1000).toFixed(1)} km perimeter</span>
              </div>
              {selectedBooking.pet.specialInstructions && (
                <div className="pt-1 text-amber-800">
                  <strong>Special Notes: </strong>
                  <span>{selectedBooking.pet.specialInstructions}</span>
                </div>
              )}
            </div>

            {/* Estimated Earnings */}
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-700 block">Trip Payout</span>
                <span className="text-xs text-emerald-800">Includes base fee + distance bonus</span>
              </div>
              <span className="text-2xl font-black text-emerald-950">₹{selectedBooking.estimatedEarnings}</span>
            </div>

            <button
              onClick={() => setSelectedBooking(null)}
              className="w-full py-3.5 rounded-2xl bg-slate-900 text-white font-bold text-xs"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
