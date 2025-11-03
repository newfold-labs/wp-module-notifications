const { test, expect } = require('@playwright/test');
const path = require('path');

// Use environment variable to resolve plugin helpers
const pluginDir = process.env.PLUGIN_DIR || path.resolve(__dirname, '../../../../../../');
const { auth, a11y } = require(path.join(pluginDir, 'tests/playwright/helpers'));
const notifications = require('../helpers');

// Test notification data
const pluginId = process.env.PLUGIN_ID || 'bluehost';
const testNotifications = [
  {
    id: 'test-settings',
    locations: [
      {
        context: `${pluginId}-plugin`,
        pages: '#/settings',
      },
    ],
    expiration: 2748820256,
    content:
      '<div class="newfold-notice notice notice-success" style="position:relative;"><p>Notice should only display on plugin app settings page<button type="button" data-action="close" class="notice-dismiss"><span class="screen-reader-text">Dismiss this notice.</span></button></p></div>',
  },
  {
    id: 'test-home',
    locations: [
      {
        context: `${pluginId}-plugin`,
        pages: ['#/home'],
      },
    ],
    expiration: 2749860279,
    content:
      '<div class="newfold-notice notice notice-error" style="position:relative;"><p>Here is a plugin notice it should display on home screen only! <button type="button" data-action="close" class="notice-dismiss"><span class="screen-reader-text">Dismiss this notice.</span></button></p></div>',
  },
  {
    id: 'test-4',
    locations: [
      {
        context: `${pluginId}-plugin`,
        pages: ['#/marketplace'],
      },
    ],
    expiration: 2749860279,
    content:
      '<div class="newfold-notice notice notice-info" style="position:relative;"><p>Here is a plugin notice it should display on marketplace themes screen only! <button type="button" data-action="close" class="notice-dismiss"><span class="screen-reader-text">Dismiss this notice.</span></button></p></div>',
  },
  {
    id: 'test-everywhere',
    locations: [
      {
        context: `${pluginId}-plugin`,
        pages: 'all',
      },
      {
        context: 'wp-admin-notice',
        pages: 'all',
      },
    ],
    expiration: 2749860279,
    content:
      '<div class="newfold-notice notice notice-warning" style="position:relative;"><p>Here is a notice it should display everywhere in the app and in wp-admin! <button type="button" data-action="close" class="notice-dismiss"><span class="screen-reader-text">Dismiss this notice.</span></button></p></div>',
  },
  {
    id: 'test-side-nav',
    locations: [
      {
        context: `${pluginId}-app-nav`,
        pages: 'all',
      },
    ],
    expiration: 2749860279,
    content:
      '<div class="newfold-notice notice" style="position:relative; display: block;"><p>Notice should display in the app side nav<button type="button" data-action="close" class="notice-dismiss"><span class="screen-reader-text">Dismiss this notice.</span></button></p></div>',
  },
  {
    id: 'test-expired',
    locations: [
      {
        context: `${pluginId}-plugin`,
        pages: 'all',
      },
    ],
    expiration: 1649817079,
    content:
      '<div class="newfold-notice notice notice-error" style="position:relative;"><p>Here is an expired notice it should never display anywhere even though it has location `all` <button type="button" data-action="close" class="notice-dismiss"><span class="screen-reader-text">Dismiss this notice.</span></button></p></div>',
  },
];

