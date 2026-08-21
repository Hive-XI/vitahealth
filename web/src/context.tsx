import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type {
  ChatMessage,
  ClinicPatient,
  Escalation,
  LabResult,
  Medication,
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
  sendChat: (text: string) => Promise<'ok' | 'emergency'>
  requestClinicalReview: (reason: string) => void
  markEscalationReviewed: (id: string) => void
  addClinicalNote: (patientId: string, note: string) => void
  notes: Record<string, string[]>
  logout: () => void
}

const defaultMeds: Medication[] = [
  {
    id: 'm1',
    name: 'Metformin',
    dosage: '500 mg',
    frequency: 'Twice daily',
    reminder: '08:00',
    status: 'taken',
  },
  {
    id: 'm2',
    name: 'Lisinopril',
    dosage: '10 mg',
    frequency: 'Once daily',
    reminder: '08:00',
    status: 'due',
  },
  {
    id: 'm3',
    name: 'Amlodipine',
    dosage: '5 mg',
    frequency: 'Once daily',
    reminder: '20:00',
    status: 'due',
  },
]

const defaultLabs: LabResult[] = [
  {
    id: 'l1',
    name: 'HbA1c',
    value: '8.2',
    unit: '%',
    range: 'Below 7.0%',
    flagged: true,
    note: 'Above the report range. A clinician should review.',
  },
  {
    id: 'l2',
    name: 'LDL cholesterol',
    value: '2.4',
    unit: 'mmol/L',
    range: 'Below 2.6 mmol/L',
    flagged: false,
    note: 'Within the report range.',
  },
  {
    id: 'l3',
    name: 'Creatinine',
    value: '78',
    unit: 'µmol/L',
    range: '45–90 µmol/L',
    flagged: false,
    note: 'Within the report range.',
  },
]

const defaultPatients: ClinicPatient[] = [
  {
    id: 'p1',
    name: 'Amara Okafor',
    age: 34,
    adherence: 67,
    conditions: 'Type 2 diabetes, hypertension',
    lastContact: 'Today',
    risk: 'Missed evening dose · flagged HbA1c',
  },
  {
    id: 'p2',
    name: 'Kwame Mensah',
    age: 58,
    adherence: 91,
    conditions: 'Heart failure',
    lastContact: 'Yesterday',
    risk: 'Stable',
  },
  {
    id: 'p3',
    name: 'Fatima Diallo',
    age: 41,
    adherence: 42,
    conditions: 'Asthma, pregnancy follow-up',
    lastContact: '3 days ago',
    risk: 'Two missed inhaler doses',
  },
  {
    id: 'p4',
    name: 'Joseph Adeyemi',
    age: 67,
    adherence: 78,
    conditions: 'CKD stage 3',
    lastContact: 'Today',
    risk: 'Creatinine flagged last week',
  },
]

const defaultEscalations: Escalation[] = [
  {
    id: 'e1',
    patientId: 'p1',
    patientName: 'Amara Okafor',
    type: 'flagged-lab',
    urgency: 'high',
    summary: 'HbA1c 8.2% — above report range. Follow-up suggested.',
    reviewed: false,
  },
  {
    id: 'e2',
    patientId: 'p3',
    patientName: 'Fatima Diallo',
    type: 'missed-dose',
    urgency: 'high',
    summary: 'Inhaler marked skipped twice in 48 hours.',
    reviewed: false,
  },
  {
    id: 'e3',
    patientId: 'p4',
    patientName: 'Joseph Adeyemi',
    type: 'flagged-lab',
    urgency: 'medium',
    summary: 'Creatinine previously out of range. Review pending.',
    reviewed: false,
  },
  {
    id: 'e4',
    patientId: 'p2',
    patientName: 'Kwame Mensah',
    type: 'missed-dose',
    urgency: 'low',
    summary: 'One evening diuretic delayed, later taken.',
    reviewed: true,
  },
]

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
  const [notes, setNotes] = useState<Record<string, string[]>>({
    p1: ['Patient reports evening dose fatigue. Review BP meds at next visit.'],
  })
  const [profile, setProfile] = useState<Profile>({
    name: 'Amara Okafor',
    age: '34',
    conditions: 'Type 2 diabetes, hypertension',
    medications: 'Metformin 500 mg, Lisinopril 10 mg, Amlodipine 5 mg',
    caregiver: '',
    language: 'English',
    notifications: true,
  })
  const [medications, setMedications] = useState(defaultMeds)
  const [labs, setLabs] = useState(defaultLabs)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'c0',
      from: 'vita',
      text: "I'm Vita, your companion between visits. Tell me how you feel, or use the microphone.",
    },
  ])
  const [clinicPatients] = useState(defaultPatients)
  const [escalations, setEscalations] = useState(defaultEscalations)

  const value = useMemo<VitaState>(
    () => ({
      role,
      language,
      identifier,
      authMethod,
      profile,
      medications,
      labs,
      messages,
      clinicPatients,
      escalations,
      consentAi,
      consentData,
      demoBooked,
      notes,
      setRole,
      setLanguage,
      setIdentifier,
      setAuthMethod,
      setProfile,
      setConsent: (ai, data) => {
        setConsentAi(ai)
        setConsentData(data)
      },
      setDemoBooked,
      markMedication: (id, status) => {
        setMedications((current) =>
          current.map((med) => (med.id === id ? { ...med, status } : med)),
        )
      },
      addMedication: (med) => {
        setMedications((current) => [
          ...current,
          { ...med, id: `m${Date.now()}`, status: 'due' },
        ])
      },
      addLab: (lab) => {
        setLabs((current) => [{ ...lab, id: `l${Date.now()}` }, ...current])
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
          setEscalations((current) => [
            {
              id: `e${Date.now()}`,
              patientId: 'p1',
              patientName: profile.name || 'Amara Okafor',
              type: 'severe-symptom',
              urgency: 'high',
              summary: `Severe symptom report: ${text}`,
              reviewed: false,
            },
            ...current,
          ])
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
        } catch {
          setMessages((current) =>
            current.map((message, index) =>
              index === current.length - 1
                ? { ...message, text: vitaReply(text) }
                : message,
            ),
          )
        }
        return 'ok'
      },
      requestClinicalReview: (reason) => {
        setEscalations((current) => [
          {
            id: `e${Date.now()}`,
            patientId: 'p1',
            patientName: profile.name || 'Amara Okafor',
            type: 'clinical-review',
            urgency: 'medium',
            summary: reason,
            reviewed: false,
          },
          ...current,
        ])
      },
      markEscalationReviewed: (id) => {
        setEscalations((current) =>
          current.map((item) =>
            item.id === id ? { ...item, reviewed: true } : item,
          ),
        )
      },
      addClinicalNote: (patientId, note) => {
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
      },
    }),
    [
      role,
      language,
      identifier,
      authMethod,
      profile,
      medications,
      labs,
      messages,
      clinicPatients,
      escalations,
      consentAi,
      consentData,
      demoBooked,
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
