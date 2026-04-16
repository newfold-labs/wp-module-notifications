import { test, expect } from '@playwright/test';
import {
  auth,
  SELECTORS,
  pluginId,
  createModalNotification,
  clearNotificationsTransient,
  mockNotificationsApi,
  waitForNotificationsUi,
} from '../helpers/index.mjs';

// AI notification tests are only for bluehost plugin
test.describe('AI Notification', () => {
  // Skip all tests in this file if not bluehost
  test.skip(() => pluginId !== 'bluehost', 'AI notification tests are only for bluehost plugin');

  test.afterAll(async () => {
    await clearNotificationsTransient();
  });

  test('appears for the six month old sites and Close button icon is clicked', async ({ page }) => {
    const modalNotification = createModalNotification();

    await mockNotificationsApi(page, modalNotification);

    await auth.loginToWordPress(page);
    await clearNotificationsTransient();
    await page.goto(`/wp-admin/admin.php?page=${pluginId}#/home`);
    await waitForNotificationsUi(page);

    // Verify AI notification and modal appear
    const notification = page.locator(SELECTORS.notificationInWrapper('test-ai'));
    await expect(notification).toBeAttached({ timeout: 15000 });

    const aiIcon = page.locator(SELECTORS.aiModalIcon);
    await expect(aiIcon).toBeAttached({ timeout: 15000 });

    const modal = page.locator(SELECTORS.aiModal);
    await expect(modal).toBeAttached({ timeout: 15000 });

    // Verify footer content
    const footer = page.locator(SELECTORS.aiModalFooter);
    await expect(footer).toBeAttached();

    const footerContent = page.locator(SELECTORS.aiModalFooterContent);
    await expect(footerContent).toBeAttached();

    const footerHeading = page.locator(SELECTORS.aiModalFooterHeading);
    await expect(footerHeading).toBeVisible();
    await expect(footerHeading).toContainText('Included FREE in your plan!');

    const footerButtons = page.locator(SELECTORS.aiModalFooterButtons).first();
    await expect(footerButtons).toBeAttached();

    // Click close button and verify modal closes
    const closeButton = page.locator(SELECTORS.aiModalCloseButton);
    await expect(closeButton).toBeVisible({ timeout: 15000 });
    await closeButton.click();

    await expect(modal).not.toBeVisible();
  });

  test('redirects to AI onboarding when TRY NOW button is clicked', async ({ page }) => {
    const modalNotification = createModalNotification();

    await mockNotificationsApi(page, modalNotification);

    await auth.loginToWordPress(page);
    await clearNotificationsTransient();
    await page.goto(`/wp-admin/admin.php?page=${pluginId}#/home`);
    await waitForNotificationsUi(page);

    const tryNowButton = page.locator(SELECTORS.aiModalTryNowButton);
    await expect(tryNowButton).toBeVisible({ timeout: 15000 });
    await expect(tryNowButton).toContainText('TRY NOW');
    await tryNowButton.click();

    // Verify redirect to onboarding
    await expect(page).toHaveURL(/nfd-onboarding/);
  });

  test('modal closes when NO THANKS button is clicked', async ({ page }) => {
    const modalNotification = createModalNotification();

    await mockNotificationsApi(page, modalNotification);

    await auth.loginToWordPress(page);
    await clearNotificationsTransient();
    await page.goto(`/wp-admin/admin.php?page=${pluginId}#/home`);
    await waitForNotificationsUi(page);

    const noThanksButton = page.locator(SELECTORS.aiModalNoThanksButton);
    await expect(noThanksButton).toBeVisible({ timeout: 15000 });
    await expect(noThanksButton).toContainText('NO, THANKS');
    await noThanksButton.click();

    // Verify modal closes
    const modal = page.locator(SELECTORS.aiModal);
    await expect(modal).not.toBeVisible();
  });
});
