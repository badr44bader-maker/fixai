import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const key = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
    if (!key) return NextResponse.json({ result: "ما كاينش KEY" });

    const models = ["gemini-1.5-flash-8b","gemini-2.0-flash-lite","gemini-flash-latest"];

    for (const model of models) {
      for (let i=0; i<2; i++) {
        try {
          const r = await fetch(`https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
          });
          const d = await r.json();
          const text = d.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) return NextResponse.json({ result: text });
          await new Promise(res => setTimeout(res, 2000));
        } catch {}
      }
    }
    return NextResponse.json({ result: "السيرفر عامر، تسنى 1 دقيقة و عاود جرب، راه غادي يخدم" });
  } catch (e:any) {
    return NextResponse.json({ result: "Error: "+e.message });
  }
}
