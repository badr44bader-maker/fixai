import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const key = process.env.GEMINI_API_KEY?.trim();
    const models = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.0-flash"];

    for (const model of models) {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `أنت فني إصلاح. أجب باختصار بالعربية: ${prompt}` }] }],
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
          ]
        })
      });
      const d = await r.json();
      const t = d.candidates?.[0]?.content?.parts?.[0]?.text;
      if (t) {
        const clean = t.replace(/\*\*/g, '').replace(/###/g, '');
        return NextResponse.json({ result: clean });
      }
    }

    return NextResponse.json({ result: "جرب سؤال آخر - مثلا: المكيف لا يبرد ما السبب؟" });
  } catch (e:any) { return NextResponse.json({ result: "Error: "+e.message }); }
}
