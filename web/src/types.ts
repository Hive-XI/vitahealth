export type Role = 'patient' | 'clinic'

export type MedStatus = 'due' | 'taken' | 'skipped'

export type Medication = {
  id: string
  patientId?: string
  name: string
  dosage: string
  frequency: string
  reminder: string
  status?: MedStatus
  verified?: boolean
}

export type MedicationEvent = {
  id: string
  patientId: string
  medicationId: string
  status: Exclude<MedStatus, 'due'>
  occurredAt: string
  source: 'patient' | 'clinic' | 'system'
}

export type LabResult = {
  id: string
  patientId?: string
  name: string
  value: string
  unit: string
  range: string
  flagged: boolean
  note: string
  collectedAt?: string
  verified?: boolean
}

export type ChatMessage = {
  id: string
  patientId?: string
  from: 'user' | 'vita'
  text: string
  createdAt?: string
}

export type EscalationStatus =
  | 'new'
  | 'assigned'
  | 'contact-attempted'
  | 'waiting-for-patient'
  | 'resolved'
  | 'escalated-to-clinician'

export type Escalation = {
  id: string
  patientId: string
  patientName: string
  type: 'missed-dose' | 'flagged-lab' | 'severe-symptom' | 'clinical-review'
  urgency: 'high' | 'medium' | 'low'
  summary: string
  reviewed?: boolean
  status: EscalationStatus
  createdAt: string
  assignedStaff?: string
  contactAttempts: number
  resolutionNote?: string
  firstRespondedAt?: string
}

export type ClinicPatient = {
  id: string
  name: string
  age: number
  adherence: number
  conditions: string
  lastContact: string
  risk: string
  userId?: string
}

export type ClinicalNote = {
  id: string
  patientId: string
  note: string
  createdAt: string
  author: string
}

export type Appointment = {
  id: string
  patientId: string
  clinic: string
  preferredTime: string
  status: 'requested' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: string
}

export type TimelineEvent = {
  id: string
  patientId: string
  type: 'symptom' | 'ai' | 'medication' | 'lab' | 'appointment' | 'note' | 'escalation'
  title: string
  description: string
  occurredAt: string
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
