import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const key = process.env.GEMINI_API_KEY?.trim();
    if (!key) return NextResponse.json({ result: "❌ GEMINI_API_KEY ما كاينش ف Vercel" });

    // الموديلات الجداد ديال 2026
    const models = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-2.5-pro"];

    for (const model of models) {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `أنت خبير إصلاح أجهزة منزلية. جاوب بالعربية ببساطة: ${prompt}` }] }]
        })
      });
      const d = await r.json();
      const t = d.candidates?.[0]?.content?.parts?.[0]?.text;
      if (t) return NextResponse.json({ result: t });
    }

    return NextResponse.json({ result: "ما خدمش - سير aistudio.google.com و دير مفتاح جديد" });
  } catch (e:any) {
    return NextResponse.json({ result: "Error: " + e.message });
  }
}
