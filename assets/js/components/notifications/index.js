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
 *      content: (html) HTML_CONTENT - escaped
 *  },
 *  ...
 * ]
 * 
 * TODO:
 * [x] Load notifications from api
 * [x] Filter expired notificaitons
 * [x] Filter notifications for context
 * [x] Filter notifications for pages
 * [ ] Dismiss listeners - close
 * [ ] Click listeners - open link/button
 * [ ] Click tracking sendEvent
 * [ ] Trigger to check for more notifications?
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
            url: props.resturl + '/newfold-notifications/v1/notifications&context=wp-admin-prime'
        }).then( ( response ) => {
            setAllNotifications(response);
		});
	}, [] );

    // on update notifications, context or page calculate active notifications
    useEffect(() => {
        setActiveNotifications(
            filterNotifications(allNotifications)
        );
	}, [allNotifications, props.page, props.context]);

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
                <div 
                    id={'notification-' + notification.id }
                    data-id={notification.id}
                    className='newfold-notification'
                    dangerouslySetInnerHTML={ {__html: notification.content} }
                />
            ))}
        </div>
    )

};

export default Notifications;