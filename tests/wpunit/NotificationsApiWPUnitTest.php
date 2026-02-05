<?php

namespace NewfoldLabs\WP\Module\Notifications;

/**
 * NotificationsApi wpunit tests.
 *
 * @coversDefaultClass \NewfoldLabs\WP\Module\Notifications\NotificationsApi
 */
class NotificationsApiWPUnitTest extends \lucatume\WPBrowser\TestCase\WPTestCase {

	/**
	 * RegisterRoutes registers newfold-notifications REST endpoints on rest_api_init.
	 *
	 * @return void
	 */
	public function test_register_routes_registers_rest_endpoints() {
		add_action( 'rest_api_init', array( NotificationsApi::class, 'registerRoutes' ) );
		do_action( 'rest_api_init' );
		$server = rest_get_server();
		$routes = $server->get_routes();
		$found  = array_filter(
			array_keys( $routes ),
			function ( $route ) {
				return strpos( $route, 'newfold-notifications' ) !== false;
			}
		);
		$this->assertNotEmpty( $found, 'Expected newfold-notifications routes to be registered' );
	}
}
