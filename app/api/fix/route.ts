import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()
    const key = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY
    if (!key) {
      return NextResponse.json({ result: "ما كاينش API KEY فـ Vercel" })
    }
    const r = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    })
    const d = await r.json()
    if (d.error) {
        return NextResponse.json({ result: JSON.stringify(d) })
    }
    const answer = d.candidates?.[0]?.content?.parts?.[0]?.text || "ما جاوبش"
    return NextResponse.json({ result: answer })
  } catch (e: any) {
    return NextResponse.json({ result: "Error: " + e.message })
  }
}
