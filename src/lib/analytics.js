// src/lib/analytics.js
// Helpers to load Google Analytics (gtag) and Google Tag Manager (GTM) on demand.

export const GTAG_ID = "G-Q51H75E0XB";
export const GTM_ID = "GTM-NBW927RM";

// load a script by URL and return a promise that resolves when loaded
export function loadScript(src, { async = true, id } = {}) {
  return new Promise((resolve, reject) => {
    if (id && document.getElementById(id)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.async = async;
    if (id) s.id = id;
    s.onload = () => resolve();
    s.onerror = (e) => reject(e);
    document.head.appendChild(s);
  });
}

/* --------------------------
  Google Analytics (gtag) loader
   - loads gtag.js and configures it
   - idempotent: calling twice is safe
---------------------------*/
export async function enableGTag() {
  if (typeof window === "undefined") return;
  if (window.__gtag_loaded) return;
  await loadScript(`https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`, { async: true, id: `gtag-js-${GTAG_ID}` });

  window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer.push(arguments);}
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GTAG_ID, { anonymize_ip: true });

  window.__gtag_loaded = true;
}

/* --------------------------
  Google Tag Manager loader
   - inserts GTM script and initial dataLayer push
   - idempotent
---------------------------*/
export async function enableGTM() {
  if (typeof window === "undefined") return;
  if (window.__gtm_loaded) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

  const src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  await loadScript(src, { async: true, id: `gtm-js-${GTM_ID}` });

  window.__gtm_loaded = true;
}

/* Optional helper: track manual event via gtag if loaded */
export function gtagEvent(action, params = {}) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag('event', action, params);
  }
}
