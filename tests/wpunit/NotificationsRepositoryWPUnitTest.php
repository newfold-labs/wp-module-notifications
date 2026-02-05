<?php

namespace NewfoldLabs\WP\Module\Notifications;

/**
 * NotificationsRepository wpunit tests.
 *
 * @coversDefaultClass \NewfoldLabs\WP\Module\Notifications\NotificationsRepository
 */
class NotificationsRepositoryWPUnitTest extends \lucatume\WPBrowser\TestCase\WPTestCase {

	/**
	 * TRANSIENT constant has expected value.
	 *
	 * @return void
	 */
	public function test_transient_constant() {
		$this->assertSame( 'newfold_notifications', NotificationsRepository::TRANSIENT );
	}

	/**
	 * Collection returns a collection (may be empty when Hiive not connected).
	 *
	 * @return void
	 */
	public function test_collection_returns_collection() {
		$repo = new NotificationsRepository( false );
		$coll = $repo->collection();
		$this->assertInstanceOf( \WP_Forge\Collection\Collection::class, $coll );
	}
}
