# Vita Health UI

Working prototype of the FigJam user flow for Vita Health (Vi+). This is an interpreted product UI — the Figma file is a board of screen notes, not pixel mockups.

## View locally

```bash
cd web
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Screens

| Path | FigJam screen |
| --- | --- |
| `/` | Landing page |
| `/login` | Sign up / Log in |
| `/consent` | Disclaimer and consent |
| `/setup` | Profile setup |
| `/app` | Patient dashboard |
| `/app/chat` | Symptom chat |
| `/app/chat/emergency` | Emergency escalation |
| `/app/meds` | Medication tracker |
| `/app/meds/add` | Add medication |
| `/app/labs` | Lab results |
| `/app/labs/follow-up` | Book follow-up |
| `/app/profile` | Profile and settings |
| `/app/caregiver` | Caregiver view |
| `/clinic` | Clinic dashboard |
| `/clinic/queue` | Escalation queue |
| `/clinic/patients/:id` | Patient detail view |

Patient path: **Get started → Patient → Continue → consent → setup → dashboard**.

Clinic path: **Get started → Clinic staff → Continue**.

Type `chest pain` or `can't breathe` in chat to trigger emergency escalation.
