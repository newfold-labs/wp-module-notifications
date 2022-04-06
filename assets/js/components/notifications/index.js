/**
 * Notifications Module
 * For use in brand app to display notifications
 * 
 * Notification shape:
 * [
 *  {
 *      id: (string) "ID",
 *      expiration: (Number) Date.time() 
 *      locations: (Array) [
 *          {
 *              context: (string) 'wp-admin-notice' || 'brand-plugin' 
 *              pages: (string) 'pagename' || (Array) [ 'page1', 'page2' ]
 *          }
 *      ],
 *      content: (html) HTML_CONTENT - (escaped)
 *  },
 *  ...
 * ]
 * 
 * @param {*} props 
 * @returns 
 */
const Notifications = (props) => {
	const [ activeMotifications, setActiveNotifications ] = props.useState( [] );
    const [ allNotifications, setAllNotifications ] = props.useState( [] );
    
    // on mount load all notifications from module api
    useEffect(() => {
        props.apiFetch( {
            url: `${props.resturl}/newfold-notifications/v1/notifications&context=${props.context}`
        }).then( ( response ) => {
            setAllNotifications(response);
		});
	}, [] );

    // on update notifications, context or page calculate active notifications
    useEffect(() => {
        setActiveNotifications(
            filterNotifications(allNotifications)
        );
	}, [allNotifications, props.page]);

    /**
     * Wrapper method to filter notifications
     * @param Array notifications array of unfiltered notifications
     * @returns Array of filtered notifications
     */
    const filterNotifications = (notifications) => {
        return (
            // last check pages
            filterByLocationPages(
                // then check context
                filterByLocationContext(
                    // first check expiration
                    filterByExpiry(
                        notifications
                    )
                )
            )
        );
    };
    
    /**
     * Filter specific to expirations
     * @param Array notifications array of unfiltered notifications
     * @returns Array of filtered notifications - removes expired notifications
     */
    const filterByExpiry = (notifications) => {
        const now = Date.now();
        // console.log( 'Now: ' + now );
        // filter out expired notifications
        return props.filter(notifications, 
            (notification) => { 
                // console.log( notification.expiration > now ? 
                //     notification.id + ' is not yet expired. Still ' + ( notification.expiration - now ) + 'ms' :
                //     notification.id + ' is an expired notification. Expired for ' + ( notification.expiration - now ) + 'ms'
                // );
                return notification.expiration > now;
            }
        );
    };
    
    /**
     * Filter specific to locations context
     * @param Array notifications array of unfiltered notifications
     * @returns Array of filtered notifications - removes unmatched contexts
     */
    const filterByLocationContext = (notifications) => {
        // console.log('Filtering by location context. Matching context:' + props.context );
        return props.filter(notifications, 
            (notification) => {
                // console.log( notification.locations[0].context === props.context ?
                //     props.context + ': context match' :
                //     props.context + ': not matching context'
                // );
                var isContextMatch = false;
                notification.locations.forEach(location => {
                    if ( location.context === props.context ) {
                        isContextMatch = true;
                    }
                });
                return isContextMatch;
            }
        );
    };

    /**
     * Filter specific to locations pages
     * @param Array notifications array of unfiltered notifications
     * @returns Array of filtered notifications - removes unmatched pages
     */
    const filterByLocationPages = (notifications) => {
        console.log('Filtering by location pages. Matching page:' + props.page );
        return props.filter(notifications, 
            (notification) => {
                var isPageMatch = false;
                notification.locations.forEach(location => {
                    // pages is string
                    if ( typeof location.pages === 'string' ) {
                        // pages matches current page or is `all`
                        if ( location.pages === props.page || location.pages === 'all' ) {
                            isPageMatch = true;
                        }
                    }
                    // pages is array and contains current page
                    if ( Array.isArray(location.pages) && location.pages.includes( props.page ) ) {
                        isPageMatch = true;
                    }
                });
                return isPageMatch;
            }
        );
    }

    return (
        <div className={props.classnames('newfold-notifications-wrapper')}>
            {activeMotifications.map(notification => (
                <Notification 
                    id={notification.id} 
                    content={notification.content}
                    resturl={props.resturl}
                    apiFetch={props.apiFetch}
                />
            ))}
        </div>
    )

};

