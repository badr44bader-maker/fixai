'use client'
import { useState } from 'react'

export default function Home() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFix = async () => {
    if (!input) return
    setLoading(true)
    setResult('')
    try {
      const res = await fetch('/api/fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input })
      })
      const data = await res.json()
      setResult(data.result || 'كاين خطأ')
    } catch (e) {
      setResult('خطأ فالسيرفر')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', padding: '20px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '60px', fontWeight: 'bold', marginBottom: '10px' }}>FixAI</h1>
      <p style={{ fontSize: '20px', color: '#aaa', marginBottom: '40px' }}>صلح أي حاجة بالذكاء الاصطناعي</p>
      <div style={{ background: '#111', border: '1px solid #333', borderRadius: '16px', padding: '30px', width: '100%', maxWidth: '500px' }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="شنو بغيتي تصلح؟" style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #333', background: '#000', color: 'white', marginBottom: '15px' }} />
        <button onClick={handleFix} style={{ width: '100%', padding: '15px', borderRadius: '10px', background: 'white', color: 'black', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
          {loading? 'كنصلح...' : 'صلح دابا ✨'}
        </button>
        {result && <div style={{ marginTop: '20px', background: '#000', padding: '15px', borderRadius: '10px', textAlign: 'right', whiteSpace: 'pre-wrap' }}>{result}</div>}
      </div>
      <p style={{ marginTop: '30px', color: '#555', fontSize: '14px' }}>fixai-jet.vercel.app • 100% خدام</p>
    </div>
  )
}
