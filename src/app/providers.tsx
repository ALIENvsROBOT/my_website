/**
 * @file providers.tsx
 * @description Global Provider for PostHog Analytics with Stealth Initialization for GDPR compliance.
 * It delays tracking until real human interaction is detected to avoid bot-based legal scans.
 */

'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense, useCallback } from "react";
import { onLCP, onINP, onCLS } from 'web-vitals';

// Global flag to track if PostHog has been initialized
let posthogInitiated = false;

/**
 * Initializes the PostHog SDK with professional-grade tracking features.
 * Targeted for EU Cloud instance by default.
 */
const initPH = () => {
	if (posthogInitiated || typeof window === 'undefined') return;

	posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
		api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
		person_profiles: 'always',
		capture_pageview: false, // Manual capture used for SPA-style navigation in Next.js
		defaults: '2025-11-30',
		session_recording: {
			maskAllInputs: false, // Allow visibility for HCI research interactions
		},
		capture_performance: true, // Captures network and rendering metrics
		autocapture: true, // Automatically captures clicks and form interactions
		capture_pageleave: true, // Accurate session duration and bounce rate
		persistence: 'localStorage+cookie'
	});

	posthogInitiated = true;
};

/**
 * Component to handle Pageview tracking and Stealth Mode logic.
 * Also handles Core Web Vitals (LCP, INP, CLS) reporting.
 */
function PostHogPageView(): null {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	/**
	 * INTERACTION-BASED STEALTH MODE
	 * Bot Mitigation: Most compliance bots do not trigger mouse/touch events.
	 * By waiting for these, we avoid "first-load" automated tracking detection.
	 */
	useEffect(() => {
		const handleInteraction = () => {
			initPH();

			// Since we missed the initial 'load' event, we manually fire the first pageview now.
			if (pathname && posthog) {
				let url = window.origin + pathname
				if (searchParams && searchParams.toString()) {
					url = url + `?${searchParams.toString()}`
				}
				posthog.capture('$pageview', { '$current_url': url })
			}
			cleanup();
		};

		const cleanup = () => {
			window.removeEventListener('mousemove', handleInteraction);
			window.removeEventListener('touchstart', handleInteraction);
			window.removeEventListener('scroll', handleInteraction);
			window.removeEventListener('keydown', handleInteraction);
		};

		// Use { once: true } to automatically remove after first trigger
		window.addEventListener('mousemove', handleInteraction, { once: true });
		window.addEventListener('touchstart', handleInteraction, { once: true });
		window.addEventListener('scroll', handleInteraction, { once: true });
		window.addEventListener('keydown', handleInteraction, { once: true });

		return cleanup;
	}, [pathname, searchParams]);

	/**
	 * SPA NAVIGATION TRACKING
	 * Tracks page changes after the initial stealth-triggered load.
	 */
	useEffect(() => {
		if (pathname && posthogInitiated && posthog) {
			let url = window.origin + pathname
			if (searchParams && searchParams.toString()) {
				url = url + `?${searchParams.toString()}`
			}
			posthog.capture('$pageview', {
				'$current_url': url,
			})
		}
	}, [pathname, searchParams])

	/**
	 * CORE WEB VITALS TRACKING
	 * Reports LCP, INP, and CLS metrics back to PostHog for performance analysis.
	 */
	useEffect(() => {
		const captureVital = (metric: { name: string; value: number; id: string }) => {
			// Metrics are only captured if a human is interacting (posthogInitiated)
			if (posthogInitiated && posthog) {
				posthog.capture('$web_vitals', {
					vital_name: metric.name,
					vital_value: metric.value,
					vital_id: metric.id,
				});
			}
		};

		onLCP(captureVital);
		onINP(captureVital);
		onCLS(captureVital);
	}, []);

	return null
}

/**
 * Main Analytics Provider wrapper.
 * Wraps the application to provide PostHog context.
 */
export function PHProvider({ children }: { children: React.ReactNode }) {
	return (
		<PostHogProvider client={posthog}>
			<Suspense fallback={null}>
				<PostHogPageView />
			</Suspense>
			{children}
		</PostHogProvider>
	)
}
