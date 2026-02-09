import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Loader2, Check } from 'lucide-react';

export default function Signup() {
  const { login, isAuthenticated, isLoading, error } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Handle Cognito signup redirect (same as login - Cognito handles signup)
  function handleSignup() {
    login(); // Cognito hosted UI handles both login and signup
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Setting up your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 p-12 items-center justify-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-white/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-yellow-500/20 blur-[120px] rounded-full" />

        <div className="relative z-10 max-w-lg text-center">
          <div className="mb-8">
            <span className="text-xs font-black text-white/80 uppercase tracking-[0.3em]">Start Your Journey</span>
          </div>

          <h2 className="text-5xl font-black text-white tracking-tight leading-tight mb-6">
            Deploy Your AI Contact Center in Minutes
          </h2>
          <p className="text-xl text-white/80 font-medium leading-relaxed">
            No credit card required. Full access to enterprise features. Cancel anytime.
          </p>

          {/* Features */}
          <div className="mt-12 space-y-4 text-left">
            {[
              'AI-powered voice agents included',
              'Unlimited phone numbers',
              'Real-time analytics dashboard',
              '24/7 customer support',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
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
              Create your account
            </h1>
            <p className="text-gray-500 text-lg">
              Start your 14-day free trial today
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
            onClick={handleSignup}
            className="w-full h-14 bg-orange-500 text-white rounded-2xl font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl mb-6"
          >
            Create Account
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

          {/* Benefits */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Check className="w-4 h-4 text-orange-600" />
              </div>
              <span className="text-sm font-medium">14-day free trial, no credit card</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Check className="w-4 h-4 text-orange-600" />
              </div>
              <span className="text-sm font-medium">Full access to all features</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Check className="w-4 h-4 text-orange-600" />
              </div>
              <span className="text-sm font-medium">Cancel anytime, no commitment</span>
            </div>
          </div>

          {/* Terms */}
          <p className="mt-6 text-xs text-gray-500 text-center">
            By creating an account, you agree to our{' '}
            <a href="/terms" className="font-bold text-black hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="font-bold text-black hover:underline">Privacy Policy</a>
          </p>

          {/* Sign In Link */}
          <p className="mt-8 text-center text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-black hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
