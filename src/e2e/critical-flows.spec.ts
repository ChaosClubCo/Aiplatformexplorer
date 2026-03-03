import { test, expect } from '@playwright/test';

/**
 * Critical User Flow E2E Tests
 * 
 * These tests cover the essential user journeys that must work in V1:
 * 1. Browse and filter platforms
 * 2. Select platforms and save as stack
 * 3. Load saved stacks
 * 4. Keyboard navigation
 * 5. Stack persistence across reloads
 */

test.describe('Critical User Flows - V1 Smoke Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test for clean state
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('Flow 1: Browse → Filter → Select → Save → Load Stack', async ({ page }) => {
    // 1. Navigate to explorer
    await page.goto('/explorer');
    await expect(page).toHaveURL(/\/explorer/);
    
    // 2. Verify platforms load (should see multiple cards)
    const platformCards = page.locator('[data-testid="platform-card"], .platform-card, [class*="platform"]');
    await expect(platformCards.first()).toBeVisible({ timeout: 5000 });
    
    // 3. Apply provider filter (if filter exists)
    const providerFilter = page.locator('select').filter({ hasText: /Provider|Microsoft|Google/ }).first();
    if (await providerFilter.isVisible()) {
      await providerFilter.selectOption({ index: 1 }); // Select first non-"All" option
      await page.waitForTimeout(500); // Wait for filter to apply
    }
    
    // 4. Select platforms (look for checkboxes)
    const checkboxes = page.locator('input[type="checkbox"]').filter({ hasNotText: /Select All/i });
    const firstCheckbox = checkboxes.first();
    const secondCheckbox = checkboxes.nth(1);
    
    if (await firstCheckbox.isVisible()) {
      await firstCheckbox.check();
      await secondCheckbox.check();
      
      // 5. Verify selection counter shows
      await expect(page.locator('text=/[0-9]+ selected/i')).toBeVisible();
    }
    
    // 6. Save as stack
    const saveButton = page.locator('button:has-text("Save as Stack"), button:has-text("Save Stack")').first();
    if (await saveButton.isVisible()) {
      await saveButton.click();
      
      // Fill in stack details
      await page.fill('input[name="name"], input[placeholder*="name" i]', 'E2E Test Stack');
      await page.fill('textarea[name="description"], textarea[placeholder*="description" i]', 'Created by automated test');
      
      // Save
      await page.click('button:has-text("Save"):not(:has-text("Save as"))');
      
      // Wait for save confirmation (toast or redirect)
      await page.waitForTimeout(1000);
      
      // 7. Navigate to stacks page
      await page.goto('/stacks');
      await expect(page.locator('text=E2E Test Stack')).toBeVisible();
      
      // 8. Load stack
      const loadButton = page.locator('button:has-text("Load")').first();
      await loadButton.click();
      
      // Should redirect to explorer with selection
      await expect(page).toHaveURL(/\/explorer/);
      await expect(page.locator('text=/[0-9]+ selected/i')).toBeVisible();
    }
  });

  test('Flow 2: Keyboard Navigation', async ({ page }) => {
    await page.goto('/explorer');
    
    // Tab to skip link (if exists)
    await page.keyboard.press('Tab');
    
    // Verify focus is visible (check for focus-visible class or outline)
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Continue tabbing through interactive elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      const currentFocus = page.locator(':focus');
      await expect(currentFocus).toBeVisible();
    }
    
    // Verify no keyboard trap (can tab backwards)
    await page.keyboard.press('Shift+Tab');
    const backwardFocus = page.locator(':focus');
    await expect(backwardFocus).toBeVisible();
  });

  test('Flow 3: Stack Persistence After Reload', async ({ page }) => {
    // Create a stack
    await page.goto('/explorer');
    
    // Select first platform
    const firstCheckbox = page.locator('input[type="checkbox"]').first();
    if (await firstCheckbox.isVisible()) {
      await firstCheckbox.check();
      
      // Save stack
      const saveButton = page.locator('button:has-text("Save as Stack")').first();
      if (await saveButton.isVisible()) {
        await saveButton.click();
        await page.fill('input[name="name"], input[placeholder*="name" i]', 'Persistence Test');
        await page.click('button:has-text("Save"):not(:has-text("Save as"))');
        await page.waitForTimeout(1000);
      }
    }
    
    // Reload page
    await page.reload();
    
    // Navigate to stacks
    await page.goto('/stacks');
    
    // Verify stack still exists
    await expect(page.locator('text=Persistence Test')).toBeVisible();
  });

  test('Flow 4: Delete Stack', async ({ page }) => {
    // Create a stack first
    await page.goto('/explorer');
    const firstCheckbox = page.locator('input[type="checkbox"]').first();
    
    if (await firstCheckbox.isVisible()) {
      await firstCheckbox.check();
      const saveButton = page.locator('button:has-text("Save as Stack")').first();
      if (await saveButton.isVisible()) {
        await saveButton.click();
        await page.fill('input[name="name"], input[placeholder*="name" i]', 'Delete Test');
        await page.click('button:has-text("Save"):not(:has-text("Save as"))');
        await page.waitForTimeout(1000);
      }
    }
    
    // Go to stacks page
    await page.goto('/stacks');
    
    // Find and click delete button
    const deleteButton = page.locator('button[aria-label*="Delete"], button:has(svg.lucide-trash)').first();
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
      
      // Confirm deletion (look for confirmation dialog)
      const confirmButton = page.locator('button:has-text("Delete"), button:has-text("Confirm")');
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
        await page.waitForTimeout(500);
      }
      
      // Verify stack is gone
      await expect(page.locator('text=Delete Test')).not.toBeVisible();
    }
  });

  test('Flow 5: Platform Modal Opens and Closes', async ({ page }) => {
    await page.goto('/explorer');
    
    // Click "View Details" on first platform
    const viewDetailsButton = page.locator('button:has-text("View Details"), button:has-text("Details")').first();
    if (await viewDetailsButton.isVisible()) {
      await viewDetailsButton.click();
      
      // Verify modal opens
      const modal = page.locator('[role="dialog"], .modal, [class*="modal"]');
      await expect(modal).toBeVisible();
      
      // Close with Escape key
      await page.keyboard.press('Escape');
      
      // Verify modal closes
      await expect(modal).not.toBeVisible();
    }
  });

  test('Flow 6: Responsive Design - Mobile View', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    
    await page.goto('/explorer');
    
    // Verify platforms render in card view (not table)
    const platformCards = page.locator('[data-testid="platform-card"], .platform-card');
    await expect(platformCards.first()).toBeVisible();
    
    // Verify no horizontal scroll
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const bodyClientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(bodyScrollWidth).toBeLessThanOrEqual(bodyClientWidth + 1); // Allow 1px tolerance
  });

  test('Flow 7: Search Functionality', async ({ page }) => {
    await page.goto('/explorer');
    
    // Find search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search" i]').first();
    if (await searchInput.isVisible()) {
      // Type search term
      await searchInput.fill('code');
      
      // Verify results update
      await page.waitForTimeout(500);
      const resultsText = page.locator('text=/Showing [0-9]+/');
      await expect(resultsText).toBeVisible();
    }
  });

  test('Flow 8: Clear Selection', async ({ page }) => {
    await page.goto('/explorer');
    
    // Select platforms
    const checkboxes = page.locator('input[type="checkbox"]');
    const firstCheckbox = checkboxes.first();
    const secondCheckbox = checkboxes.nth(1);
    
    if (await firstCheckbox.isVisible()) {
      await firstCheckbox.check();
      await secondCheckbox.check();
      
      // Verify selection shows
      await expect(page.locator('text=/[0-9]+ selected/i')).toBeVisible();
      
      // Clear selection
      const clearButton = page.locator('button:has-text("Clear Selection"), button:has-text("Clear")');
      if (await clearButton.isVisible()) {
        await clearButton.click();
        
        // Verify selection cleared
        await expect(page.locator('text=/[0-9]+ selected/i')).not.toBeVisible();
      }
    }
  });
});

