import { useApi } from './useApi';
import * as api from '../services/api';
import type {
  DashboardData,
  ActivityData,
  AnalyticsData,
  FlowsResponse,
  PhoneNumbersResponse,
  AgentsResponse,
  BillingData,
} from '../types/api';

function useTenantId(): string {
  return import.meta.env.VITE_TENANT_ID || 'default-tenant';
}

// ===================== MOCK DATA =====================

const MOCK_DASHBOARD: DashboardData = {
  contacts_in_queue: 5,
  active_calls: 23,
  active_agents: 15,
  total_agents: 20,
  average_wait_time_seconds: 23,
  service_level_percent: 94.2,
  contacts_handled_today: 1247,
  abandonment_rate_percent: 3.2,
  csat_score: 4.7,
  ai_resolution_rate: 67,
  ai_handling: 8,
};

const MOCK_ACTIVITY: ActivityData = {
  dashboard: MOCK_DASHBOARD,
  live_activities: [
    { id: '1', type: 'inbound', caller: '+1 (555) 123-4567', agent: 'Sarah Johnson', duration: '02:34', status: 'in-progress', ai: false },
    { id: '2', type: 'outbound', caller: '+1 (555) 987-6543', agent: 'AI Agent', duration: '01:12', status: 'in-progress', ai: true },
    { id: '3', type: 'inbound', caller: '+1 (555) 456-7890', agent: 'Mike Chen', duration: '05:45', status: 'in-progress', ai: false },
    { id: '4', type: 'inbound', caller: '+1 (555) 234-5678', agent: 'AI Agent', duration: '00:45', status: 'in-progress', ai: true },
    { id: '5', type: 'inbound', caller: '+1 (555) 345-6789', agent: null, duration: '00:15', status: 'queued', ai: false },
  ],
  recent_calls: [
    { id: '1', caller: '+1 (555) 111-2222', agent: 'Sarah Johnson', duration: '04:23', status: 'completed', time: '2 min ago' },
    { id: '2', caller: '+1 (555) 222-3333', agent: 'AI Agent', duration: '01:45', status: 'completed', time: '5 min ago' },
    { id: '3', caller: '+1 (555) 333-4444', agent: 'Mike Chen', duration: '08:12', status: 'completed', time: '8 min ago' },
    { id: '4', caller: '+1 (555) 444-5555', agent: null, duration: '00:00', status: 'abandoned', time: '12 min ago' },
  ],
};

const MOCK_ANALYTICS: AnalyticsData = {
  summary: {
    total_calls: '12,456',
    total_calls_change: '+12.5%',
    avg_handle_time: '4:23',
    avg_handle_time_change: '-8.3%',
    first_call_resolution: '78.4%',
    fcr_change: '+2.1%',
    csat: '4.7/5',
    csat_change: '+0.3',
  },
  agent_performance: [
    { name: 'Sarah Johnson', calls: 234, aht: '3:45', fcr: '85%', csat: '4.9' },
    { name: 'Mike Chen', calls: 198, aht: '4:12', fcr: '78%', csat: '4.7' },
    { name: 'Emily Davis', calls: 187, aht: '3:58', fcr: '82%', csat: '4.8' },
    { name: 'AI Agent', calls: 456, aht: '2:30', fcr: '72%', csat: '4.5' },
  ],
};

const MOCK_FLOWS: FlowsResponse = {
  flows: [
    { id: '1', name: 'Main IVR', description: 'Primary inbound call routing', status: 'active', calls: 1234, queue: 'Sales' },
    { id: '2', name: 'Support Queue', description: 'Technical support routing', status: 'active', calls: 567, queue: 'Support' },
    { id: '3', name: 'After Hours', description: 'Voicemail and callback scheduling', status: 'active', calls: 89, queue: 'General' },
    { id: '4', name: 'Holiday Greeting', description: 'Holiday closure announcement', status: 'paused', calls: 0, queue: 'All' },
  ],
};

