import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const groqKey = process.env.GROQ_API_KEY?.trim();
    const geminiKey = process.env.GEMINI_API_KEY?.trim();

    if (!groqKey) return NextResponse.json({ result: "❌ GROQ_API_KEY ما كاينش ف Vercel - سير Settings > Env Vars و تأكد درتي Add for Production" });

    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${groqKey}` },
      body: JSON.stringify({ model: "llama-3.1-8b-instant", messages: [{ role: "user", content: prompt }] })
    });
    const d = await r.json();

    if (d.error) return NextResponse.json({ result: `❌ Groq قال: ${d.error.message} | المفتاح يبدا بـ ${groqKey.slice(0,15)}` });
    if (d.choices?.[0]?.message?.content) return NextResponse.json({ result: d.choices[0].message.content });

    // جرب Gemini الى Groq ما جاوبش
    if (geminiKey) {
      const r2 = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const d2 = await r2.json();
      if (d2.candidates?.[0]?.content?.parts?.[0]?.text) return NextResponse.json({ result: d2.candidates[0].content.parts[0].text });
      return NextResponse.json({ result: `Gemini Error: ${JSON.stringify(d2).slice(0,200)}` });
    }

    return NextResponse.json({ result: `Groq جاوب بلا نتيجة: ${JSON.stringify(d).slice(0,200)}` });
  } catch (e:any) { return NextResponse.json({ result: "Error: "+e.message }); }
}
