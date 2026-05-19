'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote: 'ViralFlux AI cut my content production time from 6 hours to 20 minutes per episode. The AI detection is scary accurate at finding the best moments.',
    author: 'Sarah Chen',
    role: 'Podcaster, The Tech Hour',
    initials: 'SC',
  },
  {
    quote: 'We manage 12 client brands and ViralFlux is the only tool that lets us white-label everything. Our clients think we have a full video team.',
    author: 'Marcus Johnson',
    role: 'CEO, Content Studio Pro',
    initials: 'MJ',
  },
  {
    quote: 'I went from 0 to 50K TikTok followers in 3 months using ViralFlux. It automatically finds the hooks I would have missed.',
    author: 'Priya Patel',
    role: 'Creator & Coach',
    initials: 'PP',
  },
  {
    quote: 'The caption generator alone is worth the subscription. It writes better hooks than my copywriter.',
    author: 'Jake Thompson',
    role: 'YouTuber, 2M subscribers',
    initials: 'JT',
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="relative py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Loved by Creators Worldwide
          </h2>
          <p className="text-lg text-[#888] max-w-2xl mx-auto">
            Join thousands of creators, podcasters, and agencies using ViralFlux AI.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TESTIMONIALS.map((testimonial, i) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-5 rounded-xl bg-[#111] border border-[#1a1a1a] hover:border-[#222] transition-all"
            >
              <Quote className="w-6 h-6 text-blue-500/30 mb-3" />
              <p className="text-sm text-[#888] leading-relaxed mb-4">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{testimonial.author}</p>
                  <p className="text-xs text-[#666]">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
