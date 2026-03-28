let _stripe: import('stripe').default | null = null

export function getStripe() {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) return null
    const Stripe = require('stripe').default
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia',
    })
  }
  return _stripe
}

export const PLATFORM_FEE_PERCENT = 5
