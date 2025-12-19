import { test, expect } from '@playwright/test';
import {
  auth,
  a11y,
  SELECTORS,
  pluginId,
  createNotifications,
  clearNotificationsTransient,
  closeAiModalIfPresent,
} from '../helpers/index.mjs';

test.describe('Notifications', () => {
  test.afterAll(async () => {
    await clearNotificationsTransient();
  });

  test('Container exists in plugin app and is accessible', async ({ page }) => {
    await auth.loginToWordPress(page);
    await page.goto('/wp-admin/index.php');
    
    const notificationsWrapper = page.locator(SELECTORS.notificationsWrapper);
    await expect(notificationsWrapper).toHaveCount(1);
    
    // Accessibility check
    await a11y.checkA11y(page, SELECTORS.notificationsWrapper);
  });

  test('Test notification displays in plugin app with `all`', async ({ page }) => {
    const notifications = createNotifications();
    
    // Set up route interception BEFORE any navigation including login
    await page.route('**/wp-json/newfold-notifications/v1/notifications**', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(notifications),
        });
      } else {
        await route.continue();
      }
    });
    
    await auth.loginToWordPress(page);
    await clearNotificationsTransient();
    await page.goto(`/wp-admin/admin.php?page=${pluginId}#/home`);
    await page.waitForLoadState('networkidle');
    
    // Wait for notification to load
    const notification = page.locator(SELECTORS.notificationInWrapper('test-everywhere'));
    await expect(notification).toBeVisible({ timeout: 10000 });
    await expect(notification).toHaveAttribute('data-id', 'test-everywhere');
    await expect(notification).toContainText('it should display everywhere');
  });

  test('Test notification displays in plugin app for specific page (settings)', async ({ page }) => {
    const notifications = createNotifications();
    
    // Set up route interception BEFORE any navigation including login
    await page.route('**/wp-json/newfold-notifications/v1/notifications**', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(notifications),
        });
      } else {
        await route.continue();
      }
    });
    
    await auth.loginToWordPress(page);
    await clearNotificationsTransient();
    
    // First verify notification doesn't appear on home page
    await page.goto(`/wp-admin/admin.php?page=${pluginId}#/home`);
    await page.waitForLoadState('networkidle');
    await closeAiModalIfPresent(page);
    
    const settingsNotificationOnHome = page.locator(SELECTORS.notificationInWrapper('test-settings'));
    await expect(settingsNotificationOnHome).toHaveCount(0);
    
    // Now navigate to settings and verify it appears
    await page.goto(`/wp-admin/admin.php?page=${pluginId}#/settings`);
    await page.waitForLoadState('networkidle');
    
    const settingsNotification = page.locator(SELECTORS.notificationInWrapper('test-settings'));
    await expect(settingsNotification).toBeVisible({ timeout: 10000 });
    await expect(settingsNotification).toHaveAttribute('data-id', 'test-settings');
    await expect(settingsNotification).toContainText('display on plugin app settings page');
  });

  test('Test expired notification does not display in plugin app', async ({ page }) => {
    const notifications = createNotifications();
    
    // Set up route interception BEFORE any navigation including login
    await page.route('**/wp-json/newfold-notifications/v1/notifications**', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(notifications),
        });
      } else {
        await route.continue();
      }
    });
    
    await auth.loginToWordPress(page);
    await clearNotificationsTransient();
    await page.goto(`/wp-admin/admin.php?page=${pluginId}#/home`);
    await page.waitForLoadState('networkidle');
    
    // Expired notification should not exist
    const expiredNotification = page.locator(SELECTORS.notificationInWrapper('test-expired'));
    await expect(expiredNotification).toHaveCount(0);
  });

  test('Dismissing notification removes it from the page', async ({ page }) => {
    const notifications = createNotifications();
    
    // Set up route interception for both GET (fetch) and POST (dismiss) BEFORE any navigation
    await page.route('**/wp-json/newfold-notifications/v1/notifications**', async (route) => {
      const method = route.request().method();
      if (method === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(notifications),
        });
      } else if (method === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ id: 'test-home' }),
        });
      } else {
        await route.continue();
      }
    });
    
    await auth.loginToWordPress(page);
    await clearNotificationsTransient();
    await page.goto(`/wp-admin/admin.php?page=${pluginId}#/home`);
    await page.waitForLoadState('networkidle');
    await closeAiModalIfPresent(page);
    
    // Verify home notification is visible
    const homeNotification = page.locator(SELECTORS.notificationInWrapper('test-home'));
    await expect(homeNotification).toBeVisible({ timeout: 10000 });
    await expect(homeNotification).toHaveAttribute('data-id', 'test-home');
    await expect(homeNotification).toContainText('display on home screen only');
    
    // Click dismiss button
    const dismissButton = homeNotification.locator(SELECTORS.dismissButton);
    await dismissButton.click();
    
    // Verify notification is removed
    await expect(homeNotification).toHaveCount(0);
  });

  test('Container exists in wp-admin', async ({ page }) => {
    await auth.loginToWordPress(page);
    await page.goto('/wp-admin/index.php');
    
    const wpAdminNotifications = page.locator(SELECTORS.wpAdminNotifications);
    await expect(wpAdminNotifications).toBeAttached();
  });
});
