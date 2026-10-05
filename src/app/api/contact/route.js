// /src/app/api/contact/route.js
import { NextResponse } from "next/server";
import { sendAutoReply, sendStorageCopy } from "@/lib/contactAutoReply";

/**
 * Allowed keys for the attribution object. Any key not in this list is
 * stripped before forwarding to the CRM. This prevents the client from
 * injecting arbitrary data through the attribution field.
 */
const ALLOWED_ATTRIBUTION_KEYS = new Set([
  "gclid", "gbraid", "wbraid",
  "utmSource", "utmMedium", "utmCampaign", "utmTerm", "utmContent",
  "campaignId", "adgroupId", "creativeId", "targetId",
  "keyword", "matchType", "device", "network",
  "locPhysicalId", "locInterestId",
  "landingPage", "capturedAt",
]);

/** Max length per attribution string value. */
const MAX_ATTR_LENGTH = 2000;

/**
 * Sanitize the attribution object from the client.
 * - Keeps only allowed keys
 * - Trims string values
 * - Caps string length
 * - Converts empty strings to null
 * - Returns null if no valid data remains
 */
function sanitizeAttribution(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;

  const clean = {};
  let hasValue = false;

  for (const key of ALLOWED_ATTRIBUTION_KEYS) {
    const val = raw[key];
    if (val == null) continue;
    if (typeof val !== "string") continue;

    const trimmed = val.trim().slice(0, MAX_ATTR_LENGTH);
    if (trimmed === "") continue;

    clean[key] = trimmed;
    hasValue = true;
  }

  return hasValue ? clean : null;
}

export async function POST(req) {
  try {
    const data = await req.json();
    const internalAppUrl = process.env.INTERNAL_APP_API_URL;
    const internalAppKey = process.env.INTERNAL_APP_API_KEY;

    if (!data.email || !data.name) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Sanitize attribution before forwarding — do not trust the client blindly.
    const attribution = sanitizeAttribution(data.attribution);
    const payload = { ...data, attribution };

    if (attribution) {
      console.log("[contact] Attribution received:", Object.keys(attribution).join(", "));
    }

    // Send lead to internal app
    const res = await fetch(`${internalAppUrl}/api/leads/ingest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": internalAppKey,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.error || "Internal app ingest failed");
    }

    // Send auto-reply and storage copy in parallel (must await on Vercel serverless)
    const emailResults = await Promise.allSettled([
      sendAutoReply(data),
      sendStorageCopy(data),
    ]);
    emailResults.forEach((result, i) => {
      if (result.status === "rejected") {
        const label = i === 0 ? "Auto-reply" : "Storage copy";
        console.error(`${label} email failed:`, result.reason);
      }
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
