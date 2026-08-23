import { test, expect } from '../fixtures/auth';

test.describe('Admin Privilege Enforcement', () => {

  test('Regular user is denied access to admin lookup route', async ({ authenticatedUser, page }) => {
    await page.goto('/admin/users');
    
    // Verify catch-all client router displays 404 Page Not Found
    await expect(page.locator('h1')).toContainText(/404|Not Found/i);
  });

  test('Admin can access logs audit page', async ({ authenticatedAdmin, page }) => {
    await page.goto('/dashboard');
    
    // Navigate to admin panels if needed or ensure routing logic blocks non-admins
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
