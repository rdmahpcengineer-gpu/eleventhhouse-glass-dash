import React, { useState, useEffect } from 'react';
import { MetricsGrid } from '../../../ehcx.ai-metrics-dashboard-metrivcs 2/components/MetricsGrid';
import { ChartsSection } from '../../../ehcx.ai-metrics-dashboard-metrivcs 2/components/ChartsSection';
import { AgentStatusList } from '../../../ehcx.ai-metrics-dashboard-metrivcs 2/components/AgentStatusList';

export default function Overview() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Welcome in, Nixtio</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome in, <span className="font-semibold text-gray-900 dark:text-gray-200">Ops Manager</span>. Here is the performance report for today.</p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 glass rounded-2xl shadow-sm hover:scale-105 transition-all duration-300 border border-white/50 dark:border-white/10 flex items-center justify-center"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l.707.707M6.343 6.343l.707.707ZM12 7a5 5 0 100 10 5 5 0 000-10z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          <div className="flex items-center gap-6 glass px-6 py-3 rounded-3xl shadow-sm border border-white/50 dark:border-white/10">
            <div className="flex flex-col items-end">
              <span className="font-bold text-gray-900 dark:text-white">Lora Piterson</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Operations Manager</span>
            </div>
            <div className="relative group">
              <img
                src="https://picsum.photos/seed/manager/100"
                alt="User Profile"
                className="w-14 h-14 rounded-2xl object-cover ring-4 ring-white dark:ring-slate-800 shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute -top-1 -right-1 bg-[#FFB162] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800">
                <span className="text-[10px] font-bold text-gray-900">5</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-white/60 dark:hover:bg-white/10 rounded-xl transition-colors text-gray-600 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-wrap gap-8 mb-12">
        <div className="flex flex-col gap-2 min-w-[150px]">
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            <span>Call Capacity</span>
            <span className="text-gray-900 dark:text-gray-300">82%</span>
          </div>
          <div className="w-full h-8 glass rounded-full overflow-hidden p-1">
            <div className="h-full bg-gray-900 dark:bg-white rounded-full flex items-center px-4 transition-all duration-500" style={{width: '82%'}}>
              <span className="text-[10px] text-white dark:text-gray-900 font-bold">OPTIMAL</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 min-w-[150px]">
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            <span>System Load</span>
            <span className="text-gray-900 dark:text-gray-300">15%</span>
          </div>
          <div className="w-full h-8 glass rounded-full overflow-hidden p-1">
            <div className="h-full bg-[#FFB162] rounded-full transition-all duration-500" style={{width: '15%'}}></div>
          </div>
        </div>

        <div className="flex flex-col gap-2 min-w-[150px]">
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            <span>IVR Success</span>
            <span className="text-gray-900 dark:text-gray-300">94%</span>
          </div>
          <div className="w-full h-8 glass rounded-full overflow-hidden p-1">
            <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{width: '94%'}}></div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <MetricsGrid />
        <ChartsSection />
        <AgentStatusList />
      </div>

      <footer className="mt-12 flex justify-between items-center text-gray-400 dark:text-gray-600 text-sm border-t border-gray-300/40 dark:border-white/5 pt-8">
        <p>&copy; 2024 EHCX.ai CCaaS Analytics</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">System Health</a>
        </div>
      </footer>
    </>
  );
}
