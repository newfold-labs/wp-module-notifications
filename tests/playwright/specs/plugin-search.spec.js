const { test, expect } = require('@playwright/test');
const path = require('path');

// Use environment variable to resolve plugin helpers
const pluginDir = process.env.PLUGIN_DIR || path.resolve(__dirname, '../../../../../../');
const { auth } = require(path.join(pluginDir, 'tests/playwright/helpers'));
const notifications = require('../helpers');

// Plugin search notification data
const searchNotifications = {
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
        '<div class="plugin-card-top"><div class="name column-name"><h3><a href="http://localhost:10003/wp-admin/plugin-install.php?tab=plugin-information&amp;plugin=pymntpl-paypal-woocommerce&amp;TB_iframe=true&amp;width=600&amp;height=550" class="thickbox open-plugin-details-modal">Testing Result: Payment Plugins for PayPal WooCommerce<img src="https://ps.w.org/pymntpl-paypal-woocommerce/assets/icon-256x256.png?rev=2718338" class="plugin-icon" alt=""></a></h3></div><div class="action-links"><ul class="plugin-action-buttons"><li><a class="install-now button" data-slug="pymntpl-paypal-woocommerce" href="http://localhost:10003/wp-admin/update.php?action=install-plugin&amp;plugin=pymntpl-paypal-woocommerce&amp;_wpnonce=77a1fb3637" aria-label="Install Payment Plugins for PayPal WooCommerce 1.0.47 now" data-name="Payment Plugins for PayPal WooCommerce 1.0.47">Install Now</a></li><li><a href="http://localhost:10003/wp-admin/plugin-install.php?tab=plugin-information&amp;plugin=pymntpl-paypal-woocommerce&amp;TB_iframe=true&amp;width=600&amp;height=550" class="thickbox open-plugin-details-modal" aria-label="More information about Payment Plugins for PayPal WooCommerce 1.0.47" data-title="Payment Plugins for PayPal WooCommerce 1.0.47">More Details</a></li></ul></div><div class="desc column-description"><p>Developed exclusively between Payment Plugins and PayPal, PayPal for WooCommerce integrates with PayPal\'s newest API\'s.</p><p class="authors"> <cite>By Payment Plugins, support@paymentplugins.com</cite></p></div></div><div class="plugin-card-bottom"><div class="vers column-rating"><div class="star-rating"><span class="screen-reader-text">5.0 rating based on 78 ratings</span><div class="star star-full" aria-hidden="true"></div><div class="star star-full" aria-hidden="true"></div><div class="star star-full" aria-hidden="true"></div><div class="star star-full" aria-hidden="true"></div><div class="star star-full" aria-hidden="true"></div></div><span class="num-ratings" aria-hidden="true">(78)</span></div><div class="column-updated"><strong>Last Updated:</strong>6 days ago</div><div class="column-downloaded">60,000+ Active Installations</div><div class="column-compatibility"><span class="compatibility-compatible"><strong>Compatible</strong> with your version of WordPress</span></div></div>',
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
        '<div class="plugin-card-top"><div class="name column-name"><h3><a href="http://localhost:10003/wp-admin/plugin-install.php?tab=plugin-information&amp;plugin=woo-stripe-payment&amp;TB_iframe=true&amp;width=600&amp;height=550" class="thickbox open-plugin-details-modal">Testing Result: Payment Plugins for Stripe WooCommerce<img src="https://ps.w.org/woo-stripe-payment/assets/icon-256x256.png?rev=2611337" class="plugin-icon" alt=""></a></h3></div><div class="action-links"><ul class="plugin-action-buttons"><li><a class="install-now button" data-slug="woo-stripe-payment" href="http://localhost:10003/wp-admin/update.php?action=install-plugin&amp;plugin=woo-stripe-payment&amp;_wpnonce=69d79d7f2e" aria-label="Install Payment Plugins for Stripe WooCommerce 3.3.61 now" data-name="Payment Plugins for Stripe WooCommerce 3.3.61">Install Now</a></li><li><a href="http://localhost:10003/wp-admin/plugin-install.php?tab=plugin-information&amp;plugin=woo-stripe-payment&amp;TB_iframe=true&amp;width=600&amp;height=550" class="thickbox open-plugin-details-modal" aria-label="More information about Payment Plugins for Stripe WooCommerce 3.3.61" data-title="Payment Plugins for Stripe WooCommerce 3.3.61">More Details</a></li></ul></div><div class="desc column-description"><p>Accept Credit Cards, Google Pay, ApplePay, Afterpay, Affirm, ACH, Klarna, iDEAL and more all in one plugin for free!</p><p class="authors"> <cite>By Payment Plugins, support@paymentplugins.com</cite></p></div></div><div class="plugin-card-bottom"><div class="vers column-rating"><div class="star-rating"><span class="screen-reader-text">5.0 rating based on 240 ratings</span><div class="star star-full" aria-hidden="true"></div><div class="star star-full" aria-hidden="true"></div><div class="star star-full" aria-hidden="true"></div><div class="star star-full" aria-hidden="true"></div><div class="star star-full" aria-hidden="true"></div></div><span class="num-ratings" aria-hidden="true">(240)</span></div><div class="column-updated"><strong>Last Updated:</strong>2 weeks ago</div><div class="column-downloaded">100,000+ Active Installations</div><div class="column-compatibility"><span class="compatibility-compatible"><strong>Compatible</strong> with your version of WordPress</span></div></div>',
    },
  ],
};

