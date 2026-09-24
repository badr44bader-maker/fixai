export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{margin:0,background:"#000",color:"#fff",fontFamily:"Arial"}}>
        {children}
      </body>
    </html>
  );
}
