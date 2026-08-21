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
    return ensureDatabaseShape(JSON.parse(await readFile(databasePath, 'utf8')))
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
    const database = createEmptyDatabase()
    await mkdir(dataDirectory, { recursive: true })
    await writeFile(databasePath, JSON.stringify(database, null, 2))
    return database
  }
}

function createEmptyDatabase() {
  return {
    users: [],
    sessions: [],
    profiles: [],
    medications: [],
    medicationEvents: [],
    labs: [],
    messages: [],
    escalations: [],
    notes: [],
    appointments: [],
    patients: [],
  }
}

function ensureDatabaseShape(database) {
  const empty = createEmptyDatabase()
  for (const key of Object.keys(empty)) database[key] ??= []
  return database
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
  return { id: user.id, email: user.email, role: user.role, language: user.language, patientId: user.patientId }
}

function now() {
  return new Date().toISOString()
}

function daysAgo(days, hour = 8) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  date.setHours(hour, 0, 0, 0)
  return date.toISOString()
}

function seedPatientRecords(database, user) {
  if (user.role !== 'patient' || user.patientId) return
  user.patientId = `p-${user.id.slice(0, 8)}`
  database.profiles.push({
    patientId: user.patientId,
    name: 'New Vita patient',
    age: '',
    conditions: '',
    medications: '',
    caregiver: '',
    language: user.language || 'English',
    notifications: true,
  })
  database.messages.push({
    id: crypto.randomUUID(),
    patientId: user.patientId,
    from: 'vita',
    text: "I'm Vita, your companion between visits. Tell me how you feel, or use the microphone.",
    createdAt: now(),
  })
  const starterMeds = [
    ['Metformin', '500 mg', 'Twice daily', '08:00'],
    ['Lisinopril', '10 mg', 'Once daily', '08:00'],
    ['Amlodipine', '5 mg', 'Once daily', '20:00'],
  ]
  starterMeds.forEach(([name, dosage, frequency, reminder], index) => {
    const medicationId = crypto.randomUUID()
    database.medications.push({ id: medicationId, patientId: user.patientId, name, dosage, frequency, reminder, verified: false })
    for (let day = 0; day < 7; day += 1) {
      if ((day + index) % 4 !== 0) database.medicationEvents.push({ id: crypto.randomUUID(), patientId: user.patientId, medicationId, status: 'taken', occurredAt: daysAgo(day, Number(reminder.slice(0, 2))), source: 'system' })
    }
  })
}

function clinicPatients(database) {
  return database.profiles.map((profile) => {
    const events = database.medicationEvents.filter((item) => item.patientId === profile.patientId)
    const taken = events.filter((item) => item.status === 'taken').length
    const adherence = events.length ? Math.round((taken / events.length) * 100) : 0
    const latest = database.messages.filter((item) => item.patientId === profile.patientId).sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))[0]
    const flagged = database.labs.filter((item) => item.patientId === profile.patientId && item.flagged)
    return {
      id: profile.patientId,
      name: profile.name || 'Unnamed patient',
      age: Number(profile.age) || 0,
      adherence,
      conditions: profile.conditions || 'No conditions recorded',
      lastContact: latest?.createdAt || 'No contact yet',
      risk: flagged[0] ? `${flagged[0].name} flagged` : 'No active flags',
    }
  })
}

function addTimelineMessage(database, patientId, from, text) {
  database.messages.push({ id: crypto.randomUUID(), patientId, from, text, createdAt: now() })
}

function medicationStatus(database, medication, patientId) {
  const today = new Date().toISOString().slice(0, 10)
  const event = database.medicationEvents
    .filter((item) => item.medicationId === medication.id && item.patientId === patientId && item.occurredAt.slice(0, 10) === today)
    .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))[0]
  return event?.status || 'due'
}

