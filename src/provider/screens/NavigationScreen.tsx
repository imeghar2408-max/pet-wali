/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useProviderApp } from '../ProviderContext.tsx';
import {
  MapPin,
  Navigation,
  Phone,
  MessageSquare,
  ShieldAlert,
  ChevronRight,
  Clock,
  Compass,
  CheckCircle2,
  AlertCircle,
  Car,
} from 'lucide-react';

export const NavigationScreen: React.FC = () => {
  const {
    activeAssignment,
    markArrived,
    setEmergencySosOpen,
    triggerAccidentDetectionSim,
  } = useProviderApp();

  const [simulatedProgressPct, setSimulatedProgressPct] = useState(35);

  if (!activeAssignment) return null;

  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)] pb-24">
      {/* Top Booking Accepted Banner */}
      <div className="bg-emerald-600 text-white px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span className="font-extrabold text-sm tracking-wide">BOOKING ACCEPTED ✓</span>
        </div>
        <span className="text-xs bg-emerald-700/80 px-2.5 py-1 rounded-full font-mono font-medium">
          {activeAssignment.bookingRef}
        </span>
      </div>

      {/* Interactive Simulated Turn-by-Turn GPS Map */}
      <div className="relative w-full h-72 sm:h-80 bg-slate-900 overflow-hidden flex flex-col justify-between p-4">
        {/* SVG Route Simulation Graphic */}
        <svg
          className="absolute inset-0 w-full h-full opacity-80"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 400 300"
        >
          <defs>
            <linearGradient id="routeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid lines simulating city roads */}
          <line x1="20" y1="0" x2="20" y2="300" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="120" y1="0" x2="120" y2="300" stroke="#334155" strokeWidth="1.5" />
          <line x1="240" y1="0" x2="240" y2="300" stroke="#334155" strokeWidth="1.5" />
          <line x1="340" y1="0" x2="340" y2="300" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />

          <line x1="0" y1="80" x2="400" y2="80" stroke="#334155" strokeWidth="1.5" />
          <line x1="0" y1="180" x2="400" y2="180" stroke="#334155" strokeWidth="1.5" />
          <line x1="0" y1="250" x2="400" y2="250" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />

          {/* City Landmark blocks */}
          <rect x="30" y="90" width="80" height="80" rx="8" fill="#1e293b" opacity="0.6" />
          <rect x="130" y="90" width="100" height="80" rx="8" fill="#1e293b" opacity="0.6" />
          <rect x="130" y="190" width="100" height="50" rx="8" fill="#1e293b" opacity="0.6" />
          <rect x="250" y="90" width="80" height="80" rx="8" fill="#1e293b" opacity="0.6" />

          {/* Walking/Driving Route Line */}
          <path
            d="M 60 260 L 120 260 L 120 180 L 240 180 L 240 80 L 320 80"
            fill="none"
            stroke="url(#routeGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
          />

          {/* Provider / Captain Marker */}
          <circle cx="170" cy="180" r="10" fill="#10b981" />
          <circle cx="170" cy="180" r="16" fill="#10b981" opacity="0.3" className="animate-ping" />

          {/* Customer Pickup Pin */}
          <circle cx="320" cy="80" r="9" fill="#ef4444" />
          <text x="320" y="72" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
            CUSTOMER
          </text>
        </svg>

        {/* Turn-by-Turn Head-Up Banner */}
        <div className="relative z-10 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3.5 flex items-center justify-between text-white shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
              <Navigation className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <span className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider block">
                Next Maneuver • In 250m
              </span>
              <p className="text-sm font-bold text-white">
                Turn right onto 12th Main Rd towards Indiranagar
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xl font-black text-white">{activeAssignment.estimatedArrivalMin} min</span>
            <span className="text-[11px] text-slate-400 block">{activeAssignment.distanceKm} km left</span>
          </div>
        </div>

        {/* Floating Quick Action Buttons on Map */}
        <div className="relative z-10 flex items-center justify-between">
          <button
            onClick={() => setEmergencySosOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold shadow-lg backdrop-blur-md active:scale-95 transition-all"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>SOS</span>
          </button>

          <button
            onClick={() => triggerAccidentDetectionSim()}
            className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-slate-700 backdrop-blur-md"
            title="Simulate sudden fall detection"
          >
            ⚡ Test Accident Alert
          </button>
        </div>
      </div>

      {/* Trip & Customer Dossier Card */}
      <div className="p-4 space-y-4 max-w-xl mx-auto w-full">
        {/* Customer & Call / Message Toolbar */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={activeAssignment.customer.avatar}
              alt={activeAssignment.customer.name}
              className="w-12 h-12 rounded-full object-cover border border-slate-200"
            />
            <div>
              <h3 className="text-base font-bold text-slate-900">{activeAssignment.customer.name}</h3>
              <p className="text-xs text-slate-500">
                ★ {activeAssignment.customer.rating} • {activeAssignment.customer.totalBookings} PetCare bookings
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${activeAssignment.customer.phone}`}
              className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center hover:bg-emerald-100 transition-colors shadow-xs"
              title="Call Customer"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={() => alert(`Opening chat with ${activeAssignment.customer.name}`)}
              className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200 transition-colors shadow-xs"
              title="Message Customer"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Assigned Pet & Service Card */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex items-center gap-4">
          <img
            src={activeAssignment.pet.photoUrl}
            alt={activeAssignment.pet.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-xs"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-slate-900">{activeAssignment.pet.name}</h4>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {activeAssignment.durationMinutes} min {activeAssignment.serviceType.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              {activeAssignment.pet.breed} • {activeAssignment.pet.ageYears} yrs • {activeAssignment.pet.weightKg} kg
            </p>
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 italic">
              Special note: {activeAssignment.pet.specialInstructions}
            </p>
          </div>
        </div>

        {/* Pickup Address Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 flex items-start gap-3 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
            <MapPin className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <span className="text-[11px] uppercase font-bold text-slate-400 block tracking-wider">
              Pickup Address
            </span>
            <p className="text-xs font-medium text-slate-800 mt-0.5 leading-relaxed">
              {activeAssignment.pickupAddress}
            </p>
          </div>
        </div>

        {/* Estimated Earnings Card */}
        <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3.5 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[11px] uppercase font-bold text-emerald-700 block tracking-wider">
              Guaranteed Payout for this Trip
            </span>
            <p className="text-xs text-emerald-600 mt-0.5">
              Includes base fee + distance bonus
            </p>
          </div>
          <span className="text-2xl font-black text-emerald-900">₹{activeAssignment.estimatedEarnings}</span>
        </div>

        {/* Primary Captain Action: I Have Arrived */}
        <div className="pt-2">
          <button
            onClick={markArrived}
            className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>I HAVE ARRIVED AT CUSTOMER LOCATION</span>
          </button>
          <p className="text-center text-[11px] text-slate-400 mt-2">
            Tap when you reach the customer's doorstep or pickup point
          </p>
        </div>
      </div>
    </div>
  );
};
