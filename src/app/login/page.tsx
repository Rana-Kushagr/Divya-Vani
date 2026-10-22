'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  GraduationCap, 
  KeyRound,
  Zap
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<'email' | 'phone' | 'google'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const payload: any = { authMode };
      if (authMode === 'email') {
        payload.email = email || 'student.demo@divyavani.edu';
        payload.password = password || 'password123';
      } else if (authMode === 'phone') {
        payload.phone = phone || '+919876543210';
        payload.otp = otp || '123456';
      }

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Login failed. Please verify credentials.');
      }

      // Persist user in localStorage for client components
      localStorage.setItem('divyavani_user', JSON.stringify(data.user));

      // Check if user already has class selected
      const savedClass = localStorage.getItem('divyavani_selected_class');
      const savedSubject = localStorage.getItem('divyavani_selected_subject');

      if (savedClass && savedSubject) {
        router.push(`/learn/${savedClass}/${savedSubject}`);
      } else {
        router.push('/select-class');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong during sign-in.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = (grade: string, sub: string) => {
    setEmail(`demo.${grade}@divyavani.edu`);
    setPassword('demopass123');
    localStorage.setItem('divyavani_selected_class', grade);
    localStorage.setItem('divyavani_selected_subject', sub);

    // Call login with default
    setIsLoading(true);
    setTimeout(async () => {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            authMode: 'email',
            email: `demo.${grade}@divyavani.edu`,
            password: 'demopass123',
          }),
        });
        const data = await res.json();
        localStorage.setItem('divyavani_user', JSON.stringify({
          ...data.user,
          selectedClass: grade,
          selectedSubject: sub,
        }));
        router.push(`/learn/${grade}/${sub}`);
      } catch (err) {
        router.push(`/learn/${grade}/${sub}`);
      } finally {
        setIsLoading(false);
      }
    }, 350);
  };

  return (
    <div className="min-h-screen bg-obsidian text-alabaster flex flex-col justify-between selection:bg-royal selection:text-white">
      {/* Top Bar with Concept Credit */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-structural-dark">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-royal flex items-center justify-center text-white shadow-block-dark">
            <Sparkles className="w-4 h-4 text-mint" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-white">Divyavani</span>
            <span className="ml-2 text-[10px] font-semibold bg-royal/40 text-royal-light border border-royal/60 px-1.5 py-0.5 rounded">
              v2.0
            </span>
          </div>
        </Link>
        <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400">
          <span>Concept:</span>
          <span className="text-zinc-200 font-medium">Vanshika & Divyanshi (Class IX-H)</span>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-alabaster text-obsidian rounded-2xl shadow-2xl border border-structural-light p-6 sm:p-8">
          
          {/* Card Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-royal text-white mb-3 shadow-md">
              <GraduationCap className="w-6 h-6 text-mint" />
            </div>
            <h1 className="text-2xl font-extrabold text-obsidian tracking-tight">
              Student Sign-In
            </h1>
            <p className="text-xs text-zinc-500 mt-1 font-medium">
              Eliminate hesitation. Ask freely, understand instantly.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          {/* Auth Method Switcher Tabs */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-zinc-100 rounded-lg mb-6 border border-zinc-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setAuthMode('email'); setErrorMessage(null); }}
              className={`py-2 rounded-md transition-all ${
                authMode === 'email'
                  ? 'bg-white text-obsidian shadow-sm'
                  : 'text-zinc-500 hover:text-obsidian'
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('phone'); setErrorMessage(null); }}
              className={`py-2 rounded-md transition-all ${
                authMode === 'phone'
                  ? 'bg-white text-obsidian shadow-sm'
                  : 'text-zinc-500 hover:text-obsidian'
              }`}
            >
              Phone OTP
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('google'); setErrorMessage(null); }}
              className={`py-2 rounded-md transition-all ${
                authMode === 'google'
                  ? 'bg-white text-obsidian shadow-sm'
                  : 'text-zinc-500 hover:text-obsidian'
              }`}
            >
              Google
            </button>
          </div>

          {/* Form: Email & Password */}
          {authMode === 'email' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Student Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@school.edu"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-zinc-300 text-sm text-obsidian focus:border-royal focus:ring-2 focus:ring-royal/20 transition-all outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-zinc-300 text-sm text-obsidian focus:border-royal focus:ring-2 focus:ring-royal/20 transition-all outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-lg bg-royal hover:bg-royal-hover text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                <span>{isLoading ? 'Signing In...' : 'Enter Learning Gateway'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          )}

          {/* Form: Phone OTP */}
          {authMode === 'phone' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Mobile Number (India)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-zinc-300 text-sm text-obsidian focus:border-royal focus:ring-2 focus:ring-royal/20 transition-all outline-none"
                    required
                  />
                </div>
              </div>

              {otpSent ? (
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Enter 6-Digit OTP
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="123456"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-zinc-300 text-sm text-obsidian tracking-widest font-mono focus:border-royal focus:ring-2 focus:ring-royal/20 transition-all outline-none"
                      required
                    />
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setOtpSent(true)}
                  className="w-full py-2.5 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-900 text-white font-semibold text-xs transition-colors"
                >
                  Send OTP Code
                </button>
              )}

              {otpSent && (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-lg bg-royal hover:bg-royal-hover text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  <span>{isLoading ? 'Verifying...' : 'Verify OTP & Enter'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </form>
          )}

          {/* Form: Google Sign-in */}
          {authMode === 'google' && (
            <div className="space-y-4 text-center py-2">
              <p className="text-xs text-zinc-500">
                Sign in seamlessly with your official school or personal Google account.
              </p>
              <button
                type="button"
                onClick={() => handleLogin()}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-lg border border-zinc-300 hover:bg-zinc-50 text-zinc-700 font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>
          )}

          {/* Quick Demo Evaluation Section */}
          <div className="mt-6 pt-5 border-t border-zinc-200">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber" />
                Quick Evaluation Demos
              </span>
              <span className="text-[10px] text-zinc-400 font-medium">1-Click Instant Access</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('class-9', 'science')}
                className="p-2.5 rounded-lg border border-royal/30 bg-royal/5 hover:bg-royal/10 text-left transition-colors group"
              >
                <div className="font-bold text-xs text-royal group-hover:text-royal-hover flex items-center justify-between">
                  <span>Class 9</span>
                  <span className="text-[9px] uppercase px-1 py-0.5 rounded bg-royal/20 text-royal font-bold">Science</span>
                </div>
                <p className="text-[10px] text-zinc-500 mt-0.5">Motion & Forces</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('class-10', 'maths')}
                className="p-2.5 rounded-lg border border-mint/30 bg-mint/5 hover:bg-mint/10 text-left transition-colors group"
              >
                <div className="font-bold text-xs text-mint group-hover:text-mint-hover flex items-center justify-between">
                  <span>Class 10</span>
                  <span className="text-[9px] uppercase px-1 py-0.5 rounded bg-mint/20 text-mint font-bold">Maths</span>
                </div>
                <p className="text-[10px] text-zinc-500 mt-0.5">Board Aspirant</p>
              </button>
            </div>
          </div>

          {/* Legal micro-copy */}
          <div className="mt-5 text-center text-[11px] text-zinc-400">
            <span>By entering, you agree to our </span>
            <Link href="/terms" className="underline hover:text-zinc-600">Terms</Link>
            <span> & </span>
            <Link href="/privacy" className="underline hover:text-zinc-600">Privacy Policy</Link>.
          </div>

        </div>
      </main>

      {/* Footer info banner */}
      <footer className="py-3 px-6 text-center text-xs text-zinc-500 border-t border-structural-dark">
        Divyavani AI Educational Platform &bull; Conceived by Vanshika & Divyanshi (Class IX-H) &bull; Double-Palette Architecture
      </footer>
    </div>
  );
}
