import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { prompt } = await req.json()
  try {
    const key = process.env.GEMINI_API_KEY || process.env.GEMINI || (process.env as any)["مفتاح واجهة برمجة تطبيقات GEMINI"]

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `أنت خبير إصلاح مغربي. جاوب بالدارجة المغربية فقط، بلا ** و بلا ###، جواب قصير ومفيد. السؤال: ${prompt}` }] }]
      })
    })

    const data = await res.json()
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!result) {
      return NextResponse.json({ result: `باقي مشكل: ${JSON.stringify(data).slice(0,200)}` })
    }

    return NextResponse.json({ result })

  } catch (e:any) {
    return NextResponse.json({ result: "خطأ: " + e.message })
  }
}
