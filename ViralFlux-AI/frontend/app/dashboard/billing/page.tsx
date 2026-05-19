'use client';

import { motion } from 'framer-motion';
import { CreditCard, CheckCircle2, Download, ArrowRight, Sparkles, Receipt } from 'lucide-react';
import Link from 'next/link';

const BILLING_HISTORY = [
  { date: 'Mar 1, 2024', amount: '$29.00', plan: 'Creator - Monthly', status: 'paid', invoice: '#INV-001' },
  { date: 'Feb 1, 2024', amount: '$29.00', plan: 'Creator - Monthly', status: 'paid', invoice: '#INV-002' },
  { date: 'Jan 1, 2024', amount: '$0.00', plan: 'Free Trial', status: 'trial', invoice: '-' },
];

export default function BillingPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-semibold text-white">Billing</h1>
        <p className="text-sm text-[#888] mt-1">Manage your subscription and payment history</p>
      </motion.div>

      {/* Current Plan */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="p-5 rounded-xl bg-[#111] border border-blue-500/20"
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-medium text-blue-400">Current Plan</span>
            </div>
            <h2 className="text-lg font-bold text-white">Creator Plan</h2>
            <p className="text-sm text-[#888] mt-0.5">$29/month — 50 exports, 60 min videos, no watermark</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Active
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            href="/pricing"
            className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl hover:opacity-90 transition-all"
          >
            Upgrade Plan
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-[#888] bg-[#1a1a1a] rounded-xl hover:bg-[#222] transition-all border border-[#222]">
            Cancel Subscription
          </button>
        </div>
      </motion.div>

      {/* Usage */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-5 rounded-xl bg-[#111] border border-[#1a1a1a]"
      >
        <h3 className="text-sm font-medium text-white mb-4">This Month&apos;s Usage</h3>
        <div className="space-y-4">
          {[
            { label: 'Video Exports', used: 12, total: 50, color: 'from-blue-500 to-purple-600' },
            { label: 'AI Generations', used: 47, total: 200, color: 'from-emerald-500 to-teal-600' },
            { label: 'Team Seats', used: 1, total: 3, color: 'from-purple-500 to-pink-600' },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-[#888]">{item.label}</span>
                <span className="text-white font-medium">{item.used} / {item.total}</span>
              </div>
              <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                  style={{ width: `${(item.used / item.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Payment Method */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="p-5 rounded-xl bg-[#111] border border-[#1a1a1a]"
      >
        <h3 className="text-sm font-medium text-white mb-3">Payment Method</h3>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a]">
          <div className="w-10 h-7 rounded bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-white">Visa ending in 4242</p>
            <p className="text-xs text-[#666]">Expires 12/26</p>
          </div>
          <button className="text-xs text-blue-400 hover:text-blue-300">Update</button>
        </div>
      </motion.div>

      {/* Billing History */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-5 rounded-xl bg-[#111] border border-[#1a1a1a]"
      >
        <h3 className="text-sm font-medium text-white mb-3">Billing History</h3>
        <div className="space-y-2">
          {BILLING_HISTORY.map((item) => (
            <div key={item.invoice} className="flex items-center justify-between p-3 rounded-xl bg-[#0a0a0a]">
              <div className="flex items-center gap-2.5">
                <Receipt className="w-4 h-4 text-[#666]" />
                <div>
                  <p className="text-sm text-white">{item.plan}</p>
                  <p className="text-xs text-[#666]">{item.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">{item.amount}</span>
                {item.status === 'paid' ? (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" /> Paid
                  </span>
                ) : (
                  <span className="text-[10px] text-[#666]">Trial</span>
                )}
                {item.invoice !== '-' && (
                  <button className="text-[#666] hover:text-white transition-colors">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
