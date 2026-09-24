import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const prompt = body.prompt

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ result: "❌ الـ API KEY ما كاينش فـ Vercel. سير لـ Settings -> Environment Variables و زيد OPENAI_API_KEY" })
    }

    // import هنا باش ما يكراشيش إلا ما كاينش openai
    const OpenAI = (await import('openai')).default
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'جاوب بالدارجة المغربية، حل عملي مختصر.' },
        { role: 'user', content: prompt }
      ]
    })

    return NextResponse.json({ result: completion.choices[0].message.content })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ result: "خطأ فالسيرفر: " + (e.message || e.toString()) })
  }
}
