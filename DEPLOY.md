# Deployment Guide

## Environment Variables

The following environment variables are required for the application to function correctly.

| Variable | Description |
| :--- | :--- |
| `OPENROUTER_API_KEY` | API Key for OpenRouter (AI generation). This should be kept secret (server-side). |
| `VITE_SUPABASE_URL` | URL of your Supabase project. |
| `VITE_SUPABASE_ANON_KEY` | Public anonymous key for Supabase. |

## Vercel Deployment

1.  **Import Project**: Connect your GitHub repository to Vercel.
2.  **Framework Preset**: Select "Vite" (Vercel usually detects this automatically).
3.  **Environment Variables**: Add the variables listed above in **Settings > Environment Variables**.
    *   `OPENROUTER_API_KEY`: Add to Production, Preview, and Development.
    *   `VITE_SUPABASE_URL`: Add to Production, Preview, and Development.
    *   `VITE_SUPABASE_ANON_KEY`: Add to Production, Preview, and Development.
4.  **Deploy**: Click "Deploy".

## Local Development (with Vercel Functions)

To run the project locally with the serverless functions (api/*), you should use the Vercel CLI:

1.  Install Vercel CLI: `npm i -g vercel`
2.  Link project: `vercel link`
3.  Pull env vars: `vercel env pull`
4.  Run dev server: `vercel dev`
