/**
 * @file privacy/page.tsx
 * @description The Privacy Policy page. 
 * A readable overview with optional analytics details and consent controls.
 */

'use client'

import React from 'react';
import Link from 'next/link';
import { getAnalyticsConsent, setAnalyticsConsent, type AnalyticsConsent } from '@/lib/analytics-consent';
import styles from './privacy.module.css';

export default function PrivacyPolicy() {
	const [analyticsConsent, setAnalyticsConsentState] = React.useState<AnalyticsConsent>(null);

	React.useEffect(() => {
		setAnalyticsConsentState(getAnalyticsConsent());
	}, []);

	const updateAnalyticsConsent = (choice: 'granted' | 'denied') => {
		setAnalyticsConsent(choice);
		setAnalyticsConsentState(choice);
	};

	return (
		<main className={styles.page}>
			<article className={styles.document}>
				<Link href="/" className={styles.backLink}>
					<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
						<path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
					</svg>
					Back to home
				</Link>
				<header className={styles.header}>
					<h1>Privacy Policy</h1>
					<p>I want this portfolio to be useful and enjoyable. Optional analytics helps me improve it, and you decide whether to take part.</p>
				</header>

				{/* A region avoids the global decorative styles applied to section elements. */}
				<div className={styles.preferences} role="region" aria-labelledby="analytics-choice">
					<h2 id="analytics-choice">Your analytics choice</h2>
					<p>Analytics starts only with your permission. You can change your choice here at any time.</p>
					<p className={styles.status} role="status">
						Current choice: <strong>{analyticsConsent === 'granted' ? 'Accepted' : analyticsConsent === 'denied' ? 'Rejected' : 'Not selected'}</strong>
					</p>
					<div className={styles.actions}>
						<button type="button" onClick={() => updateAnalyticsConsent('denied')} aria-pressed={analyticsConsent === 'denied'}>Reject analytics</button>
						<button type="button" onClick={() => updateAnalyticsConsent('granted')} aria-pressed={analyticsConsent === 'granted'}>Accept analytics</button>
					</div>
				</div>

				<div className={styles.content}>
					<h2>How it helps</h2>
					<p>With your permission, I use PostHog analytics and click heatmaps to see which projects interest visitors and where the site could work better. This helps me improve the content, accessibility, and performance of the portfolio.</p>
					<p>Session recording is disabled, and analytics does not identify you by name or email.</p>

					<details className={styles.details}>
						<summary>What optional analytics includes</summary>
						<div className={styles.detailContent}>
							<p>If you accept, analytics includes:</p>
							<ul>
								<li>Page visits, first and latest page paths, referring domains, and safe campaign labels.</li>
								<li>Time on the site, scroll depth, link and button clicks, downloads, and the length of copy interactions, without the copied text. Heatmaps show click positions.</li>
								<li>Performance measurements (Web Vitals) and error counts, without error content.</li>
								<li>An unnamed browser ID, browser and device details, and last activity time. PostHog uses browser storage after consent to recognise returning browsers and create a visitor profile.</li>
							</ul>
							<p>Form values, console logs, network headers and bodies, and canvas contents are not recorded. Analytics URLs exclude query strings and fragments.</p>
							<p>Your browser’s Do Not Track preference is respected. You can reject or revoke analytics using the controls above. The configured PostHog region determines where analytics data is processed.</p>
						</div>
					</details>

					<h2>When you get in touch</h2>
					<p>If you use the contact form, I use your name, email, and message only to reply to your enquiry. I do not sell your contact information.</p>

					<h2>Questions or requests?</h2>
					<p>You can ask to access, correct, or delete your personal data under GDPR. For a privacy question or request, email me at{' '}<a href="mailto:gowtham.sridher5@gmail.com">gowtham.sridher5@gmail.com</a>.</p>
				</div>

				<footer className={styles.updated}>Last updated <time dateTime="2026-10-20">20 October 2026</time></footer>
			</article>
		</main>
	);
}
