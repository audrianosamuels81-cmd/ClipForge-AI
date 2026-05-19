'use client';

import { motion } from 'framer-motion';
import { Play, Clock, MoreVertical, Film, Sparkles, ExternalLink, Plus } from 'lucide-react';
import Link from 'next/link';

const PROJECTS = [
  { name: 'Podcast Episode #47 - AI Revolution', date: 'Mar 15, 2024', duration: '45:20', clips: 8, views: '12.4K' },
  { name: 'YouTube Vlog - Tokyo Travel Guide', date: 'Mar 14, 2024', duration: '32:15', clips: 12, views: '28.1K' },
  { name: 'Client Review - Brand X Campaign', date: 'Mar 12, 2024', duration: '18:30', clips: 5, views: '8.2K' },
  { name: 'Tech Tutorial - Next.js Full Course', date: 'Mar 10, 2024', duration: '52:10', clips: 15, views: '45.3K' },
  { name: 'Interview with Marcus Chen', date: 'Mar 8, 2024', duration: '38:45', clips: 10, views: '19.7K' },
  { name: 'Morning Routine - Productivity', date: 'Mar 5, 2024', duration: '15:20', clips: 6, views: '34.2K' },
];

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">My Projects</h1>
          <p className="text-sm text-[#888] mt-1">All your video projects and generated clips</p>
        </div>
        <Link
          href="/dashboard/upload"
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl hover:opacity-90 transition-all"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {PROJECTS.map((project, i) => (
          <motion.div
            key={project.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group rounded-xl bg-[#111] border border-[#1a1a1a] overflow-hidden hover:border-[#333] transition-all"
          >
            {/* Thumbnail */}
            <div className="aspect-video bg-[#0a0a0a] flex items-center justify-center relative">
              <Play className="w-10 h-10 text-[#333] group-hover:text-blue-400 transition-colors" />
              <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-medium bg-black/60 text-white backdrop-blur-sm">
                {project.duration}
              </span>
            </div>

            <div className="p-3">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors line-clamp-2">
                  {project.name}
                </h3>
                <button className="p-1 text-[#666] hover:text-white opacity-0 group-hover:opacity-100 transition-all">
                  <MoreVertical className="w-3 h-3" />
                </button>
              </div>

              <div className="flex items-center gap-3 text-[10px] text-[#666]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {project.date}
                </span>
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> {project.clips} clips
                </span>
              </div>

              <div className="mt-2 pt-2 border-t border-[#1a1a1a] flex items-center justify-between">
                <span className="text-[10px] text-[#666]">{project.views} views</span>
                <Link href="#" className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1">
                  View Clips <ExternalLink className="w-2.5 h-2.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
