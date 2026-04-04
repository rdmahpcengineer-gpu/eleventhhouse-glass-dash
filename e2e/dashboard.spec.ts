import { test, expect } from '@playwright/test';

const BASE_URL = 'https://v2-webapp.d1tsm8kwwa2wqc.amplifyapp.com';

test.describe('Dashboard Access (Unauthenticated)', () => {
  test('TC-DB-01: /dashboard redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    // In production (non-DEV), ProtectedRoute should redirect to /login
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  test('TC-DB-02: /dashboard/activity redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/activity`);
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  test('TC-DB-03: /dashboard/analytics redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/analytics`);
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  test('TC-DB-04: /dashboard/settings redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/settings`);
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  test('TC-DB-05: /dashboard/billing redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/billing`);
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });
});

test.describe('Admin Dashboard', () => {
  test('TC-AD-01 [FAIL EXPECTED]: /admin route exists and loads', async ({ page }) => {
    // Requirement: Admin dashboard should be accessible
    // Current status: Route NOT IMPLEMENTED in App.tsx
    await page.goto(`${BASE_URL}/admin`);
    // Should NOT redirect to / (catch-all) if it exists
    await expect(page).not.toHaveURL(`${BASE_URL}/`, { timeout: 5000 });
    await expect(page).toHaveURL(/\/admin/, { timeout: 5000 });
  });

  test('TC-AD-02 [FAIL EXPECTED]: admin dashboard shows admin-specific content', async ({ page }) => {
    // Requirement: Admin dashboard should have admin-specific UI
    // Current status: NOT IMPLEMENTED
    await page.goto(`${BASE_URL}/admin`);
    const adminHeading = page.getByRole('heading', { name: /admin/i });
    await expect(adminHeading).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Investor Dashboard', () => {
  test('TC-IV-01 [FAIL EXPECTED]: /investor-dashboard route exists and loads', async ({ page }) => {
    // Requirement: Investor dashboard should be accessible via Investor Login button
    // Current status: Route NOT IMPLEMENTED in App.tsx
    await page.goto(`${BASE_URL}/investor-dashboard`);
    await expect(page).not.toHaveURL(`${BASE_URL}/`, { timeout: 5000 });
    await expect(page).toHaveURL(/\/investor/, { timeout: 5000 });
  });

  test('TC-IV-02 [FAIL EXPECTED]: investor dashboard shows investor-specific content', async ({ page }) => {
    // Requirement: Investor dashboard should show financial/investment metrics
    // Current status: NOT IMPLEMENTED
    await page.goto(`${BASE_URL}/investor-dashboard`);
    const investorHeading = page.getByRole('heading', { name: /investor/i });
    await expect(investorHeading).toBeVisible({ timeout: 5000 });
  });

  test('TC-IV-03 [FAIL EXPECTED]: Investor Login button in navbar links to investor auth', async ({ page }) => {
    // Requirement: Investor Login button should be in the main navbar
    // Current status: NOT IMPLEMENTED - Navbar only has Sign In and Start Free
    await page.goto(BASE_URL);
    const investorBtn = page.locator('nav').getByRole('link', { name: /investor/i });
    await expect(investorBtn).toBeVisible({ timeout: 5000 });
    await investorBtn.click();
    await expect(page).toHaveURL(/\/investor|\/investor-login/, { timeout: 5000 });
  });
});
