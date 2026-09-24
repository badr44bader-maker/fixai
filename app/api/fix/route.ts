import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const key = process.env.GEMINI_API_KEY?.trim();
    if (!key) return NextResponse.json({ result: "المفتاح ما كاينش" });

    const models = ["gemini-3.6-flash", "gemini-3-flash", "gemini-2.0-flash", "gemini-1.5-flash"];

    for (const model of models) {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `أنت خبير إصلاح أجهزة منزلية، جاوب بالعربية ببساطة: ${prompt}` }] }]
        })
      });
      const d = await r.json();
      const t = d.candidates?.[0]?.content?.parts?.[0]?.text;
      if (t) return NextResponse.json({ result: t });
    }

    return NextResponse.json({ result: "جرب مفتاح جديد من aistudio.google.com" });
  } catch (e:any) {
    return NextResponse.json({ result: e.message });
  }
}
