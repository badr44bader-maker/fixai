import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const key = process.env.GEMINI_API_KEY?.trim();
    if (!key) return NextResponse.json({ result: "❌ GEMINI_API_KEY ما كاينش" });

    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `أنت خبير إصلاح أجهزة منزلية. أجب بالعربية ببساطة ووضوح بدون رموز ** أو ###. السؤال: ${prompt}`
          }]
        }]
      })
    });

    const d = await r.json();
    let t = d.candidates?.[0]?.content?.parts?.[0]?.text;

    if (t) {
      t = t.replace(/\*\*\*/g, '').replace(/\*\*/g, '').replace(/###/g, '').replace(/\*\s/g, '• ');
      return NextResponse.json({ result: t });
    }

    return NextResponse.json({ result: "ما جاوبش - عاود جرب" });
  } catch (e:any) {
    return NextResponse.json({ result: "Error: "+e.message });
  }
}
