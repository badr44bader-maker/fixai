import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const groqKey = process.env.GROQ_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;
    let text = "";

    // جرب Groq الأول حيث خفيف
    if (groqKey) {
      try {
        const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${groqKey}` },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "system", content: "انت خبير إصلاح بالدارجة المغربية" }, { role: "user", content: prompt }],
          })
        });
        const d = await r.json();
        text = d.choices?.[0]?.message?.content;
        if (text) return NextResponse.json({ result: text });
      } catch {}
    }
    // إلا ما خدمش جرب Gemini
    if (geminiKey) {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const d = await r.json();
      text = d.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return NextResponse.json({ result: text });
    }
    return NextResponse.json({ result: "عاود جرب دابا" });
  } catch (e: any) {
    return NextResponse.json({ result: "Error: " + e.message });
  }
}
