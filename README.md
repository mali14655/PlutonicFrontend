# Plutonic Frontend

React + Vite + Tailwind client for **Plutonic Cleaning & Technical Services**.

Deploy target: [Vercel](https://vercel.com)  
Repository: [PlutonicFrontend](https://github.com/mali14655/PlutonicFrontend)

## Local development

```bash
npm install
cp .env.example .env   # fill in values
npm run dev
```

Runs at `http://localhost:5173`. API requests proxy to `http://localhost:5000` via Vite (`/api` → backend).

## Environment variables

Copy `.env.example` to `.env` locally. On Vercel, add the same keys under **Project → Settings → Environment Variables**.

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Production | Backend base URL, no trailing slash (e.g. `https://your-api.onrender.com`) |
| `VITE_FIREBASE_API_KEY` | Admin push | Firebase web app config |
| `VITE_FIREBASE_AUTH_DOMAIN` | Admin push | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Admin push | Firebase project ID |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Admin push | FCM sender ID |
| `VITE_FIREBASE_APP_ID` | Admin push | Firebase app ID |
| `VITE_FIREBASE_VAPID_KEY` | Admin push | Web Push VAPID public key |

> **Never commit `.env`** — it is listed in `.gitignore`.

## Deploy to Vercel

1. Import [github.com/mali14655/PlutonicFrontend](https://github.com/mali14655/PlutonicFrontend) in Vercel.
2. Framework preset: **Vite** (auto-detected).
3. Root directory: `.` (repo root is the frontend).
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add all `VITE_*` environment variables above.
7. Deploy.

`vercel.json` configures SPA routing (React Router) and cache headers for static assets.

### Backend CORS

Ensure your backend allows the Vercel domain, e.g.:

```
CLIENT_URL=https://your-app.vercel.app
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Local dev server |
| `npm run build` | Production build (generates Firebase SW + Vite bundle) |
| `npm run preview` | Preview production build locally |
| `npm run generate:firebase-sw` | Regenerate `public/firebase-messaging-sw.js` from env |

## Project structure

```
src/           React pages, components, hooks
public/        Static assets (images, branding, service worker template output)
scripts/       Build helpers (Firebase SW generator)
vercel.json    Vercel deployment config
```

## Security notes

- `.env`, `.vercel/`, `node_modules/`, and `dist/` are gitignored.
- Firebase client keys are public by design but still loaded from env, not hardcoded in source.
- Admin auth tokens are stored in `localStorage` only in the browser session.
