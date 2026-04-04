# EHCX.ai — Amplify E2E Test Report

**Date:** 2026-04-04  
**Target:** https://v2-webapp.d1tsm8kwwa2wqc.amplifyapp.com  
**Tester:** Claude Code (Automated)  
**Branch:** `claude/test-amplify-login-flows-N8C5J`  
**Scope:** Login flows, Signup flow, Investor Login (NAV), Admin Dashboard, Investor Dashboard, Routing, Infrastructure

---

## Executive Summary

| Category | Status | Severity |
|---|---|---|
| Amplify deployment publicly accessible | ❌ FAIL | CRITICAL |
| Landing page & Navbar | ⚠️ PARTIAL PASS | HIGH |
| Login flow (SSO → Cognito) | ✅ PASS (code-verified) | — |
| Signup flow (SSO → Cognito) | ✅ PASS (code-verified) | — |
| **Investor Login button in NAV** | ❌ MISSING | HIGH |
| **Investor Dashboard** | ❌ MISSING | HIGH |
| **Admin Dashboard** | ❌ MISSING | HIGH |
| Protected routes (unauthenticated redirect) | ⚠️ CONDITIONAL | MEDIUM |
| 404 / catch-all routing | ✅ PASS (code-verified) | — |

**Overall verdict: NOT READY FOR PRODUCTION** — 4 critical/high blockers must be resolved.

---

## Test Run Results

**Run date:** 2026-04-04  
**Command:** `npx playwright test --reporter=list`  
**Result: 0 passed / 45 failed (45/45)**

### Root Cause — CRIT-01 Confirmed by Live Run

Every test fails immediately with:
```
Error: page.goto: net::ERR_INVALID_AUTH_CREDENTIALS
  at https://v2-webapp.d1tsm8kwwa2wqc.amplifyapp.com/
```

Amplify Access Control (HTTP Basic Auth) is active on the deployment branch. The browser is challenged with a `401 WWW-Authenticate` before any page content loads, blocking all 45 tests at the navigation step. **No application code is reachable.**

To unblock all tests, disable Amplify Access Control (see CRIT-01 remediation below), then re-run:
```bash
npx playwright test
# or if keeping Basic Auth on staging:
AMPLIFY_BASIC_AUTH_USER=<user> AMPLIFY_BASIC_AUTH_PASS=<pass> npx playwright test
```

### Expected results once CRIT-01 is resolved

Based on static code analysis, the anticipated pass/fail breakdown after disabling Basic Auth:

| Suite | Expected Pass | Expected Fail | Reason for Fails |
|---|---|---|---|
| Landing page (TC-LP-01–10) | 9 | 1 | TC-LP-06: Investor Login button missing |
| Login flow (TC-LG-01–07) | 7 | 0 | — |
| Signup flow (TC-SU-01–07) | 7 | 0 | — |
| Dashboard protection (TC-DB-01–05) | 5 | 0 | — |
| Admin dashboard (TC-AD-01–02) | 0 | 2 | Route not implemented |
| Investor dashboard (TC-IV-01–03) | 0 | 3 | Route not implemented |
| Routing (TC-RT-01–05) | 5 | 0 | — |
| HTTPS (TC-SEC-01–02) | 2 | 0 | — |
| Infrastructure (TC-INF-01–04) | 3 | 1 | TC-INF-01: Basic Auth still active |
| **TOTAL** | **38** | **7** | |

---

## CRITICAL Findings

---

### CRIT-01: Amplify Access Control (Basic Auth) Enabled on Deployment

**Severity:** CRITICAL  
**Test:** TC-INF-01  
**Status:** ❌ FAIL

**Observation:**  
The Amplify deployment at `https://v2-webapp.d1tsm8kwwa2wqc.amplifyapp.com` returns `net::ERR_INVALID_AUTH_CREDENTIALS` (HTTP 401) on every page load. AWS Amplify Console "Access Control" (Basic Auth) is enabled on this branch.

**Impact:**
- The app is completely inaccessible to any user without the Basic Auth credentials
- Investors, new users, and stakeholders cannot access or test the app
- All downstream tests (login, signup, investor flow) are blocked by this gate

**Remediation:**
1. Log into the **AWS Amplify Console** → App: `eleventhhouse-glass-dash` → Branch
2. Go to **App Settings → Access Control**
3. Toggle Access Control to **OFF** for this branch
4. OR: If keeping Basic Auth for staging, supply credentials to the Playwright config via env var:
   ```bash
   AMPLIFY_BASIC_AUTH_USER=your_user AMPLIFY_BASIC_AUTH_PASS=your_pass npx playwright test
   ```
5. Ensure the **production branch** (e.g. `main`) has Access Control **disabled**

