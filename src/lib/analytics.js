// src/lib/analytics.js
// Helpers to load Google Analytics (gtag) and Google Tag Manager (GTM) on demand.

export const GTAG_ID = "G-Q51H75E0XB";
export const GTM_ID = "GTM-NBW927RM";
export const CONSENT_DEFAULTS = {
  ad_storage: "denied",
  analytics_storage: "denied",
  functionality_storage: "denied",
  personalization_storage: "denied",
  security_storage: "granted",
};
export function setDefaultConsent() {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function () { window.dataLayer.push(arguments); };
  }
  if (!window.__consent_default_pushed) {
    window.gtag('consent', 'default', { ...CONSENT_DEFAULTS });
    window.__consent_default_pushed = true;
    console.log("[analytics] Consent default set", CONSENT_DEFAULTS);
  }
}
export function updateConsentFromPrefs(prefs) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function () { window.dataLayer.push(arguments); };
  }
  const update = {
    ...CONSENT_DEFAULTS,
    analytics_storage: prefs?.analytics ? 'granted' : 'denied',
    ad_storage: prefs?.marketing ? 'granted' : 'denied',
  };
  window.gtag('consent', 'update', update);
  console.log("[analytics] Consent updated from prefs", update);
}

// load a script by URL and return a promise that resolves when loaded
export function loadScript(src, { async = true, id } = {}) {
  return new Promise((resolve, reject) => {
    if (id && document.getElementById(id)) {
      console.log(`[analytics] script already present: ${id}`);
      return resolve();
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = async;
    if (id) s.id = id;
    console.log("[analytics] injecting script:", src);
    s.onload = () => {
      console.log("[analytics] script loaded:", id || src);
      resolve();
    };
    s.onerror = (e) => {
      console.error("[analytics] script failed:", id || src, e);
      reject(e);
    };
    document.head.appendChild(s);
  });
}

/* --------------------------
  Google Analytics (gtag) loader
   - loads gtag.js and configures it
   - idempotent: calling twice is safe
---------------------------*/
export async function enableGTag() {
  if (typeof window === "undefined") {
    console.log("[analytics] enableGTag skipped (SSR)");
    return;
  }
  if (window.__gtag_loaded) {
    console.log("[analytics] gtag already enabled");
    return;
  }
  console.log("[analytics] enabling gtag", GTAG_ID);
  setDefaultConsent();
  await loadScript(`https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`, { async: true, id: `gtag-js-${GTAG_ID}` });

  window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer.push(arguments);} 
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GTAG_ID, { anonymize_ip: true });

  window.__gtag_loaded = true;
  console.log("[analytics] gtag enabled");
}

/* --------------------------
  Google Tag Manager loader
   - inserts GTM script and initial dataLayer push
   - idempotent
---------------------------*/
export async function enableGTM() {
  if (typeof window === "undefined") {
    console.log("[analytics] enableGTM skipped (SSR)");
    return;
  }
  if (window.__gtm_loaded) {
    console.log("[analytics] GTM already enabled");
    return;
  }

  window.dataLayer = window.dataLayer || [];
  setDefaultConsent();
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

  const src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  await loadScript(src, { async: true, id: `gtm-js-${GTM_ID}` });

  window.__gtm_loaded = true;
  console.log("[analytics] GTM enabled", GTM_ID);
}

/* Optional helper: track manual event via gtag if loaded */
export function gtagEvent(action, params = {}) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag('event', action, params);
    console.log("[analytics] gtag event:", action, params);
  }
}
