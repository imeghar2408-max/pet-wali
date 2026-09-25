/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useProviderApp } from '../ProviderContext.tsx';
import {
  ShieldAlert,
  MapPin,
  Phone,
  AlertTriangle,
  CheckCircle2,
  X,
  Radio,
} from 'lucide-react';

export const EmergencySosModal: React.FC = () => {
  const { emergencySosOpen, setEmergencySosOpen, activeAssignment } = useProviderApp();

  const [sosSent, setSosSent] = useState(false);

  if (!emergencySosOpen) return null;

  const handleSendSos = () => {
    setSosSent(true);
  };

  const handleClose = () => {
    setSosSent(false);
    setEmergencySosOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-rose-100 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-600">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
            <h3 className="text-base font-black uppercase tracking-wide">
              {sosSent ? 'Emergency Alert Sent' : 'Emergency SOS Trigger'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center font-bold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {sosSent ? (
          <div className="space-y-4 text-center py-2">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center animate-pulse">
              <Radio className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-lg font-black text-slate-900">Safety Response Dispatched</h4>
              <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                Live GPS coordinates broadcasted to PetCare Rapid Response Team and customer (
                {activeAssignment?.customer.name || 'Owner'}).
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-left space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">GPS Coordinates:</span>
                <span className="font-mono font-bold text-slate-800">12.9716° N, 77.5946° E</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-rose-600">Active Incident Response</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Safety Helpline:</span>
                <span className="font-bold text-slate-800">+91 1800 200 9999</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md"
            >
              ACKNOWLEDGE & RETURN
            </button>
          </div>
        ) : (
          <div className="space-y-3.5">
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 text-xs text-rose-900 leading-relaxed">
              <strong>Are you or the pet in danger?</strong>
              <p className="mt-1">
                Tapping "SEND SOS" will instantly alert PetCare Emergency HQ, dial the safety helpline, and notify the pet owner with your pinpoint GPS location.
              </p>
            </div>

            {activeAssignment && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Active Pet:</span>
                  <span className="font-bold text-slate-900">{activeAssignment.pet.name} ({activeAssignment.pet.breed})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer:</span>
                  <span className="font-bold text-slate-900">{activeAssignment.customer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pickup Area:</span>
                  <span className="font-bold text-slate-900 truncate max-w-[180px]">{activeAssignment.pickupAddress}</span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleClose}
                className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                CANCEL
              </button>
              <button
                onClick={handleSendSos}
                className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md shadow-rose-600/30 flex items-center justify-center gap-1.5"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>SEND SOS</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
