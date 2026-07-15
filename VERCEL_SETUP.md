# C1 Testspiel setup

The app uses Next.js, Supabase, and the OpenAI Responses API.

## Supabase

Create a Supabase project. Open the SQL editor and run `supabase/schema.sql`.
Copy the project URL and publishable/anon key into the matching environment
variables from `.env.example`. Email-and-password authentication must be enabled.

## OpenAI

Create a project API key at https://platform.openai.com/api-keys. Add it to
Vercel as `OPENAI_API_KEY`. The key is used only in the server route and must
never be committed to GitHub or placed in a `NEXT_PUBLIC_` variable.

Set `ALLOWED_EMAIL` to the email address that may use AI generation. This keeps
the personal app from exposing your API credit to other registered users.

## Vercel

Import the GitHub repository in Vercel. In Project Settings → Environment
Variables, add every variable shown in `.env.example`, then deploy again.

For Supabase email confirmations, set the Supabase Site URL to the final Vercel
URL under Authentication → URL Configuration.
