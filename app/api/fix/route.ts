import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { prompt } = await req.json()
  try {
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GEMINI || process.env["مفتاح واجهة برمجة تطبيقات GEMINI"] as any

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `أنت معلم مغربي. جاوب بالدارجة قصير مفيد بلا ** و بلا ###. السؤال: ${prompt}` }] }]
      })
    })

    const data = await res.json()
    console.log(data)

    if (data.error) {
      return NextResponse.json({ result: `مشكل فالمفتاح: ${data.error.message}` })
    }

    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || "عاود كتب السؤال"

    return NextResponse.json({ result: result.replace(/\*\*/g,"") })

  } catch (e:any) {
    return NextResponse.json({ result: "سيرفر عامر، تسنا 10 ثواني: " + e.message })
  }
}
