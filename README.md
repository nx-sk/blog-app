# Frontend (Vite + React)

This app now runs on Vite for faster dev/build and smaller bundles.

## Scripts

- `npm run dev`: Start dev server at `http://localhost:3000`.
- `npm run build`: Build to `dist/`.
- `npm run preview`: Preview the production build locally.

## Environment Variables

Set these in `.env.local`:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_ADMIN_EMAILS=email1@example.com,email2@example.com
```

Note: Vite only exposes variables prefixed with `VITE_` to the client.

## Deploy (Vercel)

`vercel.json` is configured for Vite and SPA rewrites. Output directory is `dist/`.
