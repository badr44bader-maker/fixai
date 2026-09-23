# FixAI MVP
1. `npx create-next-app@14 fixai --ts --tailwind --app --no-src-dir --import-alias "@/*"`
2. Copy this folder's contents over the new project (overwrite `app/page.tsx`, `app/layout.tsx`), then `npm i @supabase/ssr @supabase/supabase-js`
3. Create a Supabase project → SQL editor → run `supabase/schema.sql`. (Optionally disable "Confirm email" under Auth → Providers → Email for faster testing.)
4. `cp .env.example .env.local` and fill in the values.
5. `npm run dev` → http://localhost:3000
Deploy: push to GitHub → import in Vercel → add the 4 env vars → Deploy. In Supabase Auth → URL Configuration add your Vercel URL.
