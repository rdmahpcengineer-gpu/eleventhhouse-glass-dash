// Stripe Payment Links — hosted checkout, no backend required.
// Set these in your .env file after creating products/payment links in Stripe dashboard.
//
// How to create payment links:
// 1. Go to Stripe Dashboard → Payment Links
// 2. Create a product for each tier with a recurring price
// 3. Copy the payment link URL into env vars below
// 4. Add ?prefilled_email={email} to pre-fill email when available

export interface StripeCheckoutConfig {
  tier: string;
  monthlyLink: string | null;
  annualLink: string | null;
  monthlyPrice: number;
  annualPrice: number;
}

const STRIPE_LINKS: Record<string, StripeCheckoutConfig> = {
  starter: {
    tier: 'Starter',
    monthlyLink: import.meta.env.VITE_STRIPE_LINK_STARTER_MONTHLY || null,
    annualLink: import.meta.env.VITE_STRIPE_LINK_STARTER_ANNUAL || null,
    monthlyPrice: 49,
    annualPrice: Math.round(49 * 0.8 * 12),
  },
  growth: {
    tier: 'Growth',
    monthlyLink: import.meta.env.VITE_STRIPE_LINK_GROWTH_MONTHLY || null,
    annualLink: import.meta.env.VITE_STRIPE_LINK_GROWTH_ANNUAL || null,
    monthlyPrice: 99,
    annualPrice: Math.round(99 * 0.8 * 12),
  },
  scale: {
    tier: 'Scale',
    monthlyLink: null, // Scale tier uses sales flow
    annualLink: null,
    monthlyPrice: 199,
    annualPrice: Math.round(199 * 0.8 * 12),
  },
};

export function getStripeCheckoutUrl(
  tier: string,
  isAnnual: boolean,
  email?: string
): string | null {
  const config = STRIPE_LINKS[tier.toLowerCase()];
  if (!config) return null;

  const link = isAnnual ? config.annualLink : config.monthlyLink;
  if (!link) return null;

  return email ? `${link}?prefilled_email=${encodeURIComponent(email)}` : link;
}

export function redirectToCheckout(
  tier: string,
  isAnnual: boolean,
  email?: string
): boolean {
  const url = getStripeCheckoutUrl(tier, isAnnual, email);
  if (url) {
    window.location.href = url;
    return true;
  }
  return false;
}

// Success/cancel return URLs for payment links (configure in Stripe dashboard)
export const CHECKOUT_SUCCESS_URL =
  typeof window !== 'undefined'
    ? `${window.location.origin}/checkout/success`
    : '/checkout/success';

export const CHECKOUT_CANCEL_URL =
  typeof window !== 'undefined'
    ? `${window.location.origin}/checkout/cancel`
    : '/checkout/cancel';
