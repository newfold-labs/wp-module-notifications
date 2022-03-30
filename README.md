<div style="text-align: center;">
  <a href="https://newfold.com/" target="_blank">
      <img src="https://newfold.com/content/experience-fragments/newfold/site-header/master/_jcr_content/root/header/logo.coreimg.svg/1621395071423/newfold-digital.svg" alt="Newfold Logo" title="Newfold Digital" height="42" />
  </a>
</div>

# WordPress Notifications Module

[![Version Number](https://img.shields.io/github/v/release/newfold-labs/wp-module-notifications?color=21a0ed&labelColor=333333)](https://github.com/newfold/wp-module-notifications/releases)
[![License](https://img.shields.io/github/license/newfold-labs/wp-module-notifications?labelColor=333333&color=666666)](https://raw.githubusercontent.com/newfold-labs/wp-module-notifications/master/LICENSE)

A module for managing Newfold in-site notifications.

## Installation

### 1. Add the Newfold Satis to your `composer.json`.

 ```bash
 composer config repositories.newfold composer https://newfold.github.io/satis
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
- [ ] Take the React [notifications component](https://github.com/bluehost/bluehost-wordpress-plugin/blob/575c9dfc7ad9e2cc7a3932ebc9e5a07505108d7c/src/app/components/organisms/bwa-notification/index.js)
  [reducers](https://github.com/bluehost/bluehost-wordpress-plugin/blob/c842ce4925f567eab754154d0a2d52483dd79534/src/app/store/reducer.js#L47-L55)
  and [actions](https://github.com/bluehost/bluehost-wordpress-plugin/blob/c842ce4925f567eab754154d0a2d52483dd79534/src/app/store/actions.js)
  from the Bluehost plugin and make them more generic and add it to this module. We'll just include the component from
  the vendor directory for now. We'll probably need to update the component to accept the data store as a prop and maybe
  some other things as well.
- [ ] Ensure that notifications are working properly in the following contexts:
    - [ ] Realtime notices on the plugins page
    - [ ] Admin notices on standard WP admin pages
    - [ ] Notices within our plugin-specific React app

Note: The `NotificationsApi.php` file around line #45 has some commented out test code which will let you mock a
notification for testing.
