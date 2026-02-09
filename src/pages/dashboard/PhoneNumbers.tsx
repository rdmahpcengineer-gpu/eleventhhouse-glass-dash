import { GlassCard } from '../../../ehcx.ai-metrics-dashboard-metrivcs 2/components/GlassCard';

const PHONE_NUMBERS = [
  { id: 1, number: '+1 (800) 555-0100', name: 'Main Support', type: 'Toll-Free', flow: 'Main IVR', calls: 1250, status: 'active' },
  { id: 2, number: '+1 (800) 555-0101', name: 'Sales Line', type: 'Toll-Free', flow: 'Sales Queue', calls: 456, status: 'active' },
  { id: 3, number: '+1 (415) 555-0102', name: 'Local SF', type: 'Local', flow: 'Support Tier 1', calls: 234, status: 'active' },
  { id: 4, number: '+1 (212) 555-0103', name: 'Local NYC', type: 'Local', flow: 'Support Tier 1', calls: 189, status: 'active' },
  { id: 5, number: '+1 (800) 555-0104', name: 'Emergency Line', type: 'Toll-Free', flow: 'After Hours', calls: 45, status: 'inactive' },
];

export default function PhoneNumbers() {
  return (
    <>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Phone Numbers</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your phone numbers and routing configurations.</p>
        </div>
        <button className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold text-sm hover:bg-blue-600 transition-colors flex items-center gap-2">
          <span>+</span> Add Number
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <GlassCard className="flex flex-col gap-1">
          <span className="text-gray-500 dark:text-gray-400 text-sm">Total Numbers</span>
          <span className="text-3xl font-bold text-gray-900 dark:text-white">5</span>
          <span className="text-blue-500 text-xs font-semibold">3 Toll-Free, 2 Local</span>
        </GlassCard>
        <GlassCard className="flex flex-col gap-1">
          <span className="text-gray-500 dark:text-gray-400 text-sm">Active Lines</span>
          <span className="text-3xl font-bold text-gray-900 dark:text-white">4</span>
          <span className="text-green-500 text-xs font-semibold">1 inactive</span>
        </GlassCard>
        <GlassCard className="flex flex-col gap-1">
          <span className="text-gray-500 dark:text-gray-400 text-sm">Calls Today</span>
          <span className="text-3xl font-bold text-gray-900 dark:text-white">2,174</span>
          <span className="text-green-500 text-xs font-semibold">+8% from yesterday</span>
        </GlassCard>
        <GlassCard className="flex flex-col gap-1" dark>
          <span className="text-gray-300 text-sm">Monthly Cost</span>
          <span className="text-3xl font-bold">$247</span>
          <span className="text-gray-400 text-xs font-semibold">$49.40/number avg</span>
        </GlassCard>
      </div>

      <GlassCard>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">All Phone Numbers</h3>
          <div className="flex items-center gap-3">
            <select className="px-4 py-2 glass rounded-xl text-sm border-none focus:outline-none focus:ring-2 focus:ring-blue-500/50">
              <option>All Types</option>
              <option>Toll-Free</option>
              <option>Local</option>
            </select>
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 glass rounded-xl text-sm border-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                <th className="pb-4">Number</th>
                <th className="pb-4">Name</th>
                <th className="pb-4">Type</th>
                <th className="pb-4">Flow</th>
                <th className="pb-4">Calls Today</th>
                <th className="pb-4">Status</th>
                <th className="pb-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50 dark:divide-white/5">
              {PHONE_NUMBERS.map((phone) => (
                <tr key={phone.id} className="hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-4">
                    <span className="font-mono font-semibold text-gray-900 dark:text-white">{phone.number}</span>
                  </td>
                  <td className="py-4">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{phone.name}</span>
                  </td>
                  <td className="py-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${phone.type === 'Toll-Free' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                      {phone.type}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{phone.flow}</span>
                  </td>
                  <td className="py-4">
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">{phone.calls.toLocaleString()}</span>
                  </td>
                  <td className="py-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${phone.status === 'active' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                      {phone.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4">
                    <button className="p-2 hover:bg-white/60 dark:hover:bg-white/10 rounded-lg transition-colors">
                      <span className="text-gray-500">⋯</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </>
  );
}
