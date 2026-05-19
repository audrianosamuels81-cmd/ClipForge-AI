'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Upload,
  FolderOpen,
  CreditCard,
  Settings,
  Users,
  LogOut,
  Sparkles,
  Menu,
  X,
  Bell,
  ChevronDown,
  Video,
  Film,
  Scissors,
  Wand2,
  BarChart3,
  Play,
  MessageSquare,
  PenTool,
  Palette,
  Zap,
  Crown,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SIDEBAR_FEATURES = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { href: '/dashboard/upload', label: 'Create Video', icon: Video, badge: 'top' },
  { href: '/dashboard/projects', label: 'Cinema Studio', icon: Film, badge: 'top' },
  { href: '/dashboard/upload', label: 'Mixed Media', icon: Palette, badge: null },
  { href: '/dashboard/upload', label: 'Edit Video', icon: Scissors, badge: null },
  { href: '/dashboard/upload', label: 'Click to Ad', icon: Zap, badge: null },
  { href: '/dashboard/projects', label: 'Viral Trends', icon: TrendingUp, badge: 'new' },
  { href: '/dashboard/upload', label: 'Lipsync Studio', icon: MessageSquare, badge: null },
  { href: '/dashboard/upload', label: 'Draw to Video', icon: PenTool, badge: null },
  { href: '/dashboard/upload', label: 'Sketch to Video', icon: Palette, badge: 'new' },
  { href: '/dashboard/upload', label: 'UGC Factory', icon: Video, badge: null },
];

const SIDEBAR_MODELS = [
  { href: '/dashboard/upload', label: 'ViralFlux 2.0', desc: 'Most advanced clip model', icon: BarChart3, badge: 'top' },
  { href: '/dashboard/upload', label: 'ViralFlux 3.0', desc: 'Cinematic clips with audio', icon: Film, badge: null },
  { href: '/dashboard/upload', label: 'VF Motion Control', desc: 'Transfer motion to clips', icon: Play, badge: 'new' },
  { href: '/dashboard/upload', label: 'VF Edit Pro', desc: 'Advanced video editing', icon: Scissors, badge: null },
  { href: '/dashboard/upload', label: 'Sora Clips', desc: 'OpenAI powered clips', icon: Sparkles, badge: null },
  { href: '/dashboard/upload', label: 'Google Veo Lite', desc: 'Fast clip generation', icon: Video, badge: 'new' },
  { href: '/dashboard/upload', label: 'Google Veo 3.1', desc: 'Advanced AI video with sound', icon: Film, badge: null },
  { href: '/dashboard/upload', label: 'HappyHorse', desc: 'Ranked #1 video model', icon: Play, badge: 'new' },
];

const BOTTOM_LINKS = [
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
  { href: '/dashboard/team', label: 'Team', icon: Users },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 bg-[#0d0d0d] border-r border-[#1a1a1a] transform transition-transform duration-200 lg:translate-x-0 lg:static lg:inset-auto flex flex-col',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-[#1a1a1a]">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-white">
              Viral<span className="text-blue-400">Flux</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-[#888] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
          {/* Features Section */}
          <div>
            <p className="px-3 text-[10px] font-semibold text-[#666] uppercase tracking-wider mb-2">
              Features
            </p>
            <nav className="space-y-0.5">
              {SIDEBAR_FEATURES.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'sidebar-item',
                      isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'
                    )}
                  >
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                      isActive ? 'bg-[#222]' : 'bg-[#141414]'
                    )}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm truncate">{item.label}</span>
                        {item.badge === 'top' && (
                          <span className="badge-top">TOP</span>
                        )}
                        {item.badge === 'new' && (
                          <span className="badge-new">NEW</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Models Section */}
          <div>
            <p className="px-3 text-[10px] font-semibold text-[#666] uppercase tracking-wider mb-2">
              Models
            </p>
            <nav className="space-y-0.5">
              {SIDEBAR_MODELS.map((item) => (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className="feature-card"
                >
                  <div className="feature-card-icon">
                    {item.badge === 'top' && (
                      <div className="absolute -top-1 -right-1">
                        <span className="badge-top">TOP</span>
                      </div>
                    )}
                    <item.icon className="w-4 h-4 text-[#888]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm text-white truncate">{item.label}</span>
                      {item.badge === 'new' && (
                        <span className="badge-new">NEW</span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#666] truncate mt-0.5">{item.desc}</p>
                  </div>
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[#1a1a1a] p-2 space-y-0.5">
          {BOTTOM_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="sidebar-item sidebar-item-inactive"
            >
              <item.icon className="w-4 h-4" />
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
          <Link
            href="/auth/login"
            className="sidebar-item sidebar-item-inactive text-red-400 hover:text-red-300"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Sign out</span>
          </Link>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-[#1a1a1a]">
          <div className="flex items-center justify-between px-4 h-14">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-[#888] hover:text-white -ml-2"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex-1" />

            <div className="flex items-center gap-3">
              <button className="relative p-2 text-[#888] hover:text-white rounded-lg hover:bg-[#1a1a1a] transition-all">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-500 rounded-full" />
              </button>
              <div className="flex items-center gap-2 pl-3 border-l border-[#1a1a1a]">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-medium text-white">John Doe</p>
                  <p className="text-[10px] text-[#666]">Free Plan</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                  JD
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
