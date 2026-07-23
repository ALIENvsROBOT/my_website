/**
 * @file privacy/page.tsx
 * @description The Privacy Policy page. 
 * Designed as a minimalist, text-focused page consistent with the portfolio's aesthetics.
 */

'use client'

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getAnalyticsConsent, setAnalyticsConsent, type AnalyticsConsent } from '@/lib/analytics-consent';

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
		<main className="relative z-10 min-h-screen bg-transparent text-zinc-900 py-20 px-4 md:px-8">
			<div className="max-w-4xl mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="page-card p-8 md:p-10"
				>
					{/* Navigation link back to the main 3D scene */}
					<Link
						href="/"
						className="text-zinc-600 hover:text-zinc-800 transition-colors duration-300 mb-8 inline-flex items-center gap-2 font-medium"
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
						</svg>
						Back to Home
					</Link>

					<h1 className="text-5xl md:text-6xl font-bold mb-12 text-zinc-900">Privacy Policy</h1>

					<div className="text-zinc-700 leading-relaxed font-light space-y-6">
						<p>
							As an HCI (Human-Computer Interaction) researcher, I value digital ethics and data transparency. This policy outlines how information is handled when you interact with this professional portfolio. To understand how visitors interact with my research and 3D demonstrations, I use <strong>PostHog</strong>, an open-source, privacy-focused analytics platform.
						</p>
						<p>
							Optional analytics begins only if you explicitly accept it. It records page paths, referrer domains, safe campaign labels, engagement time, scroll depth, outbound-link destinations, downloads, copy interaction length, Web Vitals, and anonymized error counts. It does not use session replay, heatmaps, autocapture, form values, copied text, full URLs, arbitrary URL query strings, or user identification. The configured PostHog region determines where analytics data is processed.
						</p>
						<section className="rounded-xl border border-zinc-400/30 bg-white/30 p-5">
							<h2 className="text-lg font-semibold text-zinc-900">Analytics preference</h2>
							<p className="mt-2 text-sm">Current choice: <strong>{analyticsConsent === 'granted' ? 'Accepted' : analyticsConsent === 'denied' ? 'Rejected' : 'Not selected'}</strong>.</p>
							<div className="mt-4 flex flex-wrap gap-3">
								<button onClick={() => updateAnalyticsConsent('granted')} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700">Accept analytics</button>
								<button onClick={() => updateAnalyticsConsent('denied')} className="rounded-lg border border-zinc-400 px-4 py-2 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-100">Reject analytics</button>
							</div>
						</section>
						<p>
							I collect this information strictly for technical research and professional development. It helps me optimize interactive 3D performance, identify high-interest research topics, and monitor the accessibility of the platform across different regions. If you use the contact form, the information you provide (Name, Email, Message) is only used to respond to your inquiry and is never sold or shared with third parties.
						</p>
						<p>
							Under GDPR, you have the right to access, rectify, or request the deletion of your data. For any inquiries regarding your privacy or data removal, please contact me directly at: <a href="mailto:gowtham.sridher5@gmail.com" className="text-zinc-600 hover:text-zinc-800 transition-colors underline decoration-zinc-500/30 underline-offset-4">gowtham.sridher5@gmail.com</a>.
						</p>

						{/* Manual timestamp for static export accuracy */}
						<div className="pt-10 border-t border-zinc-400/30 text-xs text-zinc-500 font-mono tracking-wider uppercase">
							Last Updated: February 03, 2026
						</div>
					</div>
				</motion.div>
			</div>
		</main>
	);
}
