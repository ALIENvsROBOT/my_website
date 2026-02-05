# Deployment & Environment Variables

This document outlines the configuration required to deploy the Gowtham Sridhar Portfolio to GitHub Pages and set up the integrated services (Analytics, Contact Form, SEO).

## 🔐 GitHub Repository Secrets

To ensure the live site functions correctly, you must add the following **Secrets** to your GitHub repository under **Settings → Secrets and variables → Actions**:

| Secret Name | Description |
| :--- | :--- |
| `POSTHOG_KEY` | Your PostHog Project API Key (`phc_...`) |
| `GOOGLE_SITE_VERIFICATION` | Google Search Console verification code |
| `EMAILJS_SERVICE_ID` | EmailJS service ID for the contact form |
| `EMAILJS_TEMPLATE_ID` | EmailJS template ID for the contact form |
| `EMAILJS_PUBLIC_KEY` | EmailJS public key for client-side sending |
| `PUSHBULLET_TOKEN` | (Optional) Pushbullet API token for notifications |

---

## 📊 Analytics Setup (PostHog)

This project uses **PostHog** for open-source analytics, including heatmaps and session replays.

1. **Account**: Create a free account at [PostHog](https://posthog.com/).
2. **Stealth Mode**: The project is configured with "Stealth Mode," meaning tracking only initializes after a human interaction (mouse move, scroll, touch) to avoid bot detection and ensure GDPR compliance.
3. **Data Residency**: Default is set to **EU Cloud**. If using US Cloud, update the `NEXT_PUBLIC_POSTHOG_HOST` in `.github/workflows/deploy.yml`.

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
NEXT_PUBLIC_POSTHOG_KEY=your_phc_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_key
```

## 🚀 Deployment Workflow

The project uses a custom GitHub Action located in `.github/workflows/deploy.yml`. It handles:
1. Installing dependencies with `--legacy-peer-deps`.
2. Injecting secrets into the static build.
3. Exporting the project as a static site (`/out` folder).
4. Deploying to the `gh-pages` branch.
