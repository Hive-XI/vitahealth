import { useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Card, Field, inputClass } from '../components/ui'
import { useVita } from '../context'

export function PatientDetail() {
  const { id } = useParams()
  const { clinicPatients, patientRecords, notes, addClinicalNote } =
    useVita()
  const patient = clinicPatients.find((item) => item.id === id) ?? clinicPatients[0]
  const record = patientRecords[patient.id]
  const labs = record?.labs ?? []
  const medications = record?.medications ?? []
  const messages = record?.messages ?? []
  const appointments = record?.appointments ?? []
  const [note, setNote] = useState('')
  const [tab, setTab] = useState<'overview' | 'timeline' | 'medications' | 'labs' | 'conversations' | 'appointments' | 'notes'>('overview')
  const history = notes[patient.id] ?? []

  function addNote(event: FormEvent) {
    event.preventDefault()
    if (!note.trim()) return
    addClinicalNote(patient.id, note.trim())
    setNote('')
  }

  return (
    <div className="grid gap-4">
      <header>
        <h1 className="font-display text-4xl font-bold">{patient.name}</h1>
        <p className="font-medium text-white/90">
          {patient.age} · {patient.conditions} · adherence {patient.adherence}%
        </p>
      </header>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="secondary">Contact patient</Button>
        <Button type="button" variant="secondary">Assign follow-up</Button>
        <Button type="button">Verify care plan</Button>
      </div>
      <nav aria-label="Patient record sections" className="flex gap-2 overflow-x-auto border-b border-white/20 pb-2">
        {(['overview', 'timeline', 'medications', 'labs', 'conversations', 'appointments', 'notes'] as const).map((item) => (
          <button key={item} type="button" onClick={() => setTab(item)} className={`min-h-10 whitespace-nowrap rounded-lg px-3 text-sm font-semibold capitalize ${tab === item ? 'bg-white text-navy' : 'text-white/75 hover:bg-white/10'}`}>
            {item}
          </button>
        ))}
      </nav>
      {tab === 'overview' || tab === 'medications' ? <Card>
        <h2 className="font-display text-lg font-semibold">
          {tab === 'overview' ? 'Adherence history' : 'Medication plan'}
        </h2>
        <ul className="mt-3 grid gap-2 text-sm">
          {medications.map((med) => (
            <li key={med.id} className="flex justify-between">
              <span>
                {med.name} {med.dosage}
              </span>
              <span className="capitalize text-muted">{med.status}</span>
            </li>
          ))}
        </ul>
      </Card> : null}
      {tab === 'overview' || tab === 'labs' || tab === 'conversations' ? <Card>
        <h2 className="font-display text-lg font-semibold">
          {tab === 'conversations' ? 'Conversation history' : tab === 'labs' ? 'Lab results' : 'Chat and lab flag log'}
        </h2>
        <ul className="mt-3 grid gap-2 text-sm text-muted">
          {labs
            .filter((lab) => lab.flagged)
            .map((lab) => (
              <li key={lab.id}>
                Flag: {lab.name} {lab.value}
                {lab.unit}
              </li>
            ))}
          {messages
            .filter((message) => message.from === 'user')
            .slice(-3)
            .map((message) => (
              <li key={message.id}>Chat: {message.text}</li>
            ))}
        </ul>
      </Card> : null}
      {tab === 'timeline' ? <Card>
        <h2 className="font-display text-lg font-semibold">Longitudinal timeline</h2>
        <ol className="mt-3 grid gap-4 border-l border-line pl-4 text-sm">
          {[...messages.map((message) => ({ title: message.from === 'user' ? 'Symptom reported' : 'Vita guidance', description: message.text, date: message.createdAt })), ...labs.map((lab) => ({ title: `${lab.name} result`, description: `${lab.value} ${lab.unit}`, date: lab.collectedAt }))].map((event, index) => <li key={`${event.title}-${index}`}><p className="font-semibold">{event.title}</p><p className="text-muted">{event.description}</p><p className="mt-1 text-xs text-muted">{event.date ? new Date(event.date).toLocaleString() : 'Recent'}</p></li>)}
        </ol>
      </Card> : null}
      {tab === 'appointments' ? <Card>
        <h2 className="font-display text-lg font-semibold">Appointments</h2>
        <ul className="mt-3 grid gap-3 text-sm">{appointments.length === 0 ? <li className="text-muted">No appointments requested.</li> : appointments.map((appointment) => <li key={appointment.id} className="flex justify-between border-b border-line pb-3"><span className="font-semibold">{appointment.clinic}<span className="block font-normal text-muted">{appointment.preferredTime}</span></span><span className="capitalize text-muted">{appointment.status}</span></li>)}</ul>
      </Card> : null}
      {tab === 'overview' || tab === 'notes' ? <Card>
        <h2 className="font-display text-lg font-semibold">Clinical notes</h2>
        <ul className="mt-3 grid gap-2 text-sm">
          {history.length === 0 ? (
            <li className="text-muted">No notes yet.</li>
          ) : (
            history.map((item) => <li key={item}>{item}</li>)
          )}
        </ul>
        <form onSubmit={addNote} className="mt-4 grid gap-3">
          <Field id="note" label="Add clinical note">
            <textarea
              id="note"
              className={`${inputClass} min-h-24 py-3`}
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </Field>
          <Button type="submit">Save note</Button>
        </form>
      </Card> : null}
    </div>
  )
}