---

## HIGH Severity Findings

---

### HIGH-01: Investor Login Button Missing from Navbar

**Severity:** HIGH  
**Test:** TC-LP-06, TC-IV-03  
**Status:** ❌ NOT IMPLEMENTED

**Observation:**  
`src/components/Navbar.tsx` contains only two CTAs:
- `Sign In` → `/login`
- `Start Free` → `/signup`

There is **no Investor Login button** anywhere in the navbar. Searching the entire codebase for `investor` returns zero results.

**Impact:**
- Investors cannot find their dedicated login entry point from the main nav
- Investor flow is completely absent from the application

**Remediation — `src/components/Navbar.tsx`:**

Add the Investor Login button to the desktop `<div>` at line 41 and to the mobile menu at line 80:

```tsx
// Desktop CTA (after the existing "Start Free" button)
<Link
  to="/investor-login"
  className="px-6 py-2.5 text-sm font-bold text-amber-600 hover:text-amber-800 border border-amber-300 rounded-full transition-colors"
>
  Investor Login
</Link>
```

---

### HIGH-02: Investor Dashboard Route Does Not Exist

**Severity:** HIGH  
**Test:** TC-IV-01, TC-IV-02  
**Status:** ❌ NOT IMPLEMENTED

**Observation:**  
`src/App.tsx` defines routes for `/`, `/login`, `/signup`, and `/dashboard/**`. There is **no `/investor-login` or `/investor-dashboard` route**. Navigating to these paths triggers the catch-all `<Navigate to="/" />`.

**Impact:**
- Investors who click the Investor Login button (once added) will land on a non-existent route
- No investor-specific view (portfolio, financials, cap table, etc.) exists

**Remediation:**

1. Create `src/pages/InvestorLogin.tsx` (or reuse Cognito SSO with a dedicated investor user pool/client)
2. Create `src/pages/InvestorDashboard.tsx` with investor-specific content
3. Register routes in `src/App.tsx`:

```tsx
// In App.tsx Routes:
<Route path="/investor-login" element={<InvestorLogin />} />
<Route
  path="/investor-dashboard"
  element={
    <ProtectedRoute>
      <InvestorDashboard />
    </ProtectedRoute>
  }
/>
```

---

### HIGH-03: Admin Dashboard Route Does Not Exist

**Severity:** HIGH  
**Test:** TC-AD-01, TC-AD-02  
**Status:** ❌ NOT IMPLEMENTED

**Observation:**  
No `/admin` route exists in `src/App.tsx`. There is no admin authentication, no role-based access control, and no admin-specific UI components in the codebase.

**Impact:**
- No administrative interface for managing users, tenants, or system settings
- Operators/admins have no internal tooling via the web app

**Remediation:**

1. Create `src/pages/AdminDashboard.tsx`
2. Implement role-based auth check (e.g., check Cognito group `admin` in JWT):

```tsx
// In ProtectedRoute or a new AdminRoute:
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const groups = user?.groups ?? []; // extract from JWT custom claims
  if (!groups.includes('admin')) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
```

3. Register the route in `App.tsx`:

```tsx
<Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>
```

---

## MEDIUM Severity Findings

---

### MED-01: DEV Bypass Skips Auth in Development Builds

**Severity:** MEDIUM  
**Test:** TC-DB-01 through TC-DB-05  
**Status:** ⚠️ CONDITIONAL

**Observation:**  
`src/App.tsx` line 44:
```tsx
// DEV BYPASS for testing
if (import.meta.env.DEV) {
  return <>{children}</>;
}
```

In production Amplify builds (`import.meta.env.DEV === false`), the `ProtectedRoute` correctly redirects unauthenticated users to `/login`. However, this bypass exists in the codebase and must never be included in a production `NODE_ENV=production` build.

**Impact:**  
Low risk in prod (Vite sets `DEV=false` in production builds). But it's a code smell and a risk if environment config is misconfigured.

**Remediation:**  
Remove the DEV bypass and use proper test fixtures with mocked auth instead:

```tsx
// Remove this block entirely:
if (import.meta.env.DEV) {
  return <>{children}</>;
}
```

Use Playwright's `storageState` to inject auth tokens for testing instead of bypassing auth in the app.

---

### MED-02: Cognito Logout URI Mismatch Risk

**Severity:** MEDIUM  
**Test:** Code review  
**Status:** ⚠️ REVIEW NEEDED

**Observation:**  
`src/context/AuthContext.tsx` line 31:
```tsx
window.location.href = `${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(LOGOUT_URI)}`;
```

`LOGOUT_URI` defaults to `window.location.origin` if env var not set. If the Amplify URL changes (e.g., on new branch deploy), the logout redirect will fail because the URI won't match the Cognito allowed logout URIs list.

