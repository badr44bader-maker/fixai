import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()
    const key = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY
    if (!key) {
      return NextResponse.json({ result: "❌ ما كاين حتى KEY فـ Vercel" })
    }
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: `جاوب بالدارجة المغربية بحل عملي مختصر لهاد المشكل: ${prompt}` }] }] })
    })
    const d = await r.json()
    const answer = d.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(d)
    return NextResponse.json({ result: answer })
  } catch (e: any) {
    return NextResponse.json({ result: "خطأ: " + e.message })
  }
}
