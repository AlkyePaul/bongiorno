/**
 * Google Ads / UTM attribution capture and persistence.
 *
 * ## Attribution Policy
 *
 * - **Last paid Google Ads touch**: when a visitor arrives with a paid click
 *   identifier (gclid, gbraid, wbraid) or a campaign_id, the attribution is
 *   updated — overwriting any previous attribution.
 *
 * - **Direct visits do NOT overwrite**: if the visitor returns without any
 *   paid parameters, the previously stored attribution is preserved.
 *
 * - **30-day cookie window**: attribution is persisted in a first-party cookie
 *   for 30 days. After that it expires naturally.
 *
 * - **Consent-gated**: the cookie is only set when the user has granted
 *   "marketing" consent via the site's cookie banner. Without consent,
 *   attribution is held in memory for the current page session only.
 *
 * ## Cookie details
 *
 * - Name: `_bt_attr`
 * - Domain: first-party (auto)
 * - Path: /
 * - Max-age: 30 days
 * - Content: JSON with attribution fields (no PII)
 */

import { getCookie, setCookie, deleteCookie } from "cookies-next";

const COOKIE_NAME = "_bt_attr";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const CONSENT_COOKIE = "siteCookiePrefs";

/**
 * URL parameter name → attribution object key mapping.
 *
 * The URL uses snake_case (Google Ads ValueTrack macros), while the
 * attribution object uses camelCase for consistency with the rest of the
 * TypeScript codebase.
 */
const PARAM_MAP = {
  gclid: "gclid",
  gbraid: "gbraid",
  wbraid: "wbraid",
  utm_source: "utmSource",
  utm_medium: "utmMedium",
  utm_campaign: "utmCampaign",
  utm_term: "utmTerm",
  utm_content: "utmContent",
  campaign_id: "campaignId",
  adgroup_id: "adgroupId",
  creative_id: "creativeId",
  target_id: "targetId",
  keyword: "keyword",
  match_type: "matchType",
  device: "device",
  network: "network",
  loc_physical_id: "locPhysicalId",
  loc_interest_id: "locInterestId",
};

/**
 * Parameters that indicate a paid Google Ads click. If ANY of these are
 * present in the URL, the attribution is treated as a new paid touch and
 * overwrites whatever was stored before.
 */
const PAID_INDICATORS = ["gclid", "gbraid", "wbraid", "campaign_id"];

// In-memory fallback for sessions without marketing consent.
let memoryAttribution = null;

/**
 * Check if the user has granted marketing cookie consent.
 */
function hasMarketingConsent() {
  try {
    const raw = getCookie(CONSENT_COOKIE);
    if (!raw) return false;
    const prefs = typeof raw === "string" ? JSON.parse(raw) : raw;
    return prefs?.marketing === true;
  } catch {
    return false;
  }
}

/**
 * Parse attribution parameters from the current URL query string.
 *
 * Returns an attribution object if any tracked parameters are found,
 * or null if the URL contains no attribution data.
 *
 * Also captures `landingPage` (pathname without query) and `capturedAt`.
 */
export function captureGoogleAdsAttribution() {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);

  // Check if any paid indicator is present
  const hasPaidParams = PAID_INDICATORS.some((p) => params.has(p));
  if (!hasPaidParams) {
    // No paid click — do not overwrite existing attribution.
    return null;
  }

  const attribution = {};
  let hasAnyValue = false;

  for (const [urlParam, attrKey] of Object.entries(PARAM_MAP)) {
    const value = params.get(urlParam);
    if (value != null && value.trim() !== "") {
      attribution[attrKey] = value.trim();
      hasAnyValue = true;
    }
  }

  if (!hasAnyValue) return null;

  // Add context: landing page (no query string to avoid leaking params)
  // and capture timestamp.
  attribution.landingPage = window.location.pathname;
  attribution.capturedAt = new Date().toISOString();

  return attribution;
}

/**
 * Store attribution data. Uses a first-party cookie if marketing consent
 * has been granted, otherwise keeps the data in memory only.
 */
export function storeAttribution(data) {
  if (!data) return;

  memoryAttribution = data;

  if (hasMarketingConsent()) {
    try {
      setCookie(COOKIE_NAME, JSON.stringify(data), {
        maxAge: COOKIE_MAX_AGE,
        path: "/",
        sameSite: "lax",
      });
    } catch (err) {
      console.error("[attribution] Failed to set cookie:", err);
    }
  }
}

/**
 * Retrieve stored attribution data. Reads from cookie first, falls back
 * to in-memory storage.
 *
 * Returns the attribution object or null if none is stored.
 */
export function getStoredAttribution() {
  // Try cookie first
  try {
    const raw = getCookie(COOKIE_NAME);
    if (raw) {
      const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (parsed && typeof parsed === "object") {
        memoryAttribution = parsed;
        return parsed;
      }
    }
  } catch {
    // Cookie read/parse failed — fall through to memory
  }

  return memoryAttribution;
}

/**
 * Remove stored attribution (cookie + memory).
 */
export function clearAttribution() {
  memoryAttribution = null;
  try {
    deleteCookie(COOKIE_NAME, { path: "/" });
  } catch {
    // Ignore — cookie may not exist
  }
}

/**
 * Main entry point: capture attribution from URL if present, persist it,
 * and return the current attribution (new or previously stored).
 *
 * Called by the AttributionProvider on every page load.
 */
export function syncAttribution() {
  const captured = captureGoogleAdsAttribution();
  if (captured) {
    storeAttribution(captured);
    return captured;
  }
  // No new paid click — return whatever is already stored.
  return getStoredAttribution();
}

/**
 * Re-persist in-memory attribution to cookie. Called when consent changes
 * (user grants marketing consent after attribution was already captured).
 */
export function persistIfConsented() {
  if (memoryAttribution && hasMarketingConsent()) {
    storeAttribution(memoryAttribution);
  }
}
