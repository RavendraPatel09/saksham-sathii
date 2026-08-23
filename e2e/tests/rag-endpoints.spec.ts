import { test, expect } from '../fixtures/auth';

test.describe('RAG Feature Integrations', () => {

  test('Document Simplifier Page Flow', async ({ authenticatedUser, page }) => {
    await page.goto('/simplify-document');

    const textarea = page.locator('textarea[placeholder*="paste" i]');
    await expect(textarea).toBeVisible();
    await textarea.fill('This is a complex corporate policy document containing legal jargon.');

    const simplifyBtn = page.locator('button:has-text("Simplify")');
    await simplifyBtn.click();

    // Check loader
    await expect(page.locator('button:has-text("Simplifying")')).toBeVisible();

    // Wait for output simplified box
    const outputBox = page.locator('text="Simplified text copied!"');
    await page.waitForTimeout(3000);
  });

  test('Accommodation Letter Generation Flow', async ({ authenticatedUser, page }) => {
    await page.goto('/accommodation-letter');

    // Click select options
    const disabilitySelect = page.locator('select, button[id*="disability" i]').first();
    if (await disabilitySelect.isVisible()) {
      await disabilitySelect.click();
    }

    // Click generate button
    const generateBtn = page.locator('button:has-text("Generate")');
    await expect(generateBtn).toBeVisible();
    await generateBtn.click();

    // Wait for letters to render
    await page.waitForTimeout(3000);
  });

  test('Interview Coaching Session flow', async ({ authenticatedUser, page }) => {
    await page.goto('/interview');

    // Make sure elements exist
    const textModeBtn = page.locator('button:has-text("Text Mode")');
    if (await textModeBtn.isVisible()) {
      await textModeBtn.click();
    }

    // Submit mock answer
    const textarea = page.locator('textarea[placeholder*="answer" i]');
    if (await textarea.isVisible()) {
      await textarea.fill('Yes, I have handled several accessibility projects before.');
    }
  });
});
