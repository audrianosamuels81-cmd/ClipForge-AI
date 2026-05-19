'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Play, CheckCircle2, Video, Film, Scissors, Wand2, Zap, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const FEATURES = [
  { icon: Video, title: 'Create Video', desc: 'Generate AI videos from text or images', badge: 'top' as const },
  { icon: Film, title: 'Cinema Studio', desc: 'Cinematic video with AI director', badge: 'top' as const },
  { icon: Scissors, title: 'Edit Video', desc: 'Edit scenes, shots, elements', badge: null },
  { icon: Wand2, title: 'AI Captions', desc: 'Auto-generate viral captions & titles', badge: 'new' as const },
  { icon: Zap, title: 'Click to Ad', desc: 'Turn product URLs into video ads', badge: null },
  { icon: TrendingUp, title: 'Viral Trends', desc: 'Turn ideas into viral videos', badge: 'new' as const },
];

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-14">
      <div className="absolute inset-0 bg-[#0a0a0a]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/15 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Content Creation
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance max-w-4xl mx-auto leading-tight"
        >
          Turn Long Videos Into{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Viral Shorts
          </span>{' '}
          with AI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-[#888] max-w-2xl mx-auto text-balance"
        >
          Upload your long-form content once. ViralFlux AI automatically detects viral moments, 
          generates vertical clips, adds captions, and exports ready-to-post shorts.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            href="/auth/signup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Start Free Trial
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="#demo"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold text-[#888] bg-[#111] rounded-xl hover:bg-[#1a1a1a] transition-all border border-[#1a1a1a]"
          >
            <Play className="w-4 h-4" />
            See How It Works
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-[#666]"
        >
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> No credit card
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 3 free exports
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Cancel anytime
          </span>
        </motion.div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
              className="feature-card group"
            >
              <div className="feature-card-icon group-hover:bg-[#222] transition-colors">
                <feature.icon className="w-5 h-5 text-[#888]" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-white truncate">{feature.title}</span>
                  {feature.badge === 'top' && <span className="badge-top">TOP</span>}
                  {feature.badge === 'new' && <span className="badge-new">NEW</span>}
                </div>
                <p className="text-[11px] text-[#666] truncate mt-0.5">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
