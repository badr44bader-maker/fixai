import Link from 'next/link';
import { LANGS } from '@/lib/i18n';
const how = [['📸', 'Show', 'Take or upload a photo of the object.'], ['🔎', 'Identify', 'FixAI says what it sees — and how sure it is.'], ['✅', 'Follow', 'Simple numbered steps, read aloud if you like.']];
const cases = ['Coffee machine', 'Washing machine', 'Power drill', 'Thermostat', 'Printer', 'Kitchen gadget'];
const faq = [['Is FixAI always right?', 'No. When it is unsure it says so and asks for a clearer photo, the model number or the manual.'], ['Are my photos stored?', 'Only a small thumbnail is kept in your history. Full-size photos are not stored.'], ['What about gas or high-voltage equipment?', 'FixAI will not guess. It warns you and points you to the official manual or a qualified professional.']];
const S = 'mx-auto max-w-5xl px-5 py-16';
export default function Home() {
  return (
    <main>
      <section className="bg-gradient-to-b from-indigo-50 to-slate-50"><div className={`${S} text-center`}>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">Don&apos;t Know How It Works? Just Show FixAI.</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600">Take a photo. FixAI identifies what you&apos;re looking at and explains what to do — step by step.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/app" className="rounded-2xl bg-indigo-600 px-7 py-4 font-semibold text-white shadow-lg transition hover:-translate-y-0.5">Try FixAI</Link>
          <a href="#how" className="rounded-2xl border bg-white px-7 py-4 font-semibold">How It Works</a></div></div></section>
      <section id="how" className={S}><h2 className="mb-8 text-3xl font-bold">How it works</h2>
        <div className="grid gap-4 sm:grid-cols-3">{how.map(([e, h, p]) => <div key={h} className="rounded-3xl bg-white p-6 shadow"><div className="text-4xl">{e}</div><h3 className="mt-3 text-xl font-semibold">{h}</h3><p className="text-slate-600">{p}</p></div>)}</div></section>
      <section className={S}><h2 className="mb-4 text-3xl font-bold">Your language</h2>
        <div className="flex flex-wrap gap-2">{Object.values(LANGS).map((l) => <span key={l} className="rounded-full bg-white px-4 py-2 shadow">{l}</span>)}</div></section>
      <section className={S}><h2 className="mb-4 text-3xl font-bold">Use it for</h2>
        <div className="flex flex-wrap gap-2">{cases.map((c) => <span key={c} className="rounded-full bg-indigo-100 px-4 py-2">{c}</span>)}</div></section>
      <section className={S}><div className="rounded-3xl bg-amber-50 p-8"><h2 className="text-3xl font-bold">Safety first</h2>
        <p className="mt-3 text-slate-700">FixAI never pretends to be certain. For electrical, gas, medical, chemical or other hazardous equipment it will not give confident instructions unless it can clearly identify the model — and it will always point you to the official manual or a qualified professional.</p></div></section>
      <section className={S}><h2 className="mb-4 text-3xl font-bold">Pricing</h2><p className="rounded-3xl bg-white p-6 shadow">Free during the beta. Paid plans coming soon.</p></section>
      <section className={S}><h2 className="mb-4 text-3xl font-bold">FAQ</h2>
        {faq.map(([q, a]) => <details key={q} className="mb-2 rounded-2xl bg-white p-4 shadow"><summary className="cursor-pointer font-semibold">{q}</summary><p className="mt-2 text-slate-600">{a}</p></details>)}</section>
      <footer className="border-t py-8 text-center text-sm text-slate-500">© {new Date().getFullYear()} FixAI · <Link href="/login">Log in</Link></footer>
    </main>);
}
