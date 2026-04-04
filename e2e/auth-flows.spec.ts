import { test, expect } from '@playwright/test';

const BASE_URL = 'https://v2-webapp.d1tsm8kwwa2wqc.amplifyapp.com';
const COGNITO_DOMAIN = 'us-east-1iidbdckak.auth.us-east-1.amazoncognito.com';

test.describe('Login Flow', () => {
  test('TC-LG-01: /login page loads successfully', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText(/Welcome back/i);
  });

  test('TC-LG-02: login page shows EHCX logo', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await expect(page.getByText(/EHCX/i).first()).toBeVisible();
  });

  test('TC-LG-03: SSO Sign In button is visible and enabled', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    const ssoBtn = page.getByRole('button', { name: /Sign In with SSO/i });
    await expect(ssoBtn).toBeVisible();
    await expect(ssoBtn).toBeEnabled();
  });

  test('TC-LG-04: clicking SSO redirects to AWS Cognito', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    const ssoBtn = page.getByRole('button', { name: /Sign In with SSO/i });
    await ssoBtn.click();
    // Should redirect to Cognito hosted UI
    await expect(page).toHaveURL(new RegExp(COGNITO_DOMAIN), { timeout: 15000 });
  });

  test('TC-LG-05: Cognito login page renders email and password fields', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.getByRole('button', { name: /Sign In with SSO/i }).click();
    await page.waitForURL(new RegExp(COGNITO_DOMAIN), { timeout: 15000 });
    // Cognito hosted UI should have username/email and password fields
    const emailField = page.locator('input[type="text"], input[type="email"]').first();
    const passwordField = page.locator('input[type="password"]').first();
    await expect(emailField).toBeVisible({ timeout: 10000 });
    await expect(passwordField).toBeVisible({ timeout: 10000 });
  });

  test('TC-LG-06: login page has link to signup', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    const signupLink = page.getByRole('link', { name: /Start free trial/i });
    await expect(signupLink).toBeVisible();
    await signupLink.click();
    await expect(page).toHaveURL(/\/signup/);
  });

  test('TC-LG-07: "powered by AWS Cognito" label is shown', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await expect(page.getByText(/powered by AWS Cognito/i)).toBeVisible();
  });
});

test.describe('Signup Flow', () => {
  test('TC-SU-01: /signup page loads successfully', async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);
    await expect(page).toHaveURL(/\/signup/);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText(/Create your account/i);
  });

  test('TC-SU-02: signup page shows EHCX logo', async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);
    await expect(page.getByText(/EHCX/i).first()).toBeVisible();
  });

  test('TC-SU-03: Create Account button is visible and enabled', async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);
    const createBtn = page.getByRole('button', { name: /Create Account/i });
    await expect(createBtn).toBeVisible();
    await expect(createBtn).toBeEnabled();
  });

  test('TC-SU-04: clicking Create Account redirects to AWS Cognito', async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);
    const createBtn = page.getByRole('button', { name: /Create Account/i });
    await createBtn.click();
    // Signup routes through Cognito hosted UI (same as login)
    await expect(page).toHaveURL(new RegExp(COGNITO_DOMAIN), { timeout: 15000 });
  });

  test('TC-SU-05: signup page shows 14-day free trial messaging', async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);
    await expect(page.getByText(/14-day free trial/i).first()).toBeVisible();
  });

  test('TC-SU-06: signup page has link back to sign in', async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);
    const signInLink = page.getByRole('link', { name: /Sign in/i });
    await expect(signInLink).toBeVisible();
    await signInLink.click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('TC-SU-07: "powered by AWS Cognito" label is shown', async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);
    await expect(page.getByText(/powered by AWS Cognito/i)).toBeVisible();
  });
});