test.describe('Plugin Search', () => {
  test.beforeEach(async ({ page }) => {
    // Login to WordPress
    await auth.loginToWordPress(page);
    
    // Clear notifications transient
    await notifications.clearNotificationsTransient(page);
    
    // Navigate to plugin install page
    await notifications.navigateToPluginInstall(page, 'featured');
  });

  test('should display matching plugin search results', async ({ page }) => {
    // Setup notifications events API intercepts
    await notifications.setupNotificationsEventsIntercepts(page, searchNotifications, 201);
    
    // Search for paypal
    await notifications.searchPlugins(page, 'paypal');
    
    // Wait for API call to complete
    await page.waitForResponse('**/newfold-notifications/v1/notifications/events**');
    
    // Wait for search results to load
    await notifications.waitForSearchResults(page, 'plugin', 5000);
    
    // Verify search results container exists
    const resultsList = page.locator('#the-list');
    await expect(resultsList).toBeVisible();
    
    // Verify newfold search results exist
    const newfoldResults = page.locator('#the-list > div.plugin-card.newfold-search-results');
    await expect(newfoldResults).toHaveCount(1);
    
    // Verify specific search result
    await notifications.verifySearchResultExists(page, 'plugin', 'test-paypal');
  });

  test('should not display non-matching plugin search results', async ({ page }) => {
    // Setup notifications events API intercepts
    await notifications.setupNotificationsEventsIntercepts(page, searchNotifications, 201);
    
    // Search for paypal
    await notifications.searchPlugins(page, 'paypal');
    
    // Wait for API call to complete
    await page.waitForResponse('**/newfold-notifications/v1/notifications/events**');
    
    // Wait for search results to load
    await notifications.waitForSearchResults(page, 'plugin', 5000);
    
    // Verify search results container exists
    const resultsList = page.locator('#the-list');
    await expect(resultsList).toBeVisible();
    
    // Verify newfold search results exist
    const newfoldResults = page.locator('#the-list > div.plugin-card.newfold-search-results');
    await expect(newfoldResults).toHaveCount(1);
    
    // Verify that the search field contains the typed text
    const searchInput = page.locator('#search-plugins');
    await expect(searchInput).toHaveValue('paypal');
    
    // Verify specific search result exists (paypal)
    await notifications.verifySearchResultExists(page, 'plugin', 'test-paypal');
    
    // Verify non-matching result does not exist (stripe)
    await notifications.verifySearchResultNotExists(page, 'plugin', 'test-stripe');
  });
});
