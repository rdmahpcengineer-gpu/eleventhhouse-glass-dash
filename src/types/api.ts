// API response types matching the backend OpenAPI specification

export interface ApiErrorResponse {
  error: string;
  message: string;
  details?: Record<string, unknown>;
}

// --- Dashboard / Analytics ---
export interface DashboardData {
  contacts_in_queue: number;
  active_calls: number;
  active_agents: number;
  total_agents: number;
  average_wait_time_seconds: number;
  service_level_percent: number;
  contacts_handled_today: number;
  abandonment_rate_percent: number;
  csat_score: number;
  ai_resolution_rate: number;
  ai_handling: number;
}

export interface LiveActivity {
  id: string;
  type: 'inbound' | 'outbound';
  caller: string;
  agent: string | null;
  duration: string;
  status: 'in-progress' | 'queued';
  ai: boolean;
}

export interface RecentCall {
  id: string;
  caller: string;
  agent: string | null;
  duration: string;
  status: 'completed' | 'abandoned';
  time: string;
}

export interface ActivityData {
  dashboard: DashboardData;
  live_activities: LiveActivity[];
  recent_calls: RecentCall[];
}

export interface AnalyticsSummary {
  total_calls: string;
  total_calls_change: string;
  avg_handle_time: string;
  avg_handle_time_change: string;
  first_call_resolution: string;
  fcr_change: string;
  csat: string;
  csat_change: string;
}

export interface AgentPerformance {
  name: string;
  calls: number;
  aht: string;
  fcr: string;
  csat: string;
}

export interface AnalyticsData {
  summary: AnalyticsSummary;
  agent_performance: AgentPerformance[];
}

// --- Flows ---
export interface ContactFlow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused';
  calls: number;
  queue: string;
}

export interface FlowsResponse {
  flows: ContactFlow[];
}

// --- Phone Numbers ---
export interface PhoneNumberEntry {
  id: string;
  number: string;
  type: string;
  country: string;
  flow: string | null;
  calls: number;
  status: 'active' | 'available';
}

export interface PhoneNumbersResponse {
  phone_numbers: PhoneNumberEntry[];
  total: number;
  countries: number;
  calls_today: number;
}

// --- Agents ---
export interface Agent {
  id: string;
  name: string;
  email: string | null;
  role: string;
  status: 'available' | 'on-call' | 'away' | 'offline';
  calls: number;
  aht: string;
  csat: number;
}

export interface AgentsResponse {
  agents: Agent[];
  available: number;
  on_call: number;
  away: number;
  total: number;
}

// --- Billing ---
export interface Subscription {
  plan_name: string;
  price_per_agent: number;
  agent_count: number;
  total_monthly: number;
  status: 'trialing' | 'active' | 'past_due' | 'canceled';
}

export interface Usage {
  agents_used: number;
  agents_limit: number;
  phone_numbers_used: number;
  phone_numbers_limit: number;
  ai_minutes_used: number;
  ai_minutes_limit: number;
}

export interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: string;
}

export interface BillingData {
  subscription: Subscription;
  usage: Usage;
  invoices: Invoice[];
}

// --- Settings / Tenant ---
export interface TenantSettings {
  organization_name: string;
  industry: string;
  timezone: string;
}

export interface ProfileSettings {
  first_name: string;
  last_name: string;
  email: string;
  initials: string;
}

// --- Chat ---
export interface ChatRequest {
  message: string;
  sessionId?: string;
}

export interface ChatResponse {
  response: string;
  sessionId: string;
}

// --- Health ---
export interface HealthResponse {
  status: string;
  version: string;
  timestamp: string;
}
