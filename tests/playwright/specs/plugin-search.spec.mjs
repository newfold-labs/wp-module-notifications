import { test, expect } from '@playwright/test';
import {
  auth,
  SELECTORS,
  createPluginSearchNotifications,
  clearNotificationsTransient,
  navigateToPluginInstall,
  mockNotificationsApi,
} from '../helpers/index.mjs';

test.describe('Plugin Search', () => {
  test.beforeEach(async ({ page }) => {
    await auth.loginToWordPress(page);
    await clearNotificationsTransient();
  });

  test.afterAll(async () => {
    await clearNotificationsTransient();
  });

  test('should display matching plugin search results', async ({ page }) => {
    const notifications = createPluginSearchNotifications();
    await mockNotificationsApi(page, notifications);

    await navigateToPluginInstall(page);

    // Type search query
    const searchInput = page.locator(SELECTORS.pluginSearchInput);
    await searchInput.fill('paypal');

    // Wait for search results
    const pluginList = page.locator(SELECTORS.pluginList);
    await expect(pluginList).toBeVisible({ timeout: 5000 });

    // Verify matching search result appears
    const searchResult = page.locator(SELECTORS.pluginSearchResult);
    await searchResult.scrollIntoViewIfNeeded();
    await expect(searchResult).toBeVisible();
    await expect(searchResult).toHaveAttribute('data-id', 'test-paypal');
  });

  test('should not display non-matching plugin search results', async ({ page }) => {
    const notifications = createPluginSearchNotifications();
    await mockNotificationsApi(page, notifications);

    await navigateToPluginInstall(page);

    // Type search query for paypal
    const searchInput = page.locator(SELECTORS.pluginSearchInput);
    await searchInput.fill('paypal');

    // Wait for search results
    const pluginList = page.locator(SELECTORS.pluginList);
    await expect(pluginList).toBeVisible({ timeout: 5000 });

    // Verify the displayed result is for paypal, not stripe
    const searchResult = page.locator(SELECTORS.pluginSearchResult);
    await searchResult.scrollIntoViewIfNeeded();
    await expect(searchResult).toBeVisible();
    await expect(searchResult).toHaveAttribute('data-id');
    
    const dataId = await searchResult.getAttribute('data-id');
    expect(dataId).not.toBe('test-stripe');
  });
});

