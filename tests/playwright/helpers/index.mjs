/**
 * Notifications Module Test Helpers for Playwright
 */
import { expect } from '@playwright/test';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Resolve plugin directory from PLUGIN_DIR env var (set by playwright.config.mjs) or process.cwd()
const pluginDir = process.env.PLUGIN_DIR || process.cwd();

// Build path to plugin helpers (.mjs extension for ES module compatibility)
const finalHelpersPath = join(pluginDir, 'tests/playwright/helpers/index.mjs');

// Import plugin helpers using file:// URL
const helpersUrl = pathToFileURL(finalHelpersPath).href;
const pluginHelpers = await import(helpersUrl);

// Destructure plugin helpers
let { auth, wordpress, newfold, a11y, utils } = pluginHelpers;

// Get plugin ID from environment
const pluginId = process.env.PLUGIN_ID || 'bluehost';

// Common selectors
const SELECTORS = {
  // Notification containers
  notificationsWrapper: '.newfold-notifications-wrapper',
  wpAdminNotifications: '#newfold-notifications',
  notification: (id) => `#notification-${id}`,
  notificationInWrapper: (id) => `.newfold-notifications-wrapper #notification-${id}`,
  
  // Notification elements
  dismissButton: 'button.notice-dismiss[data-action="close"]',
  
  // AI Modal selectors
  aiModal: '.ai-sitegen-modal',
  aiModalOverlay: '.ai-sitegen-modal-overlay',
  aiModalCloseButton: 'button.ai-sitegen-modal__header__close-button',
  aiModalTryNowButton: 'button.ai-sitegen-modal__footer__content__buttons__try-now',
  aiModalNoThanksButton: 'button.ai-sitegen-modal__footer__content__buttons__no-thanks',
  aiModalFooter: '.ai-sitegen-modal__footer',
  aiModalFooterContent: '.ai-sitegen-modal__footer__content',
  aiModalFooterHeading: '.ai-sitegen-modal__footer__content__heading',
  aiModalFooterButtons: '.ai-sitegen-modal__footer__content__buttons',
  aiModalIcon: 'img.ai-sitegen-modal__content__right-section__heading__ai-icon',
  
  // Plugin search page
  pluginSearchInput: '#search-plugins',
  pluginList: '#the-list',
  pluginSearchResult: '#the-list > div.plugin-card.newfold-search-results',
  
  // Theme search page
  themeSearchInput: '#wp-filter-search-input',
  themeBrowser: '.theme-browser .theme',
  themeSearchResult: '.theme-browser .theme.newfold-search-results',
};

