# Deployment & Environment Variables

This document outlines the configuration required to deploy the Gowtham Sridhar Portfolio to GitHub Pages and set up the integrated services (Analytics, Contact Form, SEO).

## 🔐 GitHub Repository Secrets

To ensure the live site functions correctly, you must add the following **Secrets** to your GitHub repository under **Settings → Secrets and variables → Actions**:

| Secret Name | Description |
| :--- | :--- |
| `POSTHOG_KEY` | Your PostHog Project API Key (`phc_...`) |
| `POSTHOG_HOST` | Your PostHog ingestion host. Use `https://eu.i.posthog.com` for EU residency or `https://us.i.posthog.com` for US residency. |
| `GOOGLE_SITE_VERIFICATION` | Google Search Console verification code |
| `EMAILJS_SERVICE_ID` | EmailJS service ID for the contact form |
| `EMAILJS_TEMPLATE_ID` | EmailJS template ID for the contact form |
| `EMAILJS_PUBLIC_KEY` | EmailJS public key for client-side sending |
| `PUSHBULLET_TOKEN` | (Optional) Pushbullet API token for notifications |

---

## 📊 Analytics Setup (PostHog)

This project uses **PostHog** for consent-based Web Analytics and product events, link/button click autocapture, and heatmaps. Session recording is disabled. It keeps existing custom events for contact and project insights.

1. **Account**: Create a free account at [PostHog](https://posthog.com/).
2. **Consent**: PostHog starts only after **Accept analytics**; visitors can reject or later revoke the preference from `/privacy`. Previous acceptance requires a new choice because heatmaps have been added. Do Not Track is respected.
3. **Data Residency**: Set `POSTHOG_HOST` to your project region. No default host is used, so a missing host disables analytics instead of silently sending data to the wrong region.
4. **IP policy**: In PostHog, set **Settings → Project → General → IP data capture** to **Discard IP addresses**. This cannot be controlled by the static site build.
5. **Schema**: See [analytics.md](./analytics.md) for the complete event/property contract and data boundaries.

The deployment maps your existing `POSTHOG_KEY` secret to `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`; no secret rename is needed. It validates the token format and host before building, without logging either value. Known EU/US dashboard host origins are converted to their ingestion origins by the client; use the ingestion host directly in settings. A missing host or invalid token now fails deployment instead of publishing a site with disabled analytics.

### Verify after deploying

1. In PostHog, keep **Record user sessions** off and check **Billing & usage** for the free-plan allowance. Keep IP data capture set to **Discard IP addresses**.
2. Open the live site in a fresh browser with tracking extensions disabled and Do Not Track off, then select **Accept analytics**. Navigate to another page and click a project link.
3. In PostHog **Activity**, check for `$pageview`, `page_viewed`, and click events in the last hour. Web Analytics uses `$pageview`; old custom-only pageviews do not populate it.
4. In browser Network tools, check event delivery to the configured ingestion host. A `200` response can still report `quota_limited`; check Billing & usage if data does not appear. Never share request payloads containing the project token.
5. Reject analytics at `/privacy`, then navigate again. No new capture or recording should occur. If requests are blocked by a browser extension, consider [PostHog's managed proxy](https://posthog.com/docs/advanced/proxy) and use its supplied host in `POSTHOG_HOST`; GitHub Pages cannot run a Next.js server rewrite.

GitHub Secrets are build-time settings for this static site. Changes to them require a new deployment. The SDK uses a public project token; never put a PostHog personal API key in a `NEXT_PUBLIC_` variable. Sources: [Next.js setup](https://posthog.com/docs/libraries/next-js), [API response/quota behavior](https://posthog.com/docs/api), [pricing and free allowances](https://posthog.com/pricing).

---

## 🔍 SEO & Answer Engine Optimization (AEO)

The site is optimized for both traditional search and AI-based answer engines (ChatGPT, Google AI Overview).

1. **Google Search Console**: 
   - Verify your property at [GSC](https://search.google.com/search-console).
   - Use the **HTML Tag** method and paste the string into the `GOOGLE_SITE_VERIFICATION` secret.
2. **Robots & Sitemap**: These are served from `public/robots.txt` and `public/sitemap.xml` and configured to allow AI crawlers (`GPTBot`, `Google-Extended`) while protecting private paths.

---

## 🛠️ Local Environment Setup

For local development, create a `.env.local` file in the root directory. **Never commit this file to Git.**

```bash
# Example .env.local
NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=your_phc_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_key
```

`NEXT_PUBLIC_POSTHOG_KEY` remains supported for existing deployments, but `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` is the preferred name from the current PostHog documentation.

## 🚀 Deployment Workflow

In GitHub **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions**. Do not publish the raw `main` branch root: it does not contain the built `out` site and can compete with the deployment workflow. This setting was corrected for the live repository on October 6, 2026.

The project uses a custom GitHub Action located in `.github/workflows/deploy.yml`. It handles:
1. Installing dependencies with `--legacy-peer-deps`.
2. Injecting secrets into the static build.
3. Exporting the project as a static site (`/out` folder).
4. Deploying the exported artifact with GitHub Pages Actions.
