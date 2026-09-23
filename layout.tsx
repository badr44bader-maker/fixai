import './globals.css';
export const metadata = { title: 'FixAI — Show it. Understand it.', description: 'Take a photo. FixAI explains what to do, step by step.' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body className="min-h-screen bg-slate-50 text-slate-900 antialiased">{children}</body></html>;
}
