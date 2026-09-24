"use client"
import { useState } from "react"

export default function Home() {
  const [text, setText] = useState("")
  const [messages, setMessages] = useState<{q:string,a:string}[]>([])
  const [load, setLoad] = useState(false)

  async function fix() {
    if(!text.trim() || load) return
    const q = text
    setText("")
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
      setMessages(prev=>[...prev,{q,a:"سيرفر عامر، تسنا 10 ثواني و عاود"}])
    }
    setLoad(false)
  }

  return (
    <div style={{background:"#000",color:"#fff",minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <div style={{flex:1, padding:20, paddingBottom:130}}>
        <h1 style={{textAlign:"center"}}>FixAI - صلح المشكل</h1>
        {messages.map((m,i)=>(
          <div key={i} style={{marginBottom:20}}>
            <div style={{background:"#222",padding:12,borderRadius:10,marginBottom:8}}>👤 {m.q}</div>
            <div style={{background:"#111",padding:15,borderRadius:10,whiteSpace:"pre-wrap",lineHeight:1.7}}>🔧 {m.a}</div>
          </div>
        ))}
      </div>

      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#000",padding:15,borderTop:"1px solid #333"}}>
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="مثال: ثلاجة سامسونج لا تبرد من تحت" style={{width:"100%",padding:15,borderRadius:12,fontSize:16,color:"#000"}} rows={2}/>
        <button onClick={fix} style={{width:"100%",padding:15,marginTop:10,background:"#fff",color:"#000",borderRadius:12,fontSize:18,fontWeight:"bold"}}>
          {load ? "كنصلح..." : "صلح دابا"}
        </button>
      </div>
    </div>
  )
}
