'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, Suspense } from "react"
import { onLCP, onINP, onCLS } from 'web-vitals';

if (typeof window !== 'undefined') {
	posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
		api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
		person_profiles: 'always',
		capture_pageview: false,
		defaults: '2025-11-30',
		session_recording: {
			maskAllInputs: false,
		},
		capture_performance: true,
		autocapture: true,
		capture_pageleave: true,
		persistence: 'localStorage+cookie'
	})
}

function PostHogPageView(): null {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// Track Pageviews
	useEffect(() => {
		if (pathname && posthog) {
			let url = window.origin + pathname
			if (searchParams && searchParams.toString()) {
				url = url + `?${searchParams.toString()}`
			}
			posthog.capture('$pageview', {
				'$current_url': url,
			})
		}
	}, [pathname, searchParams])

	// Track Web Vitals
	useEffect(() => {
		if (posthog) {
			const captureVital = (metric: { name: string; value: number; id: string }) => {
				posthog.capture('$web_vitals', {
					vital_name: metric.name,
					vital_value: metric.value,
					vital_id: metric.id,
				});
			};

			onLCP(captureVital);
			onINP(captureVital);
			onCLS(captureVital);
		}
	}, []);

	return null
}

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
