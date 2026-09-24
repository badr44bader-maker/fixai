"use client"
import { useState } from "react"

export default function Home() {
  const [text, setText] = useState("")
  const [messages, setMessages] = useState<{q:string,a:string}[]>([])
  const [load, setLoad] = useState(false)

  async function fix() {
    if(!text.trim()) return
    const q = text
    setText("") // كيمسح الخانة فالبلاصة
    setLoad(true)
    try{
      const r = await fetch("/api/fix",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({prompt:q})
      })
      const d = await r.json()
      const clean = d.result.replace(/\*\*/g,"").replace(/###/g,"").replace(/\*/g,"")
      setMessages(prev=>[...prev,{q,a:clean}])
    }catch{
      setMessages(prev=>[...prev,{q,a:"سيرفر عامر، عاود بعد 10 ثواني"}])
    }
    setLoad(false)
  }

  return (
    <div style={{background:"#000",color:"#fff",minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      
      {/* الفوق فين كيبان الجواب */}
      <div style={{flex:1, padding:20, paddingBottom:100, overflowY:"auto"}}>
        <h1 style={{textAlign:"center", marginBottom:20}}>FixAI - صلح المشكل</h1>
        {messages.length==0 && <p style={{textAlign:"center", color:"#888"}}>كتب المشكل ديالك لتحت و غادي نجاوبك الفوق هنا</p>}
        {messages.map((m,i)=>(
          <div key={i} style={{marginBottom:20}}>
            <div style={{background:"#222",padding:12,borderRadius:10,marginBottom:8}}>👤 {m.q}</div>
            <div style={{background:"#111",padding:15,borderRadius:10,whiteSpace:"pre-wrap",lineHeight:1.7}}>🔧 {m.a}</div>
          </div>
        ))}
      </div>

      {/* لتحت فين كتكتب - لاصقة ديما */}
      <div style={{position:"fixed", bottom:0, left:0, right:0, background:"#000", padding:15, borderTop:"1px solid #333"}}>
        <textarea 
          value={text} 
          onChange={e=>setText(e.target.value)}
          placeholder="مثال: ثلاجة سامسونج لا تبرد من تحت"
          style={{width:"100%",padding:15,borderRadius:12,fontSize:16, border:"none"}}
          rows={2}
        />
        <button onClick={fix} disabled={load} style={{width:"100%",padding:15,marginTop:10,background:"#fff",color:"#000",borderRadius:12,fontSize:18,fontWeight:"bold", border:"none"}}>
          {load ? "كنصلح..." : "صلح دابا"}
        </button>
      </div>

    </div>
  )
}
