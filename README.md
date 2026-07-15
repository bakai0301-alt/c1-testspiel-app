# C1 Testspiel

A personal German C1 reading app built with Next.js. It generates new reading
texts with the OpenAI Responses API, creates telc-style comprehension and
vocabulary exercises, and stores progress across devices with Supabase.

## Features

- AI-generated C1 texts in three lengths and three editorial styles
- Multiple-choice comprehension questions
- `Richtig / Falsch / Nicht im Text` questions
- Contextual vocabulary exercises
- Saved texts, scores, incorrect answers, and vocabulary
- Email-and-password login with per-user database policies
- Responsive editorial interface for desktop, tablet, and mobile

## Local development

Install dependencies with `npm install`, copy `.env.example` to `.env.local`,
add the required values, and run `npm run dev`.

The interface opens in demo mode when Supabase is not configured. Demo mode
uses the included sample exercise and does not call the OpenAI API.

## Deployment

See `VERCEL_SETUP.md` for the Supabase, OpenAI, and Vercel setup steps.

The OpenAI key is read only by `app/api/generate/route.ts`. Never expose it in
client-side code or commit a real `.env.local` file.