/**
 * Accessibility Tests
 */
test.describe('Accessibility - WCAG 2.2 AA', () => {
  
  test('A11y: Page has proper heading structure', async ({ page }) => {
    await page.goto('/explorer');
    
    // Check for H1
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    
    // Verify heading text is meaningful
    const h1Text = await h1.textContent();
    expect(h1Text?.length).toBeGreaterThan(0);
  });

  test('A11y: All images have alt text', async ({ page }) => {
    await page.goto('/explorer');
    
    // Find all images
    const images = page.locator('img');
    const count = await images.count();
    
    // Check each image has alt attribute
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).not.toBeNull(); // Alt can be empty string for decorative images
    }
  });

  test('A11y: Interactive elements are focusable', async ({ page }) => {
    await page.goto('/explorer');
    
    // Check buttons are focusable
    const buttons = page.locator('button');
    const firstButton = buttons.first();
    
    if (await firstButton.isVisible()) {
      await firstButton.focus();
      const isFocused = await firstButton.evaluate(el => el === document.activeElement);
      expect(isFocused).toBe(true);
    }
  });
});

/**
 * Performance Tests
 */
test.describe('Performance Checks', () => {
  
  test('Perf: Page loads within 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/explorer');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000); // 3 second budget
  });

  test('Perf: No console errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/explorer');
    await page.waitForTimeout(2000);
    
    expect(errors).toHaveLength(0);
  });
});
