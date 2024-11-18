// <reference types="Cypress" />
import { wpLogin, wpCli } from '../wp-module-support/utils.cy';

const notifications = [
	{
		id: 'test-settings',
		locations: [
			{
				context: Cypress.env( 'pluginId' ) + '-plugin',
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
				context: Cypress.env( 'pluginId' ) + '-plugin',
				pages: [ '#/home' ],
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
				context: Cypress.env( 'pluginId' ) + '-plugin',
				pages: [ '#/marketplace' ],
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
				context: Cypress.env( 'pluginId' ) + '-plugin',
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
				context: Cypress.env( 'pluginId' ) + '-app-nav',
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
				context: Cypress.env( 'pluginId' ) + '-plugin',
				pages: 'all',
			},
		],
		expiration: 1649817079,
		content:
			'<div class="newfold-notice notice notice-error" style="position:relative;"><p>Here is an expired notice it should never display anywhere even though it has location `all` <button type="button" data-action="close" class="notice-dismiss"><span class="screen-reader-text">Dismiss this notice.</span></button></p></div>',
	},
];

describe( 'Notifications', { testIsolation: true }, () => {
	beforeEach( () => {
		wpLogin();
		wpCli( 'transient delete newfold_notifications' );
		cy.visit( '/wp-admin/index.php' );
	} );

	it( 'Container Exists in plugin app and is accessible', () => {
		cy.visit( '/wp-admin/index.php' );
		cy.injectAxe();
		cy.wait( 1000 );
		cy.get( '.newfold-notifications-wrapper' ).should( 'have.length', 1 );
		cy.checkA11y( '.newfold-notifications-wrapper' );
	} );

	// notification renders in all app for `all`
	it( 'Test notification displays in plugin app with `all`', () => {
		cy.intercept(
			{
				method: 'GET',
				url: /newfold-notifications(\/|%2F)v1(\/|%2F)notifications/,
			},
			notifications
		).as( 'notifications' );
		cy.visit(
			'/wp-admin/admin.php?page=' + Cypress.env( 'pluginId' ) + '#/home'
		);
		cy.wait( '@notifications' );
		cy.get( '.newfold-notifications-wrapper #notification-test-everywhere' )
			.should( 'be.visible' )
			.should( 'have.attr', 'data-id' )
			.and( 'equal', 'test-everywhere' );

		cy.get(
			'.newfold-notifications-wrapper #notification-test-everywhere'
		).contains( 'it should display everywhere' );
	} );

	// notification renders only on specified app page
	it( 'Test notification displays in plugin app for specific page (settings)', () => {
		cy.intercept(
			{
				method: 'GET',
				url: /newfold-notifications(\/|%2F)v1(\/|%2F)notifications/,
			},
			notifications
		).as( 'notifications' );
		cy.visit(
			'/wp-admin/admin.php?page=' + Cypress.env( 'pluginId' ) + '#/home'
		);
		cy.wait( '@notifications' );
		cy.get( 'body' ).then( ( $body ) => {
			if (
				$body.find( '.ai-sitegen-modal' ).length > 0 &&
				$body.find( '.ai-sitegen-modal' ).is( ':visible' )
			) {
				cy.get(
					'button.ai-sitegen-modal__header__close-button'
				).click();
			}
		} );
		cy.get(
			'.newfold-notifications-wrapper #notification-test-settings'
		).should( 'not.exist' );

		cy.get(
			'.' + Cypress.env( 'appId' ) + '-app-navitem-Settings'
		).click();
		cy.wait( 500 );

		cy.get( '.newfold-notifications-wrapper #notification-test-settings' )
			.scrollIntoView()
			.should( 'be.visible' )
			.should( 'have.attr', 'data-id' )
			.and( 'equal', 'test-settings' );

		cy.get(
			'.newfold-notifications-wrapper #notification-test-settings'
		).contains( 'display on plugin app settings page' );
	} );

	// notification renders on the side nav
	it( 'Test notification displays in app side nav', () => {
		cy.intercept(
			{
				method: 'GET',
				url: /newfold-notifications(\/|%2F)v1(\/|%2F)notifications/,
			},
			notifications
		).as( 'notifications' );
		cy.visit(
			'/wp-admin/admin.php?page=' + Cypress.env( 'pluginId' ) + '#/home'
		);
		cy.wait( '@notifications' );
		cy.get(
			'.newfold-nav-notifications-wrapper #notification-test-side-nav'
		)
			.should( 'be.visible' )
			.should( 'have.attr', 'data-id' )
			.and( 'equal', 'test-side-nav' );

		cy.get(
			'.newfold-nav-notifications-wrapper #notification-test-side-nav'
		).contains( 'display in the app side nav' );
	} );

	// expired notification should not show
	it( 'Test expired notification does not display in plugin app', () => {
		cy.intercept(
			{
				method: 'GET',
				url: /newfold-notifications(\/|%2F)v1(\/|%2F)notifications/,
			},
			notifications
		).as( 'notifications' );
		cy.visit(
			'/wp-admin/admin.php?page=' + Cypress.env( 'pluginId' ) + '#/home'
		);
		cy.wait( '@notifications' );
		cy.get(
			'.newfold-notifications-wrapper #notification-test-expired'
		).should( 'not.exist' );
	} );

	// dismiss events triggered
	it( 'Dismissing notification removes it from the page', () => {
		cy.intercept(
			{
				method: 'GET',
				url: /newfold-notifications(\/|%2F)v1(\/|%2F)notifications/,
			},
			notifications
		).as( 'notifications' );
		cy.visit(
			'/wp-admin/admin.php?page=' + Cypress.env( 'pluginId' ) + '#/home'
		);
		cy.wait( '@notifications' );
		cy.get( 'body' ).then( ( $body ) => {
			if (
				$body.find( '.ai-sitegen-modal' ).length > 0 &&
				$body.find( '.ai-sitegen-modal' ).is( ':visible' )
			) {
				cy.get(
					'button.ai-sitegen-modal__header__close-button'
				).click();
			}
		} );

		cy.intercept(
			{
				method: 'POST',
				url: /newfold-notifications(\/|%2F)v1(\/|%2F)notifications/,
			},
			{
				body: { id: 'test-home' },
			}
		).as( 'dismissNotificaiton' );

		cy.visit(
			'/wp-admin/admin.php?page=' + Cypress.env( 'pluginId' ) + '#/home'
		);
		cy.get( '.newfold-notifications-wrapper #notification-test-home' )
			.scrollIntoView()
			.should( 'be.visible' )
			.should( 'have.attr', 'data-id' )
			.and( 'equal', 'test-home' );

		cy.get(
			'.newfold-notifications-wrapper #notification-test-home'
		).should( 'be.visible' );
		cy.get(
			'.newfold-notifications-wrapper #notification-test-home'
		).contains( 'display on home screen only' );

		cy.get(
			'#notification-test-home button.notice-dismiss[data-action="close"]'
		).click();
		cy.wait( '@dismissNotificaiton' );

		cy.get(
			'.newfold-notifications-wrapper #notification-test-home'
		).should( 'not.exist' );
	} );

	// these can be updated later on, but currently the wp-admin tests are not loaded via the api
	// so we can't intercept with test notifications
	it( 'Container Exists in wp-admin', () => {
		cy.visit( '/wp-admin/index.php' );
		cy.get( '#newfold-notifications' ).should( 'exist' );
	} );

	// click events triggered
	// plugin search notifications render properly
} );
