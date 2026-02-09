import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../../../ehcx.ai-metrics-dashboard-metrivcs 2/components/Sidebar';

const DashboardLayout: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="flex min-h-screen bg-[#EEE9DF] dark:bg-[#0F172A] text-gray-900 dark:text-white transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <Outlet context={{ darkMode, setDarkMode }} />
      </main>
    </div>
  );
};

export default DashboardLayout;
