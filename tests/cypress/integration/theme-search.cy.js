// <reference types="Cypress" />
import { wpLogin, wpCli } from '../wp-module-support/utils.cy';

const notifications = {
	data: [
		{
			id: 'test-termA',
			locations: [
				{
					pages: 'all',
					context: Cypress.env( 'pluginId' ) + '-plugin',
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
					context: Cypress.env( 'pluginId' ) + '-plugin',
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

describe( 'Theme Search', { testIsolation: true }, () => {

	beforeEach( () => {
		wpLogin();
		wpCli( 'transient delete newfold_notifications' );
	} );

	it( 'should display matching theme search results', () => {
		cy.visit( '/wp-admin/theme-install.php?browse=popular' );
		cy.intercept(
			{
				method: 'POST',
				url: /newfold-notifications(\/|%2F)v1(\/|%2F)notifications(\/|%2F)events/,
			},
			{
				statusCode: 201,
				body: notifications,
			}
		).as( 'notifications' );

		cy.get( '#wp-filter-search-input' ).clear();
		cy.get( '#wp-filter-search-input' ).type( 'termA' );

		cy.wait( '@notifications' );

		cy.get( '.theme-browser .theme', { timeout: 30000 } ).should( 'exist' );

		cy.get( '.theme-browser .theme.newfold-search-results' )
			.scrollIntoView()
			.should( 'be.visible' )
			.should( 'have.attr', 'data-id' )
			.and( 'equal', 'test-termA' );
	} );

	it( 'should not display non-matching theme search results', () => {
		cy.visit( '/wp-admin/theme-install.php?browse=popular' );

		cy.get( '#wp-filter-search-input' ).type( 'termB' );
		cy.intercept(
			{
				method: 'POST',
				url: /newfold-notifications(\/|%2F)v1(\/|%2F)notifications(\/|%2F)events/,
			},
			{
				statusCode: 201,
				body: notifications,
			}
		).as( 'notifications' );

		cy.wait( '@notifications' );

		cy.get( '.theme-browser .theme.newfold-search-results' )
			.scrollIntoView()
			.should( 'be.visible' )
			.should( 'have.attr', 'data-id' )
			.and( 'not.equal', 'test-termA' );
	} );
} );
