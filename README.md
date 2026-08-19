# Vita Health

AI-powered patient companion for partner clinics. Patients get symptom guidance, medication reminders, and plain-language labs. Clinics see who needs follow-up. Vita does not diagnose or prescribe.

The app lives in [`web/`](web/).

## Run locally

```bash
cd web
npm install
npm run dev
```

Open http://localhost:5173

## Deploy (Netlify)

The site is in `web/`. Repo root is only this README, so Netlify’s default (publish the repo root, no build) produces the branded **Page not found** card — there is no `index.html` at the root.

`netlify.toml` at the repo root sets:

- **Base directory:** `web`
- **Build command:** `npm run build`
- **Publish directory:** `dist` (that is `web/dist` on disk)

Site settings in the Netlify UI **override** `netlify.toml` if they conflict. If the live site still 404s, open Site configuration → Build & deploy and set Base directory `web`, Publish directory `web/dist` (UI often shows the path from repo root), Build command `npm run build`. Then trigger a new deploy.

## Demo paths

- Patient: Get started → Patient → Continue → consent → setup
- Clinic: Get started → Clinic staff → Continue
- Emergency: in chat, type `chest pain` or `can't breathe`

## Stack

Vite, React, TypeScript, Tailwind CSS. Mock data only — no live LLM or backend.
