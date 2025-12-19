import { test, expect } from '@playwright/test';
import {
  auth,
  SELECTORS,
  createThemeSearchNotifications,
  clearNotificationsTransient,
  navigateToThemeInstall,
  mockNotificationsApi,
} from '../helpers/index.mjs';

test.describe('Theme Search', () => {
  test.beforeEach(async ({ page }) => {
    await auth.loginToWordPress(page);
    await clearNotificationsTransient();
  });

  test.afterAll(async () => {
    await clearNotificationsTransient();
  });

  test('should display matching theme search results', async ({ page }) => {
    const notifications = createThemeSearchNotifications();
    await mockNotificationsApi(page, notifications);

    await navigateToThemeInstall(page);

    // Clear and type search query
    const searchInput = page.locator(SELECTORS.themeSearchInput);
    await searchInput.clear();
    await searchInput.fill('termA');

    // Wait for theme browser to load
    const themeBrowser = page.locator(SELECTORS.themeBrowser);
    await expect(themeBrowser.first()).toBeVisible({ timeout: 30000 });

    // Verify matching search result appears
    const searchResult = page.locator(SELECTORS.themeSearchResult);
    await searchResult.scrollIntoViewIfNeeded();
    await expect(searchResult).toBeVisible();
    await expect(searchResult).toHaveAttribute('data-id', 'test-termA');
  });

  test('should not display non-matching theme search results', async ({ page }) => {
    const notifications = createThemeSearchNotifications();
    await mockNotificationsApi(page, notifications);

    await navigateToThemeInstall(page);

    // Type search query for termB
    const searchInput = page.locator(SELECTORS.themeSearchInput);
    await searchInput.fill('termB');

    // Wait for theme browser to load
    const themeBrowser = page.locator(SELECTORS.themeBrowser);
    await expect(themeBrowser.first()).toBeVisible({ timeout: 30000 });

    // Verify the displayed result is for termB, not termA
    const searchResult = page.locator(SELECTORS.themeSearchResult);
    await searchResult.scrollIntoViewIfNeeded();
    await expect(searchResult).toBeVisible();
    await expect(searchResult).toHaveAttribute('data-id');
    
    const dataId = await searchResult.getAttribute('data-id');
    expect(dataId).not.toBe('test-termA');
  });
});

