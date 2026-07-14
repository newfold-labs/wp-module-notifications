import { test, expect } from '@playwright/test';
import {
  auth,
  SELECTORS,
  createThemeSearchNotifications,
  clearNotificationsTransient,
  navigateToThemeInstall,
  mockNotificationsApi,
} from '../helpers/index.mjs';

/** Resolve after the realtime module finishes POSTing search metadata to `.../notifications/events`. */
function whenNotificationsSearchEventsComplete(page) {
  return page.waitForResponse(
    (response) => {
      if (response.request().method() !== 'POST') {
        return false;
      }
      const url = response.url();
      if (!url.includes('newfold-notifications') || !url.includes('events')) {
        return false;
      }
      return response.status() === 201;
    },
    { timeout: 30000 },
  );
}

test.describe('Theme Search', () => {
  // Generous budget: beforeEach's WP-CLI transient cleanup and the live
  // theme-browser search can each vary under CI load, and both precede the
  // expect.poll below, which needs its own full 30s of headroom.
  test.describe.configure({ timeout: 60_000 });

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
    const eventsDone = whenNotificationsSearchEventsComplete(page);
    await searchInput.clear();
    await searchInput.fill('termA');
    await eventsDone;

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

    const searchInput = page.locator(SELECTORS.themeSearchInput);
    const eventsDone = whenNotificationsSearchEventsComplete(page);
    await searchInput.clear();
    await searchInput.fill('termB');
    await eventsDone;

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

