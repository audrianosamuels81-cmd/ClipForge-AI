'use client';

import { motion } from 'framer-motion';
import { User, Bell, Palette } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-semibold text-white">Settings</h1>
        <p className="text-sm text-[#888] mt-1">Manage your account settings and preferences</p>
      </motion.div>

      {/* Profile */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="p-5 rounded-xl bg-[#111] border border-[#1a1a1a]"
      >
        <div className="flex items-center gap-2 mb-4">
          <User className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-medium text-white">Profile</h3>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-[#888] mb-1.5">Full name</label>
            <input
              type="text"
              defaultValue="John Doe"
              className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#888] mb-1.5">Email</label>
            <input
              type="email"
              defaultValue="john@example.com"
              className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <button className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl hover:opacity-90 transition-all">
            Save Changes
          </button>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-5 rounded-xl bg-[#111] border border-[#1a1a1a]"
      >
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-medium text-white">Notifications</h3>
        </div>
        <div className="space-y-3">
          {['Export complete notifications', 'Weekly usage summary', 'Product updates'].map((item) => (
            <label key={item} className="flex items-center justify-between py-1">
              <span className="text-sm text-[#888]">{item}</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-[#333] bg-[#0a0a0a] text-blue-500 focus:ring-blue-500" />
            </label>
          ))}
        </div>
      </motion.div>

      {/* Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="p-5 rounded-xl bg-[#111] border border-[#1a1a1a]"
      >
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-medium text-white">Preferences</h3>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-[#888] mb-1.5">Theme</label>
            <select className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50">
              <option>Dark (Default)</option>
              <option>Light</option>
              <option>System</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#888] mb-1.5">Language</label>
            <select className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50">
              <option>English (US)</option>
              <option>Spanish</option>
              <option>French</option>
              <option>Japanese</option>
            </select>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
