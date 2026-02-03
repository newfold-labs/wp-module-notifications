<?php

namespace NewfoldLabs\WP\Module\Notifications;

/**
 * Notification wpunit tests.
 *
 * @coversDefaultClass \NewfoldLabs\WP\Module\Notifications\Notification
 */
class NotificationWPUnitTest extends \lucatume\WPBrowser\TestCase\WPTestCase {

	/**
	 * Constructor accepts array and sets id, content, locations, expiration.
	 *
	 * @return void
	 */
	public function test_constructor_accepts_array() {
		$data = array(
			'id'         => 'test-notification-1',
			'content'    => '<p>Test content</p>',
			'locations'  => array(),
			'expiration' => 0,
		);
		$notification = new Notification( $data );
		$this->assertSame( 'test-notification-1', $notification->id );
		$this->assertSame( '<p>Test content</p>', $notification->content );
		$this->assertSame( array(), $notification->locations );
		$this->assertSame( 0, $notification->expiration );
	}

	/**
	 * Constructor accepts JSON string.
	 *
	 * @return void
	 */
	public function test_constructor_accepts_json_string() {
		$json = wp_json_encode( array(
			'id'        => 'json-notification',
			'content'   => 'JSON content',
			'locations' => array(),
			'expiration' => 0,
		) );
		$notification = new Notification( $json );
		$this->assertSame( 'json-notification', $notification->id );
	}

	/**
	 * IsExpired returns true when expiration is in the past.
	 *
	 * @return void
	 */
	public function test_is_expired_returns_true_when_expiration_past() {
		$data = array(
			'id'         => 'expired',
			'content'    => '',
			'locations'  => array(),
			'expiration' => time() - 3600,
		);
		$notification = new Notification( $data );
		$this->assertTrue( $notification->isExpired() );
	}

	/**
	 * IsExpired returns false when expiration is zero.
	 *
	 * @return void
	 */
	public function test_is_expired_returns_false_when_expiration_zero() {
		$data = array(
			'id'         => 'no-expiry',
			'content'    => '',
			'locations'  => array(),
			'expiration' => 0,
		);
		$notification = new Notification( $data );
		$this->assertFalse( $notification->isExpired() );
	}

	/**
	 * AsArray returns id, locations, expiration, content.
	 *
	 * @return void
	 */
	public function test_as_array_returns_expected_keys() {
		$data = array(
			'id'         => 'array-test',
			'content'    => 'Content',
			'locations'  => array( array( 'context' => 'test' ) ),
			'expiration' => 12345,
		);
		$notification = new Notification( $data );
		$arr = $notification->asArray();
		$this->assertSame( 'array-test', $arr['id'] );
		$this->assertSame( array( array( 'context' => 'test' ) ), $arr['locations'] );
		$this->assertSame( 12345, $arr['expiration'] );
		$this->assertSame( 'Content', $arr['content'] );
	}
}
