import { GlassCard } from '../../../ehcx.ai-metrics-dashboard-metrivcs 2/components/GlassCard';

const FLOWS = [
  { id: 1, name: 'Main IVR', status: 'active', calls: 1250, success: 94, lastModified: '2 days ago' },
  { id: 2, name: 'Sales Queue', status: 'active', calls: 456, success: 89, lastModified: '1 week ago' },
  { id: 3, name: 'Support Tier 1', status: 'active', calls: 892, success: 91, lastModified: '3 days ago' },
  { id: 4, name: 'After Hours', status: 'active', calls: 234, success: 97, lastModified: '2 weeks ago' },
  { id: 5, name: 'Holiday Schedule', status: 'draft', calls: 0, success: 0, lastModified: '1 day ago' },
];

const FLOW_STEPS = [
  { step: 1, name: 'Greeting', type: 'Audio', connected: true },
  { step: 2, name: 'Language Selection', type: 'Menu', connected: true },
  { step: 3, name: 'Department Menu', type: 'Menu', connected: true },
  { step: 4, name: 'Queue', type: 'Queue', connected: true },
  { step: 5, name: 'Agent Connect', type: 'Transfer', connected: false },
];

export default function Flows() {
  return (
    <>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Contact Flows</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Design and manage your IVR and call routing flows.</p>
        </div>
        <button className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold text-sm hover:bg-blue-600 transition-colors flex items-center gap-2">
          <span>+</span> Create New Flow
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <GlassCard className="flex flex-col gap-1">
          <span className="text-gray-500 dark:text-gray-400 text-sm">Active Flows</span>
          <span className="text-3xl font-bold text-gray-900 dark:text-white">4</span>
          <span className="text-green-500 text-xs font-semibold">All healthy</span>
        </GlassCard>
        <GlassCard className="flex flex-col gap-1">
          <span className="text-gray-500 dark:text-gray-400 text-sm">Draft Flows</span>
          <span className="text-3xl font-bold text-gray-900 dark:text-white">1</span>
          <span className="text-[#FFB162] text-xs font-semibold">Pending review</span>
        </GlassCard>
        <GlassCard className="flex flex-col gap-1">
          <span className="text-gray-500 dark:text-gray-400 text-sm">Avg Success Rate</span>
          <span className="text-3xl font-bold text-gray-900 dark:text-white">92.8%</span>
          <span className="text-green-500 text-xs font-semibold">+1.2% this week</span>
        </GlassCard>
        <GlassCard className="flex flex-col gap-1" dark>
          <span className="text-gray-300 text-sm">Calls Today</span>
          <span className="text-3xl font-bold">2,832</span>
          <span className="text-green-400 text-xs font-semibold">Through all flows</span>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">All Flows</h3>
            <input
              type="text"
              placeholder="Search flows..."
              className="px-4 py-2 glass rounded-xl text-sm border-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div className="space-y-3">
            {FLOWS.map((flow) => (
              <div key={flow.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-transparent dark:border-white/5 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${flow.status === 'active' ? 'bg-green-500/10' : 'bg-gray-500/10'}`}>
                    <span className={flow.status === 'active' ? 'text-green-500' : 'text-gray-500'}>🔀</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{flow.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Modified {flow.lastModified}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-bold text-sm text-gray-900 dark:text-white">{flow.calls.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">calls</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-sm ${flow.success >= 90 ? 'text-green-500' : 'text-[#FFB162]'}`}>{flow.success}%</p>
                    <p className="text-xs text-gray-500">success</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded ${flow.status === 'active' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                    {flow.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Flow Preview</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Main IVR Flow Structure</p>
          <div className="space-y-3">
            {FLOW_STEPS.map((step, i) => (
              <div key={step.step} className="relative">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/40 dark:bg-slate-800/40">
                  <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center">
                    {step.step}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{step.name}</p>
                    <p className="text-xs text-gray-500">{step.type}</p>
                  </div>
                </div>
                {i < FLOW_STEPS.length - 1 && (
                  <div className="absolute left-[23px] top-full h-3 w-0.5 bg-blue-500/30"></div>
                )}
              </div>
            ))}
          </div>
          <button className="w-full mt-6 px-4 py-3 glass rounded-xl text-sm font-semibold hover:bg-white/60 dark:hover:bg-white/10 transition-colors">
            Edit Flow
          </button>
        </GlassCard>
      </div>
    </>
  );
}
