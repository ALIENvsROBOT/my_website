import { pathToFileURL } from 'node:url'

export function validatePostHogConfig(env) {
	const token = env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN?.trim() || env.NEXT_PUBLIC_POSTHOG_KEY?.trim()
	if (!token || !/^phc_[A-Za-z0-9_-]+$/.test(token)) {
		throw new Error('POSTHOG_KEY must contain the public project token from PostHog project settings.')
	}

	let host
	try {
		host = new URL(env.NEXT_PUBLIC_POSTHOG_HOST?.trim())
	} catch {
		throw new Error('POSTHOG_HOST must contain a valid HTTPS ingestion URL for your project region.')
	}
	if (host.protocol !== 'https:' || host.username || host.password || host.search || host.hash) {
		throw new Error('POSTHOG_HOST must use HTTPS without credentials, query strings, or fragments.')
	}
	if (['eu.posthog.com', 'us.posthog.com', 'app.posthog.com'].includes(host.hostname) && host.pathname !== '/') {
		throw new Error('POSTHOG_HOST must be the ingestion host, not a PostHog dashboard page URL.')
	}
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	try {
		validatePostHogConfig(process.env)
		console.log('PostHog build configuration is valid. Values are not logged.')
	} catch (error) {
		console.error(error.message)
		process.exitCode = 1
	}
}
