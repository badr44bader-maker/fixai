import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const groqKey = process.env.GROQ_API_KEY?.trim();
    const geminiKey = process.env.GEMINI_API_KEY?.trim();

    // 1- جرب Groq (خدام ديما)
    if (groqKey) {
      try {
        const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${groqKey}` },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [{ role: "user", content: prompt }]
          })
        });
        const d = await r.json();
        if (d.choices?.[0]?.message?.content) {
          return NextResponse.json({ result: d.choices[0].message.content });
        }
      } catch {}
    }

    // 2- جرب Gemini
    if (geminiKey) {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const d = await r.json();
      const t = d.candidates?.[0]?.content?.parts?.[0]?.text;
      if (t) return NextResponse.json({ result: t });
    }

    return NextResponse.json({ result: "عاود جرب دابا" });
  } catch (e:any) { return NextResponse.json({ result: "Error: "+e.message }); }
}
