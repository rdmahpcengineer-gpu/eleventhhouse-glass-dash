import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Loader2 } from 'lucide-react';

export default function Login() {
  const { login, isAuthenticated, isLoading, error } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Handle Cognito login redirect
  function handleLogin() {
    login();
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-black mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2 mb-12">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-sm">EH</span>
            </div>
            <span className="text-xl font-black tracking-tight">EHCX.ai</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-2">
              Welcome back
            </h1>
            <p className="text-gray-500 text-lg">
              Sign in to your EHCX dashboard
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <p className="text-red-600 text-sm font-medium">{error.message}</p>
            </div>
          )}

          {/* Single Sign-On Button */}
          <button
            onClick={handleLogin}
            className="w-full h-14 bg-black text-white rounded-2xl font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl mb-6"
          >
            Sign In with SSO
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">powered by AWS Cognito</span>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-medium">Enterprise-grade security</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className="text-sm font-medium">Multi-factor authentication</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-sm font-medium">Instant access to your dashboard</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-gray-500">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-black hover:underline">
              Start free trial
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-gray-900 via-gray-800 to-black p-12 items-center justify-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-orange-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-500/20 blur-[120px] rounded-full" />

        <div className="relative z-10 max-w-lg text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-white/80 uppercase tracking-widest">Live Platform Status</span>
            </div>
          </div>

          <h2 className="text-5xl font-black text-white tracking-tight leading-tight mb-6">
            Your AI Contact Center Awaits
          </h2>
          <p className="text-xl text-white/60 font-medium leading-relaxed">
            Join thousands of businesses scaling their customer support with enterprise-grade AI. No IT team required.
          </p>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-black text-white mb-1">99.9%</div>
              <div className="text-xs font-bold text-white/50 uppercase tracking-widest">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-white mb-1">2.3M+</div>
              <div className="text-xs font-bold text-white/50 uppercase tracking-widest">Calls Handled</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-white mb-1">4.9/5</div>
              <div className="text-xs font-bold text-white/50 uppercase tracking-widest">Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
