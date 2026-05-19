'use client';

import { motion } from 'framer-motion';
import {
  Video,
  Upload,
  TrendingUp,
  Clock,
  BarChart3,
  Sparkles,
  Play,
  Film,
  Scissors,
  Wand2,
  Zap,
  MessageSquare,
  PenTool,
  Palette,
  Crown,
  ArrowRight,
  Plus,
} from 'lucide-react';
import Link from 'next/link';

const STATS = [
  { label: 'Exports This Month', value: '12', change: '+20%', icon: Video },
  { label: 'Exports Remaining', value: '38', change: '50 limit', icon: Upload },
  { label: 'AI Generations', value: '47', change: '+12%', icon: Sparkles },
  { label: 'Total Views', value: '128.5K', change: '+8.3%', icon: TrendingUp },
];

const FEATURE_CARDS = [
  {
    icon: Video,
    title: 'Create Video',
    desc: 'Generate AI videos from text or images',
    badge: 'top' as const,
    href: '/dashboard/upload',
  },
  {
    icon: Film,
    title: 'Cinema Studio',
    desc: 'Cinematic video with AI director',
    badge: 'top' as const,
    href: '/dashboard/projects',
  },
  {
    icon: Palette,
    title: 'Mixed Media',
    desc: 'Create mixed media projects',
    badge: null,
    href: '/dashboard/upload',
  },
  {
    icon: Scissors,
    title: 'Edit Video',
    desc: 'Edit scenes, shots, elements',
    badge: null,
    href: '/dashboard/upload',
  },
  {
    icon: Zap,
    title: 'Click to Ad',
    desc: 'Turn product URLs into video ads',
    badge: null,
    href: '/dashboard/upload',
  },
  {
    icon: TrendingUp,
    title: 'Viral Trends',
    desc: 'Turn ideas into viral videos',
    badge: 'new' as const,
    href: '/dashboard/projects',
  },
  {
    icon: MessageSquare,
    title: 'Lipsync Studio',
    desc: 'Create talking clips',
    badge: null,
    href: '/dashboard/upload',
  },
  {
    icon: PenTool,
    title: 'Draw to Video',
    desc: 'Sketch turns into cinema',
    badge: null,
    href: '/dashboard/upload',
  },
  {
    icon: Palette,
    title: 'Sketch to Video',
    desc: 'From sketch to video with AI',
    badge: 'new' as const,
    href: '/dashboard/upload',
  },
  {
    icon: Video,
    title: 'UGC Factory',
    desc: 'Build UGC video with avatar',
    badge: null,
    href: '/dashboard/upload',
  },
];

const MODEL_CARDS = [
  {
    icon: BarChart3,
    title: 'ViralFlux 2.0',
    desc: 'Most advanced clip model',
    badge: 'top' as const,
  },
  {
    icon: Film,
    title: 'ViralFlux 3.0',
    desc: 'Cinematic clips with audio',
    badge: null,
  },
  {
    icon: Play,
    title: 'VF Motion Control',
    desc: 'Transfer motion to clips',
    badge: 'new' as const,
  },
  {
    icon: Scissors,
    title: 'VF Edit Pro',
    desc: 'Advanced video editing',
    badge: null,
  },
  {
    icon: Sparkles,
    title: 'Sora Clips',
    desc: 'OpenAI powered clips',
    badge: null,
  },
  {
    icon: Video,
    title: 'Google Veo Lite',
    desc: 'Fast clip generation',
    badge: 'new' as const,
  },
  {
    icon: Film,
    title: 'Google Veo 3.1',
    desc: 'Advanced AI video with sound',
    badge: null,
  },
  {
    icon: Play,
    title: 'HappyHorse',
    desc: 'Ranked #1 video model',
    badge: 'new' as const,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-xl font-semibold text-white">Welcome back, John</h1>
        <p className="text-sm text-[#888] mt-1">Create viral short-form content with AI</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 rounded-xl bg-[#111] border border-[#1a1a1a]"
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="w-4 h-4 text-[#888]" />
              <span className="text-[10px] font-medium text-emerald-400">{stat.change}</span>
            </div>
            <p className="text-lg font-bold text-white">{stat.value}</p>
            <p className="text-xs text-[#666] mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Features Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white">Features</h2>
          <Link
            href="/dashboard/upload"
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {FEATURE_CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.03 }}
            >
              <Link href={card.href}>
                <div className="feature-card group">
                  <div className="feature-card-icon group-hover:bg-[#222] transition-colors">
                    <card.icon className="w-5 h-5 text-[#888]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-white truncate">{card.title}</span>
                      {card.badge === 'top' && <span className="badge-top">TOP</span>}
                      {card.badge === 'new' && <span className="badge-new">NEW</span>}
                    </div>
                    <p className="text-[11px] text-[#666] truncate mt-0.5">{card.desc}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Models Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white">Models</h2>
          <span className="text-xs text-[#666]">{MODEL_CARDS.length} available</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {MODEL_CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.03 }}
            >
              <div className="feature-card group cursor-pointer">
                <div className="feature-card-icon relative group-hover:bg-[#222] transition-colors">
                  {card.badge === 'top' && (
                    <span className="absolute -top-1.5 -right-1.5 badge-top">TOP</span>
                  )}
                  <card.icon className="w-5 h-5 text-[#888]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-white truncate">{card.title}</span>
                    {card.badge === 'new' && <span className="badge-new">NEW</span>}
                  </div>
                  <p className="text-[11px] text-[#666] truncate mt-0.5">{card.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Action */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Link
          href="/dashboard/upload"
          className="group flex items-center justify-between p-4 rounded-xl bg-[#111] border border-[#1a1a1a] hover:border-[#333] transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors">
                Start a new project
              </p>
              <p className="text-xs text-[#666] mt-0.5">Upload a video and let AI find viral moments</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#666] group-hover:text-white transition-colors" />
        </Link>
      </motion.div>
    </div>
  );
}
