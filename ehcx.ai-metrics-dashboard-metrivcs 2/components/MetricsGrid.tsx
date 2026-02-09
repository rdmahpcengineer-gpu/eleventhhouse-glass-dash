
import React from 'react';
import { GlassCard } from './GlassCard';

export const MetricsGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <GlassCard className="flex flex-col gap-1">
        <span className="text-gray-500 dark:text-gray-400 text-sm">Average Handle Time</span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">04:32</span>
          <span className="text-green-500 text-xs font-semibold">↓ 12%</span>
        </div>
        <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
          <div className="h-full bg-gray-800 dark:bg-gray-300 rounded-full" style={{ width: '65%' }}></div>
        </div>
      </GlassCard>

      <GlassCard className="flex flex-col gap-1">
        <span className="text-gray-500 dark:text-gray-400 text-sm">Service Level (SL)</span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">88.4%</span>
          <span className="text-red-500 text-xs font-semibold">↓ 2.1%</span>
        </div>
        <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
          <div className="h-full bg-[#FFB162] rounded-full" style={{ width: '88%' }}></div>
        </div>
      </GlassCard>

      <GlassCard className="flex flex-col gap-1">
        <span className="text-gray-500 dark:text-gray-400 text-sm">CSAT Score</span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">4.8/5</span>
          <span className="text-green-500 text-xs font-semibold">↑ 0.4</span>
        </div>
        <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full" style={{ width: '96%' }}></div>
        </div>
      </GlassCard>

      <GlassCard className="flex flex-col gap-1" dark>
        <span className="text-gray-300 text-sm">First Call Resolution</span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">72%</span>
          <span className="text-orange-300 text-xs font-semibold">↑ 5%</span>
        </div>
        <div className="w-full h-1 bg-white/20 rounded-full mt-2 overflow-hidden">
          <div className="h-full bg-white rounded-full" style={{ width: '72%' }}></div>
        </div>
      </GlassCard>
    </div>
  );
};
