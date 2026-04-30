// /src/app/api/contact/route.js
import { NextResponse } from "next/server";
import { sendAutoReply, sendStorageCopy } from "@/lib/contactAutoReply";

export async function POST(req) {
  try {
    const data = await req.json();

    if (!data.email || !data.name) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const appApiUrl = process.env.INTERNAL_APP_API_URL;
    const appApiKey = process.env.INTERNAL_APP_API_KEY;

    const res = await fetch(`${appApiUrl}/api/leads/ingest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": appApiKey,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`App ingest failed (${res.status}): ${body}`);
    }

    const emailResults = await Promise.allSettled([
      sendAutoReply(data),
      sendStorageCopy(data),
    ]);
    emailResults.forEach((result, i) => {
      if (result.status === "rejected") {
        const label = i === 0 ? "Auto-reply" : "Storage copy";
        console.error(`❌ ${label} email failed:`, result.reason);
      }
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Contact form error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
