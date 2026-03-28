import React, { useEffect } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { trackCheckoutCompleted } from '../lib/analytics';

export default function CheckoutSuccess() {
  useEffect(() => {
    // Extract tier from URL if Stripe passes it via metadata/redirect
    const params = new URLSearchParams(window.location.search);
    const tier = params.get('tier') || 'unknown';
    trackCheckoutCompleted(tier);
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-500" />
        </div>

        <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-3">
          You're in!
        </h1>
        <p className="text-lg text-gray-500 mb-8">
          Your EHCX.ai subscription is active. Welcome to enterprise-grade AI contact center.
        </p>

        <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
          <h3 className="font-black text-gray-900 mb-3">Next steps:</h3>
          <ol className="space-y-2 text-sm text-gray-600">
            <li className="flex gap-2"><span className="font-bold text-orange-500">1.</span> Check your email for login instructions</li>
            <li className="flex gap-2"><span className="font-bold text-orange-500">2.</span> Set up your first contact flow in minutes</li>
            <li className="flex gap-2"><span className="font-bold text-orange-500">3.</span> Connect your phone number or CRM</li>
          </ol>
        </div>

        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-gray-800 transition-all shadow-lg"
        >
          Go to Dashboard <ArrowRight className="w-4 h-4" />
        </a>

        <p className="mt-4 text-sm text-gray-400">
          Questions? Email <a href="mailto:support@ehcx.ai" className="text-gray-600 underline">support@ehcx.ai</a>
        </p>
      </div>
    </div>
  );
}
