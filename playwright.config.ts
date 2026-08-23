import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
  fullyParallel: false, // Sequential execution since tests may query/affect global state
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1, // Sequential testing
  reporter: 'line',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:4173',
    actionTimeout: 15000,
    navigationTimeout: 20000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'npm run preview',
      port: 4173,
      reuseExistingServer: !process.env.CI,
      timeout: 60000,
    },
    {
      command: 'cd apps/api && npm run start',
      port: 5000,
      reuseExistingServer: !process.env.CI,
      timeout: 60000,
    }
  ],
});
