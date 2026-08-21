import crypto from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'

const root = path.dirname(fileURLToPath(import.meta.url))
const dataDirectory = path.join(root, '..', 'data')
const databasePath = path.join(dataDirectory, 'db.json')
const port = Number(process.env.PORT || 8787)
const app = express()

app.use(express.json({ limit: '32kb' }))

async function readDatabase() {
  try {
    return JSON.parse(await readFile(databasePath, 'utf8'))
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
    const database = { users: [], sessions: [] }
    await mkdir(dataDirectory, { recursive: true })
    await writeFile(databasePath, JSON.stringify(database, null, 2))
    return database
  }
}

async function writeDatabase(database) {
  await mkdir(dataDirectory, { recursive: true })
  await writeFile(databasePath, JSON.stringify(database, null, 2))
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return { salt, hash }
}

function samePassword(password, user) {
  const candidate = Buffer.from(hashPassword(password, user.passwordSalt).hash, 'hex')
  const stored = Buffer.from(user.passwordHash, 'hex')
  return candidate.length === stored.length && crypto.timingSafeEqual(candidate, stored)
}

function publicUser(user) {
  return { id: user.id, email: user.email, role: user.role, language: user.language }
}

function createSession(database, userId) {
  const token = crypto.randomBytes(32).toString('hex')
  database.sessions = database.sessions.filter((session) => session.userId !== userId)
  database.sessions.push({ token, userId, createdAt: new Date().toISOString() })
  return token
}

function requireUser(handler) {
  return async (request, response) => {
    const token = request.headers.authorization?.replace('Bearer ', '')
    const database = await readDatabase()
    const session = database.sessions.find((item) => item.token === token)
    const user = database.users.find((item) => item.id === session?.userId)
    if (!user) return response.status(401).json({ error: 'Sign in required.' })
    request.user = user
    return handler(request, response, database)
  }
}

app.get('/api/health', (_request, response) => response.json({ ok: true }))

app.post('/api/auth/signup', async (request, response) => {
  const { email, password, role = 'patient', language = 'English' } = request.body ?? {}
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) return response.status(400).json({ error: 'Enter a valid email.' })
  if (typeof password !== 'string' || password.length < 8) return response.status(400).json({ error: 'Password must be at least 8 characters.' })
  if (!['patient', 'clinic'].includes(role)) return response.status(400).json({ error: 'Invalid role.' })
  const database = await readDatabase()
  if (database.users.some((user) => user.email === email.toLowerCase())) return response.status(409).json({ error: 'An account already exists for this email.' })
  const passwordData = hashPassword(password)
  const user = { id: crypto.randomUUID(), email: email.toLowerCase(), role, language, passwordSalt: passwordData.salt, passwordHash: passwordData.hash, createdAt: new Date().toISOString() }
  database.users.push(user)
  const token = createSession(database, user.id)
  await writeDatabase(database)
  response.status(201).json({ token, user: publicUser(user) })
})

app.post('/api/auth/login', async (request, response) => {
  const { email, password } = request.body ?? {}
  const database = await readDatabase()
  const user = database.users.find((item) => item.email === email?.toLowerCase())
  if (!user || typeof password !== 'string' || !samePassword(password, user)) return response.status(401).json({ error: 'Email or password is incorrect.' })
  const token = createSession(database, user.id)
  await writeDatabase(database)
  response.json({ token, user: publicUser(user) })
})

app.post('/api/ai/chat', requireUser(async (request, response) => {
  if (request.user.role !== 'patient') return response.status(403).json({ error: 'AI chat is available for patients.' })
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.startsWith('replace-')) return response.status(503).json({ error: 'AI is not configured on the server yet.' })
  const { message, language = 'English' } = request.body ?? {}
  if (typeof message !== 'string' || !message.trim()) return response.status(400).json({ error: 'Message is required.' })
  const prompt = `You are Vita, a cautious health companion for a Nigerian clinic. Reply in ${language}. Give brief, plain-language guidance, ask useful follow-up questions, and never diagnose or prescribe. For chest pain, trouble breathing, stroke signs, severe bleeding, seizures, unconsciousness, or suicidal thoughts, say to contact emergency services immediately. Label uncertainty and recommend the clinic when appropriate.\n\nPatient message: ${message.trim()}`
  const result = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL || 'gemini-2.5-flash'}:generateContent?key=${process.env.GEMINI_API_KEY}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) })
  if (!result.ok) return response.status(502).json({ error: 'The AI service is temporarily unavailable.' })
  const payload = await result.json()
  const text = payload.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) return response.status(502).json({ error: 'The AI returned no guidance.' })
  response.json({ text })
}))

app.listen(port, () => console.log(`Vita API listening on http://localhost:${port}`))