const MOCK_PHONE_NUMBERS: PhoneNumbersResponse = {
  phone_numbers: [
    { id: '1', number: '+1 (555) 123-4567', type: 'Toll-Free', country: 'US', flow: 'Main IVR', calls: 456, status: 'active' },
    { id: '2', number: '+1 (555) 987-6543', type: 'Local', country: 'US', flow: 'Support Queue', calls: 234, status: 'active' },
    { id: '3', number: '+44 20 7946 0958', type: 'Local', country: 'UK', flow: 'UK Support', calls: 89, status: 'active' },
    { id: '4', number: '+1 (555) 246-8135', type: 'Local', country: 'US', flow: null, calls: 0, status: 'available' },
  ],
  total: 4,
  countries: 2,
  calls_today: 779,
};

const MOCK_AGENTS: AgentsResponse = {
  agents: [
    { id: '1', name: 'Sarah Johnson', email: 'sarah@company.com', role: 'Senior Agent', status: 'available', calls: 45, aht: '3:45', csat: 4.9 },
    { id: '2', name: 'Mike Chen', email: 'mike@company.com', role: 'Agent', status: 'on-call', calls: 38, aht: '4:12', csat: 4.7 },
    { id: '3', name: 'Emily Davis', email: 'emily@company.com', role: 'Agent', status: 'available', calls: 42, aht: '3:58', csat: 4.8 },
    { id: '4', name: 'James Wilson', email: 'james@company.com', role: 'Agent', status: 'away', calls: 0, aht: '-', csat: 4.6 },
    { id: '5', name: 'AI Agent Alpha', email: null, role: 'AI Agent', status: 'available', calls: 156, aht: '2:30', csat: 4.5 },
  ],
  available: 3,
  on_call: 1,
  away: 1,
  total: 5,
};

const MOCK_BILLING: BillingData = {
  subscription: {
    plan_name: 'Growth',
    price_per_agent: 99,
    agent_count: 5,
    total_monthly: 495,
    status: 'active',
  },
  usage: {
    agents_used: 5,
    agents_limit: 25,
    phone_numbers_used: 3,
    phone_numbers_limit: 5,
    ai_minutes_used: 2450,
    ai_minutes_limit: 5000,
  },
  invoices: [
    { id: 'INV-001', date: 'Jan 1, 2024', amount: '$495.00', status: 'Paid' },
    { id: 'INV-002', date: 'Dec 1, 2023', amount: '$495.00', status: 'Paid' },
    { id: 'INV-003', date: 'Nov 1, 2023', amount: '$495.00', status: 'Paid' },
  ],
};

// ===================== HOOKS =====================

export function useDashboard() {
  const tenantId = useTenantId();
  return useApi(
    (token) => api.getDashboard(token, tenantId),
    MOCK_DASHBOARD,
  );
}

export function useActivity() {
  const tenantId = useTenantId();
  return useApi(
    (token) => api.getActivity(token, tenantId),
    MOCK_ACTIVITY,
    { refreshInterval: 10_000 },
  );
}

export function useAnalytics(period: string) {
  const tenantId = useTenantId();
  return useApi(
    (token) => api.getAnalytics(token, tenantId, period),
    MOCK_ANALYTICS,
  );
}

export function useFlows() {
  const tenantId = useTenantId();
  return useApi(
    (token) => api.listFlows(token, tenantId),
    MOCK_FLOWS,
  );
}

export function usePhoneNumbers() {
  const tenantId = useTenantId();
  return useApi(
    (token) => api.listPhoneNumbers(token, tenantId),
    MOCK_PHONE_NUMBERS,
  );
}

export function useAgents() {
  const tenantId = useTenantId();
  return useApi(
    (token) => api.listAgents(token, tenantId),
    MOCK_AGENTS,
  );
}

export function useBilling() {
  const tenantId = useTenantId();
  return useApi(
    (token) => api.getBilling(token, tenantId),
    MOCK_BILLING,
  );
}
