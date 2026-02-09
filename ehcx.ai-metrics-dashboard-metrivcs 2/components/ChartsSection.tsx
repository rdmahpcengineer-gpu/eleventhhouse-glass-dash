
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GlassCard } from './GlassCard';
import { MOCK_CALL_DATA } from '../constants';

export const ChartsSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <GlassCard className="lg:col-span-2 h-[400px]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">Daily Call Volume</h3>
          <div className="flex gap-4 text-xs font-medium text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-gray-900 dark:bg-white"></span> Inbound
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#FFB162]"></span> Outbound
            </div>
          </div>
        </div>
        <div className="w-full h-full pb-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_CALL_DATA}>
              <defs>
                <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1B2632" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#1B2632" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-200 dark:text-white/5" />
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fill: '#9CA3AF'}} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fill: '#9CA3AF'}} 
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                }}
                itemStyle={{ color: '#111827' }}
              />
              <Area 
                type="monotone" 
                dataKey="inbound" 
                stroke="currentColor" 
                className="text-gray-900 dark:text-white"
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorIn)" 
              />
              <Area 
                type="monotone" 
                dataKey="outbound" 
                stroke="#FFB162" 
                strokeWidth={3} 
                fillOpacity={0} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <div className="flex flex-col gap-6">
        <GlassCard className="flex-1">
          <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Occupancy Rate</h3>
          <div className="flex flex-col items-center justify-center h-full relative">
             <div className="w-32 h-32 rounded-full border-[10px] border-[#FFB162] border-t-transparent animate-[spin_3s_linear_infinite] flex items-center justify-center relative">
                <span className="text-2xl font-bold text-gray-900 dark:text-white absolute -rotate-0">84%</span>
             </div>
             <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center px-4">Agents are currently performing within optimal occupancy ranges.</p>
          </div>
        </GlassCard>

        <GlassCard className="flex-1">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-lg text-gray-900 dark:text-white">Queue Status</h3>
             <span className="text-xs font-semibold px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">LIVE</span>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Waiting</span>
              <span className="font-bold text-gray-900 dark:text-white">12 Calls</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Longest Wait</span>
              <span className="font-bold text-[#A35139] dark:text-orange-400">02:14</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Agents Avail.</span>
              <span className="font-bold text-gray-900 dark:text-white">24 / 32</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
