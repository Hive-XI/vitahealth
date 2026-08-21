import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type {
  ChatMessage,
  ClinicPatient,
  Escalation,
  LabResult,
  Medication,
  MedicationEvent,
  Appointment,
  TimelineEvent,
  Profile,
  Role,
} from './types'

type VitaState = {
  role: Role
  language: string
  identifier: string
  authMethod: 'email' | 'phone'
  profile: Profile
  medications: Medication[]
  labs: LabResult[]
  messages: ChatMessage[]
  clinicPatients: ClinicPatient[]
  escalations: Escalation[]
  consentAi: boolean
  consentData: boolean
  demoBooked: boolean
  setRole: (role: Role) => void
  setLanguage: (language: string) => void
  setIdentifier: (value: string) => void
  setAuthMethod: (method: 'email' | 'phone') => void
  setProfile: (profile: Profile) => void
  setConsent: (ai: boolean, data: boolean) => void
  setDemoBooked: (value: boolean) => void
  markMedication: (id: string, status: Medication['status']) => void
  addMedication: (med: Omit<Medication, 'id' | 'status'>) => void
  addLab: (lab: Omit<LabResult, 'id'>) => void
  requestAppointment: (clinic: string, preferredTime: string) => Promise<void>
  medicationEvents: MedicationEvent[]
  appointments: Appointment[]
  timeline: TimelineEvent[]
  patientRecords: Record<string, { medications: Medication[]; labs: LabResult[]; messages: ChatMessage[]; notes: { note: string }[]; appointments: Appointment[] }>
  sendChat: (text: string) => Promise<'ok' | 'emergency' | 'error'>
  requestClinicalReview: (reason: string) => void
  markEscalationReviewed: (id: string) => void
  updateEscalation: (id: string, status: Escalation['status']) => void
  addClinicalNote: (patientId: string, note: string) => void
  notes: Record<string, string[]>
  refreshWorkspace: () => Promise<void>
  logout: () => void
}

const emptyProfile: Profile = {
  name: '',
  age: '',
  conditions: '',
  medications: '',
  caregiver: '',
  language: 'English',
  notifications: true,
}

const VitaContext = createContext<VitaState | null>(null)

const severePattern =
  /chest pain|can't breathe|cannot breathe|shortness of breath|suicid|unconscious|stroke|seizure|severe bleed|coughing blood|faint(ed|ing)|worst headache|not waking/i

function vitaReply(text: string): string {
  const stamp = 'Vita companion guidance, with your clinic.\n\n'
  const lower = text.toLowerCase()
  if (lower.includes('headache')) {
    return (
      stamp +
      'Tier: self-care unless sudden and severe.\n\n1. Sudden or gradual?\n2. Fever, neck stiffness, or vision change?\n3. Usual medicines taken today?\n\nIf sudden and severe, or vision changes, seek in-person care. Otherwise rest and hydrate.'
    )
  }
  if (lower.includes('cough') || lower.includes('cold') || lower.includes('fever')) {
    return (
      stamp +
      'Tier: self-care if mild; see a clinician if it lasts or worsens.\n\n1. How many days?\n2. Wheeze, tightness, or blood in sputum?\n3. Drinking fluids and staying awake?\n\nHard to breathe or chest pain → Emergency. Lasts over 3 days → clinic.'
    )
  }
  if (lower.includes('sugar') || lower.includes('dizzy') || lower.includes('glucose')) {
    return (
      stamp +
      'Tier: follow your clinic protocol.\n\n1. Last glucose reading?\n2. Eaten and taken Metformin as scheduled?\n3. Vomiting, confusion, or fainting?\n\nConfused or faint → urgent care. Otherwise log the reading in Labs.'
    )
  }
  return (
    stamp +
    'Tier: self-care if mild; clinic if worse; Emergency for chest pain, breathing trouble, or stroke signs.\n\n1. When did this start?\n2. Chest pain, trouble breathing, bleeding, or fainting?\n3. Medicines taken today?\n\nIf unclear, your clinic reviews next.'
  )
}

