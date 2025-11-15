const { test, expect } = require('@playwright/test');
const path = require('path');

// Use environment variable to resolve plugin helpers
const pluginDir = process.env.PLUGIN_DIR || path.resolve(__dirname, '../../../../../../');
const { auth } = require(path.join(pluginDir, 'tests/playwright/helpers'));
const notifications = require('../helpers');

// Theme search notification data
const searchNotifications = {
  data: [
    {
      id: 'test-termA',
      locations: [
        {
          pages: 'all',
          context: `${process.env.PLUGIN_ID || 'bluehost'}-plugin`,
        },
        {
          pages: 'all',
          context: 'wp-theme-search',
        },
      ],
      expiration: 127950904013,
      type: 'html',
      query: 'termA',
      content:
        '<div class="theme-screenshot"><img src="https://placehold.co/600x450" alt=""></div><span class="more-details">Details &amp; Preview</span><div class="theme-author">By Example</div><div class="theme-id-container"><h3 class="theme-name">TermA</h3><div class="theme-actions"><a class="button button-primary theme-install" data-name="Example" data-slug="termB" href="http://localhost:10013/wp-admin/update.php?action=install-theme&amp;theme=Example&amp;_wpnonce=06be73870b" aria-label="Install Example">Install</a><button class="button preview install-theme-preview">Preview</button></div></div>',
    },
    {
      id: 'test-termB',
      locations: [
        {
          pages: 'all',
          context: `${process.env.PLUGIN_ID || 'bluehost'}-plugin`,
        },
        {
          pages: 'all',
          context: 'wp-theme-search',
        },
      ],
      expiration: 127950904013,
      type: 'html',
      query: 'termB',
      content:
        '<div class="theme-screenshot"><img src="https://placehold.co/600x450" alt=""></div><span class="more-details">Details &amp; Preview</span><div class="theme-author">By Example</div><div class="theme-id-container"><h3 class="theme-name">TermB</h3><div class="theme-actions"><a class="button button-primary theme-install" data-name="Example" data-slug="themetwo" href="http://localhost:10013/wp-admin/update.php?action=install-theme&amp;theme=Example&amp;_wpnonce=06be73870b" aria-label="Install Example">Install</a><button class="button preview install-theme-preview">Preview</button></div></div>',
    },
  ],
};

test.describe('Theme Search', () => {
  test.beforeEach(async ({ page }) => {
    // Login to WordPress
    await auth.loginToWordPress(page);
    
    // Clear notifications transient
    await notifications.clearNotificationsTransient(page);
  });

  test('should display matching theme search results', async ({ page }) => {
    // Navigate to theme install page
    await notifications.navigateToThemeInstall(page, 'popular');
    
    // Setup notifications events API intercepts
    await notifications.setupNotificationsEventsIntercepts(page, searchNotifications, 201);
    
    // Search for termA
    await notifications.searchThemes(page, 'termA');
    
    // Wait for API call to complete
    await page.waitForResponse('**/newfold-notifications/v1/notifications/events**');
    
    // Wait for search results to load
    await notifications.waitForSearchResults(page, 'theme', 30000);
    
    // Wait a bit more for injected search results to appear
    await page.waitForTimeout(1500);
    
    // Verify specific search result exists (newfold search results)
    await notifications.verifySearchResultExists(page, 'theme', 'test-termA');
    
    // Verify newfold search result count
    const newfoldResults = page.locator('.theme-browser .theme.newfold-search-results');
    await expect(newfoldResults).toHaveCount(1);
  });

  test('should not display non-matching theme search results', async ({ page }) => {
    // Navigate to theme install page
    await notifications.navigateToThemeInstall(page, 'popular');
    
    // Search for termB
    await notifications.searchThemes(page, 'termB');
    
    // Setup notifications events API intercepts
    await notifications.setupNotificationsEventsIntercepts(page, searchNotifications, 201);
    
    // Wait for API call to complete
    await page.waitForResponse('**/newfold-notifications/v1/notifications/events**');
    
    // Wait for search results to load
    await notifications.waitForSearchResults(page, 'theme', 30000);
    
    // Wait a bit more for injected search results to appear
    await page.waitForTimeout(1500);
    
    // Verify specific search result exists (termB)
    await notifications.verifySearchResultExists(page, 'theme', 'test-termB');
    
    // Verify non-matching result does not exist (termA)
    await notifications.verifySearchResultNotExists(page, 'theme', 'test-termA');
  });
});
