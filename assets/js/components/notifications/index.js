import { default as Notification } from '../notification/';

/**
 * Notifications Component
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
    props.useEffect(() => {
        props.apiFetch( {
            url: `${props.resturl}/newfold-notifications/v1/notifications&context=${props.context}`
        }).then( ( response ) => {
            setAllNotifications(response);
		});
	}, [] );

    // on update notifications, context or page calculate active notifications
    props.useEffect(() => {
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
        // console.log('Filtering by location pages. Matching page:' + props.page );
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

    const removeNotification = (id) => {
        setAllNotifications(
            props.filter(allNotifications,
                (notification) => {
                    // console.log('Removing notification with id:',id);
                    return notification.id !== id;
                }
            )
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
                    useEffect={props.useEffect}
                    removeNotification={removeNotification}
                />
            ))}
        </div>
    )

};

export default Notifications;