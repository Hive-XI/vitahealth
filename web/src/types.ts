export type Role = 'patient' | 'clinic'

export type MedStatus = 'due' | 'taken' | 'skipped'

export type Medication = {
  id: string
  name: string
  dosage: string
  frequency: string
  reminder: string
  status: MedStatus
}

export type LabResult = {
  id: string
  name: string
  value: string
  unit: string
  range: string
  flagged: boolean
  note: string
}

export type ChatMessage = {
  id: string
  from: 'user' | 'vita'
  text: string
}

export type Escalation = {
  id: string
  patientId: string
  patientName: string
  type: 'missed-dose' | 'flagged-lab' | 'severe-symptom' | 'clinical-review'
  urgency: 'high' | 'medium' | 'low'
  summary: string
  reviewed: boolean
}

export type ClinicPatient = {
  id: string
  name: string
  age: number
  adherence: number
  conditions: string
  lastContact: string
  risk: string
}

export type Profile = {
  name: string
  age: string
  conditions: string
  medications: string
  caregiver: string
  language: string
  notifications: boolean
}
