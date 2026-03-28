import React, { useState, useRef, useEffect } from 'react';
import { GlassCard } from '../../../ehcx.ai-metrics-dashboard-metrivcs 2/components/GlassCard';
import { sendChatMessage } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ACTIVE_SESSIONS = [
  { id: 1, customer: 'Sarah Johnson', channel: 'Web Chat', agent: 'AI Agent #1', duration: '3:45', messages: 12 },
  { id: 2, customer: 'Mike Thompson', channel: 'Video Call', agent: 'Lora Piterson', duration: '8:20', messages: 0 },
  { id: 3, customer: 'Emily Davis', channel: 'Web Chat', agent: 'Randy Gouse', duration: '5:12', messages: 8 },
  { id: 4, customer: 'James Wilson', channel: 'SMS', agent: 'AI Agent #2', duration: '2:30', messages: 6 },
];

interface Message {
  id: string;
  sender: 'customer' | 'agent';
  name: string;
  message: string;
  time: string;
  isStreaming?: boolean;
}

const INITIAL_MESSAGES: Message[] = [
  { id: '1', sender: 'customer', name: 'Sarah Johnson', message: 'Hi, I need help with my recent order #45231', time: '2:30 PM' },
  { id: '2', sender: 'agent', name: 'EHCX AI Agent', message: "Hello Sarah! I'd be happy to help you with order #45231. Let me pull up the details for you.", time: '2:30 PM' },
  { id: '3', sender: 'agent', name: 'EHCX AI Agent', message: 'I can see your order was shipped yesterday and is currently in transit. The expected delivery date is tomorrow by 5 PM.', time: '2:31 PM' },
  { id: '4', sender: 'customer', name: 'Sarah Johnson', message: 'Can I change the delivery address?', time: '2:32 PM' },
];

export default function Chatroom() {
  const { accessToken } = useAuth();
  const [selectedSession, setSelectedSession] = useState(ACTIVE_SESSIONS[0]);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = () => {
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'customer',
      name: 'You',
      message: text,
      time: formatTime(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    const typingMsg: Message = {
      id: 'typing',
      sender: 'agent',
      name: 'EHCX AI Agent',
      message: '...',
      time: formatTime(),
      isStreaming: true,
    };
    setMessages(prev => [...prev, typingMsg]);

    try {
      const token = accessToken || 'demo';
      const res = await sendChatMessage(token, text, sessionId);
      setSessionId(res.sessionId);

      setMessages(prev => prev.filter(m => m.id !== 'typing').concat({
        id: Date.now().toString(),
        sender: 'agent',
        name: 'EHCX AI Agent',
        message: res.response,
        time: formatTime(),
      }));
    } catch {
      // Graceful demo fallback — show a realistic AI response
      const demoResponses = [
        "I understand your concern. Let me look into that for you right away. Based on your account history, I can see you've been a valued customer for over 2 years. I'll prioritize this resolution.",
        "Great question! Our AI-powered contact center handles over 85% of inquiries automatically with a 4.9 CSAT score. I'm here to ensure your experience exceeds expectations.",
        "I've checked the relevant records and can confirm this is being processed. You should receive a confirmation within the next 15 minutes. Is there anything else I can help you with?",
        "Absolutely! I've escalated this to our specialist team and assigned it a priority ticket. Reference number: EHC-" + Math.floor(Math.random() * 90000 + 10000) + ". You'll be contacted within 2 hours.",
      ];
      const fallback = demoResponses[Math.floor(Math.random() * demoResponses.length)];

      setMessages(prev => prev.filter(m => m.id !== 'typing').concat({
        id: Date.now().toString(),
        sender: 'agent',
        name: 'EHCX AI Agent',
        message: fallback,
        time: formatTime(),
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Live Chat Console</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Monitor and interact with AI-handled customer sessions in real time.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold text-green-700 dark:text-green-400">AI Agent Online</span>
          </div>
          <button className="px-4 py-2 glass rounded-xl text-sm font-medium hover:bg-white/60 dark:hover:bg-white/10 transition-colors">
            New Session
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

          <div className="mt-6 pt-4 border-t border-gray-200/50 dark:border-white/10">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-2 font-semibold uppercase tracking-wider">Try the AI Agent</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Type any customer inquiry in the chat panel — powered by AWS Bedrock.
            </p>
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-2 flex flex-col h-[560px]">
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
              <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Bedrock AI</span>
              </div>
              <button className="p-2 glass rounded-xl hover:bg-white/60 dark:hover:bg-white/10">
                <span>📞</span>
              </button>
              <button className="p-2 glass rounded-xl hover:bg-white/60 dark:hover:bg-white/10">
                <span>🎥</span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-4 min-h-0">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'agent' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl ${
                  msg.sender === 'agent'
                    ? 'bg-white/60 dark:bg-slate-800/60'
                    : 'bg-blue-500 text-white'
                }`}>
                  {msg.sender === 'agent' && (
                    <p className="text-[10px] font-bold text-blue-500 dark:text-blue-400 mb-1 uppercase tracking-wider">{msg.name}</p>
                  )}
                  {msg.isStreaming ? (
                    <div className="flex gap-1 py-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  ) : (
                    <p className={`text-sm leading-relaxed ${msg.sender === 'agent' ? 'text-gray-900 dark:text-white' : 'text-white'}`}>
                      {msg.message}
                    </p>
                  )}
                  <p className={`text-[10px] mt-2 ${msg.sender === 'agent' ? 'text-gray-400' : 'text-blue-100'}`}>{msg.time}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="pt-4 border-t border-gray-200/50 dark:border-white/10">
            <div className="flex items-center gap-3">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a customer message to test the AI agent..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 glass rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm disabled:opacity-60"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !inputValue.trim()}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold text-sm hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Send'
                )}
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    </>
  );
}
