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

    // WP sets `body.loading-content` during admin-ajax `query-themes`, which hides
    // `.content-filterable` — the tile can exist in the DOM but stay non-visible until that clears.
    const searchResult = page.locator(
      `${SELECTORS.themeSearchResult}[data-id="test-termA"]`,
    );
    await expect
      .poll(
        async () => {
          const blocked = await page.evaluate(() =>
            document.body.classList.contains('loading-content'),
          );
          if (blocked) {
            return false;
          }
          return searchResult.isVisible();
        },
        { timeout: 30000 },
      )
      .toBe(true);
    await expect(searchResult).toHaveAttribute('data-id', 'test-termA');
  });

  test('should not display non-matching theme search results', async ({ page }) => {
    const notifications = createThemeSearchNotifications();
    await mockNotificationsApi(page, notifications);

    await navigateToThemeInstall(page);

    // Type search query for termB
    const searchInput = page.locator(SELECTORS.themeSearchInput);
    await searchInput.fill('termB');

    const searchResult = page.locator(
      `${SELECTORS.themeSearchResult}[data-id="test-termB"]`,
    );
    await expect
      .poll(
        async () => {
          const blocked = await page.evaluate(() =>
            document.body.classList.contains('loading-content'),
          );
          if (blocked) {
            return false;
          }
          return searchResult.isVisible();
        },
        { timeout: 30000 },
      )
      .toBe(true);
    await expect(searchResult).toHaveAttribute('data-id', 'test-termB');
  });
});

