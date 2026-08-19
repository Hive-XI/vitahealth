import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Field, inputClass } from '../components/ui'
import { useVita } from '../context'

export function AddMed() {
  const navigate = useNavigate()
  const { addMedication } = useVita()
  const [name, setName] = useState('')
  const [dosage, setDosage] = useState('')
  const [frequency, setFrequency] = useState('Once daily')
  const [reminder, setReminder] = useState('08:00')

  function save(event: FormEvent) {
    event.preventDefault()
    if (!name.trim()) return
    addMedication({
      name: name.trim(),
      dosage: dosage.trim() || 'As prescribed',
      frequency,
      reminder,
    })
    navigate('/app/meds')
  }

  return (
    <form onSubmit={save} className="grid gap-4">
      <h1 className="font-display text-4xl font-bold">Add medication</h1>
      <p className="text-sm font-medium text-white/90">
        Prefer a clinic-verified plan. Manual entry is temporary.
      </p>
      <Card className="grid gap-4">
        <Field id="med-name" label="Name">
          <input
            id="med-name"
            className={inputClass}
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </Field>
        <Field id="dosage" label="Dosage">
          <input
            id="dosage"
            className={inputClass}
            value={dosage}
            onChange={(event) => setDosage(event.target.value)}
            placeholder="10 mg"
          />
        </Field>
        <Field id="frequency" label="Frequency">
          <select
            id="frequency"
            className={inputClass}
            value={frequency}
            onChange={(event) => setFrequency(event.target.value)}
          >
            <option>Once daily</option>
            <option>Twice daily</option>
            <option>Three times daily</option>
            <option>As needed</option>
          </select>
        </Field>
        <Field id="reminder" label="Reminder time">
          <input
            id="reminder"
            type="time"
            className={inputClass}
            value={reminder}
            onChange={(event) => setReminder(event.target.value)}
          />
        </Field>
        <Button type="submit">Save to schedule</Button>
      </Card>
    </form>
  )
}
