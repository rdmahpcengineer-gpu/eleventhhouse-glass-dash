
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', dark = false }) => {
  // If explicitly 'dark' prop is passed, use glass-dark, else use standard 'glass' which responds to .dark class
  const baseStyle = dark ? 'glass-dark text-white' : 'glass text-gray-800 dark:text-gray-100';
  
  return (
    <div className={`rounded-3xl p-6 shadow-xl transition-all duration-300 ${baseStyle} ${className}`}>
      {children}
    </div>
  );
};
