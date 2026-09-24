import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const key = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
    if (!key) return NextResponse.json({ result: "ما كاينش API KEY" });

    const models = [
      "gemini-2.0-flash",
      "gemini-2.0-flash-lite",
      "gemini-flash-latest",
      "gemini-3.6-flash"
    ];

    for (const model of models) {
      try {
        const r = await fetch(
          `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${key}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
          }
        );
        const d = await r.json();
        if (d.candidates?.[0]?.content?.parts?.[0]?.text) {
          return NextResponse.json({ result: d.candidates[0].content.parts[0].text });
        }
      } catch {}
    }

    return NextResponse.json({ result: "جرب تاني دابا، السيرفر عامر شوية" });

  } catch (e: any) {
    return NextResponse.json({ result: "Error: " + e.message });
  }
}
