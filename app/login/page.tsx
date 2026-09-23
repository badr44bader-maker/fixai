'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
export default function Login() {
  const [mode, setMode] = useState<'in' | 'up'>('in'), [email, setEmail] = useState(''), [pw, setPw] = useState(''), [msg, setMsg] = useState(''), router = useRouter();
  async function go(e: React.FormEvent) {
    e.preventDefault(); setMsg(''); const a = createClient().auth;
    const { data, error } = mode === 'in' ? await a.signInWithPassword({ email, password: pw }) : await a.signUp({ email, password: pw });
    if (error) return setMsg(error.message);
    if (data.session) { router.push('/app'); router.refresh(); } else setMsg('Check your email to confirm your account, then log in.');
  }
  return (
    <main className="mx-auto max-w-sm p-6">
      <h1 className="mb-4 text-3xl font-bold">{mode === 'in' ? 'Log in' : 'Sign up'}</h1>
      <form onSubmit={go} className="space-y-3">
        <input type="email" required autoComplete="email" placeholder="Email" className="w-full rounded-xl border p-3" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" required minLength={8} autoComplete={mode === 'in' ? 'current-password' : 'new-password'} placeholder="Password (8+ characters)" className="w-full rounded-xl border p-3" value={pw} onChange={(e) => setPw(e.target.value)} />
        <button className="w-full rounded-2xl bg-indigo-600 p-3 font-semibold text-white">{mode === 'in' ? 'Log in' : 'Create account'}</button>
      </form>
      {msg && <p role="alert" className="mt-3 text-sm text-red-700">{msg}</p>}
      <button className="mt-4 text-sm text-indigo-600" onClick={() => setMode(mode === 'in' ? 'up' : 'in')}>{mode === 'in' ? 'New here? Sign up' : 'Have an account? Log in'}</button>
    </main>);
}
