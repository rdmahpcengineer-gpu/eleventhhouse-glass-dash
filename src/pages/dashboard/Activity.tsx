import React from 'react';
import { GlassCard } from '../../../ehcx.ai-metrics-dashboard-metrivcs 2/components/GlassCard';

const LIVE_CALLS = [
  { id: 1, caller: '+1 (555) 123-4567', agent: 'Lora Piterson', duration: '04:32', status: 'active', type: 'Inbound' },
  { id: 2, caller: '+1 (555) 987-6543', agent: 'Randy Gouse', duration: '02:15', status: 'active', type: 'Outbound' },
  { id: 3, caller: '+1 (555) 456-7890', agent: 'Marcus Chen', duration: '08:47', status: 'active', type: 'Inbound' },
  { id: 4, caller: '+1 (555) 321-0987', agent: 'AI Agent #1', duration: '01:23', status: 'active', type: 'Inbound' },
];

const RECENT_ACTIVITY = [
  { id: 1, event: 'Call completed', agent: 'Giana Schleifer', time: '2 mins ago', details: 'Duration: 5:32 | CSAT: 5/5' },
  { id: 2, event: 'New ticket created', agent: 'System', time: '5 mins ago', details: 'Ticket #4521 - Billing inquiry' },
  { id: 3, event: 'Agent went on break', agent: 'Giana Schleifer', time: '8 mins ago', details: 'Scheduled 15 min break' },
  { id: 4, event: 'Call transferred', agent: 'AI Agent #2', time: '12 mins ago', details: 'Escalated to human agent' },
  { id: 5, event: 'Queue alert cleared', agent: 'System', time: '15 mins ago', details: 'Wait time back to normal' },
];

export default function Activity() {
  return (
    <>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Live Activity</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Monitor real-time calls and activity across your contact center.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-sm font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            12 Active Calls
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <GlassCard className="flex flex-col gap-1">
          <span className="text-gray-500 dark:text-gray-400 text-sm">Active Calls</span>
          <span className="text-3xl font-bold text-gray-900 dark:text-white">12</span>
          <span className="text-green-500 text-xs font-semibold">+3 from avg</span>
        </GlassCard>
        <GlassCard className="flex flex-col gap-1">
          <span className="text-gray-500 dark:text-gray-400 text-sm">In Queue</span>
          <span className="text-3xl font-bold text-gray-900 dark:text-white">8</span>
          <span className="text-[#FFB162] text-xs font-semibold">2 min avg wait</span>
        </GlassCard>
        <GlassCard className="flex flex-col gap-1">
          <span className="text-gray-500 dark:text-gray-400 text-sm">Available Agents</span>
          <span className="text-3xl font-bold text-gray-900 dark:text-white">24</span>
          <span className="text-gray-500 text-xs font-semibold">of 32 total</span>
        </GlassCard>
        <GlassCard className="flex flex-col gap-1" dark>
          <span className="text-gray-300 text-sm">AI Handling</span>
          <span className="text-3xl font-bold">34%</span>
          <span className="text-green-400 text-xs font-semibold">4 AI agents active</span>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Live Calls</h3>
            <span className="text-xs font-semibold px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">LIVE</span>
          </div>
          <div className="space-y-3">
            {LIVE_CALLS.map((call) => (
              <div key={call.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-transparent dark:border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <span className="text-blue-500">{call.type === 'Inbound' ? '📞' : '📱'}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{call.caller}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{call.agent}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-gray-900 dark:text-white">{call.duration}</p>
                  <span className={`text-[10px] font-bold ${call.type === 'Inbound' ? 'text-blue-500' : 'text-[#FFB162]'}`}>{call.type.toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Recent Activity</h3>
            <button className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {RECENT_ACTIVITY.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-gray-200/50 dark:border-white/5 last:border-0 last:pb-0">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{activity.event}</p>
                    <span className="text-xs text-gray-400">{activity.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.agent}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.details}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </>
  );
}
