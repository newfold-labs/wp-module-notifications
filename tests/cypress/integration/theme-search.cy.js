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
        "context": "wp-theme-search"
      }
    ],
    "expiration": 127950904013,
    "type": "html",
    "query": "stripe",
    "content": "<div class=\"theme-screenshot\"><img src=\"//xssts.w.org/wp-content/themes/socialpress/screenshot.png?ver=1.1?ver=1.1\" alt=\"\"></div><span class=\"more-details\">Details &amp; Preview</span><div class=\"theme-author\">By Superb</div><div class=\"theme-id-container\"><h3 class=\"theme-name\">SocialPress</h3><div class=\"theme-actions\"><a class=\"button button-primary theme-install\" data-name=\"SocialPress\" data-slug=\"paypal\" href=\"http://localhost:10013/wp-admin/update.php?action=install-theme&amp;theme=socialpress&amp;_wpnonce=06be73870b\" aria-label=\"Install SocialPress\">Install</a><button class=\"button preview install-theme-preview\">Preview</button></div></div>"
  },
  {
    id: 'test-1',
    "locations": [
      {
        "pages": "all",
        "context": "bluehost-plugin"
      },
      {
        "pages": "all",
        "context": "wp-theme-search"
      }
    ],
    "expiration": 127950904013,
    "type": "html",
    "query": "paypal",
    "content": "<div class=\"theme-screenshot\"><img src=\"//ts.w.org/wp-content/themes/socialpress/screenshot.png?ver=1.1?ver=1.1\" alt=\"\"></div><span class=\"more-details\">Details &amp; Preview</span><div class=\"theme-author\">By Superb</div><div class=\"theme-id-container\"><h3 class=\"theme-name\">SocialPress</h3><div class=\"theme-actions\"><a class=\"button button-primary theme-install\" data-name=\"SocialPress\" data-slug=\"themetwo\" href=\"http://localhost:10013/wp-admin/update.php?action=install-theme&amp;theme=socialpress&amp;_wpnonce=06be73870b\" aria-label=\"Install SocialPress\">Install</a><button class=\"button preview install-theme-preview\">Preview</button></div></div>"
  }]
};

describe('Theme Search', () => {
  const appClass = '.' + Cypress.env('appId');

  before(() => {
    cy.exec('npx wp-env run cli wp transient delete newfold_notifications', { failOnNonZeroExit: false });
    cy.visit('/wp-admin/theme-install.php?browse=popular');

    cy.get('#wp-filter-search-input').type('paypal');
    cy.intercept(
      {
        method: 'POST',
        url: /newfold-notifications(\/|%2F)v1(\/|%2F)notifications(\/|%2F)events/,
      },
      notifications
    ).as('notifications');

    cy.wait('@notifications');

  });

  it('should display matching theme search results', () => {

    cy.get('#wp-filter-search-input').clear();
    cy.get('#wp-filter-search-input').type('stripe');
    cy.intercept(
      {
        method: 'POST',
        url: /newfold-notifications(\/|%2F)v1(\/|%2F)notifications(\/|%2F)events/,
      },
      notifications
    ).as('notifications');

    cy.wait('@notifications');

    cy.get('#wpbody-content > div.wrap > div.theme-browser.content-filterable.rendered > div > div.theme.newfold-search-results', { timeout: 30000 }).should(
      'exist'
    );

    cy.get('#wpbody-content > div.wrap > div.theme-browser.content-filterable.rendered > div > div.theme.newfold-search-results')
      .scrollIntoView()
      .should('be.visible')
      .should('have.attr', 'data-id')
      .and('equal', 'test-1');

  });


  it('should not display non-matching theme search results', () => {

    // Verify that the search field contains the typed text
    cy.get('#wpbody-content > div.wrap > div.theme-browser.content-filterable.rendered > div > div.theme.newfold-search-results')
      .scrollIntoView()
      .should('be.visible')
      .should('have.attr', 'data-id')
      .and('not.equal', 'test-2');
  });

});
