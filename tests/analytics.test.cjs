const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { test } = require('node:test')
const { pathToFileURL } = require('node:url')
const ts = require('typescript')

const root = path.resolve(__dirname, '..')

function loadModule(relativePath, context, requireModule, extraExports = '') {
	const source = fs.readFileSync(path.join(root, relativePath), 'utf8')
	const compiled = ts.transpileModule(source, {
		compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
	}).outputText
	const exports = {}
	vm.runInNewContext(compiled + extraExports, { ...context, exports, require: requireModule })
	return exports
}

function setup(stored = {}, env = {}) {
	const storage = new Map(Object.entries(stored))
	const window = {
		localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
		dispatchEvent() {},
	}
	const context = {
		window, URL, URLSearchParams, console: { warn() {} },
		process: { env: { NEXT_PUBLIC_POSTHOG_KEY: 'phc_test_only', NEXT_PUBLIC_POSTHOG_HOST: 'https://eu.i.posthog.com', ...env } },
	}
	const consent = loadModule('src/lib/analytics-consent.ts', context, () => ({}))
	let optedOut = true
	const captured = []
	const sdk = {
		__loaded: false,
		init(token, config) { this.config = config; this.__loaded = true },
		has_opted_out_capturing: () => optedOut,
		capture(event, properties) {
			const result = this.config.before_send({ event, properties: { ...properties } })
			if (result) captured.push(result)
		},
	}
	const provider = loadModule('src/app/providers.tsx', context, name => {
		if (name === 'posthog-js') return { default: sdk }
		if (name === '@/lib/analytics-consent') return consent
		return {}
	}, '\nexports.testApi = { getPostHogConfig, initializePostHog, capture, sanitizeUrl };')
	return { consent, api: provider.testApi, sdk, storage, captured, optIn: () => { optedOut = false } }
}

test('new collection policy requires renewed acceptance and preserves rejection', () => {
	assert.equal(setup({ 'analytics-consent:v1': 'granted' }).consent.getAnalyticsConsent(), null)
	assert.equal(setup({ 'analytics-consent:v1': 'denied' }).consent.getAnalyticsConsent(), 'denied')
	assert.equal(setup({ 'analytics-consent:v2': 'granted' }).consent.getAnalyticsConsent(), 'granted')
})

test('SDK never initializes or captures without current consent', () => {
	for (const choice of [undefined, 'denied']) {
		const state = setup(choice ? { 'analytics-consent:v2': choice } : {})
		assert.equal(state.api.initializePostHog(), false)
		state.api.capture('$pageview', {})
		assert.equal(state.sdk.__loaded, false)
		assert.equal(state.captured.length, 0)
	}
})

test('empty preferred token uses existing secret name and preserves host region', () => {
	const state = setup({}, { NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN: ' ', NEXT_PUBLIC_POSTHOG_HOST: 'https://eu.posthog.com/' })
	assert.equal(state.api.getPostHogConfig().token, 'phc_test_only')
	assert.equal(state.api.getPostHogConfig().host, 'https://eu.i.posthog.com')
	assert.equal(setup({}, { NEXT_PUBLIC_POSTHOG_HOST: 'https://us.posthog.com' }).api.getPostHogConfig().host, 'https://us.i.posthog.com')
})

test('invalid host disables collection without exposing settings', () => {
	for (const host of ['', 'not-a-url', 'http://eu.i.posthog.com', 'https://user:password@eu.i.posthog.com', 'https://eu.i.posthog.com?token=test']) {
		assert.equal(setup({}, { NEXT_PUBLIC_POSTHOG_HOST: host }).api.getPostHogConfig(), null)
	}
})

test('standard pageviews retain safe dashboard URLs and drop element content', () => {
	const state = setup({ 'analytics-consent:v2': 'granted' })
	assert.equal(state.api.initializePostHog(), true)
	state.optIn()
	state.api.capture('$pageview', {
		$current_url: 'https://example.com/projects?email=private#secret',
		$referrer: 'https://referrer.com/private?email=private',
		$referring_domain: 'referrer.com',
		$elements: [{ text: 'private' }],
		page_path: '/projects',
	})
	assert.equal(state.captured[0].event, '$pageview')
	assert.equal(state.captured[0].properties.$current_url, 'https://example.com/projects')
	assert.equal(state.captured[0].properties.$referrer, 'https://referrer.com')
	assert.equal(state.captured[0].properties.$referring_domain, 'referrer.com')
	assert.equal('$elements' in state.captured[0].properties, false)
})

test('revocation blocks custom and native events immediately, including stale callbacks', () => {
	const state = setup({ 'analytics-consent:v2': 'granted' })
	state.api.initializePostHog()
	state.optIn()
	state.storage.set('analytics-consent:v2', 'denied')
	state.api.capture('contact_form_started', {})
	assert.equal(state.captured.length, 0)
	assert.equal(state.sdk.config.before_send({ event: '$autocapture', properties: {} }), null)
})

test('SDK initial metadata cannot leak the original query string', () => {
	const state = setup({ 'analytics-consent:v2': 'granted' })
	state.api.initializePostHog()
	const result = state.sdk.config.before_send({
		event: '$pageview', properties: {},
		$set_once: { $current_url: 'https://example.com/?email=private', $referrer: 'https://referrer.com/private?token=private' },
	})
	assert.equal(result.$set_once.$current_url, 'https://example.com/')
	assert.equal(result.$set_once.$referrer, 'https://referrer.com')
})

test('replay, heatmaps and native metrics are enabled with form/network masking', () => {
	const state = setup({ 'analytics-consent:v2': 'granted' })
	state.api.initializePostHog()
	const config = state.sdk.config
	assert.equal(config.disable_session_recording, false)
	assert.equal(config.capture_heatmaps.flush_interval_milliseconds, 5000)
	assert.equal(config.session_recording.maskAllInputs, true)
	assert.ok(config.session_recording.blockSelector.includes('form'))
	assert.equal(config.session_recording.recordHeaders, false)
	assert.equal(config.session_recording.recordBody, false)
	assert.equal(config.enable_recording_console_log, false)
	assert.equal(config.capture_performance.web_vitals, true)
	assert.equal(config.respect_dnt, true)
})

test('deployment validator rejects absent/unsafe settings and accepts the existing secret mapping', async () => {
	const { validatePostHogConfig } = await import(pathToFileURL(path.join(root, 'scripts/validate-posthog-config.mjs')))
	assert.throws(() => validatePostHogConfig({}), /POSTHOG_KEY/)
	assert.throws(() => validatePostHogConfig({ NEXT_PUBLIC_POSTHOG_KEY: 'phx_not_a_public_token' }), /POSTHOG_KEY/)
	const env = { NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN: 'phc_test_only', NEXT_PUBLIC_POSTHOG_HOST: 'https://eu.i.posthog.com' }
	assert.doesNotThrow(() => validatePostHogConfig(env))
	assert.throws(() => validatePostHogConfig({ ...env, NEXT_PUBLIC_POSTHOG_HOST: 'https://eu.posthog.com/project/1' }), /dashboard/)
})
