import { test as base, expect } from '@playwright/test';

export const dismissA11yWizard = async (page: any) => {
  try {
    const skipBtn = page.locator('button:has-text("Skip for now")');
    await skipBtn.waitFor({ state: 'visible', timeout: 2000 });
    await skipBtn.click();
  } catch (e) {
    // Modal not displayed or already dismissed
  }
};

export const test = base.extend({
  // Fixture: pre-logged-in user context
  authenticatedUser: async ({ page }, provide) => {
    const user = {
      email: 'demo.user@saksham.ai',
      password: 'sakshamUser2026',
      name: 'Demo Candidate User',
    };

    await page.goto('/login');
    await dismissA11yWizard(page);
    
    await page.fill('input[type="email"]', user.email);
    await page.fill('input[type="password"]', user.password);
    await page.click('button[type="submit"]');

    // Wait for the dashboard redirect
    await page.waitForURL('**/dashboard');

    await provide(user);
  },

  // Fixture: pre-logged-in admin context
  authenticatedAdmin: async ({ page }, provide) => {
    const admin = {
      email: 'demo.admin@saksham.ai',
      password: 'sakshamAdmin2026',
    };

    await page.goto('/login');
    await dismissA11yWizard(page);
    
    await page.fill('input[type="email"]', admin.email);
    await page.fill('input[type="password"]', admin.password);
    await page.click('button[type="submit"]');

    // Wait for redirect
    await page.waitForURL('**/dashboard');

    await provide(admin);
  },
});

export { expect };
