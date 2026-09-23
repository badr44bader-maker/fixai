import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
export default async function History() {
  const { data } = await createClient().from('analyses').select('id,object_name,summary,thumbnail,created_at').order('created_at', { ascending: false }).limit(50);
  return (
    <main className="mx-auto max-w-lg space-y-3 p-4">
      <Link href="/app" className="text-indigo-600">← FixAI</Link>
      {!data?.length && <p className="text-slate-500">No analyses yet.</p>}
      {data?.map((a) => (
        <Link key={a.id} href={`/history/${a.id}`} className="flex gap-3 rounded-2xl bg-white p-3 shadow">
          {a.thumbnail && <img src={a.thumbnail} alt="" className="h-20 w-20 rounded-xl object-cover" />}
          <div className="min-w-0"><p className="font-semibold">{a.object_name}</p><p className="text-xs text-slate-500">{new Date(a.created_at).toLocaleString()}</p><p className="line-clamp-2 text-sm">{a.summary}</p></div>
        </Link>))}
    </main>);
}
