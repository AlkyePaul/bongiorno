// components/common/CookieConsent.js
"use client";

import { useState, useEffect } from "react";
import { getCookie, setCookie } from "cookies-next";
import { useTranslations, useLocale } from "next-intl";
import { enableGTag, enableGTM, setDefaultConsent, updateConsentFromPrefs } from "@/lib/analytics";
import { Cog } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function CookieConsent() {
  const t = useTranslations("cookies");
  const locale = useLocale();
  const [visible, setVisible] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [showFab, setShowFab] = useState(false);
  const [prefs, setPrefs] = useState({
    essential: true, // always true (non-toggleable)
    analytics: false,
    marketing: false,
  });

  // cookie name
  const COOKIE_NAME = "siteCookiePrefs";
  const COOKIE_MAX_AGE = 60 * 60 * 24 * 180; // 6 months

  useEffect(() => {
    setDefaultConsent();
    const raw = getCookie(COOKIE_NAME);
    try {
      if (raw) {
        const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
        console.log("[consent] loaded prefs:", parsed);
        setPrefs((p) => ({ ...p, ...parsed }));
        updateConsentFromPrefs(parsed);
        if (parsed.analytics) {
          enableGTag().catch(console.error);
        }
        if (parsed.marketing) {
          enableGTM().catch(console.error);
        }
        setVisible(false);
        setShowFab(true);
      } else {
        setVisible(true);
        setShowFab(false);
        console.log("[consent] no prefs found -> showing banner");
      }
    } catch (err) {
      setVisible(true);
      setShowFab(false);
      console.error("cookie parse error", err);
    }
  }, []);

  function savePrefs(newPrefs) {
    const toStore = { ...newPrefs, essential: true };
    setCookie(COOKIE_NAME, JSON.stringify(toStore), { maxAge: COOKIE_MAX_AGE, path: "/" });
    setPrefs(toStore);
    setVisible(false);
    setShowCustom(false);
    setShowFab(true);
    console.log("[consent] saved prefs:", toStore);

    updateConsentFromPrefs(toStore);
    if (toStore.analytics) {
      enableGTag().catch(console.error);
    }
    if (toStore.marketing) {
      enableGTM().catch(console.error);
    }
  }

  const acceptAll = () => {
    console.log("[consent] action: acceptAll");
    savePrefs({ essential: true, analytics: true, marketing: true });
  };
  const rejectAll = () => {
    console.log("[consent] action: rejectAll");
    savePrefs({ essential: true, analytics: false, marketing: false });
  };

  // toggle a single category in the customize panel
  const toggleCategory = (key) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
  };

  return (
    <>
      {/* Floating Settings Button (appears after preferences are set) */}
      {showFab && !visible && (
        <button
          type="button"
          aria-label="Cookie preferences"
          onClick={() => {
            console.log("[consent] open customize via FAB");
            setShowCustom(true);
          }}
          className="fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded-full px-3 py-2 bg-white border border-gray-200 shadow hover:shadow-md text-gray-700"
        >
          <Cog className="w-5 h-5" />
          <span className="text-base hidden sm:inline">{t("customize")}</span>
        </button>
      )}

      {/* Banner */}
      {visible && (
        <div className="fixed bottom-4 inset-x-4 z-50 flex justify-center max-w-[90vw]">
          <div className="max-w-4xl w-full bg-white border border-gray-200 rounded-2xl shadow-lg p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1 text-base text-gray-700">
              <p className="font-semibold">{t("title")}</p>
              <p className="mt-1">{t("text")}</p>
              <div className="mt-2 text-xs text-gray-500">
                <Link href="/privacy" className="underline">{t("privacyLink")}</Link>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                className="px-3 py-2 rounded-md border border-gray-300 text-gray-700"
                onClick={() => setShowCustom(true)}
              >
                {t("customize")}
              </button>

              <button
                className="px-3 py-2 rounded-md bg-gray-100 text-gray-900"
                onClick={rejectAll}
              >
                {t("decline")}
              </button>

              <button
                className="px-3 py-2 rounded-md bg-brand-accent text-white"
                onClick={acceptAll}
              >
                {t("accept")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customize Drawer */}
      {showCustom && (
        <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCustom(false)} />
          <div className="relative max-w-2xl w-full bg-white rounded-xl shadow-xl p-6 z-10">
            <h3 className="text-lg font-semibold mb-3">{t("customizeTitle")}</h3>
            <p className="text-base text-gray-600 mb-4">{t("customizeText")}</p>

            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium">{t("categories.essential.title")}</div>
                  <div className="text-xs text-gray-500">{t("categories.essential.desc")}</div>
                </div>
                <div className="text-base text-gray-500">Required</div>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium">{t("categories.analytics.title")}</div>
                  <div className="text-xs text-gray-500">{t("categories.analytics.desc")}</div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={prefs.analytics}
                    onChange={() => toggleCategory("analytics")}
                    className="h-5 w-5"
                  />
                </label>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium">{t("categories.marketing.title")}</div>
                  <div className="text-xs text-gray-500">{t("categories.marketing.desc")}</div>
                </div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={prefs.marketing}
                    onChange={() => toggleCategory("marketing")}
                    className="h-5 w-5"
                  />
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button className="px-3 py-2 rounded-md border" onClick={() => setShowCustom(false)}>
                {t("cancel")}
              </button>
              <button
                className="px-4 py-2 rounded-md bg-brand-accent text-white"
                onClick={() => savePrefs(prefs)}
              >
                {t("save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
