import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const key = process.env.GEMINI_API_KEY?.trim();
    if (!key) return NextResponse.json({ result: "❌ GEMINI_API_KEY ما كاينش ف Vercel" });

    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const d = await r.json();

    if (d.error) return NextResponse.json({ result: `❌ Google قال: ${d.error.message}` });
    const t = d.candidates?.[0]?.content?.parts?.[0]?.text;
    if (t) return NextResponse.json({ result: t });

    return NextResponse.json({ result: `❌ Google جاوب هكا: ${JSON.stringify(d).slice(0,400)}` });
  } catch (e:any) { return NextResponse.json({ result: "Error: "+e.message }); }
}