// Test notification data
const createNotifications = () => [
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

// AI Modal notification data
const createModalNotification = () => [
  {
    id: 'test-ai',
    locations: [
      {
        context: `${pluginId}-plugin`,
        pages: ['#/home'],
      },
    ],
    expiration: 2748820256,
    content:
      '<script>function checkAndRemoveModalOverlay() { const currentPath = window.location.pathname; const pattern = /^\\/admin\\/messages(\\/[\\d\\w-]+)*\\/?$/; if (!pattern.test(currentPath)) { return; } const modalOverlay = document.querySelector(".ai-sitegen-modal-overlay"); if (modalOverlay) { modalOverlay.classList.remove("ai-sitegen-modal-overlay"); } } function closeModal() { const modalOverlay = document.querySelector(".ai-sitegen-modal-overlay"); if (modalOverlay) { modalOverlay.style.display = "none"; } else { console.error("Modal overlay not found"); } } function playVideoAgain() { watchAgainOverlay.style.display = "none"; aiVideo.play(); } function redirectToOnboarding() { window.location.href = `${window.location.origin}/wp-admin/index.php?page=nfd-onboarding`; } function showWatchAgainOverlay() { const watchAgainOverlay = document.getElementById("watchAgainOverlay"); if (!watchAgainOverlay) { console.error("Watch again overlay element not found"); return; } watchAgainOverlay.style.display = "flex"; } document.addEventListener("DOMContentLoaded", () => { const aiVideo = document.getElementById("aiVideo"); if (!aiVideo) { console.error("Video element not found"); return; } aiVideo.play(); checkAndRemoveModalOverlay(); }); </script><style> .ai-sitegen-modal-overlay { position: fixed; top: 0; left: 0; display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 999999; overflow: auto; } .ai-sitegen-modal { width: 95%; height: 95%; display: flex; flex-direction: column; justify-content: space-between; background-color: white; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); border-radius: 8px; overflow: auto; z-index: 999999; } .ai-sitegen-modal__header { background-color: #132F58; color: white; padding: 20px; text-align: center; position: relative; } .ai-sitegen-modal__header__heading { color: white; margin: 20px 0px !important; line-height: 1.2; font-size: clamp(1.875rem, 1.6477rem + 1.1364vw, 4.375rem) !important; } .ai-sitegen-modal__header__subheading { margin: 10px 0 0 !important; font-size: clamp(0.875rem, 0.7841rem + 0.4545vw, 1.875rem); } .ai-sitegen-modal__header__close-button { position: absolute; top: 20px; right: 20px; background: none; border: none; color: white !important; font-size: 32px !important; cursor: pointer !important; outline: none; } .ai-sitegen-modal__content { display: flex; justify-content: space-between; padding: 40px; gap: 40px; z-index: 9999; } .ai-sitegen-modal__footer { display: flex; flex-direction: row; justify-content: end; align-items: center; padding: 15px; text-align: center; border-top: 1px solid #ddd; box-shadow: 0px -4px 8px 0px #00000040; } .ai-sitegen-modal__footer__content { display: flex; flex-direction: column; } .ai-sitegen-modal__footer__content__heading { font-size: 20px; background-color: #E5ECF0; margin-bottom: 10px !important; padding: 0px 16px; } .ai-sitegen-modal__footer__content__buttons__no-thanks { background-color: white !important; color: #196BDE !important; border: 1px solid #196BDE; padding: 10px 20px !important; border-radius: 4px; cursor: pointer !important; margin: 5px !important; } .ai-sitegen-modal__footer__content__buttons__try-now { background-color: #196BDE !important; color: white !important; padding: 10px 20px !important; border: none; border-radius: 4px; cursor: pointer !important; margin: 5px !important; } </style><div class="ai-sitegen-modal-overlay"> <div class="ai-sitegen-modal"> <div class="ai-sitegen-modal__header"> <button data-action="close" class="ai-sitegen-modal__header__close-button" onclick="closeModal();">&times;</button> <h1 class="ai-sitegen-modal__header__heading">Building your WordPress site just got easier.</h1> <p class="ai-sitegen-modal__header__subheading">Easily design and launch a stylish WordPress website with our AI WonderSuite tools.</p> </div> <div class="ai-sitegen-modal__content"> <div class="ai-sitegen-modal__content__left-section"> </div> <div class="ai-sitegen-modal__content__right-section"> <div class="ai-sitegen-modal__content__right-section__content"> <h2 class="ai-sitegen-modal__content__right-section__heading"> <img class="ai-sitegen-modal__content__right-section__heading__ai-icon" src="https://d2k7nyq3ix8wzh.cloudfront.net/286e07d2-d885-495b-b185-e625b8eec683/images/svg/ai.svg" alt="Description of SVG"/> <span class="ai-sitegen-modal__content__right-section__heading__text">Website Creator for WordPress</span> </h2> </div> </div> </div> <div class="ai-sitegen-modal__footer"> <div class="ai-sitegen-modal__footer__content"> <p class="ai-sitegen-modal__footer__content__heading">Included FREE in your plan!</p> <div class="ai-sitegen-modal__footer__content__buttons"> <button data-action="close" class="ai-sitegen-modal__footer__content__buttons__no-thanks" onclick="closeModal();">NO, THANKS</button> <button class="ai-sitegen-modal__footer__content__buttons__try-now" onclick="redirectToOnboarding();">TRY NOW</button> </div> </div> </div> </div> </div>',
  },
];

// Plugin search notification data
const createPluginSearchNotifications = () => ({
  data: [
    {
      id: 'test-paypal',
      locations: [
        {
          pages: 'all',
          context: 'bluehost-plugin',
        },
        {
          pages: 'all',
          context: 'wp-plugin-search',
        },
      ],
      expiration: 127950904013,
      type: 'html',
      query: 'paypal',
      content:
        '<div class="plugin-card-top"><div class="name column-name"><h3><a href="#" class="thickbox open-plugin-details-modal">Testing Result: Payment Plugins for PayPal WooCommerce<img src="https://ps.w.org/pymntpl-paypal-woocommerce/assets/icon-256x256.png?rev=2718338" class="plugin-icon" alt=""></a></h3></div><div class="action-links"><ul class="plugin-action-buttons"><li><a class="install-now button" data-slug="pymntpl-paypal-woocommerce" href="#" aria-label="Install Payment Plugins for PayPal WooCommerce" data-name="Payment Plugins for PayPal WooCommerce">Install Now</a></li></ul></div><div class="desc column-description"><p>Test PayPal plugin description</p></div></div>',
    },
    {
      id: 'test-stripe',
      locations: [
        {
          pages: 'all',
          context: 'bluehost-plugin',
        },
        {
          pages: 'all',
          context: 'wp-plugin-search',
        },
      ],
      expiration: 127950904013,
      type: 'html',
      query: 'stripe',
      content:
        '<div class="plugin-card-top"><div class="name column-name"><h3><a href="#" class="thickbox open-plugin-details-modal">Testing Result: Payment Plugins for Stripe WooCommerce<img src="https://ps.w.org/woo-stripe-payment/assets/icon-256x256.png?rev=2611337" class="plugin-icon" alt=""></a></h3></div><div class="action-links"><ul class="plugin-action-buttons"><li><a class="install-now button" data-slug="woo-stripe-payment" href="#" aria-label="Install Payment Plugins for Stripe WooCommerce" data-name="Payment Plugins for Stripe WooCommerce">Install Now</a></li></ul></div><div class="desc column-description"><p>Test Stripe plugin description</p></div></div>',
    },
  ],
});

// Theme search notification data
const createThemeSearchNotifications = () => ({
  data: [
    {
      id: 'test-termA',
      locations: [
        {
          pages: 'all',
          context: `${pluginId}-plugin`,
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
        '<div class="theme-screenshot"><img src="https://placehold.co/600x450" alt=""></div><span class="more-details">Details &amp; Preview</span><div class="theme-author">By Example</div><div class="theme-id-container"><h3 class="theme-name">TermA</h3><div class="theme-actions"><a class="button button-primary theme-install" data-name="Example" data-slug="termA" href="#">Install</a><button class="button preview install-theme-preview">Preview</button></div></div>',
    },
    {
      id: 'test-termB',
      locations: [
        {
          pages: 'all',
          context: `${pluginId}-plugin`,
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
        '<div class="theme-screenshot"><img src="https://placehold.co/600x450" alt=""></div><span class="more-details">Details &amp; Preview</span><div class="theme-author">By Example</div><div class="theme-id-container"><h3 class="theme-name">TermB</h3><div class="theme-actions"><a class="button button-primary theme-install" data-name="Example" data-slug="termB" href="#">Install</a><button class="button preview install-theme-preview">Preview</button></div></div>',
    },
  ],
});

/**
 * Clear notifications transient
 */
async function clearNotificationsTransient() {
  try {
    await wordpress.wpCli('transient delete newfold_notifications', {
      failOnNonZeroExit: false,
    });
  } catch (error) {
    // Ignore errors - transient might not exist
  }
}

/**
 * Navigate to plugin app home page
 * @param {import('@playwright/test').Page} page
 */
async function navigateToPluginHome(page) {
  await page.goto(`/wp-admin/admin.php?page=${pluginId}#/home`);
}

/**
 * Navigate to plugin app settings page
 * @param {import('@playwright/test').Page} page
 */
async function navigateToPluginSettings(page) {
  await page.goto(`/wp-admin/admin.php?page=${pluginId}#/settings`);
}

/**
 * Navigate to plugin install page
 * @param {import('@playwright/test').Page} page
 */
async function navigateToPluginInstall(page) {
  await page.goto('/wp-admin/plugin-install.php?tab=featured');
}

/**
 * Navigate to theme install page
 * @param {import('@playwright/test').Page} page
 */
async function navigateToThemeInstall(page) {
  await page.goto('/wp-admin/theme-install.php?browse=popular');
}

/**
 * Close AI sitegen modal if it appears
 * @param {import('@playwright/test').Page} page
 */
async function closeAiModalIfPresent(page) {
  const modal = page.locator(SELECTORS.aiModal);
  const isVisible = await modal.isVisible().catch(() => false);
  if (isVisible) {
    const closeButton = page.locator(SELECTORS.aiModalCloseButton);
    if (await closeButton.isVisible().catch(() => false)) {
      await closeButton.click();
    }
  }
}

/**
 * Setup route to intercept notifications API and return mock data
 * @param {import('@playwright/test').Page} page
 * @param {Array|Object} notifications - Mock notification data to return
 */
async function mockNotificationsApi(page, notifications) {
  // Match the URL pattern used by the plugin - handles both / and %2F encoding
  // Pattern: /wp-json/newfold-notifications/v1/notifications
  await page.route(/newfold-notifications(%2F|\/)v1(%2F|\/)notifications/, async (route) => {
    const method = route.request().method();
    if (method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(notifications),
      });
    } else if (method === 'POST') {
      // Handle dismiss/events endpoints
      const url = route.request().url();
      if (url.includes('events')) {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify(notifications),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ id: 'dismissed' }),
        });
      }
    } else {
      await route.continue();
    }
  });
}

