'use client';

import { motion } from 'framer-motion';
import { User, Bell, Palette, Mail, Shield, Clock } from 'lucide-react';

const TEAM_MEMBERS = [
  { name: 'John Doe', email: 'john@agency.com', role: 'Owner', status: 'active', joined: 'Jan 2024' },
  { name: 'Sarah Smith', email: 'sarah@agency.com', role: 'Admin', status: 'active', joined: 'Feb 2024' },
  { name: 'Mike Johnson', email: 'mike@agency.com', role: 'Editor', status: 'active', joined: 'Mar 2024' },
  { name: 'Emily Davis', email: 'emily@agency.com', role: 'Viewer', status: 'pending', joined: '-' },
];

export default function TeamPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-semibold text-white">Team</h1>
        <p className="text-sm text-[#888] mt-1">Manage your team members and permissions</p>
      </motion.div>

      {/* Invite */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="p-4 rounded-xl bg-[#111] border border-[#1a1a1a]"
      >
        <h3 className="text-sm font-medium text-white mb-3">Invite Team Member</h3>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
            <input
              type="email"
              placeholder="colleague@example.com"
              className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <select className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50">
            <option>Editor</option>
            <option>Admin</option>
            <option>Viewer</option>
          </select>
          <button className="px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl hover:opacity-90 transition-all whitespace-nowrap">
            Invite
          </button>
        </div>
      </motion.div>

      {/* Team List */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-2">
        {TEAM_MEMBERS.map((member, i) => (
          <motion.div
            key={member.email}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="flex items-center justify-between p-3 rounded-xl bg-[#111] border border-[#1a1a1a] hover:border-[#222] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="text-sm text-white">{member.name}</p>
                <p className="text-xs text-[#666]">{member.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-[10px] text-[#888] flex items-center gap-1">
                  <Shield className="w-3 h-3" /> {member.role}
                </p>
                <p className="text-[10px] text-[#666] flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" /> {member.joined}
                </p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                member.status === 'active'
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-amber-500/10 text-amber-400'
              }`}>
                {member.status}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
