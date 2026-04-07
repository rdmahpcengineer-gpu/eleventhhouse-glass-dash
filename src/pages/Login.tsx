import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, isAuthenticated, isLoading, challenge, completeNewPassword } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [givenName, setGivenName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setSubmitting(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign in failed';
      if (msg.includes('USER_PASSWORD_AUTH') || msg.includes('flow not enabled')) {
        setError('Password auth is not enabled on this user pool. Please enable USER_PASSWORD_AUTH in Cognito App Client settings.');
      } else if (msg.includes('NotAuthorizedException') || msg.includes('Incorrect username or password')) {
        setError('Incorrect email or password.');
      } else if (msg.includes('UserNotConfirmedException')) {
        setError('Account not confirmed. Check your email for a verification code, then sign up again to confirm.');
      } else {
        setError(msg);
      }
    }
    setSubmitting(false);
  }

  async function handleNewPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!newPassword) { setError('Please enter a new password.'); return; }
    if (newPassword !== confirmNewPassword) { setError('Passwords do not match.'); return; }
    if (newPassword.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (!givenName.trim()) { setError('Please enter your name.'); return; }
    setSubmitting(true);
    setError('');
    try {
      const nameParts = givenName.trim().split(/\s+/);
      const first = nameParts[0];
      const last = nameParts.length > 1 ? nameParts.slice(1).join(' ') : first;
      await completeNewPassword(newPassword, {
        given_name: first,
        family_name: last,
        name: givenName.trim(),
      });
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to set new password';
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
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-sky-500/20 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-violet-600/20 blur-[140px] rounded-full pointer-events-none" />

      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16 relative z-10">
        <div className="max-w-lg">
          <div className="flex items-center gap-3 mb-14">
            <div className="w-11 h-11 bg-sky-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/40">
              <span className="text-white font-black text-sm tracking-wide">EH</span>
            </div>
            <span className="text-2xl font-black text-white tracking-tight">EHCX.ai</span>
          </div>

          <h2 className="text-5xl font-black text-white leading-tight tracking-tight mb-6">
            Your AI Contact<br />Center Awaits
          </h2>
          <p className="text-lg text-slate-400 font-medium leading-relaxed mb-12">
            Enterprise-grade AI voice agents. Real-time analytics. Instant deployment.
          </p>

          <div className="grid grid-cols-3 gap-6">
            {[
              { v: '99.9%', l: 'Uptime SLA' },
              { v: '2.3M+', l: 'Calls Handled' },
              { v: '4.9/5', l: 'Customer Rating' },
            ].map(s => (
              <div key={s.l} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4 text-center">
                <div className="text-2xl font-black text-white mb-1">{s.v}</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{s.l}</div>
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
            <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-sm">EH</span>
            </div>
            <span className="text-xl font-black text-white">EHCX.ai</span>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            {challenge ? (
              <>
                <h1 className="text-3xl font-black text-white mb-1 tracking-tight">Set New Password</h1>
                <p className="text-slate-400 text-sm mb-8">Your account requires a new password before you can sign in.</p>

                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl">
                    <p className="text-red-400 text-sm font-medium">{error}</p>
                  </div>
                )}

                <form onSubmit={handleNewPassword} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={givenName}
                      onChange={e => setGivenName(e.target.value)}
                      placeholder="e.g. Philip"
                      autoComplete="given-name"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm font-medium outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      autoComplete="new-password"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm font-medium outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmNewPassword}
                      onChange={e => setConfirmNewPassword(e.target.value)}
                      placeholder="Re-enter password"
                      autoComplete="new-password"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm font-medium outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-12 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-bold text-sm tracking-wider uppercase shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Setting password...
                      </>
                    ) : 'Set Password & Sign In'}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-black text-white mb-1 tracking-tight">Welcome back</h1>
                <p className="text-slate-400 text-sm mb-8">Sign in to your EHCX dashboard</p>

                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl">
                    <p className="text-red-400 text-sm font-medium">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      autoComplete="email"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm font-medium outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm font-medium outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-12 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-bold text-sm tracking-wider uppercase shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Signing in...
                      </>
                    ) : 'Sign In'}
                  </button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 bg-transparent text-xs text-slate-600 font-medium">powered by AWS Cognito</span>
                  </div>
                </div>

                <p className="text-center text-sm text-slate-500">
                  Don't have an account?{' '}
                  <Link to="/signup" className="font-bold text-sky-400 hover:text-sky-300 transition-colors">
                    Start free trial
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
