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
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = String(now.getFullYear());
    const HH = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");

    const payload = {
      ...data,
      source: "bongiorno web - " + data.locale,
      date: `${dd}/${mm}/${yyyy}`,
      time: `${HH}:${min}`,
    
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
