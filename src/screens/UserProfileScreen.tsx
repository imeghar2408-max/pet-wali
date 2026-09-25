import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';

export const UserProfileScreen: React.FC = () => {
  const {
    user,
    updateUser,
    logout,
    pets,
    bookings,
    payments,
    setCurrentTab,
    setPetIdModalPet,
    activePet,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'payments' | 'settings'>('profile');

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [address, setAddress] = useState(user.address);
  const [city, setCity] = useState(user.city);
  const [emergencyName, setEmergencyName] = useState(user.emergencyContact.name);
  const [emergencyPhone, setEmergencyPhone] = useState(user.emergencyContact.phone);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Wallet Top-up State
  const [walletBalance, setWalletBalance] = useState<number>(145.0);
  const [topUpSuccess, setTopUpSuccess] = useState<string | null>(null);

  // Settings State
  const [pushEnabled, setPushEnabled] = useState(true);
  const [smsEmergencyEnabled, setSmsEmergencyEnabled] = useState(true);
  const [geofenceBreachSound, setGeofenceBreachSound] = useState(true);
  const [defaultWalkRadius, setDefaultWalkRadius] = useState('1.0 km');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser({
      name,
      phone,
      address,
      city,
      emergencyContact: {
        ...user.emergencyContact,
        name: emergencyName,
        phone: emergencyPhone,
      },
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleTopUpWallet = (amount: number) => {
    setWalletBalance((b) => b + amount);
    setTopUpSuccess(`Added $${amount}.00 to PetCare Wallet!`);
    setTimeout(() => setTopUpSuccess(null), 2500);
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-5 pb-28 pt-2 space-y-4">
      {/* Profile Header Hero */}
      <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-[0_4px_20px_-2px_rgba(30,75,56,0.06)] border border-[#dde2f3]/40 flex flex-col items-center text-center relative">
        <div className="relative w-20 h-20 rounded-full overflow-hidden p-1 bg-surface-container-low shadow-sm mb-3">
          <img className="w-full h-full rounded-full object-cover" src={user.avatar} alt={user.name} />
          <span className="absolute bottom-1 right-1 w-4 h-4 bg-secondary rounded-full ring-2 ring-white" />
        </div>

        <h2 className="font-headline font-bold text-headline-sm text-on-surface">{user.name}</h2>
        <span className="text-xs text-on-surface-variant mt-0.5">{user.email}</span>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-primary text-[11px] font-bold mt-2">
          <span className="material-symbols-outlined text-[14px]">shield</span>
          <span>Verified Pet Parent • {user.role}</span>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2 w-full mt-4 pt-4 border-t border-surface-container-high/60">
          <button
            onClick={() => setCurrentTab('pets')}
            className="flex flex-col items-center hover:opacity-80 transition-opacity"
          >
            <span className="font-headline font-bold text-headline-sm text-primary">
              {pets.length}
            </span>
            <span className="text-[10px] text-on-surface-variant uppercase font-medium">Pets</span>
          </button>
          <button
            onClick={() => setCurrentTab('bookings')}
            className="flex flex-col items-center hover:opacity-80 transition-opacity"
          >
            <span className="font-headline font-bold text-headline-sm text-secondary">
              {bookings.length}
            </span>
            <span className="text-[10px] text-on-surface-variant uppercase font-medium">Bookings</span>
          </button>
          <div className="flex flex-col items-center">
            <span className="font-headline font-bold text-headline-sm text-on-surface">100%</span>
            <span className="text-[10px] text-on-surface-variant uppercase font-medium">Safety Rate</span>
          </div>
        </div>
      </div>

      {/* Segmented Screen Selector: Profile / Payments / Settings */}
      <div className="grid grid-cols-3 gap-1 bg-surface-container-low p-1 rounded-2xl border border-surface-container-high">
        {[
          { id: 'profile', label: 'Profile', icon: 'account_circle' },
          { id: 'payments', label: 'Payments', icon: 'credit_card' },
          { id: 'settings', label: 'Settings', icon: 'settings' },
        ].map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                isSelected
                  ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SCREEN 7 & 22: PROFILE & EMERGENCY HUB */}
      {activeTab === 'profile' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-[#dde2f3]/40 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-headline font-bold text-sm text-on-surface">
                Contact &amp; Emergency Hub
              </h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs text-secondary font-bold hover:underline"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {savedSuccess && (
              <div className="p-2 bg-secondary-container/40 text-secondary text-xs rounded-xl text-center font-bold">
                Profile details updated successfully! ✓
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-3 pt-1 text-xs">
                <div>
                  <label className="font-semibold block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-outline-variant bg-surface-container-low"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-outline-variant bg-surface-container-low"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Home Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-outline-variant bg-surface-container-low"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Emergency Contact Name</label>
                  <input
                    type="text"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-outline-variant bg-surface-container-low"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Emergency Contact Phone</label>
                  <input
                    type="text"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-outline-variant bg-surface-container-low"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full h-10 rounded-xl bg-primary text-on-primary font-bold shadow-xs hover:opacity-95"
                >
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="space-y-2 text-xs text-on-surface-variant">
                <div className="flex justify-between py-1.5 border-b border-surface-container-high/60">
                  <span>Primary Phone:</span>
                  <span className="font-semibold text-on-surface">{user.phone}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-surface-container-high/60">
                  <span>Home Base:</span>
                  <span className="font-semibold text-on-surface">
                    {user.address}, {user.city}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-surface-container-high/60">
                  <span>Emergency Contact:</span>
                  <span className="font-semibold text-on-surface">
                    {user.emergencyContact.name} ({user.emergencyContact.relationship})
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span>Emergency Phone:</span>
                  <span className="font-semibold text-on-surface">{user.emergencyContact.phone}</span>
                </div>
              </div>
            )}
          </div>

          {/* Digital Pet ID Launcher */}
          <button
            onClick={() => setPetIdModalPet(activePet)}
            className="w-full p-4 rounded-2xl bg-surface-container-lowest border border-[#dde2f3] flex items-center justify-between shadow-xs hover:bg-surface-container-low transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary-container/40 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[20px]">badge</span>
              </div>
              <div className="text-left">
                <p className="font-headline font-bold text-xs text-on-surface">
                  Digital Pet ID &amp; Medical Dossier
                </p>
                <p className="text-[11px] text-on-surface-variant">
                  Emergency QR code &amp; veterinary vaccine passport for {activePet.name}
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[18px] text-outline">chevron_right</span>
          </button>
        </div>
      )}

      {/* SCREEN 18: PAYMENT & WALLET MANAGEMENT */}
      {activeTab === 'payments' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* PetCare Wallet Card */}
          <div className="bg-gradient-to-br from-primary to-[#0f3424] rounded-3xl p-5 text-white shadow-lg space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-secondary">
                  account_balance_wallet
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-primary-fixed">
                  PetCare Wallet
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold">
                Auto-Reload: ON
              </span>
            </div>

            <div>
              <span className="text-xs opacity-80">Available Balance</span>
              <p className="font-headline font-bold text-3xl tracking-tight">
                ${walletBalance.toFixed(2)}
              </p>
            </div>

            {topUpSuccess && (
              <div className="p-2 rounded-xl bg-secondary text-primary font-bold text-xs text-center">
                {topUpSuccess}
              </div>
            )}

            {/* Quick Top-Up Buttons */}
            <div>
              <span className="text-[11px] text-white/80 block mb-1.5 font-medium">
                Quick Top-Up:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[25, 50, 100].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleTopUpWallet(amt)}
                    className="py-1.5 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-xs font-bold transition-all"
                  >
                    +${amt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Saved Payment Methods */}
          <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-[#dde2f3]/40 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-headline font-bold text-sm text-on-surface">
                Saved Payment Methods
              </h3>
              <span className="text-xs text-secondary font-bold">2 Cards Linked</span>
            </div>

            <div className="space-y-2.5">
              {/* Apple Pay */}
              <div className="p-3 rounded-xl border border-secondary/30 bg-secondary-container/15 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface">
                    <span className="material-symbols-outlined text-[18px]">phone_iphone</span>
                  </div>
                  <div>
                    <p className="font-headline font-bold text-xs text-on-surface">Apple Pay</p>
                    <p className="text-[10px] text-on-surface-variant">Default checkout method</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-secondary text-white text-[10px] font-bold">
                  DEFAULT
                </span>
              </div>

              {/* Visa */}
              <div className="p-3 rounded-xl border border-[#dde2f3] bg-surface-container-lowest flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[18px]">credit_card</span>
                  </div>
                  <div>
                    <p className="font-headline font-bold text-xs text-on-surface">
                      Visa ending in 4242
                    </p>
                    <p className="text-[10px] text-on-surface-variant">Expires 08/2028</p>
                  </div>
                </div>
                <button className="text-xs text-on-surface-variant hover:text-primary">Edit</button>
              </div>
            </div>
          </div>

          {/* Recent Invoices & Payment Receipts */}
          <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-[#dde2f3]/40 space-y-3">
            <h3 className="font-headline font-bold text-sm text-on-surface">
              Recent Transactions &amp; Receipts
            </h3>

            <div className="space-y-2">
              {payments.slice(0, 4).map((pm) => {
                const b = bookings.find((bk) => bk.id === pm.bookingId);
                return (
                  <div
                    key={pm.id}
                    className="flex items-center justify-between py-2 border-b border-surface-container-high/50 last:border-0 text-xs"
                  >
                    <div className="flex flex-col">
                      <span className="font-headline font-bold text-on-surface truncate max-w-[190px]">
                        {b?.serviceName || 'PetCare Caregiver Booking'}
                      </span>
                      <span className="text-[10px] text-on-surface-variant font-mono">
                        {pm.transactionId} • {pm.timestamp.split('T')[0]} • {pm.paymentMethod.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-headline font-bold text-primary block">
                        ${pm.amount.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-secondary font-bold uppercase">
                        {pm.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PetCare Guarantee Badge */}
          <div className="p-3 rounded-2xl bg-secondary-container/30 border border-secondary/30 flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary text-[24px]">verified_user</span>
            <div className="text-xs text-on-surface-variant">
              <strong className="text-primary block">PetCare Safety Guarantee</strong>
              Every transaction includes $5,000 emergency veterinary protection and continuous telemetry.
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 22: SETTINGS & PREFERENCES */}
      {activeTab === 'settings' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Notifications & Safety Alerts */}
          <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-[#dde2f3]/40 space-y-3">
            <h3 className="font-headline font-bold text-sm text-on-surface">
              Safety &amp; Telemetry Alerts
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-on-surface">Push Notifications</p>
                  <p className="text-[11px] text-on-surface-variant">
                    Walk started, potty logs, milestones
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPushEnabled(!pushEnabled)}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors relative ${
                    pushEnabled ? 'bg-secondary' : 'bg-outline-variant'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      pushEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-on-surface">Emergency SMS Broadcast</p>
                  <p className="text-[11px] text-on-surface-variant">
                    Immediate SMS if safe zone perimeter is breached
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSmsEmergencyEnabled(!smsEmergencyEnabled)}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors relative ${
                    smsEmergencyEnabled ? 'bg-secondary' : 'bg-outline-variant'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      smsEmergencyEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-on-surface">Audio Siren on Boundary Exit</p>
                  <p className="text-[11px] text-on-surface-variant">
                    Audible tone when caregiver approaches perimeter edge
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setGeofenceBreachSound(!geofenceBreachSound)}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors relative ${
                    geofenceBreachSound ? 'bg-secondary' : 'bg-outline-variant'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      geofenceBreachSound ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Default Safe Zone Configuration */}
          <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-[#dde2f3]/40 space-y-2.5">
            <h3 className="font-headline font-bold text-sm text-on-surface">
              Safe Zone Defaults
            </h3>
            <div className="flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">Default Boundary Radius:</span>
              <select
                value={defaultWalkRadius}
                onChange={(e) => setDefaultWalkRadius(e.target.value)}
                className="bg-surface-container-low border border-outline-variant rounded-lg px-2 py-1 font-semibold text-primary"
              >
                <option value="500m">500m (Close Proximity)</option>
                <option value="1.0 km">1.0 km (Standard Neighborhood)</option>
                <option value="2.0 km">2.0 km (Trail &amp; Park)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full h-11 rounded-2xl bg-surface-container text-error font-headline font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-error-container/40 transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">logout</span>
        <span>Sign Out</span>
      </button>
    </div>
  );
};
