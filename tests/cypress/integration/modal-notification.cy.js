// <reference types="Cypress" />
import { wpLogin, wpCli } from '../wp-module-support/utils.cy';

const modalNotification = [
	{
		id: 'test-ai',
		locations: [
			{
				context: Cypress.env( 'pluginId' ) + '-plugin',
				pages: [ '#/home' ],
			},
		],
		expiration: 2748820256,
		content:
			'<script>function checkAndRemoveModalOverlay() { const currentPath = window.location.pathname; const pattern = /^\\/admin\\/messages(\\/[\\d\\w-]+)*\\/?$/; if (!pattern.test(currentPath)) { return; } const modalOverlay = document.querySelector(".ai-sitegen-modal-overlay"); if (modalOverlay) { modalOverlay.classList.remove("ai-sitegen-modal-overlay"); } } function closeModal() { const modalOverlay = document.querySelector(".ai-sitegen-modal-overlay"); if (modalOverlay) { modalOverlay.style.display = "none"; } else { console.error("Modal overlay not found"); } } function playVideoAgain() { watchAgainOverlay.style.display = "none"; aiVideo.play(); } function redirectToOnboarding() { window.location.href = `${window.location.origin}/wp-admin/index.php?page=nfd-onboarding`; } function showWatchAgainOverlay() { const watchAgainOverlay = document.getElementById("watchAgainOverlay"); if (!watchAgainOverlay) { console.error("Watch again overlay element not found"); return; } watchAgainOverlay.style.display = "flex"; } document.addEventListener("DOMContentLoaded", () => { const aiVideo = document.getElementById("aiVideo"); if (!aiVideo) { console.error("Video element not found"); return; } aiVideo.play(); checkAndRemoveModalOverlay(); }); </script><style> .ai-sitegen-modal-overlay { position: fixed; top: 0; left: 0; display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 999999; overflow: auto; } .ai-sitegen-modal { width: 95%; height: 95%; display: flex; flex-direction: column; justify-content: space-between; background-color: white; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); border-radius: 8px; overflow: auto; z-index: 999999; } .ai-sitegen-modal__header { background-color: #132F58; color: white; padding: 20px; text-align: center; position: relative; } .ai-sitegen-modal__header__heading { color: white; margin: 20px 0px !important; line-height: 1.2; font-size: clamp(1.875rem, 1.6477rem + 1.1364vw, 4.375rem) !important; } .ai-sitegen-modal__header__subheading { margin: 10px 0 0 !important; font-size: clamp(0.875rem, 0.7841rem + 0.4545vw, 1.875rem); } .ai-sitegen-modal__header__close-button { position: absolute; top: 20px; right: 20px; background: none; border: none; color: white !important; font-size: 32px !important; cursor: pointer !important; outline: none; } .ai-sitegen-modal__content { display: flex; justify-content: space-between; padding: 40px; gap: 40px; z-index: 9999; } .ai-sitegen-modal__content__left-section { flex: 1; width: 80%; display: flex; justify-content: center; align-items: center; } .ai-sitegen-modal__content__left-section__frame { width: 80%; max-width: 700px; padding: 8px; border: 7px solid #9800a6; border-radius: 24px; background-color: #f9f9f9; text-align: center; } .ai-sitegen-modal__content__right-section { flex: 1; padding-left: 0px; justify-content: center !important; text-align: left; } .ai-sitegen-modal__content__right-section__heading { display: flex; align-items: center; font-size: clamp(1.25rem, 1.1364rem + 0.5682vw, 2.5rem) !important; margin: 0 !important; } .ai-sitegen-modal__content__right-section__heading__text { margin-left: 10px; line-height: 1.2; } .ai-sitegen-modal__content__right-section__content__subheading { font-size: clamp(0.75rem, 0.6591rem + 0.4545vw, 1.75rem); margin: 20px 0 !important; color: #404040; } .ai-sitegen-modal__content__right-section__content__pretext { font-size: clamp(0.75rem, 0.6705rem + 0.3977vw, 1.625rem); margin: 20px 0 !important; color: #404040; } .ai-sitegen-modal__content__right-section__content__points { list-style-type: none !important; padding: 0 !important; margin: 10px 0 !important; } .ai-sitegen-modal__content__right-section__content__points__point { display: flex; flex-direction: row; gap: 9px; font-size: clamp(0.75rem, 0.6705rem + 0.3977vw, 1.625rem); color: #404040; margin: 25px 0; padding-left: 16px; position: relative; } .ai-sitegen-modal__footer { display: flex; flex-direction: row; justify-content: end; align-items: center; padding: 15px; text-align: center; border-top: 1px solid #ddd; box-shadow: 0px -4px 8px 0px #00000040; } .ai-sitegen-modal__footer__content { display: flex; flex-direction: column; } .ai-sitegen-modal__footer__content__heading { font-size: 20px; background-color: #E5ECF0; margin-bottom: 10px !important; padding: 0px 16px; } .ai-sitegen-modal__footer__content__buttons__no-thanks { background-color: white !important; color: #196BDE !important; border: 1px solid #196BDE; padding: 10px 20px !important; border-radius: 4px; cursor: pointer !important; margin: 5px !important; } .ai-sitegen-modal__footer__content__buttons__no-thanks:hover { border-color: #1763cf; color: #1763cf; } .ai-sitegen-modal__footer__content__buttons__try-now { background-color: #196BDE !important; color: white !important; padding: 10px 20px !important; border: none; border-radius: 4px; cursor: pointer !important; margin: 5px !important; } .ai-sitegen-modal__footer__content__buttons__try-now:hover { background-color: #1763cf; } .ai-sitegen-modal__content__left-section__frame__video-container { position: relative; width: 100%; } .ai-sitegen-modal__content__left-section__frame__video-container__video { width: 100%; height: auto !important; border: none; display: block !important; border-radius: 8px; } .ai-sitegen-modal__content__left-section__frame__video-container__watch-again-overlay { display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(255, 255, 255, 0.8); color: #000; flex-direction: column; justify-content: center; align-items: center; cursor: pointer; border-radius: 8px; font-size: 18px; font-weight: bold; } .ai-sitegen-modal__content__left-section__frame__video-container__watch-again-overlay__play-button { width: 50px; height: 50px; background-color: black; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin-top: 10px; } .ai-sitegen-modal__content__left-section__frame__video-container__watch-again-overlay__play-button::after { content: ""; display: block; width: 0; height: 0; border-left: 12px solid white; border-top: 7px solid transparent; border-bottom: 7px solid transparent; margin-left: 5px; } @media only screen and (max-width: 960px) { .ai-sitegen-modal-overlay { padding: 0px; } .ai-sitegen-modal { width: 100%; height: 100%; border-radius: 0px; } .ai-sitegen-modal__content { width: 100%; height: 100%; padding: 0px; align-items: center; justify-content: center; flex-direction: column; gap: 12px; margin-bottom: 150px; } .ai-sitegen-modal__content__left-section { margin: 10px 0px; width: 100%; align-items: center; justify-content: center; flex-direction: column; padding: 10px; } .ai-sitegen-modal__content__left-section__frame { width: 100%; padding: 8px; } .ai-sitegen-modal__content__right-section { width: 100%; align-items: center; justify-content: center; flex-direction: column; padding: 10px; } .ai-sitegen-modal__content__right-section__heading { flex-direction: column; align-items: center; justify-content: center; margin: 10px 0px; } .ai-sitegen-modal__content__right-section__heading__ai-icon { display: none; } .ai-sitegen-modal__footer { position: fixed; bottom: 0; left: 0; width: 100%; background-color: #ffffff; box-shadow: 0px -4px 8px 0px rgba(0, 0, 0, 0.1); z-index: 99999; padding: 15px; justify-content: center; } .ai-sitegen-modal__footer__content__buttons { display: flex; flex-direction: row; } .ai-sitegen-modal__footer__content__buttons__no-thanks, .ai-sitegen-modal__footer__content__buttons__try-now { padding: 8px 16px; } } </style><div class="ai-sitegen-modal-overlay"> <div class="ai-sitegen-modal"> <div class="ai-sitegen-modal__header"> <button data-action="close" class="ai-sitegen-modal__header__close-button" onclick="closeModal();">&times;</button> <h1 class="ai-sitegen-modal__header__heading">Building your WordPress site just got easier.</h1> <p class="ai-sitegen-modal__header__subheading">Easily design and launch a stylish WordPress website with our AI WonderSuite tools.</p> </div> <div class="ai-sitegen-modal__content"> <div class="ai-sitegen-modal__content__left-section"> <div class="ai-sitegen-modal__content__left-section__frame"> <div class="ai-sitegen-modal__content__left-section__frame__video-container"> <video id="aiVideo" class="ai-sitegen-modal__content__left-section__frame__video-container__video" width="100%" height="auto" autoplay muted onended="showWatchAgainOverlay();"> <source src="https://cdn.hiive.space/ai-site-gen/ai-embed.mp4"> Your browser does not support the video tag. </video> <div id="watchAgainOverlay" class="ai-sitegen-modal__content__left-section__frame__video-container__watch-again-overlay" onclick="playVideoAgain();"> <p class="ai-sitegen-modal__content__left-section__frame__video-container__watch-again-overlay__text"> Watch again</p> <div class="ai-sitegen-modal__content__left-section__frame__video-container__watch-again-overlay__play-button"> </div> </div> </div> </div> </div> <div class="ai-sitegen-modal__content__right-section"> <div class="ai-sitegen-modal__content__right-section__content"> <h2 class="ai-sitegen-modal__content__right-section__heading"> <img class="ai-sitegen-modal__content__right-section__heading__ai-icon" src="https://d2k7nyq3ix8wzh.cloudfront.net/286e07d2-d885-495b-b185-e625b8eec683/images/svg/ai.svg" alt="Description of SVG"/> <span class="ai-sitegen-modal__content__right-section__heading__text">Website Creator for WordPress</span> </h2> <p class="ai-sitegen-modal__content__right-section__content__subheading">Tell our AI engine what kind of site you want to create and let it handle the content and design for you:</p> <p class="ai-sitegen-modal__content__right-section__content__pretext">Using the AI Site Generator is easy!</p> <ul class="ai-sitegen-modal__content__right-section__content__points"> <li class="ai-sitegen-modal__content__right-section__content__points__point"><img src="https://d2k7nyq3ix8wzh.cloudfront.net/286e07d2-d885-495b-b185-e625b8eec683/images/svg/green-check.svg" alt="first tick" /> Preview different layouts and designs in minutes</li> <li class="ai-sitegen-modal__content__right-section__content__points__point"><img src="https://d2k7nyq3ix8wzh.cloudfront.net/286e07d2-d885-495b-b185-e625b8eec683/images/svg/green-check.svg" alt="second tick" /> Customize the colors and fonts</li> <li class="ai-sitegen-modal__content__right-section__content__points__point"><img src="https://d2k7nyq3ix8wzh.cloudfront.net/286e07d2-d885-495b-b185-e625b8eec683/images/svg/green-check.svg" alt="third tick" /> Site headlines, text, and imagery generated automatically</li> <li class="ai-sitegen-modal__content__right-section__content__points__point"><img src="https://d2k7nyq3ix8wzh.cloudfront.net/286e07d2-d885-495b-b185-e625b8eec683/images/svg/green-check.svg" alt="fourth tick" /> Multiple site designs for you to choose from</li> </ul> </div> </div> </div> <div class="ai-sitegen-modal__footer"> <div class="ai-sitegen-modal__footer__content"> <p class="ai-sitegen-modal__footer__content__heading">Included FREE in your plan!</p> <div class="ai-sitegen-modal__footer__content__buttons"> <button data-action="close" class="ai-sitegen-modal__footer__content__buttons__no-thanks" onclick="closeModal();">NO, THANKS</button> <button class="ai-sitegen-modal__footer__content__buttons__try-now" onclick="redirectToOnboarding();">TRY NOW</button> </div> </div> </div> </div> </div>',
	},
];

