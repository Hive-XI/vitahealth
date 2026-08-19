import { useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Card, Field, inputClass } from '../components/ui'
import { useVita } from '../context'

export function PatientDetail() {
  const { id } = useParams()
  const { clinicPatients, labs, medications, messages, notes, addClinicalNote } =
    useVita()
  const patient = clinicPatients.find((item) => item.id === id) ?? clinicPatients[0]
  const [note, setNote] = useState('')
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
      <Card>
        <h2 className="font-display text-lg font-semibold">
          Adherence history
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
      </Card>
      <Card>
        <h2 className="font-display text-lg font-semibold">
          Chat and lab flag log
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
      </Card>
      <Card>
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
      </Card>
    </div>
  )
}
