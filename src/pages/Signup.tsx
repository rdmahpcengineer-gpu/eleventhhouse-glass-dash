import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { signup, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password) { setError('Please fill in all fields.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setSubmitting(true);
    setError('');
    try {
      await signup(email, password, name);
      setSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign up failed';
      setError(msg);
    }
    setSubmitting(false);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-sky-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] flex relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] bg-orange-500/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[50%] h-[50%] bg-sky-600/15 blur-[140px] rounded-full pointer-events-none" />

      {/* Left panel — feature list */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16 relative z-10">
        <div className="max-w-lg">
          <div className="flex items-center gap-3 mb-14">
            <div className="w-11 h-11 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
              <span className="text-white font-black text-sm">EH</span>
            </div>
            <span className="text-2xl font-black text-white tracking-tight">EHCX.ai</span>
          </div>

          <h2 className="text-5xl font-black text-white leading-tight tracking-tight mb-6">
            Deploy in<br />Minutes
          </h2>
          <p className="text-lg text-slate-400 font-medium leading-relaxed mb-12">
            No IT team required. Full enterprise AI contact center from day one.
          </p>

          <div className="space-y-4">
            {[
              { icon: '\u26A1', label: 'AI-powered voice agents included' },
              { icon: '\uD83D\uDCDE', label: 'Unlimited phone numbers' },
              { icon: '\uD83D\uDCCA', label: 'Real-time analytics dashboard' },
              { icon: '\uD83D\uDD12', label: 'Enterprise-grade security & compliance' },
            ].map(f => (
              <div key={f.label} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-sm">
                  {f.icon}
                </div>
                <span className="text-slate-300 font-medium text-sm">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center px-8 py-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-sm">EH</span>
            </div>
            <span className="text-xl font-black text-white">EHCX.ai</span>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            {success ? (
              <>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-black text-white mb-1 tracking-tight">Check your email</h1>
                <p className="text-slate-400 text-sm mb-8">
                  We sent a confirmation link to <span className="text-white font-semibold">{email}</span>. Click the link to activate your account, then sign in.
                </p>
                <Link
                  to="/login"
                  className="block w-full text-center h-12 leading-[3rem] bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-bold text-sm tracking-wider uppercase shadow-lg"
                >
                  Go to Sign In
                </Link>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-black text-white mb-1 tracking-tight">Create account</h1>
                <p className="text-slate-400 text-sm mb-8">Start your 14-day free trial — no credit card needed</p>

                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl">
                    <p className="text-red-400 text-sm font-medium">{error}</p>
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Jane Smith"
                      autoComplete="name"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm font-medium outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Work Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="jane@company.com"
                      autoComplete="email"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm font-medium outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      autoComplete="new-password"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm font-medium outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold text-sm tracking-wider uppercase shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating account...
                      </>
                    ) : 'Create Account'}
                  </button>
                </form>

                <p className="mt-5 text-xs text-slate-600 text-center">
                  By signing up you agree to our{' '}
                  <a href="/terms" className="text-slate-500 hover:text-white transition-colors">Terms</a>
                  {' '}and{' '}
                  <a href="/privacy" className="text-slate-500 hover:text-white transition-colors">Privacy Policy</a>
                </p>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                </div>

                <p className="text-center text-sm text-slate-500">
                  Already have an account?{' '}
                  <Link to="/login" className="font-bold text-sky-400 hover:text-sky-300 transition-colors">
                    Sign in
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
