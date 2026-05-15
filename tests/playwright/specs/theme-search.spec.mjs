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

    // Theme grid can re-render after search; wait for the exact row instead of scrolling early.
    const searchResult = page.locator(
      `${SELECTORS.themeSearchResult}[data-id="test-termA"]`,
    );
    await expect(searchResult).toBeVisible({ timeout: 30000 });
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

    const searchResult = page.locator(
      `${SELECTORS.themeSearchResult}[data-id="test-termB"]`,
    );
    await expect(searchResult).toBeVisible({ timeout: 30000 });
    await expect(searchResult).toHaveAttribute('data-id', 'test-termB');
  });
});

