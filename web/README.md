# Vita Health web app

This directory contains the Vite frontend and the local Express API for Vita Health.

```bash
npm install
npm run dev:all
```

- Frontend: http://localhost:5173
- API: http://localhost:8787
- Local records: `data/db.json`

Configure live Gemini chat in `.env`:

```dotenv
GEMINI_API_KEY=your-new-gemini-key
GEMINI_MODEL=gemini-2.5-flash
PORT=8787
```

The API keeps the Gemini key server-side. The JSON database is for local demos only and must be replaced with managed persistence before production deployment.

For the complete product overview, architecture notes, demo flow, API routes, security boundaries, and deployment guidance, see the [root README](../README.md).
