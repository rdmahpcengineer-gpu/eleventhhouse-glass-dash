import React from 'react';
import { XCircle, ArrowLeft } from 'lucide-react';
import { analytics } from '../lib/analytics';

export default function CheckoutCancel() {
  React.useEffect(() => {
    analytics.track('checkout_cancelled');
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-gray-400" />
        </div>

        <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-3">
          No worries.
        </h1>
        <p className="text-lg text-gray-500 mb-8">
          Your checkout was cancelled. No charges were made.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/#pricing"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-black text-white rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-gray-800 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Pricing
          </a>
          <a
            href="/signup"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black border border-gray-200 rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-gray-50 transition-all"
          >
            Start Free Trial
          </a>
        </div>

        <p className="mt-6 text-sm text-gray-400">
          Need help choosing? <a href="mailto:sales@ehcx.ai" className="text-gray-600 underline">Talk to sales</a>
        </p>
      </div>
    </div>
  );
}
