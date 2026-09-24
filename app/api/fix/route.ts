import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const key = process.env.GEMINI_API_KEY?.trim();

    // نجربو v1 مع الموديلات الجداد
    const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest"];

    for (const model of models) {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: `جاوب بالعربية ببساطة: ${prompt}` }] }] })
      });
      const d = await r.json();
      const t = d.candidates?.[0]?.content?.parts?.[0]?.text;
      if (t) return NextResponse.json({ result: t });
    }

    return NextResponse.json({ result: "ما خدمش - بدل المفتاح من aistudio.google.com" });
  } catch (e:any) { return NextResponse.json({ result: e.message }); }
}
