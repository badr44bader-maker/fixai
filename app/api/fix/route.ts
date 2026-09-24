import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()
    
    if (!prompt) {
      return NextResponse.json({ result: "كتب السؤال عافاك" })
    }

    // كيقرا المفتاح سواء كان بالعربية ولا بالإنجليزية
    const apiKey = 
      process.env.GEMINI_API_KEY || 
      process.env.GEMINI ||
      (process.env as any)["مفتاح واجهة برمجة تطبيقات GEMINI"] ||
      (process.env as any)["GEMINI_API_KEY"]

    if (!apiKey) {
      return NextResponse.json({ result: "مكاينش المفتاح ف Vercel" })
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `أنت معلم إصلاح مغربي محترف. جاوب بالدارجة المغربية فقط. جواب قصير، مفيد، بلا نجوم ** و بلا ###. السؤال هو: ${prompt}`
                }
              ]
            }
          ]
        })
      }
    )

    const data = await response.json()

    if (data.error) {
      return NextResponse.json({ result: `خطأ من Google: ${data.error.message}` })
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      return NextResponse.json({ result: "ماجاش الجواب، عاود جرب" })
    }

    return NextResponse.json({ result: text })

  } catch (error: any) {
    return NextResponse.json({ result: `مشكل تقني: ${error.message}` })
  }
}
