'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef, useState } from 'react'
import { onCLS, onINP, onLCP } from 'web-vitals'
import {
	ANALYTICS_CONSENT_EVENT,
	ANALYTICS_TRACK_EVENT,
	getAnalyticsConsent,
	type AnalyticsProperties,
	type AnalyticsConsent,
} from '@/lib/analytics-consent'

let posthogInitiated = false

const POSTHOG_DEFAULTS_DATE = '2026-05-30'
const SENSITIVE_PROPERTY_NAMES = new Set([
	'$elements',
	'$elements_chain',
	'$el_text',
])

function getPostHogConfig() {
	const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN?.trim()
		|| process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim()
	const host = process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim()

	if (!token || !host) return null

	try {
		const url = new URL(host)
		if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) return null
		const ingestionHosts: Record<string, string> = {
			'eu.posthog.com': 'eu.i.posthog.com',
			'us.posthog.com': 'us.i.posthog.com',
			'app.posthog.com': 'us.i.posthog.com',
		}
		if (ingestionHosts[url.hostname] && url.pathname !== '/') return null
		url.hostname = ingestionHosts[url.hostname] || url.hostname
		return { token, host: url.origin + url.pathname.replace(/\/$/, '') }
	} catch {
		return null
	}
}

function getPagePath(pathname: string | null) {
	return pathname || '/'
}

function getReferrerDomain() {
	if (!document.referrer) return 'direct'

	try {
		return new URL(document.referrer).hostname
	} catch {
		return 'unknown'
	}
}

function getSectionId(element: Element | null) {
	const section = element?.closest('section[id], section[aria-labelledby]')
	if (!section) return 'none'
	return section.id || section.getAttribute('aria-labelledby') || 'unnamed'
}

function getCampaignProperties(search: string) {
	if (!search) return {}

	const searchParams = new URLSearchParams(search)
	const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign'] as const
	return campaignKeys.reduce<Record<string, string>>((properties, key) => {
		const value = searchParams.get(key)?.trim()
		if (value && /^[A-Za-z0-9._-]{1,100}$/.test(value)) properties[key] = value
		return properties
	}, {})
}

function capture(event: string, properties: AnalyticsProperties) {
	if (getAnalyticsConsent() === 'granted' && posthogInitiated && !posthog.has_opted_out_capturing()) {
		posthog.capture(event, properties)
	}
}

function sanitizeUrl(value: unknown, referrer = false) {
	if (typeof value !== 'string' || !value) return ''
	try {
		const url = new URL(value)
		if (url.protocol !== 'https:' && url.protocol !== 'http:') return ''
		return referrer ? url.origin : url.origin + url.pathname
	} catch {
		return ''
	}
}

function initializePostHog() {
	if (typeof window === 'undefined' || getAnalyticsConsent() !== 'granted') return false
	if (posthogInitiated) return true

	const config = getPostHogConfig()
	if (!config) {
		console.warn('[Analytics] PostHog is disabled: configure the project token and HTTPS ingestion host at build time.')
		return false
	}

	posthog.init(config.token, {
		api_host: config.host,
		defaults: POSTHOG_DEFAULTS_DATE,
		opt_out_capturing_by_default: true,
		opt_out_persistence_by_default: true,
		respect_dnt: true,
		capture_pageview: false,
		capture_pageleave: true,
		capture_performance: { web_vitals: true, network_timing: false },
		autocapture: {
			dom_event_allowlist: ['click'],
			element_allowlist: ['a', 'button'],
			capture_copied_text: false,
		},
		mask_all_text: true,
		mask_all_element_attributes: true,
		capture_heatmaps: { flush_interval_milliseconds: 5000 },
		disable_session_recording: false,
		enable_recording_console_log: false,
		session_recording: {
			maskAllInputs: true,
			blockSelector: 'form, [contenteditable="true"], .ph-no-capture',
			recordHeaders: false,
			recordBody: false,
			captureCanvas: { recordCanvas: false },
		},
		capture_exceptions: false,
		disable_surveys: true,
		save_campaign_params: false,
		save_referrer: false,
		debug: false,
		person_profiles: 'identified_only',
		property_denylist: Array.from(SENSITIVE_PROPERTY_NAMES),
		before_send: (event) => {
			if (!event || getAnalyticsConsent() !== 'granted') return null
			// Keep PostHog's dashboard properties while removing query strings and fragments.
			for (const properties of [event.properties, event.$set_once, event.$set]) {
				if (!properties) continue
				for (const key of ['$current_url', '$initial_current_url', '$session_entry_url', '$session_exit_url']) {
					if (key in properties) properties[key] = sanitizeUrl(properties[key])
				}
				for (const key of ['$referrer', '$initial_referrer']) {
					if (key in properties) properties[key] = sanitizeUrl(properties[key], true)
				}
			}
			for (const key of Array.from(SENSITIVE_PROPERTY_NAMES)) delete event.properties[key]
			return event
		},
	})

	posthogInitiated = posthog.__loaded
	return posthogInitiated
}

