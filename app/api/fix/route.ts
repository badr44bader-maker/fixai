import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    const groqKey = process.env.GROQ_API_KEY || (process.env as any)["GROQ"]
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GEMINI || (process.env as any)["مفتاح واجهة برمجة تطبيقات GEMINI"]

    // 1- نجربو GROQ الأول حيت هو السريع
    if (groqKey) {
      try {
        const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: { "Authorization": `Bearer ${groqKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: `جاوب بالدارجة المغربية قصير ومفيد بلا ** : ${prompt}` }],
            temperature: 0.7
          })
        })
        const d = await r.json()
        if (d.choices?.[0]?.message?.content) {
          return NextResponse.json({ result: d.choices[0].message.content })
        }
      } catch {}
    }

    // 2- الى GROQ ما خدمش، نجربو GEMINI بموديل خدام 100%
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `جاوب بالدارجة المغربية قصير ومفيد: ${prompt}` }] }]
        })
      }
    )
    const data = await res.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (text) return NextResponse.json({ result: text })

    return NextResponse.json({ result: `باقي الضغط: ${data.error?.message || "عاود"}` })

  } catch (e:any) {
    return NextResponse.json({ result: "عاود جرب دابا: " + e.message })
  }
}