const Notification = ({ id, content, ...props }) => {

    const onClose = ( event ) => {
        event.preventDefault();
        if ( event.keycode && ENTER !== event.keycode ) {
			return;
		}

        const noticeContainer = document.querySelector('[data-id="' + id +'"]');
        if ( noticeContainer ) {
            props.apiFetch( {
                url: `${props.resturl}/newfold-notifications/v1/notifications/${id}`,
                method: 'DELETE'
            }).then( ( response ) => {
                noticeContainer.remove();
                console.log(response);
            });
        }
    }

    /**
     * Send events to the WP REST API
     *
     * @param {Object} event The event data to be tracked.
     */
    const sendEvent = (event)  => {
        event.data = event.data || {};
        event.data.page = window.location.href;
        props.apiFetch({
            path: `${props.resturl}/newfold-data/v1/events/`,
            method: 'POST', 
            data: event
        });
    }

    const onButtonNavigate = ( event ) => {
        if ( event.keycode && ENTER !== event.keycode ) {
			return;
		}
        sendEvent({
            action: 'newfold-notification-click',
            data: {
                element: 'button',
                label: event.target.innerText,
                notificationId: id,
            }
        })
    }

    const onAnchorNavigate = ( event ) => {
        if ( event.keycode && ENTER !== event.keycode ) {
			return;
		}
        sendEvent({
            action: 'newfold-notification-click',
            data: {
                element: 'a',
                href: event.target.getAttribute('href'),
                label: event.target.innerText,
                notificationId: id,
            }
        })
    }

    useEffect(() => {
        const noticeContainer   = document.querySelector('[data-id="' + id +'"]');
        const noticeCloser      = noticeContainer.querySelector('[data-action="close"]');
        const noticeButtons     = Array.from(noticeContainer.querySelectorAll('button'));
        const noticeAnchors     = Array.from(noticeContainer.querySelectorAll('a'));

        if (noticeButtons.length) {
            noticeButtons.forEach(
                button => {
                    if (button.getAttribute('data-action') !== 'close') {
                        button.addEventListener('click', onButtonNavigate);
                        button.addEventListener('onkeydown', onButtonNavigate);
                    }
                }
            )
        }

        if (noticeAnchors.length) {
            noticeAnchors.forEach(
                link => {
                    if (link.getAttribute('data-action') !== 'close') {
                        link.addEventListener('click', onAnchorNavigate);
                        link.addEventListener('onkeydown', onAnchorNavigate);
                    }
                }
            )
        }

        if (noticeCloser) {
            noticeCloser.addEventListener('click', onClose);
            noticeCloser.addEventListener('onkeydown', onClose);
        }
        
        return () => {
            if (noticeButtons.length) {
                noticeButtons.forEach(
					button => {
						if (button.getAttribute('data-action') !== 'close') {
                            button.removeEventListener('click', onButtonNavigate);
                            button.removeEventListener('onkeydown', onButtonNavigate);
						}
					}
				)
            }
            if (noticeAnchors.length) {
				noticeAnchors.forEach(
					link => {
						if (link.getAttribute('data-action') !== 'close') {
                            link.removeEventListener('click', onAnchorNavigate);
                            link.removeEventListener('onkeydown', onAnchorNavigate);
						}
					}
				)
            }
            if (noticeCloser) {
                noticeCloser.removeEventListener('click', onClose);
                noticeCloser.removeEventListener('onkeydown', onClose);
            }
        }
    }, [id]);

    return (
        <div 
        id={'notification-' + id }
        data-id={id}
        className='newfold-notification'
        dangerouslySetInnerHTML={ {__html: content} }
        />
    );
};

export default Notifications;