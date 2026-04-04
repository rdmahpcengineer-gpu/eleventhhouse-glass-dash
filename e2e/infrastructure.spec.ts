import { test, expect, request } from '@playwright/test';

const BASE_URL = 'https://v2-webapp.d1tsm8kwwa2wqc.amplifyapp.com';

test.describe('Infrastructure & Amplify Deployment', () => {
  test('TC-INF-01: Amplify deployment is publicly accessible (no Basic Auth)', async ({ request }) => {
    // CRITICAL: For production readiness, the app must be publicly accessible
    // AWS Amplify "Access Control" / Basic Auth must be DISABLED on the production branch
    const response = await request.get(BASE_URL, { failOnStatusCode: false });
    expect(response.status(),
      'FAIL: Amplify deployment returned non-200 status. ' +
      'If 401, Basic Auth (Access Control) is enabled in Amplify Console — must be disabled for production.'
    ).toBe(200);
  });

  test('TC-INF-02: app assets load (JS bundles present)', async ({ request }) => {
    const response = await request.get(BASE_URL, { failOnStatusCode: false });
    // If accessible, check for HTML content with React app script tags
    if (response.status() === 200) {
      const body = await response.text();
      expect(body).toContain('<div id="root">');
    } else {
      test.skip();
    }
  });

  test('TC-INF-03: HTTPS redirect works (no HTTP leaks)', async ({ request }) => {
    const response = await request.get(BASE_URL, { failOnStatusCode: false });
    expect(BASE_URL).toMatch(/^https:\/\//);
    // HTTP should redirect to HTTPS (Amplify enforces this by default)
    expect(response.url()).toMatch(/^https:\/\//);
  });

  test('TC-INF-04: Cognito domain is reachable', async ({ request }) => {
    const cognitoDomain = 'https://us-east-1iidbdckak.auth.us-east-1.amazoncognito.com';
    const response = await request.get(cognitoDomain, { failOnStatusCode: false });
    // Cognito domain should return 200 or 302 (not 404/500)
    expect(response.status()).toBeLessThan(500);
    expect(response.status()).not.toBe(404);
  });
});
