import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.tsx';

export const AccidentDetectionModal: React.FC = () => {
  const {
    accidentModalVisible,
    setAccidentModalVisible,
    triggerSOS,
    activePet,
  } = useApp();

  const [countdown, setCountdown] = useState<number>(25);

  useEffect(() => {
    if (!accidentModalVisible) {
      setCountdown(25);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-escalate to SOS
          triggerSOS({
            type: 'ACCIDENT_DETECTED',
            title: 'Sudden Impact & Fall Detected',
            description: `Smart harness detected abrupt deceleration and lack of movement for ${activePet.name}. User did not respond to safety check prompt.`,
          });
          setAccidentModalVisible(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [accidentModalVisible, triggerSOS, activePet.name, setAccidentModalVisible]);

  if (!accidentModalVisible) return null;

  const handleImOk = () => {
    setAccidentModalVisible(false);
  };

  const handleSendSOS = () => {
    setAccidentModalVisible(false);
    triggerSOS({
      type: 'ACCIDENT_DETECTED',
      title: 'Sudden Stop & Possible Fall',
      description: `Possible accident confirmed by user or walker near ${activePet.name}'s walk area.`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-surface-container-lowest rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-center border-2 border-error/20">
        {/* Pulsing Warning Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-error-container text-on-error-container flex items-center justify-center relative">
          <span className="material-symbols-outlined text-[32px] text-error animate-bounce">
            warning
          </span>
          <span className="absolute inset-0 rounded-full bg-error/20 animate-ping" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container text-error text-[11px] font-bold tracking-wider uppercase mb-2">
            Sensor Telemetry Alert
          </span>
          <h2 className="font-headline text-headline-md text-on-surface font-bold">
            Possible accident detected. Are you okay?
          </h2>
          <p className="font-body text-body-sm text-on-surface-variant mt-2">
            Accelerometer detected a sudden stop and rapid tilt angle on {activePet.name}&apos;s walk harness.
          </p>
        </div>

        {/* Countdown Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-on-surface-variant font-medium">
            <span>Auto-escalating to Emergency SOS in:</span>
            <span className="font-bold text-error text-sm">{countdown}s</span>
          </div>
          <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
            <div
              className="bg-error h-full rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${(countdown / 25) * 100}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={handleImOk}
            className="h-12 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-headline font-semibold text-body-md shadow-sm active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-secondary text-[20px]">
              check_circle
            </span>
            <span>I&apos;m OK</span>
          </button>

          <button
            type="button"
            onClick={handleSendSOS}
            className="h-12 rounded-xl bg-error text-on-error font-headline font-bold text-body-md shadow-md hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[20px]">
              e911_emergency
            </span>
            <span>Send SOS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
