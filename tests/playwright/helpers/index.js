/**
 * Notifications Module Test Helpers for Playwright
 * 
 * Utilities for testing the Notifications module functionality.
 * Includes API mocking, test data setup, and notification-specific assertions.
 */

const path = require('path');
const { expect } = require('@playwright/test');

// Use environment variable to resolve plugin helpers
const pluginDir = process.env.PLUGIN_DIR || path.resolve(__dirname, '../../../../../../');
const { wordpress } = require(path.join(pluginDir, 'tests/playwright/helpers'));
const { wpCli } = wordpress;

/**
 * Clear notifications transient data
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
async function clearNotificationsTransient(page) {
  try {
    await wpCli('transient delete newfold_notifications', { failOnNonZeroExit: false });
  } catch (error) {
    console.warn('Failed to clear notifications transient:', error.message);
  }
}

/**
 * Setup notifications API intercepts
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Array} notifications - Notifications data to return
 * @param {number} delay - Response delay in milliseconds
 */
async function setupNotificationsIntercepts(page, notifications = [], delay = 0) {
  await page.route('**/newfold-notifications/v1/notifications**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(notifications),
      delay: delay
    });
  });
}

/**
 * Setup notifications events API intercepts (for search)
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} notifications - Notifications data to return
 * @param {number} statusCode - HTTP status code (default: 201)
 * @param {number} delay - Response delay in milliseconds
 */
async function setupNotificationsEventsIntercepts(page, notifications = { data: [] }, statusCode = 201, delay = 0) {
  await page.route('**/newfold-notifications/v1/notifications/events**', async (route) => {
    await route.fulfill({
      status: statusCode,
      contentType: 'application/json',
      body: JSON.stringify(notifications),
      delay: delay
    });
  });
}

/**
 * Wait for notifications to load
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {number} timeout - Timeout in milliseconds
 */
async function waitForNotificationsLoad(page, timeout = 10000) {
  await page.waitForSelector('.newfold-notifications-wrapper', { state: 'visible', timeout });
}

/**
 * Wait for specific notification to appear
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} notificationId - Notification ID
 * @param {number} timeout - Timeout in milliseconds
 */
async function waitForNotification(page, notificationId, timeout = 10000) {
  await page.waitForSelector(`#notification-${notificationId}`, { timeout });
}

/**
 * Get notification by ID
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} notificationId - Notification ID
 * @returns {import('@playwright/test').Locator} Notification locator
 */
function getNotification(page, notificationId) {
  return page.locator(`#notification-${notificationId}`);
}

/**
 * Check if notification exists
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} notificationId - Notification ID
 * @returns {Promise<boolean>} True if notification exists
 */
async function notificationExists(page, notificationId) {
  return await page.locator(`#notification-${notificationId}`).count() > 0;
}

/**
 * Dismiss notification by clicking dismiss button
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} notificationId - Notification ID
 */
async function dismissNotification(page, notificationId) {
  const notification = getNotification(page, notificationId);
  const dismissButton = notification.locator('button[data-action="close"]');
  await dismissButton.click();
}

/**
 * Setup notification dismiss API intercept
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} notificationId - Notification ID to dismiss
 * @param {number} statusCode - HTTP status code (default: 200)
 * @param {number} delay - Response delay in milliseconds
 */
async function setupNotificationDismissIntercept(page, notificationId, statusCode = 200, delay = 0) {
  await page.route('**/newfold-notifications/v1/notifications**', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: statusCode,
        contentType: 'application/json',
        body: JSON.stringify({ id: notificationId }),
        delay: delay
      });
    } else {
      await route.continue();
    }
  });
}

/**
 * Navigate to plugin app page
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} pagePath - Page path (e.g., '#/home', '#/settings')
 * @param {string} pluginId - Plugin ID for URL construction (defaults to PLUGIN_ID env var)
 */
async function navigateToPluginApp(page, pagePath, pluginId = null) {
  const id = pluginId || process.env.PLUGIN_ID || 'bluehost';
  await page.goto(`/wp-admin/admin.php?page=${id}${pagePath}`);
}

/**
 * Navigate to WordPress admin page
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} adminPage - Admin page path
 */
async function navigateToWpAdmin(page, adminPage = 'index.php') {
  await page.goto(`/wp-admin/${adminPage}`);
}

