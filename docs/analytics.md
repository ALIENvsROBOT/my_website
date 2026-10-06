# Analytics event schema

Analytics is optional. PostHog initializes only after a visitor selects **Accept analytics**, then opts that browser in. The `analytics-consent:v2` preference covers analytics and heatmaps. Visitors who accepted the previous policy must choose again; previous rejections remain respected. Do Not Track blocks capture even after acceptance.

## Data boundaries

- After consent, Web Analytics, click heatmaps, and link/button click autocapture are enabled. Session recording is disabled in both the SDK and project settings: portfolio trends and contact funnels provide the needed information without recordings. Console logs, network headers/bodies, and canvas contents are not recorded.
- Analytics event URL properties retain only origin and path. Referrer URLs retain only origin. Element text and attributes are masked, and element trees are dropped before events are sent. No form values, selected text, or visitor names/emails are intentionally collected. Only URL-safe `utm_source`, `utm_medium`, and `utm_campaign` labels are added by the application.
- The PostHog host is required. Use `https://eu.i.posthog.com` for EU data residency; the application will not silently fall back to the US host.
- Visitors can decline on the banner or change/revoke their choice on the Privacy Policy page. Revocation opts the browser out of all subsequent PostHog capture.
- In PostHog, set **Settings → Project → General → IP data capture** to **Discard IP addresses**. This is an account-level setting and cannot be enforced from the static site.

## Events

| Event | Purpose | Properties |
| --- | --- | --- |
| `$pageview` | Populate the built-in Web Analytics dashboard and page paths. | Sanitized `$current_url`, SDK device/session properties, `page_path`, `page_title`, `referrer_domain`, optional UTM source/medium/campaign |
| `page_viewed` | Preserve existing custom pageview insights. | Same safe application properties as `$pageview` |
| `$pageleave`, `$autocapture`, `$web_vitals`, `$$heatmap` | Native page duration/scroll, link/button clicks, performance, and heatmaps. | SDK-managed properties, with the boundaries above; `$$heatmap` carries `$heatmap_data`. |
| `section_viewed` | Measure which named content sections are actually read. | `page_path`, `section_id` |
| `page_engagement_completed` | Measure meaningful time and scroll depth per page. | `page_path`, `engaged_seconds`, `max_scroll_depth_percent`, `exit_reason` |
| `internal_navigation_clicked` | Understand navigation journeys within the portfolio. | `page_path`, `section_id`, `link_id`, `destination_path` |
| `control_clicked` | Measure all button/control usage without reading button text. | `page_path`, `section_id`, `control_id` |
| `outbound_link_clicked` | See which external destination category visitors chose. | `page_path`, `section_id`, `link_id`, `destination_host`, `destination_type` |
| `file_download_clicked` | Measure portfolio/document downloads. | `page_path`, `link_id`, `file_extension` |
| `content_copied` | Measure copy interactions without recording copied text. | `page_path`, `selected_text_length` |
| `about_tab_selected` | Identify the biography content visitors choose. | `tab_name` |
| `project_card_toggled` / `project_list_toggled` | Measure project discovery and expansion intent. | project/list identifier and resulting state |
| `contact_form_*` | Funnel: started, validation failed, attempted, succeeded, or failed. | `form_name` only |
| `web_vital_measured` | Monitor client performance. | `page_path`, `metric_name`, `metric_value`, `metric_rating` |
| `frontend_error_observed` | Count client errors without recording error content. | `page_path`, `error_type` |

Native SDK events include browser, device, and session metadata. Standard URL properties are sanitized rather than removed because Web Analytics and Paths rely on them. The custom events remain available for existing insights. After consent, `person_profiles: 'always'` creates People profiles using unnamed browser IDs; the app does not call `identify` or collect names/emails. Browser IDs represent browsers, not a guaranteed count of individual people.

Pageviews update profile properties without sending additional `$set` events: `last_page_path`, browser/version, OS/version, device type, and valid campaign source/medium/name. `first_page_path`, `first_referrer_domain`, and `$initial_utm_*` are set once. Existing URL/referrer sanitization also covers SDK person metadata.

In **Settings → Product analytics**, enable **Person last seen tracking**, then use **People → Configure columns → Last seen** and sort newest first. This project setting was enabled on October 6, 2026. The built-in Last seen value updates hourly; use Activity for exact event timestamps. Old visitors appear when they return and consent; missing historical person properties cannot be reconstructed.

## Useful free-plan views

1. **Web Analytics**: visitors, pageviews, top paths, sources/UTMs, devices, and performance. Set `contact_form_submit_succeeded` as a conversion goal.
2. **Contact funnel**: `$pageview` → `contact_form_started` → `contact_form_submit_attempted` → `contact_form_submit_succeeded`. Use `contact_form_validation_failed` and `contact_form_submit_failed` to investigate failures.
3. **Project interest**: trends for `project_card_toggled`, `project_list_toggled`, and `outbound_link_clicked`, broken down by their project/link properties.
4. **Engagement and reliability**: `section_viewed`, `page_engagement_completed`, `file_download_clicked`, `web_vital_measured`, and `frontend_error_observed`. Error events count failures without exposing error messages.
5. **Click heatmaps**: inspect where visitors click on key portfolio pages. Keep **Record user sessions** off; heatmaps work independently of replay.

As checked on October 6, 2026, the free plan includes **1 million analytics events** and **5,000 recordings per month**. The first million events are free whether or not they process person profiles; after that, events with profiles cost more on paid plans. Replay remains disabled. The no-card free plan drops additional data after a product reaches its allowance; allowances reset monthly. Check Billing & usage and leave the account on the no-card free plan for a hard spending boundary. The application cannot enforce an account-wide monthly quota. Historical missing events cannot be reconstructed.

Sources: [Web Analytics setup](https://posthog.com/docs/web-analytics/start-here), [dashboard requirements](https://posthog.com/docs/web-analytics/dashboard), [Next.js integration](https://posthog.com/docs/libraries/next-js), [People and Last seen](https://posthog.com/docs/data/persons), [profiles and free allowance](https://posthog.com/docs/data/anonymous-vs-identified-events), [pricing](https://posthog.com/pricing).
