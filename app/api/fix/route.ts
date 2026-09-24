import { NextResponse } from "next/server"
export async function POST(req: Request) {
  const { prompt } = await req.json()
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "جاوب بالدارجة المغربية قصير و مفيد بلا ** " },
          { role: "user", content: prompt }
        ],
        max_tokens: 400
      })
    })

    const data = await res.json()

    if (!res.ok) {
      console.log(data)
      return NextResponse.json({ result: "المفتاح خاسر، سير لـ Vercel و عاود دير GROQ_API_KEY" })
    }

    return NextResponse.json({ result: data.choices[0].message.content })
  } catch (e) {
    return NextResponse.json({ result: "سيرفر عامر، عاود بعد 10 ثواني" })
  }
}
