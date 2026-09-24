import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const groqKey = process.env.GROQ_API_KEY?.trim();
    
    if (!groqKey) {
      return NextResponse.json({ result: `Vercel ما لقاش GROQ_API_KEY - خاصك تدير Redeploy` });
    }

    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${groqKey}` },
      body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [{ role: "user", content: prompt }] })
    });
    
    const d = await r.json();
    
    if (d.error) {
      return NextResponse.json({ result: `Groq Error: ${d.error.message} - المفتاح: ${groqKey.slice(0,10)}...` });
    }
    
    if (d.choices?.[0]?.message?.content) {
      return NextResponse.json({ result: d.choices[0].message.content });
    }

    return NextResponse.json({ result: `Groq ما جاوبش: ${JSON.stringify(d).slice(0,200)}` });
  } catch (e:any) { 
    return NextResponse.json({ result: "Error: "+e.message }); 
  }
                              }
