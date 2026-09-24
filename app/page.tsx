import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "أنت معلم مغربي. جاوب بالدارجة قصير بلا ** و بلا ###. عطي السبب و الحل ف 100 كلمة."
          },
          { role: "user", content: prompt }
        ],
        max_tokens: 300
      })
    })

    if (res.status === 429) {
      return NextResponse.json({ result: "سيرفر عامر دابا، تسنا 20 ثانية و عاود" })
    }

    const data = await res.json()
    const result = data.choices?.[0]?.message?.content || "ما لقيتش الحل، عاود كتب السؤال"

    return NextResponse.json({ result })

  } catch (e) {
    return NextResponse.json({ result: "سيرفر عامر شوية، عاود ورك بعد 10 ثواني" })
  }
}
