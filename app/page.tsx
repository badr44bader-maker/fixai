"use client"
import { useState } from "react"
export default function Home() {
  const [text, setText] = useState("")
  const [res, setRes] = useState("")
  const [load, setLoad] = useState(false)
  async function fix() {
    setLoad(true)
    setRes("")
    try {
      const r = await fetch("/api/fix", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({prompt: text})
      })
      const d = await r.json()
      setRes(d.result)
    } catch(e:any){ setRes("Error: "+e.message) }
    setLoad(false)
  }
  return (
    <div style={{padding:20, background:"black", color:"white", minHeight:"100vh"}}>
      <h1>FixAI - صلح المشكل</h1>
      <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="كتب هنا..." style={{width:"100%", height:100, color:"black", padding:10}}/>
      <button onClick={fix} style={{width:"100%", padding:15, marginTop:10, background:"white", color:"black", fontWeight:"bold"}}>{load?"كنصلح...":"صلح دابا"}</button>
      {res && <div style={{marginTop:20, background:"#222", padding:15, whiteSpace:"pre-wrap"}}>{res}</div>}
    </div>
  )
}
