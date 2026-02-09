import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { GlassCard } from '../../../ehcx.ai-metrics-dashboard-metrivcs 2/components/GlassCard';

const WEEKLY_DATA = [
  { day: 'Mon', calls: 1250, resolved: 1180 },
  { day: 'Tue', calls: 1420, resolved: 1350 },
  { day: 'Wed', calls: 1380, resolved: 1290 },
  { day: 'Thu', calls: 1520, resolved: 1480 },
  { day: 'Fri', calls: 1680, resolved: 1590 },
  { day: 'Sat', calls: 890, resolved: 860 },
  { day: 'Sun', calls: 650, resolved: 630 },
];

const CHANNEL_DATA = [
  { name: 'Voice', value: 45, color: '#3B82F6' },
  { name: 'Chat', value: 30, color: '#FFB162' },
  { name: 'Email', value: 15, color: '#10B981' },
  { name: 'SMS', value: 10, color: '#8B5CF6' },
];

const RESOLUTION_DATA = [
  { category: 'First Call', value: 72 },
  { category: 'Escalated', value: 18 },
  { category: 'Follow-up', value: 10 },
];

export default function Analytics() {
  return (
    <>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Deep insights into your contact center performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2 glass rounded-xl text-sm font-medium border-none focus:outline-none focus:ring-2 focus:ring-blue-500/50">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
          <button className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
            Export Report
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <GlassCard className="flex flex-col gap-1">
          <span className="text-gray-500 dark:text-gray-400 text-sm">Total Interactions</span>
          <span className="text-3xl font-bold text-gray-900 dark:text-white">8,790</span>
          <span className="text-green-500 text-xs font-semibold">+12.3% vs last week</span>
        </GlassCard>
        <GlassCard className="flex flex-col gap-1">
          <span className="text-gray-500 dark:text-gray-400 text-sm">Resolution Rate</span>
          <span className="text-3xl font-bold text-gray-900 dark:text-white">94.2%</span>
          <span className="text-green-500 text-xs font-semibold">+2.1% improvement</span>
        </GlassCard>
        <GlassCard className="flex flex-col gap-1">
          <span className="text-gray-500 dark:text-gray-400 text-sm">Avg Handle Time</span>
          <span className="text-3xl font-bold text-gray-900 dark:text-white">4:32</span>
          <span className="text-green-500 text-xs font-semibold">-45s from target</span>
        </GlassCard>
        <GlassCard className="flex flex-col gap-1" dark>
          <span className="text-gray-300 text-sm">AI Automation</span>
          <span className="text-3xl font-bold">38%</span>
          <span className="text-green-400 text-xs font-semibold">+5% this month</span>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <GlassCard className="lg:col-span-2 h-[350px]">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Weekly Performance</h3>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={WEEKLY_DATA}>
              <defs>
                <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-200 dark:text-white/5" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="calls" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorCalls)" />
              <Area type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} fillOpacity={0} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="h-[350px]">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Channel Distribution</h3>
          <ResponsiveContainer width="100%" height="70%">
            <PieChart>
              <Pie data={CHANNEL_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                {CHANNEL_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {CHANNEL_DATA.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-gray-600 dark:text-gray-400">{item.name} {item.value}%</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="h-[300px]">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Resolution Breakdown</h3>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={RESOLUTION_DATA} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="currentColor" className="text-gray-200 dark:text-white/5" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} />
              <YAxis type="category" dataKey="category" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} width={80} />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Top Performing Agents</h3>
          <div className="space-y-4">
            {[
              { name: 'Lora Piterson', calls: 142, csat: 4.9, fcr: '89%' },
              { name: 'Marcus Chen', calls: 128, csat: 4.8, fcr: '85%' },
              { name: 'Randy Gouse', calls: 115, csat: 4.7, fcr: '82%' },
              { name: 'Giana Schleifer', calls: 98, csat: 4.9, fcr: '91%' },
            ].map((agent, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/40 dark:bg-slate-800/40">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </span>
                  <span className="font-semibold text-sm text-gray-900 dark:text-white">{agent.name}</span>
                </div>
                <div className="flex items-center gap-6 text-xs text-gray-500 dark:text-gray-400">
                  <span>{agent.calls} calls</span>
                  <span>{agent.csat} CSAT</span>
                  <span className="text-green-500 font-semibold">{agent.fcr} FCR</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </>
  );
}
