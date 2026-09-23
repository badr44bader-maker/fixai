'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LANGS, Lang, T } from '@/lib/i18n';
import { createClient } from '@/lib/supabase/client';
import Result, { R } from '@/components/Result';

async function shrink(f: File, max: number, q: number) {
  const b = await createImageBitmap(f), k = Math.min(1, max / Math.max(b.width, b.height));
  const c = document.createElement('canvas'); c.width = Math.round(b.width * k); c.height = Math.round(b.height * k);
  c.getContext('2d')!.drawImage(b, 0, 0, c.width, c.height); return c.toDataURL('image/jpeg', q);
}

export default function AppPage() {
  const [lang, setLang] = useState<Lang>('en'), [img, setImg] = useState<{ full: string; thumb: string } | null>(null);
  const [busy, setBusy] = useState(false), [err, setErr] = useState(''), [res, setRes] = useState<R | null>(null);
  const router = useRouter(), t = T[lang];
  useEffect(() => { const l = localStorage.getItem('lang') as Lang; if (l && l in LANGS) setLang(l); }, []);

  async function pick(f?: File) {
    setErr(''); setRes(null); if (!f) return;
    if (!/^image\/(jpeg|png|webp)$/.test(f.type) || f.size > 15_000_000) return setErr('Please choose a JPEG, PNG or WebP image under 15 MB.');
    try { setImg({ full: await shrink(f, 1280, 0.82), thumb: await shrink(f, 240, 0.6) }); } catch { setErr('This image could not be read. Try another photo.'); }
  }
  async function submit() {
    if (!img) return; setBusy(true); setErr('');
    try {
      const r = await fetch('/api/analyze', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ image: img.full, thumbnail: img.thumb, language: lang }) });
      if (r.status === 401) return router.push('/login');
      const d = await r.json(); if (!r.ok) throw new Error(d.error); setRes(d);
    } catch (e: any) { setErr(e.message === 'Failed to fetch' ? 'Network problem. Check your connection.' : e.message || 'Something went wrong.'); }
    finally { setBusy(false); }
  }
  const btn = 'rounded-2xl px-5 py-3 font-semibold min-h-12';
  return (
    <main className="mx-auto max-w-lg space-y-4 p-4">
      <header className="flex items-center justify-between gap-2">
        <select aria-label="Language" value={lang} onChange={(e) => { setLang(e.target.value as Lang); localStorage.setItem('lang', e.target.value); }} className="rounded-xl border p-2">
          {Object.entries(LANGS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        <nav className="flex gap-3 text-sm"><Link href="/history">{t.history}</Link>
          <button onClick={async () => { await createClient().auth.signOut(); router.push('/'); }}>{t.logout}</button></nav>
      </header>
      {!res && (img ? <>
        <img src={img.full} alt="Preview" className="w-full rounded-3xl shadow" />
        <div className="flex gap-2"><button className={`${btn} border`} onClick={() => setImg(null)}>{t.retake}</button>
          <button className={`${btn} flex-1 bg-indigo-600 text-white disabled:opacity-50`} disabled={busy} onClick={submit}>{busy ? '…' : t.analyze}</button></div></>
        : <label className="flex h-64 cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed bg-white text-center">
          <span className="text-5xl">📸</span><span className="font-semibold">{t.take}</span>
          <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={(e) => pick(e.target.files?.[0])} /></label>)}
      {err && <p role="alert" className="rounded-2xl bg-red-50 p-3 text-red-800">{err}</p>}
      {res && <><Result r={res} lang={lang} /><button className={`${btn} w-full border`} onClick={() => { setRes(null); setImg(null); }}>{t.retake}</button></>}
    </main>);
}