test.describe('Notifications', () => {

  test.beforeEach(async ({ page }) => {
    // Login to WordPress
    await auth.loginToWordPress(page);
    
    // Clear notifications transient
    await notifications.clearNotificationsTransient(page);
    
    // Navigate to WordPress admin
    await notifications.navigateToWpAdmin(page);
  });

  test('Container Exists in plugin app and is accessible', async ({ page }) => {
    // Setup notifications API intercepts
    await notifications.setupNotificationsIntercepts(page, testNotifications);
    
    // Navigate to plugin app home page
    await notifications.navigateToPluginApp(page, '#/home', pluginId);
    
    // Wait for API call to complete
    await page.waitForResponse('**/newfold-notifications/v1/notifications**');
    
    // Wait for notifications container to load (it may be hidden if no notifications)
    await page.waitForSelector('.newfold-notifications-wrapper', { timeout: 10000 });
    
    // Wait a bit for any animations to complete
    await page.waitForTimeout(1000);
    
    // Verify container exists
    const container = page.locator('.newfold-notifications-wrapper');
    await expect(container).toHaveCount(1);
    
    // Run accessibility check on the notifications that are visible
    // Only check if there are visible notifications
    const visibleNotifications = container.locator('.newfold-notice:visible');
    if (await visibleNotifications.count() > 0) {
      await a11y.checkA11y(page, '.newfold-notifications-wrapper');
    }
  });

  test('Test notification displays in plugin app with `all`', async ({ page }) => {
    // Setup notifications API intercepts
    await notifications.setupNotificationsIntercepts(page, testNotifications);
    
    // Navigate to home page
    await notifications.navigateToPluginApp(page, '#/home', pluginId);
    
    // Wait for API call to complete
    await page.waitForResponse('**/newfold-notifications/v1/notifications**');
    
    // Wait for notification to appear
    await notifications.waitForNotification(page, 'test-everywhere');
    
    // Verify notification exists and has correct content
    await notifications.verifyNotificationContent(page, 'test-everywhere', 'it should display everywhere');
  });

  test('Test notification displays in plugin app for specific page (settings)', async ({ page }) => {
    // Setup notifications API intercepts
    await notifications.setupNotificationsIntercepts(page, testNotifications);
    
    // Navigate to home page first
    await notifications.navigateToPluginApp(page, '#/home', pluginId);
    
    // Wait for API call to complete
    await page.waitForResponse('**/newfold-notifications/v1/notifications**');
    
    // Handle AI modal if it appears
    await notifications.handleAiModal(page);
    
    // Verify settings notification does not exist on home page
    await notifications.verifyNotificationNotExists(page, 'test-settings');
    
    // Navigate to settings page
    await notifications.navigateToPluginApp(page, '#/settings', pluginId);
    await page.waitForTimeout(500);
    
    // Verify settings notification exists on settings page
    await notifications.verifyNotificationContent(page, 'test-settings', 'display on plugin app settings page');
  });

  test('Test expired notification does not display in plugin app', async ({ page }) => {
    // Setup notifications API intercepts
    await notifications.setupNotificationsIntercepts(page, testNotifications);
    
    // Navigate to home page
    await notifications.navigateToPluginApp(page, '#/home', pluginId);
    
    // Wait for API call to complete
    await page.waitForResponse('**/newfold-notifications/v1/notifications**');
    
    // Verify expired notification does not exist
    await notifications.verifyNotificationNotExists(page, 'test-expired');
  });

  test('Dismissing notification removes it from the page', async ({ page }) => {
    // Setup combined intercept that handles both GET and POST
    await page.route('**/newfold-notifications/v1/notifications**', async (route) => {
      if (route.request().method() === 'POST') {
        // Handle dismiss request
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ id: 'test-home' }),
        });
      } else {
        // Handle GET request - return notifications
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(testNotifications),
        });
      }
    });
    
    // Navigate to home page
    await notifications.navigateToPluginApp(page, '#/home', pluginId);
    
    // Wait for API call to complete
    await page.waitForResponse('**/newfold-notifications/v1/notifications**');
    
    // Handle AI modal if it appears
    await notifications.handleAiModal(page);
    
    // Wait for notification to appear (may take time after modal closes)
    await notifications.waitForNotification(page, 'test-home', 15000);
    
    // Verify notification exists initially
    await notifications.verifyNotificationContent(page, 'test-home', 'display on home screen only');
    
    // Dismiss the notification
    await notifications.dismissNotification(page, 'test-home');
    
    // Wait for dismiss API call (POST request)
    await page.waitForResponse(response => 
      response.url().includes('newfold-notifications/v1/notifications') && 
      response.request().method() === 'POST'
    );
    
    // Wait a bit for UI to update after dismiss
    await page.waitForTimeout(500);
    
    // Verify notification is removed
    await notifications.verifyNotificationNotExists(page, 'test-home');
  });

  test('Container Exists in wp-admin', async ({ page }) => {
    await notifications.navigateToWpAdmin(page);
    
    // Verify wp-admin notifications container exists
    const container = page.locator('#newfold-notifications');
    await expect(container).toHaveCount(1);
  });
});
