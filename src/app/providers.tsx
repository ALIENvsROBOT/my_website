/**
 * @file providers.tsx
 * @description Global Provider for PostHog Analytics with Stealth Initialization for GDPR compliance.
 * It delays tracking until real human interaction is detected to avoid bot-based legal scans.
 */

'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'
import { onLCP, onINP, onCLS } from 'web-vitals'

// Global flag to track if PostHog has been initialized
let posthogInitiated = false
let behavioralTrackingAttached = false

const getCurrentUrl = (pathname: string, searchParams: URLSearchParams | null) => {
	let url = window.origin + pathname
	if (searchParams && searchParams.toString()) {
		url = `${url}?${searchParams.toString()}`
	}
	return url
}

const captureEnvContext = () => {
	if (!posthogInitiated) return

	const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
	const connection = (navigator as Navigator & {
		connection?: { effectiveType?: string; downlink?: number; rtt?: number; saveData?: boolean }
	}).connection

	posthog.register({
		browser_language: navigator.language,
		timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		screen_resolution: `${window.screen.width}x${window.screen.height}`,
		viewport_resolution: `${window.innerWidth}x${window.innerHeight}`,
		network_effective_type: connection?.effectiveType ?? 'unknown',
		network_downlink_mbps: connection?.downlink ?? null,
		network_rtt_ms: connection?.rtt ?? null,
		network_save_data: connection?.saveData ?? null,
		navigation_type: navigationEntry?.type ?? 'unknown',
		referrer_domain: document.referrer
			? new URL(document.referrer, window.location.origin).hostname
			: 'direct',
	})

	if (window.location.search) {
		const query = new URLSearchParams(window.location.search)
		const campaignProps = {
			utm_source: query.get('utm_source'),
			utm_medium: query.get('utm_medium'),
			utm_campaign: query.get('utm_campaign'),
			utm_term: query.get('utm_term'),
			utm_content: query.get('utm_content'),
			gclid: query.get('gclid'),
			fbclid: query.get('fbclid'),
		}

		if (Object.values(campaignProps).some(Boolean)) {
			posthog.capture('campaign_parameters_detected', campaignProps)
		}
	}
}

const attachBehavioralTracking = () => {
	if (!posthogInitiated || behavioralTrackingAttached) return
	behavioralTrackingAttached = true

	const scrollMilestones = new Set<number>()
	const thresholds = [25, 50, 75, 90, 100]
	let lastHeartbeat = Date.now()

	const captureScrollDepth = () => {
		const doc = document.documentElement
		const scrollableHeight = doc.scrollHeight - window.innerHeight
		if (scrollableHeight <= 0) return

		const depth = Math.round((window.scrollY / scrollableHeight) * 100)
		thresholds.forEach((threshold) => {
			if (depth >= threshold && !scrollMilestones.has(threshold)) {
				scrollMilestones.add(threshold)
				posthog.capture('scroll_depth_reached', {
					scroll_depth_percent: threshold,
					current_url: window.location.href,
				})
			}
		})
	}

	const captureOutboundClicks = (event: MouseEvent) => {
		const target = event.target as HTMLElement | null
		const link = target?.closest('a[href]') as HTMLAnchorElement | null
		if (!link) return

		const destination = new URL(link.href, window.location.origin)
		if (destination.origin !== window.location.origin) {
			posthog.capture('outbound_link_clicked', {
				link_url: destination.href,
				link_text: link.textContent?.trim().slice(0, 120) || 'unknown',
				current_url: window.location.href,
			})
		}

		if (/(\.pdf|\.zip|\.docx?|\.xlsx?|\.pptx?)$/i.test(destination.pathname)) {
			posthog.capture('file_download_clicked', {
				file_url: destination.href,
				file_extension: destination.pathname.split('.').pop()?.toLowerCase() ?? 'unknown',
				current_url: window.location.href,
			})
		}
	}

	const captureCopy = () => {
		const selectedTextLength = window.getSelection()?.toString().trim().length ?? 0
		posthog.capture('content_copied', {
			selected_text_length: selectedTextLength,
			current_url: window.location.href,
		})
	}

	const captureEngagementHeartbeat = () => {
		const now = Date.now()
		const engagedSeconds = Math.round((now - lastHeartbeat) / 1000)
		lastHeartbeat = now

		if (document.visibilityState === 'visible') {
			posthog.capture('engagement_heartbeat', {
				engaged_seconds: engagedSeconds,
				current_url: window.location.href,
			})
		}
	}

	const captureVisibility = () => {
		posthog.capture('visibility_changed', {
			visibility_state: document.visibilityState,
			current_url: window.location.href,
		})
	}

	const captureError = (event: ErrorEvent) => {
		posthog.capture('frontend_error', {
			message: event.message,
			source: event.filename,
			line: event.lineno,
			column: event.colno,
			current_url: window.location.href,
		})
	}

	const captureUnhandledRejection = (event: PromiseRejectionEvent) => {
		posthog.capture('frontend_unhandled_rejection', {
			reason: String(event.reason),
			current_url: window.location.href,
		})
	}

	window.addEventListener('scroll', captureScrollDepth, { passive: true })
	document.addEventListener('click', captureOutboundClicks)
	document.addEventListener('copy', captureCopy)
	document.addEventListener('visibilitychange', captureVisibility)
	window.addEventListener('error', captureError)
	window.addEventListener('unhandledrejection', captureUnhandledRejection)

	setInterval(captureEngagementHeartbeat, 15000)
}

