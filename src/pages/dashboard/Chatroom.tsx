import React, { useState } from 'react';
import { GlassCard } from '../../../ehcx.ai-metrics-dashboard-metrivcs 2/components/GlassCard';

const ACTIVE_SESSIONS = [
  { id: 1, customer: 'Sarah Johnson', channel: 'Web Chat', agent: 'AI Agent #1', duration: '3:45', messages: 12 },
  { id: 2, customer: 'Mike Thompson', channel: 'Video Call', agent: 'Lora Piterson', duration: '8:20', messages: 0 },
  { id: 3, customer: 'Emily Davis', channel: 'Web Chat', agent: 'Randy Gouse', duration: '5:12', messages: 8 },
  { id: 4, customer: 'James Wilson', channel: 'SMS', agent: 'AI Agent #2', duration: '2:30', messages: 6 },
];

const CHAT_MESSAGES = [
  { id: 1, sender: 'customer', name: 'Sarah Johnson', message: 'Hi, I need help with my recent order #45231', time: '2:30 PM' },
  { id: 2, sender: 'agent', name: 'AI Agent #1', message: "Hello Sarah! I'd be happy to help you with order #45231. Let me pull up the details for you.", time: '2:30 PM' },
  { id: 3, sender: 'agent', name: 'AI Agent #1', message: 'I can see your order was shipped yesterday and is currently in transit. The expected delivery date is tomorrow by 5 PM.', time: '2:31 PM' },
  { id: 4, sender: 'customer', name: 'Sarah Johnson', message: 'Can I change the delivery address?', time: '2:32 PM' },
];

export default function Chatroom() {
  const [selectedSession, setSelectedSession] = useState(ACTIVE_SESSIONS[0]);

  return (
    <>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Video & Chat</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage live chat sessions and video calls with customers.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 glass rounded-xl text-sm font-medium hover:bg-white/60 dark:hover:bg-white/10 transition-colors">
            Start Video Call
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <GlassCard className="flex flex-col gap-1">
          <span className="text-gray-500 dark:text-gray-400 text-sm">Active Chats</span>
          <span className="text-3xl font-bold text-gray-900 dark:text-white">18</span>
          <span className="text-green-500 text-xs font-semibold">14 AI, 4 Human</span>
        </GlassCard>
        <GlassCard className="flex flex-col gap-1">
          <span className="text-gray-500 dark:text-gray-400 text-sm">Video Calls</span>
          <span className="text-3xl font-bold text-gray-900 dark:text-white">3</span>
          <span className="text-blue-500 text-xs font-semibold">All agents busy</span>
        </GlassCard>
        <GlassCard className="flex flex-col gap-1">
          <span className="text-gray-500 dark:text-gray-400 text-sm">Avg Response</span>
          <span className="text-3xl font-bold text-gray-900 dark:text-white">12s</span>
          <span className="text-green-500 text-xs font-semibold">-8s from target</span>
        </GlassCard>
        <GlassCard className="flex flex-col gap-1" dark>
          <span className="text-gray-300 text-sm">CSAT Today</span>
          <span className="text-3xl font-bold">4.9/5</span>
          <span className="text-green-400 text-xs font-semibold">+0.2 from yesterday</span>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-1">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Active Sessions</h3>
          <div className="space-y-2">
            {ACTIVE_SESSIONS.map((session) => (
              <div
                key={session.id}
                onClick={() => setSelectedSession(session)}
                className={`p-4 rounded-2xl cursor-pointer transition-all ${
                  selectedSession.id === session.id
                    ? 'bg-blue-500/10 border border-blue-500/30'
                    : 'bg-white/40 dark:bg-slate-800/40 border border-transparent hover:bg-white/60 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-gray-900 dark:text-white">{session.customer}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    session.channel === 'Video Call' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' :
                    session.channel === 'SMS' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                    'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>{session.channel}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{session.agent}</span>
                  <span>{session.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-2 flex flex-col h-[500px]">
          <div className="flex items-center justify-between pb-4 border-b border-gray-200/50 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                {selectedSession.customer.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{selectedSession.customer}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">with {selectedSession.agent}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 glass rounded-xl hover:bg-white/60 dark:hover:bg-white/10">
                <span>📞</span>
              </button>
              <button className="p-2 glass rounded-xl hover:bg-white/60 dark:hover:bg-white/10">
                <span>🎥</span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {CHAT_MESSAGES.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'agent' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl ${
                  msg.sender === 'agent'
                    ? 'bg-white/60 dark:bg-slate-800/60'
                    : 'bg-blue-500 text-white'
                }`}>
                  <p className={`text-sm ${msg.sender === 'agent' ? 'text-gray-900 dark:text-white' : 'text-white'}`}>{msg.message}</p>
                  <p className={`text-[10px] mt-2 ${msg.sender === 'agent' ? 'text-gray-400' : 'text-blue-100'}`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-200/50 dark:border-white/10">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 glass rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
              />
              <button className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold text-sm hover:bg-blue-600 transition-colors">
                Send
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    </>
  );
}
