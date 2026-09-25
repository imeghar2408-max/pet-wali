/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useProviderApp } from '../ProviderContext.tsx';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Activity,
} from 'lucide-react';

export const AccidentDetectionModal: React.FC = () => {
  const { accidentModalOpen, setAccidentModalOpen, setEmergencySosOpen } = useProviderApp();

  const [countdown, setCountdown] = useState(25);

  useEffect(() => {
    let timer: any = null;
    if (accidentModalOpen) {
      setCountdown(25);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setAccidentModalOpen(false);
            setEmergencySosOpen(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [accidentModalOpen, setAccidentModalOpen, setEmergencySosOpen]);

  if (!accidentModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border-2 border-rose-500 text-center space-y-4">
        {/* Pulsing Alert Icon */}
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center animate-ping">
          <Activity className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[11px] uppercase font-black tracking-widest text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            Fall / Impact Detected
          </span>
          <h3 className="text-xl font-black text-slate-900 mt-2">
            Possible accident detected. Are you okay?
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Sudden deceleration or impact was detected by phone accelerometer.
          </p>
        </div>

        {/* Countdown Ring */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
          <span className="text-[11px] text-slate-500 block">Auto-dispatching SOS in:</span>
          <span className="text-3xl font-black text-rose-600 font-mono">{countdown}s</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={() => setAccidentModalOpen(false)}
            className="w-full py-4 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>I'M OKAY (FALSE ALARM)</span>
          </button>

          <button
            onClick={() => {
              setAccidentModalOpen(false);
              setEmergencySosOpen(true);
            }}
            className="w-full py-3 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>DISPATCH SOS NOW</span>
          </button>
        </div>
      </div>
    </div>
  );
};
