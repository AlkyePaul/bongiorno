// /src/app/api/contact/route.js
import { NextResponse } from "next/server";
import { sendAutoReply, sendStorageCopy } from "@/lib/contactAutoReply";

export async function POST(req) {
  try {
    const data = await req.json();
    const internalAppUrl = process.env.INTERNAL_APP_API_URL;
    const internalAppKey = process.env.INTERNAL_APP_API_KEY;

    if (!data.email || !data.name) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Send lead to internal app (replaces Zapier)
    const res = await fetch(`${internalAppUrl}/api/leads/ingest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": internalAppKey,
      },
      body: JSON.stringify(data),
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
