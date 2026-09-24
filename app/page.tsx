export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#000', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', padding: '20px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '60px', fontWeight: 'bold', marginBottom: '10px' }}>FixAI</h1>
      <p style={{ fontSize: '20px', color: '#aaa', marginBottom: '40px' }}>صلح أي حاجة بالذكاء الاصطناعي</p>
      
      <div style={{ background: '#111', border: '1px solid #333', borderRadius: '16px', padding: '30px', width: '100%', maxWidth: '500px' }}>
        <input placeholder="شنو بغيتي تصلح؟" style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #333', background: '#000', color: 'white', marginBottom: '15px' }} />
        <button style={{ width: '100%', padding: '15px', borderRadius: '10px', background: 'white', color: 'black', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
          صلح دابا ✨
        </button>
      </div>
      
      <p style={{ marginTop: '30px', color: '#555', fontSize: '14px' }}>fixai-jet.vercel.app • خدام 100%</p>
    </div>
  )
}
