import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const gKey = process.env.GEMINI_API_KEY?.trim();
    const groqKey = process.env.GROQ_API_KEY?.trim();

    // 1 - Gemini 3.6 هو السريع
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${gKey}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const d = await r.json();
      const t = d.candidates?.[0]?.content?.parts?.[0]?.text;
      if (t) return NextResponse.json({ result: t });
    } catch {}

    // 2 - الى Gemini عامر، Groq كينقذك
    if (groqKey) {
      const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${groqKey}` },
        body: JSON.stringify({ model: "llama-3.1-8b-instant", messages: [{ role: "user", content: prompt }] })
      });
      const d = await r.json();
      const t = d.choices?.[0]?.message?.content;
      if (t) return NextResponse.json({ result: t });
    }

    return NextResponse.json({ result: "سيرفر عامر شوية، عاود ورك بعد 10 ثواني" });
  } catch (e:any) {
    return NextResponse.json({ result: "عاود جرب: " + e.message });
  }
}
