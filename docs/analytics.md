# Analytics event schema

Analytics is optional and starts only after a visitor selects **Accept analytics**. PostHog loads in an opted-out state so it can immediately honour a later preference, but sends no analytics events before that choice.

## Data boundaries

- No session replay, heatmaps, autocapture, form-input values, selected text, full URLs, arbitrary URL query strings, click text, email addresses, or user identification are collected. Only URL-safe `utm_source`, `utm_medium`, and `utm_campaign` values are allowed as campaign properties.
- The PostHog host is required. Use `https://eu.i.posthog.com` for EU data residency; the application will not silently fall back to the US host.
- Visitors can decline on the banner or change/revoke their choice on the Privacy Policy page. Revocation opts the browser out of all subsequent PostHog capture.
- In PostHog, set **Settings → Project → General → IP data capture** to **Discard IP addresses**. This is an account-level setting and cannot be enforced from the static site.

## Events

| Event | Purpose | Properties |
| --- | --- | --- |
| `page_viewed` | Understand which portfolio page was visited and the high-level acquisition source. | `page_path`, `page_title`, `referrer_domain`, optional UTM source/medium/campaign |
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

Only the listed properties are intentionally sent by the application. PostHog's default full URL and referrer properties are removed before capture; use `page_path` and `referrer_domain` instead.
