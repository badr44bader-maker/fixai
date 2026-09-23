'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Lang, T, TTS } from '@/lib/i18n';

export type R = { id: string; identified_object: string; brand: string | null; model: string | null; confidence: number; hazard: string; summary: string; steps: { number: number; instruction: string; warning: string | null }[]; safety_warning: string | null; needs_more_information: boolean; additional_information: string[] };

export default function Result({ r, lang }: { r: R; lang: Lang }) {
  const t = T[lang], [i, setI] = useState(0), [fb, setFb] = useState<'' | 'no' | 'done'>(''), [note, setNote] = useState('');
  const s = r.steps[i];
  const speak = (x: string) => { if (!('speechSynthesis' in window)) return; speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(x); u.lang = TTS[lang]; speechSynthesis.speak(u); };
  const send = async (helpful: boolean) => {
    const sb = createClient(); const { data: { user } } = await sb.auth.getUser(); if (!user) return;
    await sb.from('feedback').insert({ analysis_id: r.id, user_id: user.id, helpful, comment: helpful ? null : note.slice(0, 1000) });
    setFb('done');
  };
  const btn = 'rounded-2xl px-5 py-3 font-semibold min-h-12 disabled:opacity-40';
  return (
    <div dir={lang === 'ar' || lang === 'ary' ? 'rtl' : 'ltr'} className="space-y-4">
      <div className="rounded-3xl bg-white p-5 shadow">
        <h2 className="text-2xl font-bold">{r.identified_object}</h2>
        <p className="text-sm text-slate-500">{[r.brand, r.model].filter(Boolean).join(' · ')} {Math.round(r.confidence * 100)}%</p>
        <p className="mt-2">{r.summary}</p>
      </div>
      {r.safety_warning && <div role="alert" className="rounded-2xl bg-red-50 p-4 text-red-800">⚠️ {r.safety_warning}</div>}
      {(r.needs_more_information || r.hazard !== 'low') && (
        <div className="rounded-2xl bg-amber-50 p-4 text-amber-900"><p>{t.manual}</p>
          <ul className="list-disc ps-5">{r.additional_information.map((x, k) => <li key={k}>{x}</li>)}</ul></div>)}
      {s && (
        <div className="rounded-3xl bg-indigo-600 p-6 text-white shadow-lg" aria-live="polite">
          <p className="text-sm opacity-80">{t.step} {s.number} / {r.steps.length}</p>
          <p className="mt-2 text-xl leading-snug">{s.instruction}</p>
          {s.warning && <p className="mt-3 rounded-xl bg-white/20 p-3 text-sm">⚠️ {s.warning}</p>}
          <div className="mt-5 flex flex-wrap gap-2 text-slate-900">
            <button className={`${btn} bg-white`} disabled={!i} onClick={() => setI(i - 1)}>{t.prev}</button>
            <button className={`${btn} bg-white`} disabled={i === r.steps.length - 1} onClick={() => setI(i + 1)}>{t.next}</button>
            <button className={`${btn} bg-white/80`} onClick={() => speak(s.instruction)}>🔊 {t.listen}</button>
            <button className={`${btn} bg-white/80`} onClick={() => speak(s.instruction)}>↻ {t.repeat}</button>
          </div>
        </div>)}
      <div className="rounded-2xl bg-white p-4 shadow">
        {fb === 'done' ? <p>{t.thanks}</p> : <>
          <p className="font-medium">{t.helpful}</p>
          <div className="mt-2 flex gap-2"><button className={`${btn} bg-emerald-100`} onClick={() => send(true)}>👍 {t.yes}</button><button className={`${btn} bg-rose-100`} onClick={() => setFb('no')}>👎 {t.no}</button></div>
          {fb === 'no' && <div className="mt-3 space-y-2"><textarea aria-label={t.wrong} placeholder={t.wrong} maxLength={1000} className="w-full rounded-xl border p-3" value={note} onChange={(e) => setNote(e.target.value)} /><button className={`${btn} bg-slate-900 text-white`} onClick={() => send(false)}>{t.send}</button></div>}
        </>}
      </div>
    </div>);
}
