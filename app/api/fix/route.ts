import { NextRequest, NextResponse } from 'next/server'
export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: `جاوب بالدارجة المغربية باختصار: ${prompt}` }] }] })
    })
    const data = await res.json()
    if (data.error) return NextResponse.json({ result: "خطأ: " + data.error.message })
    return NextResponse.json({ result: data.candidates?.[0]?.content?.parts?.[0]?.text || "ما لقيتش جواب" })
  } catch (e: any) {
    return NextResponse.json({ result: "خطأ: " + e.message })
  }
}
