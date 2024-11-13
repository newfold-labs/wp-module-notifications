/**
 * Loginto WordPress.
 */
export const wpLogin = () => {
	cy.login( Cypress.env( 'wpUsername' ), Cypress.env( 'wpPassword' ) );
};

/**
 * wp-cli helper
 *
 * This wraps the command in the required npx wp-env run cli wp
 *
 * @param {string} cmd the command to send to wp-cli
 */
export const wpCli = ( cmd ) => {
	cy.exec( `npx wp-env run cli wp ${ cmd }`, {
		env: {
			NODE_TLS_REJECT_UNAUTHORIZED: '1',
		},
	} ).then( ( result ) => {
		for ( const [ key, value ] of Object.entries( result ) ) {
			cy.log( `${ key }: ${ value }` );
		}
	} );
};