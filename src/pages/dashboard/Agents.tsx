import { GlassCard } from '../../../ehcx.ai-metrics-dashboard-metrivcs 2/components/GlassCard';

const AGENTS = [
  { id: 1, name: 'Lora Piterson', role: 'Senior Agent', status: 'On Call', calls: 24, csat: 4.9, avatar: 'https://picsum.photos/seed/lora/200', type: 'human' },
  { id: 2, name: 'Randy Gouse', role: 'Support Specialist', status: 'Available', calls: 18, csat: 4.7, avatar: 'https://picsum.photos/seed/randy/200', type: 'human' },
  { id: 3, name: 'Giana Schleifer', role: 'Quality Analyst', status: 'Break', calls: 15, csat: 4.9, avatar: 'https://picsum.photos/seed/giana/200', type: 'human' },
  { id: 4, name: 'Marcus Chen', role: 'Lead Supervisor', status: 'Available', calls: 22, csat: 4.8, avatar: 'https://picsum.photos/seed/marcus/200', type: 'human' },
  { id: 5, name: 'AI Agent #1', role: 'Virtual Assistant', status: 'Active', calls: 156, csat: 4.6, avatar: '', type: 'ai' },
  { id: 6, name: 'AI Agent #2', role: 'Sales Bot', status: 'Active', calls: 89, csat: 4.5, avatar: '', type: 'ai' },
];

export default function Agents() {
  const humanAgents = AGENTS.filter(a => a.type === 'human');
  const aiAgents = AGENTS.filter(a => a.type === 'ai');

  return (
    <>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Agents</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your human and AI agents.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 glass rounded-xl text-sm font-medium hover:bg-white/60 dark:hover:bg-white/10 transition-colors">
            + Add Human Agent
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors">
            + Create AI Agent
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <GlassCard className="flex flex-col gap-1">
          <span className="text-gray-500 dark:text-gray-400 text-sm">Human Agents</span>
          <span className="text-3xl font-bold text-gray-900 dark:text-white">4</span>
          <span className="text-green-500 text-xs font-semibold">2 available now</span>
        </GlassCard>
        <GlassCard className="flex flex-col gap-1">
          <span className="text-gray-500 dark:text-gray-400 text-sm">AI Agents</span>
          <span className="text-3xl font-bold text-gray-900 dark:text-white">2</span>
          <span className="text-green-500 text-xs font-semibold">Both active</span>
        </GlassCard>
        <GlassCard className="flex flex-col gap-1">
          <span className="text-gray-500 dark:text-gray-400 text-sm">Avg CSAT</span>
          <span className="text-3xl font-bold text-gray-900 dark:text-white">4.7</span>
          <span className="text-green-500 text-xs font-semibold">+0.2 this week</span>
        </GlassCard>
        <GlassCard className="flex flex-col gap-1" dark>
          <span className="text-gray-300 text-sm">AI Handled</span>
          <span className="text-3xl font-bold">38%</span>
          <span className="text-green-400 text-xs font-semibold">245 calls today</span>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Human Agents</h3>
            <span className="text-xs text-gray-500">{humanAgents.length} total</span>
          </div>
          <div className="space-y-3">
            {humanAgents.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-transparent dark:border-white/5">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={agent.avatar} alt={agent.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 ${
                      agent.status === 'Available' ? 'bg-green-500' :
                      agent.status === 'On Call' ? 'bg-[#FFB162]' : 'bg-gray-400'
                    }`} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{agent.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{agent.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-sm text-gray-900 dark:text-white">{agent.calls}</p>
                    <p className="text-xs text-gray-500">calls</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-green-500">{agent.csat}</p>
                    <p className="text-xs text-gray-500">CSAT</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                    agent.status === 'Available' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                    agent.status === 'On Call' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
                    'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {agent.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">AI Agents</h3>
            <span className="text-xs text-gray-500">{aiAgents.length} deployed</span>
          </div>
          <div className="space-y-3">
            {aiAgents.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-transparent dark:border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-xl">🤖</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{agent.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{agent.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-sm text-gray-900 dark:text-white">{agent.calls}</p>
                    <p className="text-xs text-gray-500">calls</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-green-500">{agent.csat}</p>
                    <p className="text-xs text-gray-500">CSAT</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    {agent.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">AI Performance Summary</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Avg Resolution Time</p>
                <p className="font-bold text-gray-900 dark:text-white">2:34</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Escalation Rate</p>
                <p className="font-bold text-gray-900 dark:text-white">12%</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </>
  );
}
