import { test, expect } from '@playwright/test';

const BASE_URL = 'https://v2-webapp.d1tsm8kwwa2wqc.amplifyapp.com';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('TC-LP-01: page loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/.+/);
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test('TC-LP-02: navbar is visible', async ({ page }) => {
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('TC-LP-03: navbar logo is present and links to home', async ({ page }) => {
    const logo = page.locator('nav a[href="/"]').first();
    await expect(logo).toBeVisible();
    await expect(logo).toContainText(/EHCX/i);
  });

  test('TC-LP-04: navbar has Sign In link', async ({ page }) => {
    const signIn = page.locator('nav a[href="/login"]');
    await expect(signIn).toBeVisible();
    await expect(signIn).toContainText(/Sign In/i);
  });

  test('TC-LP-05: navbar has Start Free / signup link', async ({ page }) => {
    const startFree = page.locator('nav a[href="/signup"]');
    await expect(startFree).toBeVisible();
    await expect(startFree).toContainText(/Start Free/i);
  });

  test('TC-LP-06 [FAIL EXPECTED]: navbar has Investor Login button', async ({ page }) => {
    // Requirement: Investor login button should be visible in the NAV bar
    // Current status: NOT IMPLEMENTED
    const investorBtn = page.locator('nav').getByRole('link', { name: /investor/i });
    await expect(investorBtn).toBeVisible({ timeout: 5000 });
  });

  test('TC-LP-07: hero section is visible', async ({ page }) => {
    await expect(page.locator('main')).toBeVisible();
  });

  test('TC-LP-08: Sign In nav link navigates to /login', async ({ page }) => {
    await page.locator('nav a[href="/login"]').click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('TC-LP-09: Start Free nav link navigates to /signup', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('nav a[href="/signup"]').click();
    await expect(page).toHaveURL(/\/signup/);
  });

  test('TC-LP-10: footer is present', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });
});
