import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'e2e/playwright-report', open: 'never' }],
    ['json', { outputFile: 'e2e/test-results.json' }],
  ],
  use: {
    baseURL: 'https://v2-webapp.d1tsm8kwwa2wqc.amplifyapp.com',
    screenshot: 'on',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    // HTTP Basic Auth credentials for Amplify Access Control (set via env vars)
    httpCredentials: process.env.AMPLIFY_BASIC_AUTH_USER ? {
      username: process.env.AMPLIFY_BASIC_AUTH_USER,
      password: process.env.AMPLIFY_BASIC_AUTH_PASS || '',
    } : undefined,
    launchOptions: {
      executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  outputDir: 'e2e/test-artifacts',
});
