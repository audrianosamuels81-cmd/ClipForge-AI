'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    question: 'How does ViralFlux AI detect viral moments?',
    answer: 'Our AI analyzes speech patterns, audio energy, facial expressions, and engagement signals to identify hooks, emotional spikes, and moments most likely to perform well on short-form platforms.',
  },
  {
    question: 'What video formats do you support?',
    answer: 'We support MP4, MOV, AVI, and MKV files up to 6 hours in length depending on your plan. Videos are processed in the cloud so your computer keeps running smoothly.',
  },
  {
    question: 'Can I export to TikTok, Reels, and Shorts?',
    answer: 'Yes. Every export is available in optimized formats for TikTok (9:16), Instagram Reels, and YouTube Shorts. We handle aspect ratios, safe zones, and platform-specific requirements.',
  },
  {
    question: 'Is there a watermark on free trial exports?',
    answer: 'Yes, free trial exports include a small ViralFlux AI watermark. Upgrading to Creator or higher removes the watermark completely.',
  },
  {
    question: 'Can my team collaborate on projects?',
    answer: 'Yes. Pro plans include 3 team seats and Agency plans include up to 15 seats. Team members can upload, edit, and export projects with role-based permissions.',
  },
  {
    question: 'How does billing work?',
    answer: 'We offer monthly and yearly billing. Yearly plans save you 20%. You can upgrade, downgrade, or cancel anytime. All plans include a 14-day money-back guarantee.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-20 lg:py-28">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-[#888]">
            Everything you need to know about ViralFlux AI
          </p>
        </motion.div>

        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-[#1a1a1a] bg-[#111] overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="text-sm font-medium text-white pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#666] flex-shrink-0 transition-transform ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-4 pb-4">
                      <p className="text-sm text-[#888] leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
