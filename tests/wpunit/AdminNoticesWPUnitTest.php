<?php

namespace NewfoldLabs\WP\Module\Notifications;

/**
 * AdminNotices wpunit tests.
 *
 * @coversDefaultClass \NewfoldLabs\WP\Module\Notifications\AdminNotices
 */
class AdminNoticesWPUnitTest extends \lucatume\WPBrowser\TestCase\WPTestCase {

	/**
	 * OpenContainer outputs expected wrapper markup.
	 *
	 * @return void
	 */
	public function test_open_container_outputs_wrapper() {
		$this->expectOutputString( '<div id="newfold-notifications" class="newfold-notifications-wrapper">' );
		AdminNotices::openContainer();
	}

	/**
	 * CloseContainer outputs closing div.
	 *
	 * @return void
	 */
	public function test_close_container_outputs_closing_div() {
		$this->expectOutputString( '</div>' );
		AdminNotices::closeContainer();
	}
}