**Remediation:**  
Ensure `VITE_LOGOUT_URI` is always set in the Amplify environment variables for each branch, and that each URI is registered in the Cognito App Client's "Allowed sign-out URLs" list.

---

### MED-03: No Error Boundary on Dashboard

**Severity:** MEDIUM  
**Test:** Code review  
**Status:** ⚠️ REVIEW NEEDED

**Observation:**  
`src/components/dashboard/DashboardLayout.tsx` imports from a relative path with a space:
```tsx
import { Sidebar } from '../../../ehcx.ai-metrics-dashboard-metrivcs 2/components/Sidebar';
```

This path (`ehcx.ai-metrics-dashboard-metrivcs 2`) is a legacy directory with a space in its name — fragile and non-standard. If this build artifact is missing or the path changes, the entire Dashboard will fail to render silently.

**Remediation:**
1. Rename the directory to `ehcx-metrics-dashboard` (no spaces, no version suffix)
2. Move the `Sidebar` component into `src/components/dashboard/Sidebar.tsx`
3. Update the import to a clean relative path

---

## PASS Findings (Code-Verified)

### Login Flow (TC-LG-01 to TC-LG-07)
✅ `/login` page exists with correct layout  
✅ "Sign In with SSO" button triggers `auth.signinRedirect()` → Cognito hosted UI  
✅ Cognito domain is correctly configured  
✅ Error state is handled (error alert rendered)  
✅ "Start free trial" cross-link to `/signup` exists  
✅ "powered by AWS Cognito" label present  

### Signup Flow (TC-SU-01 to TC-SU-07)
✅ `/signup` page exists with correct layout  
✅ "Create Account" button triggers same `login()` → Cognito hosted UI  
✅ 14-day free trial messaging present  
✅ "Sign in" cross-link to `/login` exists  
✅ "powered by AWS Cognito" label present  

### Routing (TC-RT-01 to TC-RT-05)
✅ Unknown routes → catch-all `<Navigate to="/" replace />`  
✅ `/checkout/success` and `/checkout/cancel` routes registered  
✅ Back-navigation logic is standard React Router  

### HTTPS (TC-SEC-01, TC-SEC-02)
✅ Amplify enforces HTTPS by default  
✅ All auth redirects use HTTPS endpoints  

---

## Pre-Production Checklist

| # | Item | Status |
|---|------|--------|
| 1 | Disable Amplify Basic Auth (Access Control) on prod branch | ❌ PENDING |
| 2 | Add Investor Login button to Navbar | ❌ PENDING |
| 3 | Implement Investor Dashboard route & page | ❌ PENDING |
| 4 | Implement Admin Dashboard route & page with RBAC | ❌ PENDING |
| 5 | Remove DEV auth bypass from `ProtectedRoute` | ❌ PENDING |
| 6 | Verify Cognito logout URIs match all branch URLs | ❌ PENDING |
| 7 | Refactor DashboardLayout legacy import (space in path) | ❌ PENDING |
| 8 | Set `VITE_LOGOUT_URI` in Amplify env vars per branch | ❌ PENDING |
| 9 | Run full Playwright suite with valid credentials | ❌ PENDING |
| 10 | Add authenticated test fixtures for dashboard routes | ❌ PENDING |

---

## How to Run Tests

```bash
# Install dependencies
npm install

# Run all tests (requires network access to Amplify URL)
npx playwright test

# Run with Basic Auth (if Amplify Access Control is enabled)
AMPLIFY_BASIC_AUTH_USER=<user> AMPLIFY_BASIC_AUTH_PASS=<pass> npx playwright test

# Run specific test file
npx playwright test e2e/auth-flows.spec.ts

# View HTML report
npx playwright show-report e2e/playwright-report

# Run tests headed (visible browser)
npx playwright test --headed
```

---

## Test Files

| File | Test IDs | Coverage |
|------|----------|----------|
| `e2e/landing-page.spec.ts` | TC-LP-01 to TC-LP-10 | Landing page, Navbar elements |
| `e2e/auth-flows.spec.ts` | TC-LG-01 to TC-LG-07, TC-SU-01 to TC-SU-07 | Login & Signup flows |
| `e2e/dashboard.spec.ts` | TC-DB-01 to TC-DB-05, TC-AD-01 to TC-AD-02, TC-IV-01 to TC-IV-03 | Dashboard protection, Admin & Investor dashboards |
| `e2e/routing.spec.ts` | TC-RT-01 to TC-RT-05, TC-SEC-01 to TC-SEC-02 | Routing & HTTPS |
| `e2e/infrastructure.spec.ts` | TC-INF-01 to TC-INF-04 | Amplify deployment health |
