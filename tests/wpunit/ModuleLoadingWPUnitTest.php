<?php

namespace NewfoldLabs\WP\Module\Notifications;

/**
 * Module loading wpunit tests.
 *
 * @coversDefaultClass \NewfoldLabs\WP\Module\Notifications\Notification
 */
class ModuleLoadingWPUnitTest extends \lucatume\WPBrowser\TestCase\WPTestCase {

	/**
	 * Verify core module classes exist.
	 *
	 * @return void
	 */
	public function test_module_classes_load() {
		$this->assertTrue( class_exists( Notification::class ) );
		$this->assertTrue( class_exists( NotificationsApi::class ) );
		$this->assertTrue( class_exists( NotificationsRepository::class ) );
		$this->assertTrue( class_exists( AdminNotices::class ) );
	}

	/**
	 * Verify WordPress factory is available.
	 *
	 * @return void
	 */
	public function test_wordpress_factory_available() {
		$this->assertTrue( function_exists( 'get_option' ) );
		$this->assertNotEmpty( get_option( 'blogname' ) );
	}
}
