import { useState } from 'react';
import { GlassCard } from '../../../ehcx.ai-metrics-dashboard-metrivcs 2/components/GlassCard';

export default function Settings() {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    slack: true,
  });

  return (
    <>
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Configure your contact center preferences.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-6">General Settings</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Name</label>
                <input
                  type="text"
                  defaultValue="EHCX Contact Center"
                  className="w-full px-4 py-3 glass rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Timezone</label>
                  <select className="w-full px-4 py-3 glass rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm">
                    <option>America/New_York (EST)</option>
                    <option>America/Los_Angeles (PST)</option>
                    <option>Europe/London (GMT)</option>
                    <option>Asia/Tokyo (JST)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
                  <select className="w-full px-4 py-3 glass rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm">
                    <option>English (US)</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Business Hours</label>
                <div className="grid grid-cols-2 gap-4">
                  <input type="time" defaultValue="09:00" className="px-4 py-3 glass rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm" />
                  <input type="time" defaultValue="18:00" className="px-4 py-3 glass rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm" />
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-6">Notifications</h3>
            <div className="space-y-4">
              {[
                { key: 'email', label: 'Email Notifications', desc: 'Receive daily reports and alerts via email' },
                { key: 'sms', label: 'SMS Alerts', desc: 'Get critical alerts via text message' },
                { key: 'push', label: 'Push Notifications', desc: 'Browser notifications for real-time updates' },
                { key: 'slack', label: 'Slack Integration', desc: 'Send notifications to your Slack channel' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-white/40 dark:bg-slate-800/40">
                  <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{item.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      notifications[item.key as keyof typeof notifications] ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                      notifications[item.key as keyof typeof notifications] ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-6">AI Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">AI Response Style</label>
                <select className="w-full px-4 py-3 glass rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm">
                  <option>Professional & Friendly</option>
                  <option>Formal & Concise</option>
                  <option>Casual & Conversational</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Auto-Escalation Threshold</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  defaultValue="3"
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Escalate Quickly</span>
                  <span>Let AI Handle More</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Account</h3>
            <div className="flex items-center gap-4 mb-6">
              <img src="https://picsum.photos/seed/admin/100" alt="Admin" className="w-16 h-16 rounded-xl object-cover" />
              <div>
                <p className="font-bold text-gray-900 dark:text-white">Admin User</p>
                <p className="text-sm text-gray-500">admin@ehcx.ai</p>
              </div>
            </div>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 text-left text-sm glass rounded-xl hover:bg-white/60 dark:hover:bg-white/10 transition-colors">
                Edit Profile
              </button>
              <button className="w-full px-4 py-2 text-left text-sm glass rounded-xl hover:bg-white/60 dark:hover:bg-white/10 transition-colors">
                Change Password
              </button>
              <button className="w-full px-4 py-2 text-left text-sm glass rounded-xl hover:bg-white/60 dark:hover:bg-white/10 transition-colors">
                Two-Factor Auth
              </button>
            </div>
          </GlassCard>

          <GlassCard dark>
            <h3 className="font-bold text-lg mb-4">Danger Zone</h3>
            <p className="text-sm text-gray-400 mb-4">Irreversible and destructive actions</p>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 text-left text-sm bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors">
                Export All Data
              </button>
              <button className="w-full px-4 py-2 text-left text-sm bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors">
                Delete Account
              </button>
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-4">
        <button className="px-6 py-3 glass rounded-xl text-sm font-semibold hover:bg-white/60 dark:hover:bg-white/10 transition-colors">
          Cancel
        </button>
        <button className="px-6 py-3 bg-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors">
          Save Changes
        </button>
      </div>
    </>
  );
}
