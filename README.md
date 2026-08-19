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

## Demo paths

- Patient: Get started → Patient → Continue → consent → setup
- Clinic: Get started → Clinic staff → Continue
- Emergency: in chat, type `chest pain` or `can't breathe`

## Stack

Vite, React, TypeScript, Tailwind CSS. Mock data only — no live LLM or backend.
