import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Field, inputClass } from '../components/ui'
import { useVita } from '../context'

export function BookFollowUp() {
  const navigate = useNavigate()
  const [clinic, setClinic] = useState('')
  const [when, setWhen] = useState('')
  const [sent, setSent] = useState(false)
  const { requestAppointment } = useVita()

  async function confirm(event: FormEvent) {
    event.preventDefault()
    if (!clinic.trim() || !when.trim()) return
    await requestAppointment(clinic.trim(), when.trim())
    setSent(true)
    window.setTimeout(() => navigate('/app'), 1200)
  }

  return (
    <form onSubmit={confirm} className="grid gap-4">
      <h1 className="font-display text-4xl font-bold">Book follow-up</h1>
      <p className="text-sm font-medium text-white/90">
        A result sat outside the report range. Your clinician chooses next steps.
      </p>
      <Card className="grid gap-4">
        <Field id="clinic" label="Preferred clinic">
          <input
            id="clinic"
            className={inputClass}
            value={clinic}
            onChange={(event) => setClinic(event.target.value)}
            placeholder="Your clinic name"
            required
          />
        </Field>
        <Field id="when" label="Preferred time">
          <input
            id="when"
            className={inputClass}
            value={when}
            onChange={(event) => setWhen(event.target.value)}
            placeholder="e.g. Tomorrow morning"
            required
          />
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