/**
 * Navigate to plugin install page
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} tab - Tab to open (default: 'featured')
 */
async function navigateToPluginInstall(page, tab = 'featured') {
  await page.goto(`/wp-admin/plugin-install.php?tab=${tab}`);
}

/**
 * Navigate to theme install page
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} browse - Browse type (default: 'popular')
 */
async function navigateToThemeInstall(page, browse = 'popular') {
  await page.goto(`/wp-admin/theme-install.php?browse=${browse}`);
}

/**
 * Search for plugins
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} searchTerm - Search term
 */
async function searchPlugins(page, searchTerm) {
  const searchInput = page.locator('#search-plugins');
  await searchInput.fill(searchTerm);
}

/**
 * Search for themes
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} searchTerm - Search term
 */
async function searchThemes(page, searchTerm) {
  const searchInput = page.locator('#wp-filter-search-input');
  await searchInput.clear();
  await searchInput.fill(searchTerm);
}

/**
 * Wait for search results to load
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} type - Type of search ('plugin' or 'theme')
 * @param {number} timeout - Timeout in milliseconds
 */
async function waitForSearchResults(page, type = 'plugin', timeout = 10000) {
  if (type === 'plugin') {
    await page.waitForSelector('#the-list', { timeout });
  } else if (type === 'theme') {
    // Wait for theme browser container (may have multiple themes)
    await page.waitForSelector('.theme-browser', { timeout });
    // Wait a bit for themes to load
    await page.waitForTimeout(500);
  }
}

/**
 * Get search result by ID
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} type - Type of search ('plugin' or 'theme')
 * @param {string} resultId - Result ID
 * @returns {import('@playwright/test').Locator} Search result locator
 */
function getSearchResult(page, type, resultId) {
  if (type === 'plugin') {
    return page.locator(`#the-list > div.plugin-card.newfold-search-results[data-id="${resultId}"]`);
  } else if (type === 'theme') {
    return page.locator(`.theme-browser .theme.newfold-search-results[data-id="${resultId}"]`);
  }
}

/**
 * Check if AI modal is visible and close it if needed
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
async function handleAiModal(page) {
  const modal = page.locator('.ai-sitegen-modal');
  if (await modal.isVisible()) {
    const closeButton = page.locator('button.ai-sitegen-modal__header__close-button');
    if (await closeButton.isVisible()) {
      await closeButton.click();
    }
  }
}

/**
 * Verify notification content
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} notificationId - Notification ID
 * @param {string} expectedText - Expected text content
 */
async function verifyNotificationContent(page, notificationId, expectedText) {
  const notification = getNotification(page, notificationId);
  await expect(notification).toBeVisible();
  await expect(notification).toContainText(expectedText);
  await expect(notification).toHaveAttribute('data-id', notificationId);
}

/**
 * Verify notification does not exist
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} notificationId - Notification ID
 */
async function verifyNotificationNotExists(page, notificationId) {
  const notification = getNotification(page, notificationId);
  await expect(notification).toHaveCount(0);
}

/**
 * Verify search result exists
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} type - Type of search ('plugin' or 'theme')
 * @param {string} resultId - Result ID
 */
async function verifySearchResultExists(page, type, resultId) {
  const result = getSearchResult(page, type, resultId);
  await expect(result).toBeVisible();
  await expect(result).toHaveAttribute('data-id', resultId);
}

/**
 * Verify search result does not exist
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} type - Type of search ('plugin' or 'theme')
 * @param {string} resultId - Result ID
 */
async function verifySearchResultNotExists(page, type, resultId) {
  const result = getSearchResult(page, type, resultId);
  await expect(result).toHaveCount(0);
}

module.exports = {
  clearNotificationsTransient,
  setupNotificationsIntercepts,
  setupNotificationsEventsIntercepts,
  setupNotificationDismissIntercept,
  waitForNotificationsLoad,
  waitForNotification,
  getNotification,
  notificationExists,
  dismissNotification,
  navigateToPluginApp,
  navigateToWpAdmin,
  navigateToPluginInstall,
  navigateToThemeInstall,
  searchPlugins,
  searchThemes,
  waitForSearchResults,
  getSearchResult,
  handleAiModal,
  verifyNotificationContent,
  verifyNotificationNotExists,
  verifySearchResultExists,
  verifySearchResultNotExists,
};