export function VitaProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('patient')
  const [language, setLanguage] = useState('English')
  const [identifier, setIdentifier] = useState('')
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email')
  const [consentAi, setConsentAi] = useState(false)
  const [consentData, setConsentData] = useState(false)
  const [demoBooked, setDemoBooked] = useState(false)
  const [notes, setNotes] = useState<Record<string, string[]>>({})
  const [profile, setProfile] = useState<Profile>(emptyProfile)
  const [medications, setMedications] = useState<Medication[]>([])
  const [medicationEvents, setMedicationEvents] = useState<MedicationEvent[]>([])
  const [labs, setLabs] = useState<LabResult[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'c0',
      from: 'vita',
      text: "I'm Vita, your companion between visits. Tell me how you feel, or use the microphone.",
    },
  ])
  const [clinicPatients, setClinicPatients] = useState<ClinicPatient[]>([])
  const [escalations, setEscalations] = useState<Escalation[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [patientRecords, setPatientRecords] = useState<
    Record<
      string,
      {
        medications: Medication[]
        labs: LabResult[]
        messages: ChatMessage[]
        notes: { note: string }[]
        appointments: Appointment[]
      }
    >
  >({})

  async function refreshWorkspace() {
    const token = window.localStorage.getItem('vita.token')
    if (!token) return
    try {
      const response = await fetch('/api/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) return
      const payload = await response.json()
      if (payload.user?.role) setRole(payload.user.role)
      if (payload.user?.language) setLanguage(payload.user.language)
      if (payload.user?.email) setIdentifier(payload.user.email)
      if (payload.profile) setProfile(payload.profile)
      setMedications(payload.medications ?? [])
      setMedicationEvents(payload.medicationEvents ?? [])
      setLabs(payload.labs ?? [])
      if (payload.messages?.length) setMessages(payload.messages)
      setEscalations(payload.escalations ?? [])
      setAppointments(payload.appointments ?? [])
      setClinicPatients(payload.clinicPatients ?? [])
      setPatientRecords(payload.patientRecords ?? {})
      if (payload.notes) {
        const byPatient: Record<string, string[]> = {}
        for (const item of payload.notes as { patientId: string; note: string }[]) {
          byPatient[item.patientId] ??= []
          byPatient[item.patientId].push(item.note)
        }
        setNotes(byPatient)
      }
    } catch {
      /* keep current workspace if API is briefly unavailable */
    }
  }

  useEffect(() => {
    void refreshWorkspace()
  }, [])

  const value = useMemo<VitaState>(
    () => ({
      role,
      language,
      identifier,
      authMethod,
      profile,
      medications,
      medicationEvents,
      labs,
      messages,
      clinicPatients,
      escalations,
      consentAi,
      consentData,
      demoBooked,
      appointments,
      patientRecords,
      timeline: [
        ...messages.map((message) => ({
          id: message.id,
          patientId: message.patientId || 'p1',
          type: message.from === 'user' ? 'symptom' as const : 'ai' as const,
          title: message.from === 'user' ? 'Symptom reported' : 'Vita guidance',
          description: message.text,
          occurredAt: message.createdAt || new Date().toISOString(),
        })),
        ...medicationEvents.map((event) => ({
          id: event.id,
          patientId: event.patientId,
          type: 'medication' as const,
          title: `Medication ${event.status}`,
          description: medications.find((med) => med.id === event.medicationId)?.name || 'Medication',
          occurredAt: event.occurredAt,
        })),
        ...labs.map((lab) => ({
          id: lab.id,
          patientId: lab.patientId || 'p1',
          type: 'lab' as const,
          title: `${lab.name} result`,
          description: `${lab.value} ${lab.unit}`,
          occurredAt: lab.collectedAt || new Date().toISOString(),
        })),
      ].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt)),
      notes,
      setRole,
      setLanguage,
      setIdentifier,
      setAuthMethod,
      setProfile: (nextProfile) => {
        setProfile(nextProfile)
        const token = window.localStorage.getItem('vita.token')
        void fetch('/api/profile', {
          method: 'PATCH',
          headers: { 'content-type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify(nextProfile),
        })
      },
      setConsent: (ai, data) => {
        setConsentAi(ai)
        setConsentData(data)
      },
      setDemoBooked,
      markMedication: async (id, status) => {
        setMedications((current) =>
          current.map((med) => (med.id === id ? { ...med, status } : med)),
        )
        const token = window.localStorage.getItem('vita.token')
        const response = await fetch(`/api/medications/${id}/events`, {
          method: 'POST',
          headers: { 'content-type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ status }),
        })
        if (response.ok) {
          const event = await response.json()
          setMedicationEvents((current) => [...current, event])
        }
      },
      addMedication: async (med) => {
        const token = window.localStorage.getItem('vita.token')
        const response = await fetch('/api/medications', {
          method: 'POST',
          headers: { 'content-type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify(med),
        })
        if (response.ok) {
          const medication = await response.json()
          setMedications((current) => [...current, medication])
        }
      },
      addLab: async (lab) => {
        const token = window.localStorage.getItem('vita.token')
        const response = await fetch('/api/labs', {
          method: 'POST',
          headers: { 'content-type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify(lab),
        })
        if (response.ok) {
          const lab = await response.json()
          setLabs((current) => [lab, ...current])
        }
      },
      requestAppointment: async (clinic, preferredTime) => {
        const token = window.localStorage.getItem('vita.token')
        const response = await fetch('/api/appointments', {
          method: 'POST',
          headers: { 'content-type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ clinic, preferredTime }),
        })
        if (response.ok) {
          const appointment = await response.json()
          setAppointments((current) => [...current, appointment])
        }
      },
      sendChat: async (text) => {
        if (severePattern.test(text)) {
          setMessages((current) => [
            ...current,
            { id: `u${Date.now()}`, from: 'user', text },
            {
              id: `v${Date.now()}`,
              from: 'vita',
              text: 'This needs emergency care. Redirecting.',
            },
          ])
          void fetch('/api/escalations', { method: 'POST', headers: { 'content-type': 'application/json', Authorization: `Bearer ${window.localStorage.getItem('vita.token')}` }, body: JSON.stringify({ type: 'severe-symptom', urgency: 'high', summary: `Severe symptom report: ${text}` }) })
          return 'emergency'
        }
        setMessages((current) => [
          ...current,
          { id: `u${Date.now()}`, from: 'user', text },
          { id: `v${Date.now() + 1}`, from: 'vita', text: 'Vita is thinking…' },
        ])
        try {
          const token = window.localStorage.getItem('vita.token')
          const result = await fetch('/api/ai/chat', {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ message: text, language }),
          })
          const payload = (await result.json()) as { text?: string; error?: string }
          const reply = result.ok && payload.text ? payload.text : payload.error ?? vitaReply(text)
          setMessages((current) =>
            current.map((message, index) =>
              index === current.length - 1 ? { ...message, text: reply } : message,
            ),
          )
          return result.ok && payload.text ? 'ok' : 'error'
        } catch {
          setMessages((current) =>
            current.map((message, index) =>
              index === current.length - 1
                ? { ...message, text: vitaReply(text) }
                : message,
            ),
          )
          return 'error'
        }
      },
      requestClinicalReview: (reason) => {
        void fetch('/api/escalations', { method: 'POST', headers: { 'content-type': 'application/json', Authorization: `Bearer ${window.localStorage.getItem('vita.token')}` }, body: JSON.stringify({ type: 'clinical-review', urgency: 'medium', summary: reason }) })
      },
      markEscalationReviewed: (id) => {
        setEscalations((current) =>
          current.map((item) =>
            item.id === id ? { ...item, reviewed: true, status: 'resolved' } : item,
          ),
        )
        void fetch(`/api/escalations/${id}`, { method: 'PATCH', headers: { 'content-type': 'application/json', Authorization: `Bearer ${window.localStorage.getItem('vita.token')}` }, body: JSON.stringify({ status: 'resolved' }) })
      },
      updateEscalation: (id, status) => {
        setEscalations((current) => current.map((item) => item.id === id ? { ...item, status, reviewed: status !== 'new' } : item))
        void fetch(`/api/escalations/${id}`, { method: 'PATCH', headers: { 'content-type': 'application/json', Authorization: `Bearer ${window.localStorage.getItem('vita.token')}` }, body: JSON.stringify({ status }) })
      },
      addClinicalNote: (patientId, note) => {
        void fetch('/api/notes', { method: 'POST', headers: { 'content-type': 'application/json', Authorization: `Bearer ${window.localStorage.getItem('vita.token')}` }, body: JSON.stringify({ patientId, note }) })
        setNotes((current) => ({
          ...current,
          [patientId]: [...(current[patientId] ?? []), note],
        }))
      },
      logout: () => {
        window.localStorage.removeItem('vita.token')
        setIdentifier('')
        setAuthMethod('email')
        setConsentAi(false)
        setConsentData(false)
        setRole('patient')
        setProfile(emptyProfile)
        setMedications([])
        setMedicationEvents([])
        setLabs([])
        setClinicPatients([])
        setEscalations([])
        setAppointments([])
        setPatientRecords({})
        setNotes({})
        setMessages([
          {
            id: 'c0',
            from: 'vita',
            text: "I'm Vita, your companion between visits. Tell me how you feel, or use the microphone.",
          },
        ])
      },
      refreshWorkspace,
    }),
    [
      role,
      language,
      identifier,
      authMethod,
      profile,
      medications,
      medicationEvents,
      labs,
      messages,
      clinicPatients,
      escalations,
      consentAi,
      consentData,
      demoBooked,
      appointments,
      patientRecords,
      notes,
    ],
  )

  return <VitaContext.Provider value={value}>{children}</VitaContext.Provider>
}

export function useVita() {
  const context = useContext(VitaContext)
  if (!context) throw new Error('useVita must be used inside VitaProvider')
  return context
}

export function adherencePercent(meds: Medication[]) {
  if (meds.length === 0) return 0
  const taken = meds.filter((med) => med.status === 'taken').length
  return Math.round((taken / meds.length) * 100)
}
