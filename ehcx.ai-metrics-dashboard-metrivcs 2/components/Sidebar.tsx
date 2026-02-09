
import React from 'react';
import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { icon: '📊', label: 'Dashboard', to: '/dashboard' },
  { icon: '📡', label: 'Live Activity', to: '/dashboard/activity' },
  { icon: '💬', label: 'Video & Chat', to: '/dashboard/chatroom' },
  { icon: '📈', label: 'Analytics', to: '/dashboard/analytics' },
  { icon: '🔀', label: 'Contact Flows', to: '/dashboard/flows' },
  { icon: '📞', label: 'Phone Numbers', to: '/dashboard/numbers' },
  { icon: '👥', label: 'Agents', to: '/dashboard/agents' },
  { icon: '🔌', label: 'Integrations', to: '/dashboard/integrations' },
  { icon: '⚙️', label: 'Settings', to: '/dashboard/settings' },
  { icon: '💳', label: 'Billing', to: '/dashboard/billing' },
];

export const Sidebar: React.FC = () => {
  return (
    <div className="w-64 h-screen p-6 flex flex-col gap-8 sticky top-0 border-r border-white/5 bg-[#0A0F19] text-white shadow-2xl z-20">
      <div className="flex items-center gap-3 px-4">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <span className="text-white font-bold text-lg">E</span>
        </div>
        <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          EHCX.ai
        </span>
      </div>

      <nav className="flex flex-col gap-1.5">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 ${
                isActive
                  ? 'bg-white/10 text-white shadow-sm border border-white/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto">
        <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Daily Throughput</p>
          <p className="text-2xl font-bold text-white tracking-tight">12,482</p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex -space-x-2">
              <img className="w-7 h-7 rounded-full border-2 border-[#0A0F19] ring-1 ring-white/10" src="https://picsum.photos/seed/a1/32" alt="avatar" />
              <img className="w-7 h-7 rounded-full border-2 border-[#0A0F19] ring-1 ring-white/10" src="https://picsum.photos/seed/a2/32" alt="avatar" />
              <img className="w-7 h-7 rounded-full border-2 border-[#0A0F19] ring-1 ring-white/10" src="https://picsum.photos/seed/a3/32" alt="avatar" />
            </div>
            <span className="text-[10px] font-bold bg-green-500/20 text-green-400 px-2 py-1 rounded-md border border-green-500/20">
              +12 Live
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