describe( 'AI Notification', { testIsolation: true }, () => {
	beforeEach( () => {
		wpLogin();
		wpCli( 'transient delete newfold_notifications' );
		cy.visit( '/wp-admin/index.php' );
	} );

	// AI notification for bluehost only
	if ( Cypress.env( 'pluginId' ) === 'bluehost' ) {
		it( 'appears for the six month old sites and Close button icon is clicked', () => {
			cy.intercept(
				{
					method: 'GET',
					url: /newfold-notifications(\/|%2F)v1(\/|%2F)notifications/,
				},
				modalNotification
			).as( 'notifications' );

			cy.visit(
				`/wp-admin/admin.php?page=${ Cypress.env( 'pluginId' ) }#/home`
			);
			cy.wait( '@notifications' );
			cy.get( '.newfold-notifications-wrapper #notification-test-ai' );
			cy.get(
				'img[class="ai-sitegen-modal__content__right-section__heading__ai-icon"]'
			).should( 'exist' );
			cy.get( '.ai-sitegen-modal' )
				.should( 'exist' )
				.scrollTo( 'bottom' );
			cy.get( '.ai-sitegen-modal__footer' ).should( 'exist' );
			cy.get( '.ai-sitegen-modal__footer__content' ).should( 'exist' );
			cy.get( '.ai-sitegen-modal__footer__content__heading' )
				.should( 'be.visible' )
				.and( 'contain.text', 'Included FREE in your plan!' );
			cy.get( '.ai-sitegen-modal__footer__content__buttons' )
				.eq( 0 )
				.should( 'exist' );
			cy.get( 'button.ai-sitegen-modal__header__close-button' )
				.scrollIntoView()
				.should( 'be.visible' )
				.click();
			cy.get( '.ai-sitegen-modal' ).should( 'not.visible' );
		} );

		it( 'redirects to AI onboarding when TRY NOW button is clicked', () => {
			cy.intercept(
				{
					method: 'GET',
					url: /newfold-notifications(\/|%2F)v1(\/|%2F)notifications/,
				},
				modalNotification
			).as( 'notifications' );
			cy.visit(
				'/wp-admin/admin.php?page=' +
					Cypress.env( 'pluginId' ) +
					'#/home'
			);
			cy.wait( '@notifications' );
			cy.wait( 500 );
			cy.get(
				'button.ai-sitegen-modal__footer__content__buttons__try-now'
			)
				.scrollIntoView()
				.should( 'be.visible' )
				.and( 'contain', 'TRY NOW' )
				.click();
			cy.url().should( 'include', 'nfd-onboarding' );
		} );

		it( 'modal closes when NO THANKS button is clicked', () => {
			cy.intercept(
				{
					method: 'GET',
					url: /newfold-notifications(\/|%2F)v1(\/|%2F)notifications/,
				},
				modalNotification
			).as( 'notifications' );
			cy.visit(
				'/wp-admin/admin.php?page=' +
					Cypress.env( 'pluginId' ) +
					'#/home'
			);
			cy.wait( '@notifications' );
			cy.wait( 500 );
			cy.get(
				'button.ai-sitegen-modal__footer__content__buttons__no-thanks'
			)
				.scrollIntoView()
				.should( 'be.visible' )
				.and( 'contain', 'NO, THANKS' )
				.click();
			cy.get( '.ai-sitegen-modal' ).should( 'not.be.visible' );
		} );
	}
} );
