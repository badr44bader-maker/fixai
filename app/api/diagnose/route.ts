import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SYSTEM_PROMPT } from '@/lib/prompt';
import { AI_LANG, Lang } from '@/lib/i18n';

const fail = (error: string, status: number) => NextResponse.json({ error }, { status });
const HOURLY_LIMIT = 20;

export async function POST(req: Request) {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return fail('Please log in to continue.', 401);

  const body = await req.json().catch(() => null);
  const m = typeof body?.image === 'string' && body.image.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!m || m[2].length > 3_000_000) return fail('Unsupported or too large image. Use a JPEG, PNG or WebP under ~2 MB.', 400);
  const lang = body.language as Lang;
  if (!(lang in AI_LANG)) return fail('Unsupported language.', 400);
  const thumb = typeof body.thumbnail === 'string' && body.thumbnail.startsWith('data:image/jpeg;base64,') && body.thumbnail.length < 60_000 ? body.thumbnail : null;

  const since = new Date(Date.now() - 3600_000).toISOString();
  const { count } = await sb.from('analyses').select('id', { count: 'exact', head: true }).gte('created_at', since);
  if ((count ?? 0) >= HOURLY_LIMIT) return fail('You reached the hourly limit. Please try again later.', 429);

  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY!, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({
      model: process.env.AI_MODEL || 'claude-sonnet-5', max_tokens: 1500,
      system: `${SYSTEM_PROMPT}\n\nOUTPUT LANGUAGE: ${AI_LANG[lang]}`,
      messages: [{ role: 'user', content: [{ type: 'image', source: { type: 'base64', media_type: m[1], data: m[2] } }, { type: 'text', text: 'Analyze this image.' }] }],
    }),
    signal: AbortSignal.timeout(45_000),
  }).catch(() => null);
  if (!r) return fail('Could not reach the AI service. Check your connection and try again.', 502);
  if (r.status === 429) return fail('The AI service is busy. Please retry in a minute.', 429);
  if (!r.ok) return fail('The AI service failed. Please try again.', 502);

  let d: any;
  try {
    const text = (await r.json()).content?.find((c: any) => c.type === 'text')?.text ?? '';
    d = JSON.parse(text.replace(/^```(?:json)?|```$/g, '').trim());
    if (typeof d.identified_object !== 'string' || typeof d.confidence !== 'number' || !Array.isArray(d.steps)) throw 0;
  } catch { return fail('Could not understand the AI answer. Please try another photo.', 502); }

  // Server-side safety guard: never rely on the model alone.
  const conf = Math.min(1, Math.max(0, d.confidence));
  const hazard = ['low', 'medium', 'high'].includes(d.hazard) ? d.hazard : 'high';
  let steps = d.steps.slice(0, 8).map((s: any, i: number) => ({ number: i + 1, instruction: String(s.instruction ?? '').slice(0, 500), warning: s.warning ? String(s.warning).slice(0, 300) : null })).filter((s: any) => s.instruction);
  let needs = !!d.needs_more_information;
  if (conf < 0.5 || (hazard === 'high' && conf < 0.85)) { steps = []; needs = true; }

  const { data: a, error } = await sb.from('analyses').insert({
    user_id: user.id, language: lang, object_name: String(d.identified_object).slice(0, 200), brand: d.brand ?? null, model: d.model ?? null,
    confidence: conf, summary: String(d.summary ?? '').slice(0, 1000), hazard, safety_warning: d.safety_warning ?? null,
    needs_more_information: needs, additional_information: (d.additional_information ?? []).slice(0, 8), thumbnail: thumb,
  }).select('id').single();
  if (error || !a) return fail('Could not save the result. Please try again.', 500);
  if (steps.length) await sb.from('analysis_steps').insert(steps.map((s: any) => ({ ...s, analysis_id: a.id })));

  return NextResponse.json({ id: a.id, identified_object: d.identified_object, brand: d.brand ?? null, model: d.model ?? null, confidence: conf, hazard, summary: d.summary, steps, safety_warning: d.safety_warning ?? null, needs_more_information: needs, additional_information: d.additional_information ?? [] });
}