function patientPayload(database, patientId) {
  const profile = database.profiles.find((item) => item.patientId === patientId)
  const medications = database.medications
    .filter((item) => item.patientId === patientId)
    .map((item) => ({ ...item, status: medicationStatus(database, item, patientId) }))
  return {
    profile,
    medications,
    medicationEvents: database.medicationEvents.filter((item) => item.patientId === patientId),
    labs: database.labs.filter((item) => item.patientId === patientId),
    messages: database.messages.filter((item) => item.patientId === patientId),
    escalations: database.escalations.filter((item) => item.patientId === patientId),
    notes: database.notes.filter((item) => item.patientId === patientId),
    appointments: database.appointments.filter((item) => item.patientId === patientId),
  }
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
    request.database = database
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
  seedPatientRecords(database, user)
  const token = createSession(database, user.id)
  await writeDatabase(database)
  response.status(201).json({ token, user: publicUser(user) })
})

app.post('/api/auth/login', async (request, response) => {
  const { email, password } = request.body ?? {}
  const database = await readDatabase()
  const user = database.users.find((item) => item.email === email?.toLowerCase())
  if (!user || typeof password !== 'string' || !samePassword(password, user)) return response.status(401).json({ error: 'Email or password is incorrect.' })
  seedPatientRecords(database, user)
  const token = createSession(database, user.id)
  await writeDatabase(database)
  response.json({ token, user: publicUser(user) })
})

app.get('/api/me', requireUser(async (request, response, database) => {
  if (request.user.role === 'patient') {
    seedPatientRecords(database, request.user)
    await writeDatabase(database)
    return response.json({ user: publicUser(request.user), ...patientPayload(database, request.user.patientId) })
  }
  response.json({
    user: publicUser(request.user),
    clinicPatients: clinicPatients(database),
    escalations: database.escalations,
    notes: database.notes,
    appointments: database.appointments,
    patientRecords: Object.fromEntries(database.profiles.map((profile) => [profile.patientId, patientPayload(database, profile.patientId)])),
  })
}))

app.patch('/api/profile', requireUser(async (request, response) => {
  const database = await readDatabase()
  if (request.user.role !== 'patient') return response.status(403).json({ error: 'Patient access required.' })
  seedPatientRecords(database, request.user)
  const profile = database.profiles.find((item) => item.patientId === request.user.patientId)
  Object.assign(profile, request.body)
  await writeDatabase(database)
  response.json(profile)
}))

app.post('/api/medications', requireUser(async (request, response, database) => {
  if (request.user.role !== 'patient') return response.status(403).json({ error: 'Patient access required.' })
  const { name, dosage, frequency, reminder } = request.body ?? {}
  if (!name?.trim()) return response.status(400).json({ error: 'Medication name is required.' })
  const medication = { id: crypto.randomUUID(), patientId: request.user.patientId, name: name.trim(), dosage: dosage?.trim() || 'As prescribed', frequency: frequency || 'Once daily', reminder: reminder || '08:00', verified: false }
  database.medications.push(medication)
  await writeDatabase(database)
  response.status(201).json({ ...medication, status: 'due' })
}))

app.post('/api/medications/:id/events', requireUser(async (request, response) => {
  const database = await readDatabase()
  if (request.user.role !== 'patient') return response.status(403).json({ error: 'Patient access required.' })
  const medication = database.medications.find((item) => item.id === request.params.id && item.patientId === request.user.patientId)
  if (!medication || !['taken', 'skipped'].includes(request.body?.status)) return response.status(400).json({ error: 'Invalid medication event.' })
  const event = { id: crypto.randomUUID(), patientId: request.user.patientId, medicationId: medication.id, status: request.body.status, occurredAt: now(), source: 'patient' }
  database.medicationEvents.push(event)
  await writeDatabase(database)
  response.status(201).json(event)
}))

app.post('/api/labs', requireUser(async (request, response) => {
  const database = await readDatabase()
  if (request.user.role !== 'patient') return response.status(403).json({ error: 'Patient access required.' })
  const lab = { id: crypto.randomUUID(), patientId: request.user.patientId, ...request.body, collectedAt: request.body?.collectedAt || now(), verified: false }
  if (!lab.name || !lab.value) return response.status(400).json({ error: 'Lab name and value are required.' })
  database.labs.unshift(lab)
  await writeDatabase(database)
  response.status(201).json(lab)
}))

