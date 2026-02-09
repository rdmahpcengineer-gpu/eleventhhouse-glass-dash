import type {
  DashboardData,
  ActivityData,
  AnalyticsData,
  FlowsResponse,
  PhoneNumbersResponse,
  AgentsResponse,
  BillingData,
  TenantSettings,
  HealthResponse,
  ChatResponse,
} from '../types/api';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://api.ehcx.io/v1';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiFetch<T>(
  path: string,
  token: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(res.status, body.message || res.statusText);
  }

  return res.json();
}

// --- Health (no auth required) ---
export function healthCheck(): Promise<HealthResponse> {
  return fetch(`${API_BASE}/health`).then((r) => r.json());
}

// --- Dashboard ---
export function getDashboard(token: string, tenantId: string): Promise<DashboardData> {
  return apiFetch(`/analytics/${tenantId}`, token);
}

// --- Activity (live) ---
export function getActivity(token: string, tenantId: string): Promise<ActivityData> {
  return apiFetch(`/analytics/${tenantId}/activity`, token);
}

// --- Analytics ---
export function getAnalytics(token: string, tenantId: string, period: string): Promise<AnalyticsData> {
  return apiFetch(`/analytics/${tenantId}/report?period=${encodeURIComponent(period)}`, token);
}

// --- Flows ---
export function listFlows(token: string, tenantId: string): Promise<FlowsResponse> {
  return apiFetch(`/tenants/${tenantId}/flows`, token);
}

// --- Phone Numbers ---
export function listPhoneNumbers(token: string, tenantId: string): Promise<PhoneNumbersResponse> {
  return apiFetch(`/tenants/${tenantId}/phone-numbers`, token);
}

// --- Agents ---
export function listAgents(token: string, tenantId: string): Promise<AgentsResponse> {
  return apiFetch(`/tenants/${tenantId}/users`, token);
}

// --- Billing ---
export function getBilling(token: string, tenantId: string): Promise<BillingData> {
  return apiFetch(`/billing/${tenantId}`, token);
}

// --- Settings ---
export function getTenantSettings(token: string, tenantId: string): Promise<TenantSettings> {
  return apiFetch(`/tenants/${tenantId}/settings`, token);
}

export function updateTenantSettings(token: string, tenantId: string, settings: Partial<TenantSettings>): Promise<TenantSettings> {
  return apiFetch(`/tenants/${tenantId}/settings`, token, {
    method: 'PATCH',
    body: JSON.stringify(settings),
  });
}

// --- Chat (Bedrock Agent) ---
export function sendChatMessage(token: string, message: string, sessionId?: string): Promise<ChatResponse> {
  return apiFetch('/chat', token, {
    method: 'POST',
    body: JSON.stringify({ message, sessionId }),
  });
}