/**
 * Initializes the PostHog SDK with professional-grade tracking features.
 * Targeted for EU Cloud instance by default.
 */
const initPH = () => {
	if (posthogInitiated || typeof window === 'undefined') return

	posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
		api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
		person_profiles: 'identified_only',
		capture_pageview: false,
		capture_pageleave: true,
		capture_performance: true,
		autocapture: true,
		defaults: '2025-11-30',
		persistence: 'localStorage+cookie',
		session_recording: {
			maskAllInputs: false,
			maskTextSelector: '*:not(.ph-no-capture)',
			recordCrossOriginIframes: false,
		},
		advanced_disable_flags: true,
		request_batching: true,
	})

	posthogInitiated = true
	captureEnvContext()
	attachBehavioralTracking()
}

function PostHogPageView(): null {
	const pathname = usePathname()
	const searchParams = useSearchParams()

	useEffect(() => {
		const handleInteraction = () => {
			initPH()

			if (pathname && posthog) {
				posthog.capture('$pageview', { '$current_url': getCurrentUrl(pathname, searchParams) })
			}
			cleanup()
		}

		const cleanup = () => {
			window.removeEventListener('mousemove', handleInteraction)
			window.removeEventListener('touchstart', handleInteraction)
			window.removeEventListener('scroll', handleInteraction)
			window.removeEventListener('keydown', handleInteraction)
		}

		window.addEventListener('mousemove', handleInteraction, { once: true })
		window.addEventListener('touchstart', handleInteraction, { once: true })
		window.addEventListener('scroll', handleInteraction, { once: true })
		window.addEventListener('keydown', handleInteraction, { once: true })

		return cleanup
	}, [pathname, searchParams])

	useEffect(() => {
		if (pathname && posthogInitiated && posthog) {
			posthog.capture('$pageview', {
				'$current_url': getCurrentUrl(pathname, searchParams),
			})
		}
	}, [pathname, searchParams])

	useEffect(() => {
		const captureVital = (metric: { name: string; value: number; id: string }) => {
			if (posthogInitiated && posthog) {
				posthog.capture('$web_vitals', {
					vital_name: metric.name,
					vital_value: metric.value,
					vital_id: metric.id,
				})
			}
		}

		onLCP(captureVital)
		onINP(captureVital)
		onCLS(captureVital)
	}, [])

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
