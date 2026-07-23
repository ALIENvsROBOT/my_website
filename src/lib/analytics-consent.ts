'use client'

export type AnalyticsConsent = 'granted' | 'denied' | null

export const ANALYTICS_CONSENT_KEY = 'analytics-consent:v1'
export const ANALYTICS_CONSENT_EVENT = 'analytics-consent-changed'
export const ANALYTICS_TRACK_EVENT = 'analytics-track'

export type AnalyticsProperties = Record<string, string | number | boolean>

export function getAnalyticsConsent(): AnalyticsConsent {
	try {
		const consent = window.localStorage.getItem(ANALYTICS_CONSENT_KEY)
		return consent === 'granted' || consent === 'denied' ? consent : null
	} catch {
		return null
	}
}

export function setAnalyticsConsent(consent: Exclude<AnalyticsConsent, null>) {
	try {
		window.localStorage.setItem(ANALYTICS_CONSENT_KEY, consent)
	} catch {
		// Tracking remains disabled when browser storage is unavailable.
		return
	}

	window.dispatchEvent(new CustomEvent<AnalyticsConsent>(ANALYTICS_CONSENT_EVENT, { detail: consent }))
}

/** Dispatches a semantic event. The provider drops it until analytics consent is active. */
export function trackAnalyticsEvent(event: string, properties: AnalyticsProperties = {}) {
	window.dispatchEvent(new CustomEvent(ANALYTICS_TRACK_EVENT, { detail: { event, properties } }))
}
