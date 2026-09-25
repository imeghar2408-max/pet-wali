import React from 'react';
import { useApp } from '../context/AppContext.tsx';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setCurrentTab,
  } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-sm h-full bg-surface-container-lowest shadow-2xl flex flex-col justify-between overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-surface-container-high flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">notifications</span>
            <h2 className="font-headline text-headline-sm font-semibold text-on-surface">
              Notifications
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => markAllNotificationsRead()}
              className="text-xs text-secondary font-semibold hover:underline"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-on-surface-variant text-sm">
              No notifications yet.
            </div>
          ) : (
            notifications.map((n) => {
              const getIcon = () => {
                switch (n.type) {
                  case 'SAFETY_ALERT':
                    return 'verified_user';
                  case 'EMERGENCY_SOS':
                    return 'emergency';
                  case 'WEATHER_TIP':
                    return 'wb_sunny';
                  case 'BOOKING_CONFIRMED':
                    return 'calendar_today';
                  default:
                    return 'info';
                }
              };

              const getBadgeColor = () => {
                switch (n.type) {
                  case 'EMERGENCY_SOS':
                    return 'bg-error-container text-error';
                  case 'SAFETY_ALERT':
                    return 'bg-secondary-fixed/40 text-secondary';
                  case 'WEATHER_TIP':
                    return 'bg-tertiary-fixed text-tertiary-container';
                  default:
                    return 'bg-primary-fixed text-primary';
                }
              };

              return (
                <div
                  key={n.id}
                  onClick={() => {
                    markNotificationRead(n.id);
                    if (n.type === 'EMERGENCY_SOS') {
                      setCurrentTab('emergency-sos');
                      onClose();
                    } else if (n.type === 'SAFETY_ALERT') {
                      setCurrentTab('live-walk');
                      onClose();
                    }
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    n.isRead
                      ? 'bg-surface-container-low/60 border-surface-container-high'
                      : 'bg-surface-container-lowest border-secondary-container/60 shadow-xs ring-1 ring-secondary/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${getBadgeColor()}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {getIcon()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-headline font-semibold text-body-sm text-on-surface truncate">
                          {n.title}
                        </span>
                        <span className="text-[10px] text-on-surface-variant shrink-0">
                          {n.timestamp}
                        </span>
                      </div>
                      <p className="text-body-sm text-on-surface-variant text-[12px] mt-0.5 leading-snug">
                        {n.message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-surface-container-high bg-surface-container-low text-center">
          <p className="text-[11px] text-on-surface-variant">
            PetCare Push Services • Instant Satellite & Telemetry alerts
          </p>
        </div>
      </div>
    </div>
  );
};
