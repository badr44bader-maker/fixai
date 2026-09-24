"use client"
import { useState } from "react"

export default function Home() {
  const [text, setText] = useState("")
  const [messages, setMessages] = useState<{q: string, a: string}[]>([])
  const [load, setLoad] = useState(false)

  async function fix() {
    if (!text.trim()) return
    const question = text
    setText("") // كيمسح البلاصة فالبلاصة
    setLoad(true)

    try {
      const r = await fetch("/api/fix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: question })
      })
      const d = await r.json()
      // تنظيف النجوم و الدياز
      const clean = d.result.replace(/\*\*/g, "").replace(/###/g, "").replace(/##/g, "")
      
      setMessages(prev => [...prev, { q: question, a: clean }])
    } catch (e: any) {
      setMessages(prev => [...prev, { q: question, a: "Error: " + e.message }])
    }
    setLoad(false)
  }

  return (
    <div style={{ padding: 20, background: "#000", color: "#fff", minHeight: "100vh" }}>
      <h1>FixAI - صلح المشكل</h1>
      
      <textarea 
        value={text} 
        onChange={e => setText(e.target.value)}
        placeholder="مثال: ثلاجة سامسونج لا تبرد من تحت"
        style={{ width: "100%", padding: 15, fontSize: 16, borderRadius: 8 }}
        rows={3}
      />

      <button 
        onClick={fix} 
        disabled={load}
        style={{ width: "100%", padding: 15, marginTop: 10, background: "#fff", color: "#000", fontSize: 18, borderRadius: 8, fontWeight: "bold" }}
      >
        {load ? "كنصلح..." : "صلح دابا"}
      </button>

      <div style={{ marginTop: 20 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 20, borderBottom: "1px solid #333", paddingBottom: 15 }}>
            <div style={{ background: "#222", padding: 10, borderRadius: 8, marginBottom: 10 }}>👤 {m.q}</div>
            <div style={{ background: "#111", padding: 15, borderRadius: 8, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>🔧 {m.a}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
