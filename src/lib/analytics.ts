import posthog from 'posthog-js';

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';

export function initAnalytics() {
  if (!POSTHOG_KEY) return;
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: 'identified_only',
    capture_pageview: true,
    capture_pageleave: true,
  });
}

export const analytics = {
  track(event: string, properties?: Record<string, unknown>) {
    if (!POSTHOG_KEY) return;
    posthog.capture(event, properties);
  },
  identify(userId: string, traits?: Record<string, unknown>) {
    if (!POSTHOG_KEY) return;
    posthog.identify(userId, traits);
  },
  page(name?: string) {
    if (!POSTHOG_KEY) return;
    posthog.capture('$pageview', { page_name: name });
  },
};

// Typed event helpers
export const trackPricingCTAClick = (tier: string, billingCycle: 'monthly' | 'annual') =>
  analytics.track('pricing_cta_clicked', { tier, billing_cycle: billingCycle });

export const trackCheckoutStarted = (tier: string, price: number, billingCycle: 'monthly' | 'annual') =>
  analytics.track('checkout_started', { tier, price, billing_cycle: billingCycle, currency: 'usd' });

export const trackCheckoutCompleted = (tier: string) =>
  analytics.track('checkout_completed', { tier });

export const trackSignupStarted = (source: string) =>
  analytics.track('signup_started', { source });

export const trackLeadCaptured = (email: string, tier: string) =>
  analytics.track('lead_captured', { email, tier });
