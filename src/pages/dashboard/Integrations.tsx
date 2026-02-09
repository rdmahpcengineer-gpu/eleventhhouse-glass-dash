import { GlassCard } from '../../../ehcx.ai-metrics-dashboard-metrivcs 2/components/GlassCard';

const INTEGRATIONS = [
  { id: 1, name: 'Salesforce', category: 'CRM', status: 'connected', icon: '☁️', lastSync: '2 mins ago' },
  { id: 2, name: 'Slack', category: 'Communication', status: 'connected', icon: '💬', lastSync: '5 mins ago' },
  { id: 3, name: 'Zendesk', category: 'Helpdesk', status: 'connected', icon: '🎫', lastSync: '10 mins ago' },
  { id: 4, name: 'HubSpot', category: 'CRM', status: 'disconnected', icon: '🧡', lastSync: 'Never' },
  { id: 5, name: 'Microsoft Teams', category: 'Communication', status: 'pending', icon: '👥', lastSync: 'Setting up' },
];

const AVAILABLE_INTEGRATIONS = [
  { id: 1, name: 'Intercom', category: 'Chat', icon: '💭', popular: true },
  { id: 2, name: 'Twilio', category: 'Voice', icon: '📞', popular: true },
  { id: 3, name: 'Stripe', category: 'Payments', icon: '💳', popular: false },
  { id: 4, name: 'Zapier', category: 'Automation', icon: '⚡', popular: true },
];

export default function Integrations() {
  return (
    <>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Integrations</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Connect your favorite tools and services.</p>
        </div>
        <button className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold text-sm hover:bg-blue-600 transition-colors flex items-center gap-2">
          Browse Marketplace
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <GlassCard className="flex flex-col gap-1">
          <span className="text-gray-500 dark:text-gray-400 text-sm">Connected</span>
          <span className="text-3xl font-bold text-gray-900 dark:text-white">3</span>
          <span className="text-green-500 text-xs font-semibold">All syncing</span>
        </GlassCard>
        <GlassCard className="flex flex-col gap-1">
          <span className="text-gray-500 dark:text-gray-400 text-sm">Pending</span>
          <span className="text-3xl font-bold text-gray-900 dark:text-white">1</span>
          <span className="text-[#FFB162] text-xs font-semibold">Needs setup</span>
        </GlassCard>
        <GlassCard className="flex flex-col gap-1">
          <span className="text-gray-500 dark:text-gray-400 text-sm">API Calls Today</span>
          <span className="text-3xl font-bold text-gray-900 dark:text-white">12.4K</span>
          <span className="text-blue-500 text-xs font-semibold">Within limits</span>
        </GlassCard>
        <GlassCard className="flex flex-col gap-1" dark>
          <span className="text-gray-300 text-sm">Data Synced</span>
          <span className="text-3xl font-bold">2.3GB</span>
          <span className="text-gray-400 text-xs font-semibold">This month</span>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Connected Integrations</h3>
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 glass rounded-xl text-sm border-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div className="space-y-3">
            {INTEGRATIONS.map((integration) => (
              <div key={integration.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-transparent dark:border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-2xl shadow-sm">
                    {integration.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{integration.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{integration.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Last sync</p>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{integration.lastSync}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                    integration.status === 'connected' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                    integration.status === 'pending' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {integration.status.toUpperCase()}
                  </span>
                  <button className="p-2 hover:bg-white/60 dark:hover:bg-white/10 rounded-lg transition-colors">
                    <span className="text-gray-500">⚙️</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Add Integration</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Popular integrations to get started</p>
          <div className="space-y-3">
            {AVAILABLE_INTEGRATIONS.map((integration) => (
              <div key={integration.id} className="flex items-center justify-between p-3 rounded-xl bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{integration.icon}</span>
                  <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{integration.name}</p>
                    <p className="text-xs text-gray-500">{integration.category}</p>
                  </div>
                </div>
                {integration.popular && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    POPULAR
                  </span>
                )}
              </div>
            ))}
          </div>
          <button className="w-full mt-4 px-4 py-3 glass rounded-xl text-sm font-semibold hover:bg-white/60 dark:hover:bg-white/10 transition-colors">
            View All Integrations
          </button>
        </GlassCard>
      </div>
    </>
  );
}
