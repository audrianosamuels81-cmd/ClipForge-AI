'use client';

import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const PLANS = [
  {
    name: 'Free Trial',
    monthlyPrice: '$0',
    yearlyPrice: '$0',
    description: 'Perfect for trying out ViralFlux AI',
    features: [
      '3 video exports',
      '15 min max video length',
      'Basic captions',
      '720p export quality',
      'Watermark on exports',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Creator',
    monthlyPrice: '$29',
    yearlyPrice: '$23',
    description: 'For individual content creators',
    features: [
      '50 video exports per month',
      '60 min max video length',
      'AI viral moment detection',
      'Animated captions + emojis',
      '1080p export quality',
      'No watermark',
      'Multi-platform export',
      'Priority support',
    ],
    cta: 'Start Creating',
    popular: true,
  },
  {
    name: 'Pro',
    monthlyPrice: '$79',
    yearlyPrice: '$63',
    description: 'For professional creators and teams',
    features: [
      '200 video exports per month',
      '3 hour max video length',
      'Everything in Creator',
      'Team collaboration (3 seats)',
      'Custom branding',
      'AI title & hashtag generator',
      'Advanced analytics',
      'API access',
    ],
    cta: 'Go Pro',
    popular: false,
  },
  {
    name: 'Agency',
    monthlyPrice: '$199',
    yearlyPrice: '$159',
    description: 'For agencies and content studios',
    features: [
      'Unlimited exports',
      '6 hour max video length',
      'Everything in Pro',
      'Up to 15 team seats',
      'White-label exports',
      'Multi-brand management',
      'Client dashboard',
      'Dedicated support',
      'Custom AI training',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-[#888] max-w-2xl mx-auto">
            Start free, upgrade as you grow. No hidden fees, no surprises.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative flex flex-col rounded-xl border p-5 transition-all ${
                plan.popular
                  ? 'bg-[#111] border-blue-500/30'
                  : 'bg-[#111] border-[#1a1a1a] hover:border-[#222]'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-[10px] font-semibold text-white">
                  Most Popular
                </div>
              )}

              <div className="mb-5">
                <h3 className="text-base font-semibold text-white mb-1">{plan.name}</h3>
                <p className="text-xs text-[#888]">{plan.description}</p>
              </div>

              <div className="mb-5">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">{plan.monthlyPrice}</span>
                  <span className="text-[#888] text-sm">/month</span>
                </div>
                <p className="text-[10px] text-[#666] mt-1">
                  ${plan.yearlyPrice}/mo billed yearly
                </p>
              </div>

              <ul className="flex-1 space-y-2.5 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-xs">
                    <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-[#888]">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.name === 'Agency' ? '/contact' : '/auth/signup'}
                className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90'
                    : 'bg-[#0a0a0a] text-[#888] hover:bg-[#141414] border border-[#1a1a1a]'
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
