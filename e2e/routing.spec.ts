import { test, expect } from '@playwright/test';

const BASE_URL = 'https://v2-webapp.d1tsm8kwwa2wqc.amplifyapp.com';

test.describe('Routing & Navigation', () => {
  test('TC-RT-01: unknown routes redirect to landing page', async ({ page }) => {
    await page.goto(`${BASE_URL}/this-route-does-not-exist`);
    await expect(page).toHaveURL(`${BASE_URL}/`, { timeout: 10000 });
  });

  test('TC-RT-02: /checkout/success page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/checkout/success`);
    await expect(page).toHaveURL(/\/checkout\/success/);
    // Should not crash
    await expect(page.locator('body')).toBeVisible();
  });

  test('TC-RT-03: /checkout/cancel page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/checkout/cancel`);
    await expect(page).toHaveURL(/\/checkout\/cancel/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('TC-RT-04: back navigation from /login returns to home', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.goto(`${BASE_URL}/login`);
    await page.goBack();
    await expect(page).toHaveURL(`${BASE_URL}/`);
  });

  test('TC-RT-05: back navigation from /signup returns to previous page', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.goto(`${BASE_URL}/signup`);
    await page.goBack();
    await expect(page).toHaveURL(`${BASE_URL}/`);
  });
});

test.describe('HTTPS & Security Headers', () => {
  test('TC-SEC-01: app is served over HTTPS', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/`);
    expect(page.url()).toMatch(/^https:\/\//);
    expect(response?.status()).toBeLessThan(400);
  });

  test('TC-SEC-02: login page is served over HTTPS', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    expect(page.url()).toMatch(/^https:\/\//);
  });
});
