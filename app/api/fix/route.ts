import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const key = process.env.GEMINI_API_KEY?.trim();
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const d = await r.json();
    if (d.error) return NextResponse.json({ result: `Google قال: ${d.error.message}` });
    return NextResponse.json({ result: d.candidates?.[0]?.content?.parts?.[0]?.text || "خاوي" });
  } catch (e:any) { return NextResponse.json({ result: e.message }); }
}
