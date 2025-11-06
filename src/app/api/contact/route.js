// /src/app/api/contact/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const data = await req.json();
    const zapierHook = process.env.ZAPIER_HOOK_URL;

    if (!data.email || !data.name) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // ➕ Tag di tipo per differenziare nel foglio Zapier
    const payload = {
      ...data,
      source: "bongiorno italia",
      date: new Date().toISOString(),
    };

    const res = await fetch(zapierHook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Zapier hook failed");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Contact form error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
