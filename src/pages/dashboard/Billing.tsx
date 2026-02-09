import { GlassCard } from '../../../ehcx.ai-metrics-dashboard-metrivcs 2/components/GlassCard';

const INVOICES = [
  { id: 1, date: 'Jan 2024', amount: '$499.00', status: 'paid' },
  { id: 2, date: 'Dec 2023', amount: '$499.00', status: 'paid' },
  { id: 3, date: 'Nov 2023', amount: '$499.00', status: 'paid' },
  { id: 4, date: 'Oct 2023', amount: '$399.00', status: 'paid' },
];

const USAGE = [
  { name: 'Voice Minutes', used: 8500, limit: 10000, unit: 'mins' },
  { name: 'AI Interactions', used: 12400, limit: 20000, unit: 'chats' },
  { name: 'Phone Numbers', used: 5, limit: 10, unit: 'numbers' },
  { name: 'Storage', used: 2.3, limit: 5, unit: 'GB' },
];

export default function Billing() {
  return (
    <>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Billing</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your subscription and payment details.</p>
        </div>
        <button className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold text-sm hover:bg-blue-600 transition-colors">
          Upgrade Plan
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <GlassCard className="lg:col-span-2">
          <div className="flex items-start justify-between mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-500">Current Plan</span>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">Professional</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">$499/month - Billed monthly</p>
            </div>
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-xs font-bold">
              ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-white/40 dark:bg-slate-800/40">
              <p className="text-xs text-gray-500 dark:text-gray-400">Agents</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">Unlimited</p>
            </div>
            <div className="p-4 rounded-xl bg-white/40 dark:bg-slate-800/40">
              <p className="text-xs text-gray-500 dark:text-gray-400">AI Agents</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">5 included</p>
            </div>
            <div className="p-4 rounded-xl bg-white/40 dark:bg-slate-800/40">
              <p className="text-xs text-gray-500 dark:text-gray-400">Voice Mins</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">10,000</p>
            </div>
            <div className="p-4 rounded-xl bg-white/40 dark:bg-slate-800/40">
              <p className="text-xs text-gray-500 dark:text-gray-400">Support</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">Priority</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2 glass rounded-xl text-sm font-medium hover:bg-white/60 dark:hover:bg-white/10 transition-colors">
              Change Plan
            </button>
            <button className="px-4 py-2 text-red-500 glass rounded-xl text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
              Cancel Subscription
            </button>
          </div>
        </GlassCard>

        <GlassCard dark>
          <h3 className="font-bold text-lg mb-4">Payment Method</h3>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 mb-4">
            <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center text-white text-xs font-bold">
              VISA
            </div>
            <div>
              <p className="font-semibold">•••• •••• •••• 4242</p>
              <p className="text-xs text-gray-400">Expires 12/25</p>
            </div>
          </div>
          <button className="w-full px-4 py-2 bg-white/10 rounded-xl text-sm font-medium hover:bg-white/20 transition-colors">
            Update Payment Method
          </button>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-gray-400 mb-2">Next billing date</p>
            <p className="text-xl font-bold">February 1, 2024</p>
            <p className="text-sm text-gray-400 mt-1">$499.00 will be charged</p>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-6">Usage This Month</h3>
          <div className="space-y-4">
            {USAGE.map((item) => (
              <div key={item.name}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.name}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {item.used.toLocaleString()} / {item.limit.toLocaleString()} {item.unit}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      (item.used / item.limit) > 0.9 ? 'bg-red-500' :
                      (item.used / item.limit) > 0.7 ? 'bg-[#FFB162]' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min((item.used / item.limit) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Invoice History</h3>
            <button className="text-sm text-blue-500 font-medium hover:text-blue-600">Download All</button>
          </div>
          <div className="space-y-3">
            {INVOICES.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 rounded-xl bg-white/40 dark:bg-slate-800/40">
                <div>
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">{invoice.date}</p>
                  <p className="text-xs text-gray-500">Professional Plan</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-gray-900 dark:text-white">{invoice.amount}</span>
                  <span className="text-[10px] font-bold px-2 py-1 rounded bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                    {invoice.status.toUpperCase()}
                  </span>
                  <button className="p-2 hover:bg-white/60 dark:hover:bg-white/10 rounded-lg transition-colors">
                    <span className="text-gray-500">📥</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </>
  );
}
