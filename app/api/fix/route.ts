import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const groqKey = process.env.GROQ_API_KEY?.trim();
    if (!groqKey) return NextResponse.json({ result: "GROQ_API_KEY ما كاينش" });

    const models = ["llama3-8b-8192", "llama-3.3-70b-versatile", "mixtral-8x7b-32768"];

    for (const model of models) {
      const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${groqKey}` },
        body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }] })
      });
      const d = await r.json();
      if (d.choices?.[0]?.message?.content) {
        return NextResponse.json({ result: d.choices[0].message.content });
      }
    }

    return NextResponse.json({ result: "جرب Gemini - Groq ما بغاش" });
  } catch (e:any) { return NextResponse.json({ result: "Error: "+e.message }); }
}
