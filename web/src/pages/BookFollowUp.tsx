import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Field, inputClass } from '../components/ui'

const clinics = [
  'St. Mary’s District Hospital',
  'Riverside Family Clinic',
  'Harbour Community Health Centre',
]

export function BookFollowUp() {
  const navigate = useNavigate()
  const [clinic, setClinic] = useState(clinics[0])
  const [when, setWhen] = useState('Tomorrow morning')
  const [sent, setSent] = useState(false)

  function confirm(event: FormEvent) {
    event.preventDefault()
    setSent(true)
    window.setTimeout(() => navigate('/app'), 1200)
  }

  return (
    <form onSubmit={confirm} className="grid gap-4">
      <h1 className="font-display text-4xl font-bold">Book follow-up</h1>
      <p className="text-sm font-medium text-white/90">
        A result sat outside the report range. Vita does not choose treatment.
      </p>
      <Card className="grid gap-4">
        <Field id="clinic" label="Preferred clinic">
          <select
            id="clinic"
            className={inputClass}
            value={clinic}
            onChange={(event) => setClinic(event.target.value)}
          >
            {clinics.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </Field>
        <Field id="when" label="Preferred time">
          <select
            id="when"
            className={inputClass}
            value={when}
            onChange={(event) => setWhen(event.target.value)}
          >
            <option>Tomorrow morning</option>
            <option>Tomorrow afternoon</option>
            <option>This week</option>
          </select>
        </Field>
        <Button type="submit">Confirm request</Button>
        {sent ? (
          <p className="text-sm font-medium text-navy" role="status">
            Request sent to {clinic}. Returning to Today.
          </p>
        ) : null}
      </Card>
    </form>
  )
}
