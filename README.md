<div style="text-align: center;">
  <a href="https://newfold.com/" target="_blank">
      <img src="https://newfold.com/content/experience-fragments/newfold/site-header/master/_jcr_content/root/header/logo.coreimg.svg/1621395071423/newfold-digital.svg" alt="Newfold Logo" title="Newfold Digital" height="42" />
  </a>
</div>

# WordPress Notifications Module

[![Version Number](https://img.shields.io/github/v/release/newfold-labs/wp-module-notifications?color=21a0ed&labelColor=333333)](https://github.com/newfold/wp-module-notifications/releases)
[![License](https://img.shields.io/github/license/newfold-labs/wp-module-notifications?labelColor=333333&color=666666)](https://raw.githubusercontent.com/newfold-labs/wp-module-notifications/master/LICENSE)

A module for managing Newfold in-site notifications.

## Module Responsibilities
- Renders admin notices contextually on specific admin screens or globally unless they have expired or been dismissed.
- Provides an API for fetching notifications, dispatching events that update available notifications, and dismissing notifications.
- Responds in real-time to plugin searches with notifications if triggered.

## Critical Paths
- Notifications with a specific context should only show on the appropriate pages.
- Notifications that have expired should not show at all.
- Notifications that have been dismissed should not show again.
- A plugin search for a specific matching keyword should render a notification in real-time.

## Installation

### 1. Add the Newfold Satis to your `composer.json`.

 ```bash
 composer config repositories.newfold composer https://newfold-labs.github.io/satis
 ```

### 2. Require the `newfold-labs/wp-module-notifications` package.

 ```bash
 composer require newfold-labs/wp-module-notifications
 ```

[More on NewFold WordPress Modules](https://github.com/newfold-labs/wp-module-loader)

## TODO:

- [x] Clean up/standardize REST API endpoints so they can be versioned at the module level (e.g.
  `wp-json/newfold-notifications/v1/*` and `wp-json/newfold-data/v1/*`).
- [x] Clean up remaining references to `bluehost` and `bh_` (text domains, notification display context - use
  "newfold-notifications", filter prefixes, etc.) If necessary, we can leverage the container to get the ID of a
  plugin (e.g. `bluehost`, `hostgator`, `web`, etc.)
- [x] Update notifications to have a container and always load scripts in admin so event listeners can be attached to contaienr (for CTB updates)
- [x] Take the React [notifications component](https://github.com/bluehost/bluehost-wordpress-plugin/blob/575c9dfc7ad9e2cc7a3932ebc9e5a07505108d7c/src/app/components/organisms/bwa-notification/index.js)
  [reducers](https://github.com/bluehost/bluehost-wordpress-plugin/blob/c842ce4925f567eab754154d0a2d52483dd79534/src/app/store/reducer.js#L47-L55)
  and [actions](https://github.com/bluehost/bluehost-wordpress-plugin/blob/c842ce4925f567eab754154d0a2d52483dd79534/src/app/store/actions.js)
  from the Bluehost plugin and make them more generic and add it to this module. We'll just include the component from
  the vendor directory for now. We'll probably need to update the component to accept the data store as a prop and maybe
  some other things as well.
- [ ] Ensure that notifications are working properly in the following contexts:
    - [x] Admin notices on standard WP admin pages
    - [ ] Realtime notices on the plugins page
    - [x] Notices within our plugin-specific React app
- [ ] Clean up terminology to make it consistent - notification vs notice
- [ ] Set up webpack alias in plugin so we don't need to reference such a long path for importing component
- [ ] Set up hiive brand relationship so bluehost notifications don't display in other brands plugins etc.

Note: The `NotificationsApi.php` file around line #45 has some commented out test code which will let you mock a
notification for testing.
