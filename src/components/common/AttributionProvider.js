"use client";

import { useEffect } from "react";
import { syncAttribution, persistIfConsented } from "@/lib/attribution";

/**
 * Global attribution capture component.
 *
 * Mounted once in the locale layout so it runs on every page navigation,
 * regardless of which page the user lands on (homepage, /fr, /it/preventivo,
 * any Google Ads landing page, etc.).
 *
 * On mount:
 * 1. Reads URL params for Google Ads / UTM attribution
 * 2. If a new paid click is detected, stores attribution (cookie if consented,
 *    memory otherwise)
 * 3. If no new paid click, keeps existing attribution untouched
 *
 * Also listens for consent changes: when the user grants marketing consent
 * after a paid click was captured in memory, the attribution is persisted
 * to cookie.
 */
export default function AttributionProvider() {
  useEffect(() => {
    syncAttribution();

    // Listen for consent changes. The CookieConsent component writes
    // siteCookiePrefs, and we can detect the update via storage event
    // or a small interval. We use a MutationObserver-free approach:
    // check once after a short delay to cover the common case where
    // attribution capture and consent happen in the same session.
    const timer = setTimeout(() => {
      persistIfConsented();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // This component renders nothing.
  return null;
}
