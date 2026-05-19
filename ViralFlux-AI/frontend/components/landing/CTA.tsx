'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function CTA() {
  return (
    <section className="relative py-20 lg:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative p-8 sm:p-12 rounded-2xl bg-[#111] border border-[#1a1a1a] overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-purple-500/5 rounded-full blur-[60px]" />

          <div className="relative">
            <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
              Start Creating Viral Content Today
            </h2>
            <p className="text-base text-[#888] max-w-xl mx-auto mb-6 text-balance">
              Join thousands of creators using ViralFlux AI to turn long-form content into viral shorts. 
              No credit card required. Cancel anytime.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl hover:opacity-90 transition-all"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#pricing"
                className="inline-flex items-center gap-2 px-8 py-3 text-sm font-semibold text-[#888] bg-[#0a0a0a] rounded-xl hover:bg-[#141414] transition-all border border-[#1a1a1a]"
              >
                View Pricing
              </Link>
            </div>

            <p className="mt-5 text-xs text-[#666]">
              Free plan includes 3 exports. No credit card required.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
