import { PlaywrightTestConfig, defineConfig } from '@playwright/test';

const config: PlaywrightTestConfig = defineConfig({
  testDir: './e2e',
  timeout: 30000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['html'], ['junit', { outputFile: 'test-results/e2e-junit.xml' }]] : 'html',
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});

export default config;
