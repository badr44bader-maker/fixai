import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const key = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
    if (!key) return NextResponse.json({ result: "ما كاينش API KEY" });

    const models = [
      "gemini-1.5-flash-8b",
      "gemini-2.0-flash-lite",
      "gemini-2.0-flash",
      "gemini-flash-latest"
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
        const text = d.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return NextResponse.json({ result: text });
        }
        // الى كان Error ديال الضغط، جرب الموديل اللي موراه نيشان
        if (d.error?.message?.includes("high demand") || d.error?.message?.includes("quota")) {
          continue;
        }
      } catch {}
    }

    return NextResponse.json({ result: "السيرفر عامر دابا، عاود جرب من هنا 10 ثواني، راه خدام غير خاصك تعاود" });

  } catch (e: any) {
    return NextResponse.json({ result: "Error: " + e.message });
  }
}
