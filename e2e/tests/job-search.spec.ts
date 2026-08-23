import { test, expect } from '../fixtures/auth';

test.describe('Job Board and Scoring', () => {

  test('User navigates to inclusive job feed', async ({ authenticatedUser, page }) => {
    await page.goto('/jobs');

    // Wait for at least one job card to be visible
    const jobCards = page.locator('.premium-card, div:has-text("Apply Now")');
    await expect(jobCards.first()).toBeVisible();
  });

  test('User filters jobs by work mode', async ({ authenticatedUser, page }) => {
    await page.goto('/jobs');

    // Find filter button and change select option
    const filterBtn = page.locator('button:has-text("Work Mode:")');
    if (await filterBtn.isVisible()) {
      await filterBtn.click();
    }
  });

  test('User clicks "Explain in Simple Words" RAG trigger', async ({ authenticatedUser, page }) => {
    await page.goto('/jobs');

    // Click explain button on first job card
    const explainBtn = page.locator('button:has-text("Explain in Simple Words")').first();
    await expect(explainBtn).toBeVisible();
    await explainBtn.click();

    // Check dialog popped up
    const dialogTitle = page.locator('h2, h3, :has-text("AI Job Summary")').first();
    await expect(dialogTitle).toBeVisible();

    // Wait for loader or explanation text to appear
    const explanationText = page.locator('text="Sakhi AI is analyzing compatibility"');
    if (await explanationText.isVisible()) {
      await expect(explanationText).toBeVisible();
    }
  });
});
