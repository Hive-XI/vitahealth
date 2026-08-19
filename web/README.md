# Vita Health

Working prototype of Vita Health (Vi+), an AI-powered patient companion for partner clinics. Copy follows the Hive XI concept note: decision-support and adherence only — not diagnosis or prescribing.

This folder is the deployable app. Run it from here.

## View locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Screens

| Path | Screen |
| --- | --- |
| `/` | Landing |
| `/login` | Sign up / Log in |
| `/consent` | Disclaimer and consent |
| `/setup` | Profile setup |
| `/app` | Patient dashboard |
| `/app/chat` | Symptom guidance |
| `/app/chat/emergency` | Emergency escalation |
| `/app/meds` | Medication tracker |
| `/app/meds/add` | Add medication |
| `/app/labs` | Lab results |
| `/app/labs/follow-up` | Book follow-up |
| `/app/profile` | Profile and settings |
| `/app/caregiver` | Caregiver view |
| `/clinic` | Clinic dashboard |
| `/clinic/queue` | Escalation queue |
| `/clinic/patients/:id` | Patient detail |

Patient path: **Get started → Patient → Continue → consent → setup → dashboard**.

Clinic path: **Get started → Clinic staff → Continue**.

Type `chest pain` or `can't breathe` in chat to trigger the emergency safety layer.
