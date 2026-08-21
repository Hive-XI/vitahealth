# Vita Health (Vi+)

AI-powered patient companion for partner clinics in Nigeria. Guidance, reminders, and lab explainers between visits — clinics see who needs them first.

Repo: [github.com/Hive-XI/vitahealth](https://github.com/Hive-XI/vitahealth)

## Folder structure

The Vite + React app is in **`web/`**. Repo root is config and this README.

```
.
├── netlify.toml   # base = web, publish = dist, SPA fallback
└── web/           # app source
    ├── src/
    └── package.json
```

## Run locally

```bash
cd web
npm install
npm run dev:all
```

Open http://localhost:5173

Vite, React, TypeScript, Tailwind. Demo/mock data only — no live backend.

## Deploy on Netlify

Connect **Hive-XI/vitahealth**. `netlify.toml` already sets:

- **Base directory:** `web`
- **Build command:** `npm run build`
- **Publish directory:** `dist` (`web/dist` on disk)
- SPA fallback so React Router deep links work

If the live site 404s, check Site configuration → Build & deploy: Netlify UI settings override the file. Align them with the values above, then redeploy.

## Demo paths

- Patient: Get started → Patient → Continue → consent → setup
- Clinic: Get started → Clinic staff → Continue
- Emergency: in chat, type `chest pain` or `can't breathe`
