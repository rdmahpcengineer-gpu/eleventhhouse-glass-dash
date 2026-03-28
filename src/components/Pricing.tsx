import React, { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { redirectToCheckout } from '../lib/stripe';
import { trackPricingCTAClick, trackCheckoutStarted } from '../lib/analytics';

interface PricingTier {
  name: string;
  price: number | string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
  badge?: string;
}

const tiers: PricingTier[] = [
  {
    name: 'Starter',
    price: 49,
    period: 'per agent/month',
    description: 'Perfect for small teams getting started',
    features: [
      'Up to 5 agents',
      '1 phone number included',
      'Basic IVR flows',
      'Email support',
      '7-day data retention',
      'Standard analytics',
    ],
    cta: 'Start Free Trial',
    highlighted: false,
  },
  {
    name: 'Growth',
    price: 99,
    period: 'per agent/month',
    description: 'For growing teams that need more power',
    features: [
      'Up to 25 agents',
      '5 phone numbers included',
      'Advanced IVR with AI',
      'Priority support',
      '90-day data retention',
      'Real-time analytics',
      'CRM integrations',
      'Custom reporting',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'Scale',
    price: 199,
    period: 'per agent/month',
    description: 'For teams that demand enterprise features',
    features: [
      'Unlimited agents',
      'Unlimited phone numbers',
      'AI agents included',
      '24/7 dedicated support',
      '1-year data retention',
      'Advanced AI insights',
      'All integrations',
      'Custom contact flows',
      'SSO / SAML',
      'Audit logs',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

function PricingCard({ tier, isAnnual }: { tier: PricingTier; isAnnual: boolean }) {
  const [loading, setLoading] = useState(false);
  const displayPrice = typeof tier.price === 'number' && isAnnual
    ? Math.round(tier.price * 0.8)
    : tier.price;

  function handleCTAClick() {
    const tierKey = tier.name.toLowerCase();
    const billingCycle = isAnnual ? 'annual' : 'monthly';
    trackPricingCTAClick(tier.name, billingCycle);

    // Scale tier → scroll to contact sales
    if (tierKey === 'scale') {
      document.querySelector('#contact-sales')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const price = typeof tier.price === 'number'
      ? (isAnnual ? Math.round(tier.price * 0.8) : tier.price)
      : 0;
    trackCheckoutStarted(tier.name, price, billingCycle);

    setLoading(true);
    const redirected = redirectToCheckout(tier.name, isAnnual);
    if (!redirected) {
      // Stripe links not configured — fall back to signup
      window.location.href = '/signup?plan=' + tierKey + '&billing=' + billingCycle;
    }
  }

  return (
    <div
      className={cn(
        'relative rounded-[2.5rem] p-8 h-full flex flex-col transition-all duration-300',
        tier.highlighted
          ? 'bg-black text-white shadow-2xl scale-105 z-10'
          : 'bg-white border border-gray-200 hover:shadow-xl'
      )}
    >
      {tier.badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-blue-500 text-xs font-black text-white shadow-lg uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            {tier.badge}
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className={cn(
          'text-xl font-black mb-2 tracking-tight',
          tier.highlighted ? 'text-white' : 'text-gray-900'
        )}>
          {tier.name}
        </h3>
        <p className={cn(
          'text-sm',
          tier.highlighted ? 'text-gray-400' : 'text-gray-500'
        )}>
          {tier.description}
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          {typeof displayPrice === 'number' ? (
            <>
              <span className="text-lg">$</span>
              <span className="text-5xl font-black tracking-tight">{displayPrice}</span>
            </>
          ) : (
            <span className="text-4xl font-black">{displayPrice}</span>
          )}
        </div>
        <span className={cn(
          'text-sm',
          tier.highlighted ? 'text-gray-400' : 'text-gray-500'
        )}>
          {tier.period}
        </span>
      </div>

      <button
        onClick={handleCTAClick}
        disabled={loading}
        className={cn(
          'w-full py-4 rounded-2xl font-black text-sm tracking-widest uppercase mb-8 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-wait',
          tier.highlighted
            ? 'bg-white text-black hover:bg-gray-100'
            : 'bg-black text-white hover:bg-gray-800'
        )}
      >
        {loading ? 'Redirecting...' : tier.cta}
      </button>

      <ul className="space-y-3 flex-1">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <Check className={cn(
              'w-5 h-5 shrink-0 mt-0.5',
              tier.highlighted ? 'text-orange-400' : 'text-emerald-500'
            )} />
            <span className={cn(
              'text-sm',
              tier.highlighted ? 'text-gray-300' : 'text-gray-600'
            )}>
              {feature}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const Pricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="py-24 md:py-40">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-black tracking-[0.5em] uppercase text-orange-500 mb-4 block">
            Pricing
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none mb-4">
            Simple, <span className="text-gray-400">Transparent</span>
          </h2>
          <p className="text-xl text-gray-500 font-medium">
            Start free. Scale as you grow. No hidden fees.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={cn(
            'text-sm font-bold',
            !isAnnual ? 'text-gray-900' : 'text-gray-500'
          )}>
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={cn(
              'relative w-14 h-7 rounded-full transition-colors',
              isAnnual ? 'bg-black' : 'bg-gray-300'
            )}
          >
            <span className={cn(
              'absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-transform',
              isAnnual ? 'translate-x-8' : 'translate-x-1'
            )} />
          </button>
          <span className={cn(
            'text-sm font-bold',
            isAnnual ? 'text-gray-900' : 'text-gray-500'
          )}>
            Annual <span className="text-emerald-500 font-black">Save 20%</span>
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
          {tiers.map((tier) => (
            <PricingCard key={tier.name} tier={tier} isAnnual={isAnnual} />
          ))}
        </div>

        {/* Enterprise CTA */}
        <div id="contact-sales" className="mt-16 text-center p-8 rounded-[2.5rem] bg-gray-50 border border-gray-200 max-w-4xl mx-auto">
          <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">
            Need Enterprise Features?
          </h3>
          <p className="text-gray-500 mb-6 max-w-xl mx-auto">
            Custom deployments, dedicated infrastructure, HIPAA BAA, and
            white-glove onboarding for large organizations.
          </p>
          <button className="px-8 py-4 bg-black text-white rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-gray-800 transition-all shadow-lg active:scale-95">
            Contact Sales
          </button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
