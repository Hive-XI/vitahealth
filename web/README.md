# Vita Health web app

This folder contains the Vite + React app and a small local API. From here:

```bash
npm install
npm run dev
```

Open http://localhost:5173

For real sign-up, login, and Gemini chat during local development, use:

```bash
npm run dev:all
```

The API listens on http://localhost:8787 and stores development data in `data/db.json`.
Copy a newly rotated Gemini key into `.env` as `GEMINI_API_KEY`. The browser never receives this key. `GEMINI_MODEL` defaults to `gemini-2.5-flash`.

This JSON store is suitable for a local prototype only. Netlify's deployed functions need a hosted database and secret environment variables for real users and production traffic.

Netlify, repo layout, and demo paths: see the [root README](../README.md).