/**
 * Setup route and navigate to plugin home with mocked notifications
 * @param {import('@playwright/test').Page} page
 * @param {Array|Object} notifications - Mock notification data to return
 */
async function setupMockAndNavigateHome(page, notifications) {
  await mockNotificationsApi(page, notifications);
  await page.goto(`/wp-admin/admin.php?page=${pluginId}#/home`);
  // Wait for notifications wrapper to ensure page is loaded (there may be multiple wrappers)
  await page.locator(SELECTORS.notificationsWrapper).first().waitFor({ state: 'attached', timeout: 10000 });
}

/**
 * Setup route and navigate to plugin settings with mocked notifications
 * @param {import('@playwright/test').Page} page
 * @param {Array|Object} notifications - Mock notification data to return
 */
async function setupMockAndNavigateSettings(page, notifications) {
  await mockNotificationsApi(page, notifications);
  await page.goto(`/wp-admin/admin.php?page=${pluginId}#/settings`);
  // Wait for notifications wrapper to ensure page is loaded (there may be multiple wrappers)
  await page.locator(SELECTORS.notificationsWrapper).first().waitFor({ state: 'attached', timeout: 10000 });
}

export {
  // Plugin helpers (re-exported for convenience)
  auth,
  wordpress,
  newfold,
  a11y,
  utils,
  // Constants
  SELECTORS,
  pluginId,
  // Notification data factories
  createNotifications,
  createModalNotification,
  createPluginSearchNotifications,
  createThemeSearchNotifications,
  // Helper functions
  clearNotificationsTransient,
  navigateToPluginHome,
  navigateToPluginSettings,
  navigateToPluginInstall,
  navigateToThemeInstall,
  closeAiModalIfPresent,
  mockNotificationsApi,
  setupMockAndNavigateHome,
  setupMockAndNavigateSettings,
};