app.post('/api/escalations', requireUser(async (request, response) => {
  const database = await readDatabase()
  const patientId = request.user.role === 'patient' ? request.user.patientId : request.body?.patientId
  if (!patientId) return response.status(400).json({ error: 'Patient is required.' })
  const escalation = { id: crypto.randomUUID(), patientId, patientName: database.profiles.find((item) => item.patientId === patientId)?.name || 'Patient', type: request.body?.type || 'clinical-review', urgency: request.body?.urgency || 'medium', summary: request.body?.summary || 'Clinical review requested.', status: 'new', createdAt: now(), contactAttempts: 0, reviewed: false }
  database.escalations.unshift(escalation)
  await writeDatabase(database)
  response.status(201).json(escalation)
}))

app.patch('/api/escalations/:id', requireUser(async (request, response) => {
  const database = await readDatabase()
  if (request.user.role !== 'clinic') return response.status(403).json({ error: 'Clinic access required.' })
  const escalation = database.escalations.find((item) => item.id === request.params.id)
  if (!escalation) return response.status(404).json({ error: 'Escalation not found.' })
  const allowed = ['new', 'assigned', 'contact-attempted', 'waiting-for-patient', 'resolved', 'escalated-to-clinician']
  if (request.body?.status && allowed.includes(request.body.status)) {
    escalation.status = request.body.status
    escalation.reviewed = request.body.status !== 'new'
    if (!escalation.firstRespondedAt && request.body.status !== 'new') escalation.firstRespondedAt = now()
  }
  if (request.body?.assignedStaff !== undefined) escalation.assignedStaff = request.body.assignedStaff
  if (request.body?.resolutionNote !== undefined) escalation.resolutionNote = request.body.resolutionNote
  if (request.body?.contactAttempt) escalation.contactAttempts += 1
  await writeDatabase(database)
  response.json(escalation)
}))

app.post('/api/notes', requireUser(async (request, response) => {
  const database = await readDatabase()
  if (request.user.role !== 'clinic') return response.status(403).json({ error: 'Clinic access required.' })
  const note = { id: crypto.randomUUID(), patientId: request.body?.patientId, note: request.body?.note?.trim(), createdAt: now(), author: request.user.email }
  if (!note.patientId || !note.note) return response.status(400).json({ error: 'Patient and note are required.' })
  database.notes.push(note)
  await writeDatabase(database)
  response.status(201).json(note)
}))

app.post('/api/appointments', requireUser(async (request, response) => {
  const database = await readDatabase()
  if (request.user.role !== 'patient') return response.status(403).json({ error: 'Patient access required.' })
  const appointment = { id: crypto.randomUUID(), patientId: request.user.patientId, clinic: request.body?.clinic, preferredTime: request.body?.preferredTime, status: 'requested', createdAt: now() }
  database.appointments.push(appointment)
  await writeDatabase(database)
  response.status(201).json(appointment)
}))

app.post('/api/ai/chat', requireUser(async (request, response) => {
  if (request.user.role !== 'patient') return response.status(403).json({ error: 'AI chat is available for patients.' })
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.startsWith('replace-')) return response.status(503).json({ error: 'AI is not configured on the server yet.' })
  const { message, language = 'English' } = request.body ?? {}
  if (typeof message !== 'string' || !message.trim()) return response.status(400).json({ error: 'Message is required.' })
  addTimelineMessage(request.database, request.user.patientId, 'user', message.trim())
  const prompt = `You are Vita, a cautious health companion for a Nigerian clinic. Reply in ${language}. Give brief, plain-language guidance, ask useful follow-up questions, and never diagnose or prescribe. For chest pain, trouble breathing, stroke signs, severe bleeding, seizures, unconsciousness, or suicidal thoughts, say to contact emergency services immediately. Label uncertainty and recommend the clinic when appropriate.\n\nPatient message: ${message.trim()}`
  const result = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL || 'gemini-2.5-flash'}:generateContent?key=${process.env.GEMINI_API_KEY}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) })
  if (!result.ok) return response.status(502).json({ error: 'The AI service is temporarily unavailable.' })
  const payload = await result.json()
  const text = payload.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) return response.status(502).json({ error: 'The AI returned no guidance.' })
  addTimelineMessage(request.database, request.user.patientId, 'vita', text)
  await writeDatabase(request.database)
  response.json({ text })
}))

app.listen(port, () => console.log(`Vita API listening on http://localhost:${port}`))
