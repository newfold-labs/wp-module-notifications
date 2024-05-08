{

	class RealtimeNotice {

		id = 0;
		content = '';
		expiration = 0;
		locations = [];

		constructor({id, content, expiration, locations}) {
			this.id = id;
			this.content = content;
			this.expiration = expiration;
			this.locations = locations;
		}

		maybeRender() {
			if (this.shouldShow()) {
				this.insertElement(this.createElement());
			}
		}

		shouldShow() {

			let shouldShow = false;

			// Don't show if it already exists
			if (document.querySelector('div.newfold-realtime-notice[data-id="' + this.id + '"]') !== null) {
				return shouldShow;
			}

			// Check if notice has expired
			if (this.expiration > Math.round(Date.now() / 1000)) {

				// Check if any location has the proper context
				this.locations.forEach(
					({context, pages}) => {
						if ('wp-admin-notice' === context) {
							if (Array.isArray(pages) && pages.includes('plugin-install.php')) {
								shouldShow = true;
							}
							if (pages === 'all') {
								shouldShow = true;
							}
						}
					}
				);

			}
			return shouldShow;
		}

		createElement() {
			const el = document.createElement('div');
			el.setAttribute('class', 'newfold-realtime-notice');
			el.setAttribute('data-id', this.id);
			el.innerHTML = this.content;
			this.el = el;
			return el;
		}

		insertElement(el) {
			document.querySelector('.wp-header-end').after(el);
			this.addEventListeners(el);
		}

		removeElement() {
			this.el.parentNode.removeChild(this.el);
		}

		addEventListeners(el) {

			// Handle notification close/dismiss events
			const closeButton = el.querySelector('[data-action="close"]');
			if (closeButton) {
				closeButton.addEventListener('click', this.dismissNotice.bind(this));
			}

			// Handle notification button click event tracking
			const buttons = Array.from(el.querySelectorAll('button'));
			if (buttons.length) {
				buttons.forEach(
					button => {
						if (button.getAttribute('data-action') !== 'close') {
							button.addEventListener('click', this.trackClick.bind(this));
						}
					}
				)
			}

			// Handle notification link click event tracking
			const links = Array.from(el.querySelectorAll('a'));
			if (links.length) {
				links.forEach(
					link => {
						if (link.getAttribute('data-action') !== 'close') {
							link.addEventListener('click', this.trackClick.bind(this));
						}
					}
				)
			}

		}

		dismissNotice(e) {
			e.preventDefault();
			this.removeElement();
			window.fetch(
				`${ window.NewfoldRuntime.restUrl }newfold-notifications/v1/notifications/${ this.id }`,
				{
					credentials: 'same-origin',
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
						'X-WP-Nonce': window.NewfoldRuntime.restNonce,
					},
				}
			);
		}

		trackClick(e) {
			const data = {
				action: 'newfold-notification-click',
				data: {
					element: e.target.nodeName.toLowerCase(),
					label: e.target.innerText,
					notificationId: this.id,
					page: window.location.href,
				}
			}
			if (data.element === 'a') {
				data.href = e.target.getAttribute('href');
			}
			window.fetch(
				`${ window.NewfoldRuntime.restUrl }newfold-data/v1/events/`,
				{
					credentials: 'same-origin',
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-WP-Nonce': window.NewfoldRuntime.restNonce,
					},
					body: JSON.stringify(data),
				}
			);
		}

	}

	class PluginSearchResult extends RealtimeNotice {

		searchQuery = '';
		storedQuery = '';

		constructor({id, content, expiration, locations, query}, searchQuery) {
			super({id, content, expiration, locations});
			this.searchQuery = searchQuery;
			this.storedQuery = query;
		}

		shouldShow() {

			let shouldShow = false;

			// Don't show if it already exists
			if (document.querySelector('div.plugin-card.newfold-search-results[data-id="' + this.id + '"]') !== null) {
				return shouldShow;
			}

			const queryTokens = this.searchQuery.split(" ");
			
			let isQueryMatch = false;
			queryTokens.forEach(queryToken => {
				if (this.storedQuery.toLowerCase().includes(queryToken.toLowerCase())) {
					isQueryMatch = true;
					return;
				}
			});

			if (!isQueryMatch) {
				return shouldShow;
			}

			// Check if notice has expired
			if (this.expiration > Math.round(Date.now() / 1000)) {

				// Check if any location has the proper context
				this.locations.forEach(
					({context, pages}) => {
						if ('wp-plugin-search' === context) {
							if (Array.isArray(pages) && pages.includes('plugin-install.php')) {
								shouldShow = true;
							}
							if (pages === 'all') {
								shouldShow = true;
							}
						}
					}
				);

			}
			return shouldShow;
		}

		createElement() {
			const el = document.createElement('div');
			el.setAttribute('class', 'plugin-card newfold-search-results');
			el.setAttribute('data-id', this.id);
			el.innerHTML = this.content;
			this.el = el;
			return el;
		}

		insertElement(el) {
			const insertIntoList = () => {
				const theList = document.querySelector('#the-list');
				if (theList) {
					clearInterval(interval);
					theList.insertAdjacentElement('afterbegin', el);
					this.addEventListeners(el);
				}
			};
		
			const interval = setInterval(insertIntoList, 100);
		}

	}

	class PluginSearch {

		inputHandler = _.debounce(this.onPluginSearch.bind(this), 1000);
		searchQuery;

		static init() {
			const event = new PluginSearch();
			event.enable();
		}

		enable() {
			document
				.getElementById('search-plugins')
				.addEventListener('input', this.inputHandler);
			document
				.getElementById('typeselector')
				.addEventListener('change', this.onPluginSearch.bind(this));
		}

		disable() {
			document
				.getElementById('search-plugins')
				.removeEventListener('input', this.inputHandler);
			document
				.getElementById('typeselector')
				.removeEventListener('change', this.onPluginSearch.bind(this));
		}

		onPluginSearch(e) {
			const type = document.getElementById('typeselector').value;
			const query = document.getElementById('search-plugins').value;
			this.searchQuery = query;
			this.checkForNotices({action: 'plugin_search', data: {type, query}});
		}

		clearExistingSearchResults() {
			var existingElements = document.getElementsByClassName('newfold-search-results');
			var elementsArray = Array.from(existingElements);
			elementsArray.forEach(function(element) {
				element.remove();
			});
		}

		onReceiveNotices(notices) {
			notices.forEach(notice => {
				(new RealtimeNotice(notice)).maybeRender();
			});

			this.clearExistingSearchResults();
			notices.forEach(notice => {
				(new PluginSearchResult(notice, this.searchQuery)).maybeRender();
			});
		}

		checkForNotices(event) {
			event.queue = false;
			window
				.fetch(
					`${ window.NewfoldRuntime.restUrl }newfold-notifications/v1/notifications/events`,
					{
						credentials: 'same-origin',
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'X-WP-Nonce': window.NewfoldRuntime.restNonce,
						},
						body: JSON.stringify(event),
					}
				)
				.then(response => {
					if (response.status !== 201) {
						throw new Error(response.statusText);
					}
					return response;
				})
				.then(response => response.json())
				.then(notices => {
					if (notices.hasOwnProperty('data') && Array.isArray(notices.data)) {
						this.onReceiveNotices(notices.data);
					}
				})
				.catch(error => console.error('Network request failed:', error));
		}

	}

	window.addEventListener('load', PluginSearch.init);

}
