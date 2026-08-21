# Vita Health (Vi+)

Vita Health is an AI-powered patient companion for partner clinics in Nigeria. It helps patients manage care between visits while giving clinic staff a focused view of who needs outreach first.

The product story is simple:

> A patient reports a concern, Vita offers cautious guidance, and the clinic receives a structured follow-up signal.

Repository: [github.com/Hive-XI/vitahealth](https://github.com/Hive-XI/vitahealth)

## What The Prototype Demonstrates

### Patient experience

- Email/password sign-up and login
- Explicit AI and data consent flow
- Patient profile and care-plan setup
- Personalized dashboard with care status and next medication reminder
- Dated medication events and seven-day adherence view
- Lab result entry with clinic-review flags
- AI symptom guidance through Gemini
- Suggested chat prompts and emergency escalation
- Request clinical review from the chat
- Follow-up appointment request
- Patient care timeline
- Caregiver preview

### Clinic experience

- Clinic staff sign-up and login
- Patient panel sorted by adherence
- Search and adherence filters
- Open escalation count and response-time metric
- Patients-needing-attention view
- Appointment overview
- Escalation queue with workflow statuses:
  - New
  - Assigned
  - Contact attempted
  - Waiting for patient
  - Resolved
  - Escalated to clinician
- Patient detail workspace with Overview, Timeline, Medications, Labs, Conversations, Appointments, and Notes tabs
- Clinical note entry

## Technology

- React 19
- TypeScript
- Vite 8
- React Router 7
- Tailwind CSS 4
- Express 5 local API
- Node.js `crypto.scrypt` password hashing
- Local JSON persistence for prototype development
- Gemini API using the configured `GEMINI_MODEL`
- Netlify-compatible static frontend build

## Project Structure

```text
.
├── netlify.toml              # Netlify build and SPA fallback configuration
├── README.md
└── web/
    ├── data/
    │   └── db.json           # Local prototype records; do not use in production
    ├── public/
    ├── server/
    │   └── index.mjs         # Auth, records, escalation, appointment, and AI API
    ├── src/
    │   ├── components/       # Shells, branding, and shared UI
    │   ├── pages/            # Patient, clinic, auth, and emergency screens
    │   ├── context.tsx       # Shared client state and API synchronization
    │   ├── types.ts          # Domain model types
    │   └── App.tsx            # Route map
    ├── .env                  # Local secrets; ignored by Git
    ├── package.json
    └── vite.config.ts
```

## Requirements

- Node.js 20 or newer
- npm
- A Gemini API key for live AI chat

## Local Development

From the repository root:

```bash
cd web
npm install
npm run dev:all
```

This starts:

- Frontend: http://localhost:5173
- API: http://localhost:8787

The Vite development server proxies `/api` requests to the local Express API. The API reads and writes records in `web/data/db.json`.

To run only one process:

```bash
cd web
npm run dev       # Frontend only
npm run api       # API only
```

## Environment Variables

Create or update `web/.env`:

```dotenv
GEMINI_API_KEY=your-new-gemini-key
GEMINI_MODEL=gemini-2.5-flash
PORT=8787
```

The Gemini key is read by the Express API and is never exposed through the Vite client bundle. Restart the API after changing `.env`.

Never commit `.env`, API keys, passwords, session tokens, or real patient data. Any key previously exposed in logs, screenshots, chat, or Git history should be revoked and replaced.

## Demo Flow

### Patient

1. Open http://localhost:5173.
2. Choose **Get started** and select **Patient**.
3. Create an account with an email and a password of at least eight characters.
4. Accept AI and data consent.
5. Complete the patient profile.
6. Try the medication dashboard, lab entry, appointment request, and care timeline.
7. Open Symptom guidance and try:
   - `I missed a dose`
   - `I feel dizzy`
   - `I have chest pain` to demonstrate emergency routing

### Clinic

1. Open the login screen in another browser session or private window.
2. Select **Clinic staff**.
3. Create or use a clinic account.
4. Review the dashboard, patient panel, appointment overview, and escalation queue.
5. Open a patient record and move through the record tabs.

The local JSON store is shared by all local sessions, so the clinic account can see records created by patient accounts in the same development environment.

## API Overview

All protected routes use the bearer token returned by sign-up or login.

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | API health check |
| `POST` | `/api/auth/signup` | Create an account and session |
| `POST` | `/api/auth/login` | Authenticate an account |
| `GET` | `/api/me` | Load the patient or clinic workspace |
| `PATCH` | `/api/profile` | Save a patient profile |
| `POST` | `/api/ai/chat` | Generate guarded Gemini guidance |
| `POST` | `/api/medications` | Add a medication |
| `POST` | `/api/medications/:id/events` | Record a taken or skipped dose |
| `POST` | `/api/labs` | Save a lab result |
| `POST` | `/api/escalations` | Create a clinic-review escalation |
| `PATCH` | `/api/escalations/:id` | Update escalation status or resolution data |
| `POST` | `/api/notes` | Add a clinician note |
| `POST` | `/api/appointments` | Request a patient follow-up |

## Data Model

The prototype database contains separate collections for:

- `users` and `sessions`
- `profiles`
- `medications`
- `medicationEvents`
- `labs`
- `messages`
- `escalations`
- `notes`
- `appointments`

Patient records are connected through `patientId`. Medication adherence is derived from dated medication events rather than a permanent status field. Escalations include urgency, status, creation time, assigned staff, contact attempts, response time, and resolution notes.

## Quality Checks

```bash
cd web
npm run build
npm run lint
node --check server/index.mjs
```

`npm run lint` may report the existing React Fast Refresh warning for shared exports in `src/context.tsx`; it does not block the production build.

## Deployment

The current Netlify configuration builds the static frontend:

- Base directory: `web`
- Build command: `npm run build`
- Publish directory: `dist`
- SPA fallback enabled for client-side routes

The local Express API is not deployed by Netlify. For a real hosted environment, deploy the API separately and configure the frontend API URL, or move the routes into a serverless platform.

The JSON database is intentionally a prototype convenience. It is not suitable for production because it has no safe concurrent writes, durable hosting guarantees, migrations, backups, or multi-instance consistency. Replace it with Postgres, Supabase, or another managed database before handling real users or health information.

## Security And Clinical Boundaries

Vita is a care companion, not a diagnostic or emergency service. The current prototype:

- Labels AI-generated responses.
- Routes obvious emergency phrases to an emergency screen.
- Encourages clinic review for uncertain cases.
- Keeps Gemini credentials server-side.
- Hashes passwords before storing them.

Before production, add:

- Secure HTTP-only cookie sessions with expiry and revocation
- Server-side authorization and route protection
- Rate limiting and abuse protection
- Audit logs and consent history
- Encryption, backups, and retention policies
- Clinician-reviewed triage protocols
- Structured symptom intake and safety-net follow-up
- Verified medication and lab workflows
- NDPA and clinical governance review

## Product Roadmap

The next product upgrades are:

1. Replace JSON persistence with managed Postgres.
2. Make escalation assignment, contact attempts, and resolution notes fully operational.
3. Add clinic-authored verified care plans.
4. Add real appointment availability, confirmation, rescheduling, and reminders.
5. Add secure caregiver invitations with permissions and expiry.
6. Add SMS, WhatsApp, and offline-friendly access for the Nigerian market.
7. Add clinically reviewed Hausa, Yoruba, and Igbo content.
8. Add analytics for adherence, outreach response time, unresolved flags, and outcomes.

## Status

Vita Health is an active pitch prototype. The frontend, local API, authentication, Gemini integration, patient-specific record model, medication events, timeline, clinic queue, and appointment request flow are implemented for local demonstration.
