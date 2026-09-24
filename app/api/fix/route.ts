import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const groqKey = process.env.GROQ_API_KEY?.trim();
    const geminiKey = process.env.GEMINI_API_KEY?.trim();

    // 1 - نجربو Groq هو الأول (خدام ديما)
    if (groqKey) {
      const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${groqKey}` },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: `أنت خبير إصلاح، جاوب بالعربية ببساطة: ${prompt}` }]
        })
      });
      const d = await r.json();
      const t = d.choices?.[0]?.message?.content;
      if (t) return NextResponse.json({ result: t });
    }

    // 2 - الى Groq ما كاينش نجربو Gemini v1
    if (geminiKey) {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const d = await r.json();
      const t = d.candidates?.[0]?.content?.parts?.[0]?.text;
      if (t) return NextResponse.json({ result: t });
      return NextResponse.json({ result: "خطأ Gemini: " + (d.error?.message || "مفتاح خاطئ") });
    }

    return NextResponse.json({ result: "خاصك تزيد GROQ_API_KEY ف Vercel" });
  } catch (e:any) {
    return NextResponse.json({ result: "Error: " + e.message });
  }
      }
