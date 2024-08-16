// <reference types="Cypress" />
const notifications = {
  "data": [{
    id: 'test-1',
    "locations": [
      {
        "pages": "all",
        "context": "bluehost-plugin"
      },
      {
        "pages": "all",
        "context": "wp-plugin-search"
      }
    ],
    "expiration": 127950904013,
    "type": "html",
    "query": "paypal",
    "content": "<div class=\"plugin-card-top\"><div class=\"name column-name\"><h3><a href=\"http://localhost:10003/wp-admin/plugin-install.php?tab=plugin-information&amp;plugin=pymntpl-paypal-woocommerce&amp;TB_iframe=true&amp;width=600&amp;height=550\" class=\"thickbox open-plugin-details-modal\">Testing Result: Payment Plugins for PayPal WooCommerce<img src=\"https://ps.w.org/pymntpl-paypal-woocommerce/assets/icon-256x256.png?rev=2718338\" class=\"plugin-icon\" alt=\"\"></a></h3></div><div class=\"action-links\"><ul class=\"plugin-action-buttons\"><li><a class=\"install-now button\" data-slug=\"pymntpl-paypal-woocommerce\" href=\"http://localhost:10003/wp-admin/update.php?action=install-plugin&amp;plugin=pymntpl-paypal-woocommerce&amp;_wpnonce=77a1fb3637\" aria-label=\"Install Payment Plugins for PayPal WooCommerce 1.0.47 now\" data-name=\"Payment Plugins for PayPal WooCommerce 1.0.47\">Install Now</a></li><li><a href=\"http://localhost:10003/wp-admin/plugin-install.php?tab=plugin-information&amp;plugin=pymntpl-paypal-woocommerce&amp;TB_iframe=true&amp;width=600&amp;height=550\" class=\"thickbox open-plugin-details-modal\" aria-label=\"More information about Payment Plugins for PayPal WooCommerce 1.0.47\" data-title=\"Payment Plugins for PayPal WooCommerce 1.0.47\">More Details</a></li></ul></div><div class=\"desc column-description\"><p>Developed exclusively between Payment Plugins and PayPal, PayPal for WooCommerce integrates with PayPal's newest API's.</p><p class=\"authors\"> <cite>By Payment Plugins, support@paymentplugins.com</cite></p></div></div><div class=\"plugin-card-bottom\"><div class=\"vers column-rating\"><div class=\"star-rating\"><span class=\"screen-reader-text\">5.0 rating based on 78 ratings</span><div class=\"star star-full\" aria-hidden=\"true\"></div><div class=\"star star-full\" aria-hidden=\"true\"></div><div class=\"star star-full\" aria-hidden=\"true\"></div><div class=\"star star-full\" aria-hidden=\"true\"></div><div class=\"star star-full\" aria-hidden=\"true\"></div></div><span class=\"num-ratings\" aria-hidden=\"true\">(78)</span></div><div class=\"column-updated\"><strong>Last Updated:</strong>6 days ago</div><div class=\"column-downloaded\">60,000+ Active Installations</div><div class=\"column-compatibility\"><span class=\"compatibility-compatible\"><strong>Compatible</strong> with your version of WordPress</span></div></div>"
  },
  {
    id: 'test-2',
    "locations": [
      {
        "pages": "all",
        "context": "bluehost-plugin"
      },
      {
        "pages": "all",
        "context": "wp-plugin-search"
      }
    ],
    "expiration": 127950904013,
    "type": "html",
    "query": "stripe",
    "content": "<div class=\"plugin-card-top\"><div class=\"name column-name\"><h3><a href=\"http://localhost:10003/wp-admin/plugin-install.php?tab=plugin-information&amp;plugin=woo-stripe-payment&amp;TB_iframe=true&amp;width=600&amp;height=550\" class=\"thickbox open-plugin-details-modal\">Testing Result: Payment Plugins for Stripe WooCommerce<img src=\"https://ps.w.org/woo-stripe-payment/assets/icon-256x256.png?rev=2611337\" class=\"plugin-icon\" alt=\"\"></a></h3></div><div class=\"action-links\"><ul class=\"plugin-action-buttons\"><li><a class=\"install-now button\" data-slug=\"woo-stripe-payment\" href=\"http://localhost:10003/wp-admin/update.php?action=install-plugin&amp;plugin=woo-stripe-payment&amp;_wpnonce=69d79d7f2e\" aria-label=\"Install Payment Plugins for Stripe WooCommerce 3.3.61 now\" data-name=\"Payment Plugins for Stripe WooCommerce 3.3.61\">Install Now</a></li><li><a href=\"http://localhost:10003/wp-admin/plugin-install.php?tab=plugin-information&amp;plugin=woo-stripe-payment&amp;TB_iframe=true&amp;width=600&amp;height=550\" class=\"thickbox open-plugin-details-modal\" aria-label=\"More information about Payment Plugins for Stripe WooCommerce 3.3.61\" data-title=\"Payment Plugins for Stripe WooCommerce 3.3.61\">More Details</a></li></ul></div><div class=\"desc column-description\"><p>Accept Credit Cards, Google Pay, ApplePay, Afterpay, Affirm, ACH, Klarna, iDEAL and more all in one plugin for free!</p><p class=\"authors\"> <cite>By Payment Plugins, support@paymentplugins.com</cite></p></div></div><div class=\"plugin-card-bottom\"><div class=\"vers column-rating\"><div class=\"star-rating\"><span class=\"screen-reader-text\">5.0 rating based on 240 ratings</span><div class=\"star star-full\" aria-hidden=\"true\"></div><div class=\"star star-full\" aria-hidden=\"true\"></div><div class=\"star star-full\" aria-hidden=\"true\"></div><div class=\"star star-full\" aria-hidden=\"true\"></div><div class=\"star star-full\" aria-hidden=\"true\"></div></div><span class=\"num-ratings\" aria-hidden=\"true\">(240)</span></div><div class=\"column-updated\"><strong>Last Updated:</strong>2 weeks ago</div><div class=\"column-downloaded\">100,000+ Active Installations</div><div class=\"column-compatibility\"><span class=\"compatibility-compatible\"><strong>Compatible</strong> with your version of WordPress</span></div></div>"
  }]
};

describe('Plugin Search', () => {

  before(() => {
    cy.exec('npx wp-env run cli wp transient delete newfold_notifications', { failOnNonZeroExit: false });
    cy.visit('/wp-admin/plugin-install.php');
    cy.intercept(
      {
        method: 'POST',
        url: /newfold-notifications(\/|%2F)v1(\/|%2F)notifications(\/|%2F)events/,
      },
      {
        statusCode: 201,
        body: notifications,
      }
    ).as('notifications');


    cy.get('#search-plugins').type('paypal');


    cy.wait('@notifications');
    cy.get('#the-list', { timeout: 30000 }).should('be.visible');

  });


  it('should display matching plugin search results', () => {

    cy.get('#the-list > div.plugin-card.newfold-search-results').should(
      'exist'
    );

    cy.get('#the-list > div.plugin-card.newfold-search-results')
      .scrollIntoView()
      .should('be.visible')
      .should('have.attr', 'data-id')
      .and('equal', 'test-1');

  });

  it('should not display non-matching plugin search results', () => {

    // Verify that the search field contains the typed text
    cy.get('#the-list > div.plugin-card.newfold-search-results')
      .scrollIntoView()
      .should('be.visible')
      .should('have.attr', 'data-id')
      .and('not.equal', 'test-2');
  });

});