function PostHogAnalytics(): null {
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const [consent, setConsent] = useState<AnalyticsConsent>(null)
	const pagePath = getPagePath(pathname)
	const search = searchParams?.toString() ?? ''
	const lastPageview = useRef<string | null>(null)
	const vitalsStarted = useRef(false)

	useEffect(() => {
		setConsent(getAnalyticsConsent())

		const handleConsentChange = (event: Event) => {
			const nextConsent = (event as CustomEvent<AnalyticsConsent>).detail
			setConsent(nextConsent)

			if (nextConsent === 'denied' && posthogInitiated) {
				posthog.stopSessionRecording()
				posthog.opt_out_capturing()
				lastPageview.current = null
			}
		}

		const handleTrackedEvent = (event: Event) => {
			const detail = (event as CustomEvent<{ event: string; properties: AnalyticsProperties }>).detail
			if (detail?.event) capture(detail.event, detail.properties)
		}

		window.addEventListener(ANALYTICS_CONSENT_EVENT, handleConsentChange)
		window.addEventListener(ANALYTICS_TRACK_EVENT, handleTrackedEvent)
		return () => {
			window.removeEventListener(ANALYTICS_CONSENT_EVENT, handleConsentChange)
			window.removeEventListener(ANALYTICS_TRACK_EVENT, handleTrackedEvent)
		}
	}, [])

	useEffect(() => {
		if (consent === 'granted' && initializePostHog()) {
			posthog.opt_in_capturing({ captureEventName: false })
		}
	}, [consent])

	useEffect(() => {
		if (consent !== 'granted' || !posthogInitiated) return

		const pageviewKey = `${pagePath}?${search}`
		if (lastPageview.current === pageviewKey) return
		lastPageview.current = pageviewKey
		const properties = {
			page_path: pagePath,
			page_title: document.title.slice(0, 160),
			referrer_domain: getReferrerDomain(),
			$referrer: sanitizeUrl(document.referrer, true),
			$referring_domain: document.referrer ? getReferrerDomain() : '$direct',
			...getCampaignProperties(search),
		}
		capture('$pageview', properties)
		// Preserve existing custom insights while enabling the built-in Web Analytics dashboard.
		capture('page_viewed', properties)
	}, [consent, pagePath, search])

	useEffect(() => {
		if (consent !== 'granted' || !posthogInitiated) return

		const observedSections = new Set<string>()
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return
				const sectionId = getSectionId(entry.target)
				if (observedSections.has(sectionId)) return
				observedSections.add(sectionId)
				capture('section_viewed', { page_path: pagePath, section_id: sectionId })
				observer.unobserve(entry.target)
			})
		}, { threshold: 0.4 })

		document.querySelectorAll('section[id], section[aria-labelledby]').forEach((section) => observer.observe(section))
		return () => observer.disconnect()
	}, [consent, pagePath])

	useEffect(() => {
		if (consent !== 'granted' || !posthogInitiated) return

		let visibleSince = document.visibilityState === 'visible' ? Date.now() : null
		let engagedMs = 0
		let maxScrollDepth = 0
		let reported = false

		const updateEngagement = () => {
			if (visibleSince !== null) {
				engagedMs += Date.now() - visibleSince
				visibleSince = null
			}
		}

		const updateScrollDepth = () => {
			const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
			if (scrollableHeight <= 0) return
			const depth = Math.min(100, Math.round((window.scrollY / scrollableHeight) * 100))
			maxScrollDepth = Math.max(maxScrollDepth, depth)
		}

		const reportEngagement = (exitReason: 'pagehide' | 'route_change') => {
			if (reported) return
			reported = true
			updateEngagement()
			updateScrollDepth()
			if (engagedMs < 1000 && maxScrollDepth === 0) return
			capture('page_engagement_completed', {
				page_path: pagePath,
				engaged_seconds: Math.round(engagedMs / 1000),
				max_scroll_depth_percent: maxScrollDepth,
				exit_reason: exitReason,
			})
		}

		const handleVisibilityChange = () => {
			if (document.visibilityState === 'visible') {
				visibleSince = Date.now()
			} else {
				updateEngagement()
			}
		}

		const handlePageHide = () => reportEngagement('pagehide')

		window.addEventListener('scroll', updateScrollDepth, { passive: true })
		document.addEventListener('visibilitychange', handleVisibilityChange)
		window.addEventListener('pagehide', handlePageHide, { once: true })

		return () => {
			window.removeEventListener('scroll', updateScrollDepth)
			document.removeEventListener('visibilitychange', handleVisibilityChange)
			window.removeEventListener('pagehide', handlePageHide)
			reportEngagement('route_change')
		}
	}, [consent, pagePath])

	useEffect(() => {
		if (consent !== 'granted' || !posthogInitiated) return

		const handleClick = (event: MouseEvent) => {
			const target = event.target as Element | null
			const link = target?.closest('a[href]') as HTMLAnchorElement | null
			const button = target?.closest('button') as HTMLButtonElement | null

			if (button) {
				capture('control_clicked', {
					page_path: pagePath,
					section_id: getSectionId(button),
					control_id: button.dataset.analyticsId || button.getAttribute('aria-label') || button.id || button.type || 'button',
				})
			}

			if (!link) return

			const destination = new URL(link.href, window.location.origin)
			const isDownload = /\.(pdf|zip|docx?|xlsx?|pptx?)$/i.test(destination.pathname)

			if (isDownload) {
				capture('file_download_clicked', {
					page_path: pagePath,
					link_id: link.dataset.analyticsId || 'download',
					file_extension: destination.pathname.split('.').pop()?.toLowerCase() ?? 'unknown',
				})
			}

			if (destination.origin !== window.location.origin) {
				const destinationType = destination.protocol === 'mailto:' ? 'email' : 'external'
				capture('outbound_link_clicked', {
					page_path: pagePath,
					section_id: getSectionId(link),
					link_id: link.dataset.analyticsId || 'external',
					destination_host: destinationType === 'email' ? 'mailto' : destination.hostname,
					destination_type: destinationType,
				})
			} else {
				capture('internal_navigation_clicked', {
					page_path: pagePath,
					section_id: getSectionId(link),
					link_id: link.dataset.analyticsId || 'navigation',
					destination_path: `${destination.pathname}${destination.hash}`,
				})
			}
		}

		const handleCopy = () => {
			capture('content_copied', {
				page_path: pagePath,
				selected_text_length: window.getSelection()?.toString().trim().length ?? 0,
			})
		}

		let errorEventsSent = 0
		const captureError = (errorType: 'error' | 'unhandled_rejection') => {
			if (errorEventsSent >= 5) return
			errorEventsSent += 1
			capture('frontend_error_observed', { page_path: pagePath, error_type: errorType })
		}
		const handleError = () => captureError('error')
		const handleUnhandledRejection = () => captureError('unhandled_rejection')

		document.addEventListener('click', handleClick)
		document.addEventListener('copy', handleCopy)
		window.addEventListener('error', handleError)
		window.addEventListener('unhandledrejection', handleUnhandledRejection)

		return () => {
			document.removeEventListener('click', handleClick)
			document.removeEventListener('copy', handleCopy)
			window.removeEventListener('error', handleError)
			window.removeEventListener('unhandledrejection', handleUnhandledRejection)
		}
	}, [consent, pagePath])

	useEffect(() => {
		if (consent !== 'granted' || !posthogInitiated || vitalsStarted.current) return
		vitalsStarted.current = true

		const captureVital = (metric: { name: string; value: number; rating: string }) => {
			capture('web_vital_measured', {
				page_path: window.location.pathname,
				metric_name: metric.name,
				metric_value: Math.round(metric.value * 1000) / 1000,
				metric_rating: metric.rating,
			})
		}

		onLCP(captureVital)
		onINP(captureVital)
		onCLS(captureVital)
	}, [consent])

	return null
}

export function PHProvider({ children }: { children: React.ReactNode }) {
	return (
		<PostHogProvider client={posthog}>
			<Suspense fallback={null}>
				<PostHogAnalytics />
			</Suspense>
			{children}
		</PostHogProvider>
	)
}
