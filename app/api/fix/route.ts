import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()
    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI || (process.env as any)["مفتاح واجهة برمجة تطبيقات GEMINI"]

    if (!apiKey) return NextResponse.json({ result: "مكاينش المفتاح ف Vercel" })

    const models = [
      "gemini-1.5-flash",
      "gemini-1.5-flash-8b",
      "gemini-2.0-flash-lite",
      "gemini-1.5-pro"
    ]

    let finalText = null
    let lastError = ""

    for (const model of models) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: `جاوب بالدارجة المغربية قصير ومفيد بلا ** : ${prompt}` }] }]
            })
          }
        )
        const data = await res.json()
        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
          finalText = data.candidates[0].content.parts[0].text
          break
        } else {
          lastError = data.error?.message || JSON.stringify(data).slice(0,100)
        }
      } catch (e:any) {
        lastError = e.message
      }
    }

    if (finalText) {
      return NextResponse.json({ result: finalText })
    } else {
      return NextResponse.json({ result: `كاع الموديلات عامرين دابا، عاود بعد دقيقة. آخر خطأ: ${lastError}` })
    }

  } catch (e:any) {
    return NextResponse.json({ result: "خطأ: " + e.message })
  }
}
