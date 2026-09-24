import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const groqKey = process.env.GROQ_API_KEY?.trim();
    if (!groqKey) return NextResponse.json({ result: "GROQ_API_KEY ما كاينش - دير Redeploy" });
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${groqKey}` },
      body: JSON.stringify({ model: "llama-3.1-8b-instant", messages: [{ role: "user", content: prompt }] })
    });
    const d = await r.json();
    if (d.error) return NextResponse.json({ result: "Groq: "+d.error.message });
    return NextResponse.json({ result: d.choices?.[0]?.message?.content || "ما كاين جواب" });
  } catch (e:any) { return NextResponse.json({ result: "Error: "+e.message }); }
}
