import React, { FormEvent, useMemo, useState } from 'react';
import { AuthRole, CaptainService } from './authApi.ts';
import { useAuth } from './AuthContext.tsx';

const captainServices: { id: CaptainService; label: string }[] = [
  { id: 'WALKING', label: 'Dog walking' },
  { id: 'GROOMING', label: 'Grooming' },
  { id: 'TRAINING', label: 'Training' },
];

export const AuthScreen: React.FC<{ role: AuthRole }> = ({ role }) => {
  const { login, registerUser, registerCaptain, error, clearError } = useAuth();
  const isCaptain = role === 'CAPTAIN';
  const [registering, setRegistering] = useState(location.pathname.endsWith('/register'));
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [servicesOffered, setServicesOffered] = useState<CaptainService[]>([]);
  const [bio, setBio] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const appPrefix = isCaptain ? '/captain' : '/user';
  const authHref = useMemo(() => `${appPrefix}/${registering ? 'login' : 'register'}`, [appPrefix, registering]);

  const toggleService = (service: CaptainService) => {
    setServicesOffered((selected) => selected.includes(service)
      ? selected.filter((entry) => entry !== service)
      : [...selected, service]);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    clearError();
    if (registering && password !== confirmPassword) return;
    setSubmitting(true);
    try {
      if (!registering) await login(email, password);
      else if (isCaptain) await registerCaptain({
        name, email, phone, password, confirmPassword,
        yearsExperience: Number(yearsExperience), servicesOffered, bio,
        profilePhoto: profilePhoto || undefined,
      });
      else await registerUser({ name, email, phone, password, confirmPassword });
      history.replaceState(null, '', '/');
    } catch { /* the auth context exposes the safe server error */ }
    finally { setSubmitting(false); }
  };

  const fieldClass = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100';
  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-10 flex items-center justify-center">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700 text-2xl text-white">🐾</div>
          <h1 className="text-2xl font-extrabold text-slate-900">{isCaptain ? 'PetCare Captain' : 'PetCare'}</h1>
          <p className="mt-1 text-sm text-slate-500">{registering ? 'Create your account' : 'Sign in to continue'}</p>
        </div>

        <form onSubmit={submit} className="space-y-3.5">
          {registering && <>
            <label className="block text-xs font-semibold text-slate-600">Name<input className={`${fieldClass} mt-1`} autoComplete="name" required minLength={2} maxLength={100} value={name} onChange={(e) => setName(e.target.value)} /></label>
            <label className="block text-xs font-semibold text-slate-600">Phone<input className={`${fieldClass} mt-1`} autoComplete="tel" type="tel" required minLength={7} maxLength={32} value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
          </>}
          <label className="block text-xs font-semibold text-slate-600">Email<input className={`${fieldClass} mt-1`} autoComplete="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label className="block text-xs font-semibold text-slate-600">Password<input className={`${fieldClass} mt-1`} autoComplete={registering ? 'new-password' : 'current-password'} type="password" required minLength={10} maxLength={128} value={password} onChange={(e) => setPassword(e.target.value)} /></label>
          {registering && <label className="block text-xs font-semibold text-slate-600">Confirm password<input className={`${fieldClass} mt-1`} autoComplete="new-password" type="password" required minLength={10} maxLength={128} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></label>}

          {registering && isCaptain && <>
            <label className="block text-xs font-semibold text-slate-600">Years of experience<input className={`${fieldClass} mt-1`} type="number" min="0" max="80" step="1" required value={yearsExperience} onChange={(e) => setYearsExperience(e.target.value)} /></label>
            <fieldset>
              <legend className="mb-2 text-xs font-semibold text-slate-600">Services offered</legend>
              <div className="grid grid-cols-3 gap-2">{captainServices.map((service) => (
                <label key={service.id} className="flex items-center gap-1.5 rounded-xl border border-slate-200 p-2 text-xs text-slate-700">
                  <input type="checkbox" checked={servicesOffered.includes(service.id)} onChange={() => toggleService(service.id)} />{service.label}
                </label>
              ))}</div>
            </fieldset>
            <label className="block text-xs font-semibold text-slate-600">Short bio<textarea className={`${fieldClass} mt-1`} rows={3} maxLength={800} required value={bio} onChange={(e) => setBio(e.target.value)} /></label>
            <label className="block text-xs font-semibold text-slate-600">Profile photo URL (optional)<input className={`${fieldClass} mt-1`} type="url" maxLength={2048} value={profilePhoto} onChange={(e) => setProfilePhoto(e.target.value)} /></label>
          </>}

          {registering && password !== confirmPassword && confirmPassword.length > 0 && <p className="text-xs text-rose-600">Passwords do not match.</p>}
          {registering && isCaptain && servicesOffered.length === 0 && <p className="text-xs text-slate-500">Select at least one service to continue.</p>}
          {error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
          <button className="w-full rounded-xl bg-emerald-700 px-4 py-3.5 text-sm font-bold text-white hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-60" disabled={submitting || (registering && (password !== confirmPassword || (isCaptain && servicesOffered.length === 0)))}>
            {submitting ? 'Please wait…' : registering ? 'Create account' : 'Sign in'}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-slate-500">
          {registering ? 'Already have an account?' : 'New to PetCare?'}{' '}
          <a href={authHref} className="font-bold text-emerald-700" onClick={(e) => { e.preventDefault(); clearError(); setRegistering(!registering); history.pushState(null, '', authHref); }}>{registering ? 'Sign in' : 'Create account'}</a>
        </p>
      </section>
    </main>
  );
};
