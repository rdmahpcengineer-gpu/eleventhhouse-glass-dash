
import React from 'react';
import { MOCK_AGENTS } from '../constants';
import { GlassCard } from './GlassCard';

export const AgentStatusList: React.FC = () => {
  return (
    <GlassCard className="mt-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Active Agents</h3>
        <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium">View All</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_AGENTS.map((agent) => (
          <div key={agent.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors border border-transparent dark:border-white/5">
            <div className="relative">
              <img src={agent.avatar} alt={agent.name} className="w-12 h-12 rounded-xl object-cover" />
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 ${
                agent.status === 'Available' ? 'bg-green-500' : 
                agent.status === 'On Call' ? 'bg-[#FFB162]' : 'bg-gray-400'
              }`} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-gray-900 dark:text-white">{agent.name}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{agent.role}</span>
              <span className={`text-[10px] font-bold mt-1 ${
                agent.status === 'Available' ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-500'
              }`}>{agent.status.toUpperCase()}</span>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
