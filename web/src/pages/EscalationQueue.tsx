import { Link } from 'react-router-dom'
import { Button, Card } from '../components/ui'
import { useVita } from '../context'

const urgencyRank = { high: 0, medium: 1, low: 2 }

export function EscalationQueue() {
  const { escalations, updateEscalation } = useVita()
  const sorted = [...escalations].sort(
    (a, b) =>
      Number(a.reviewed) - Number(b.reviewed) ||
      urgencyRank[a.urgency] - urgencyRank[b.urgency],
  )

  return (
    <div className="grid gap-4">
      <h1 className="font-display text-4xl font-bold">Escalation queue</h1>
      <p className="font-medium text-white/90">Highest urgency first.</p>
      {sorted.map((item) => (
        <Card key={item.id}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="kicker text-xs text-muted">
                {item.type.replace('-', ' ')} · {item.urgency}
              </p>
              <h2 className="font-display mt-1 text-lg font-semibold">
                {item.patientName}
              </h2>
              <p className="mt-1 text-sm text-muted">{item.summary}</p>
            </div>
            <span className="rounded-full bg-navy/10 px-2.5 py-1 text-xs font-semibold text-navy">
              {item.status.replaceAll('-', ' ')}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <select
              aria-label={`Update ${item.patientName} escalation status`}
              className="min-h-11 rounded-xl border border-line bg-white px-3 text-sm font-semibold capitalize text-navy"
              value={item.status}
              onChange={(event) => updateEscalation(item.id, event.target.value as typeof item.status)}
            >
              <option value="new">New</option>
              <option value="assigned">Assigned</option>
              <option value="contact-attempted">Contact attempted</option>
              <option value="waiting-for-patient">Waiting for patient</option>
              <option value="resolved">Resolved</option>
              <option value="escalated-to-clinician">Escalated to clinician</option>
            </select>
            <Button type="button" variant="secondary" onClick={() => updateEscalation(item.id, 'contact-attempted')}>
              Log contact attempt
            </Button>
            <a
              href="tel:+2348001112222"
              className="inline-flex min-h-11 cursor-pointer items-center rounded-xl px-4 font-semibold text-navy ring-1 ring-line"
            >
              Contact patient
            </a>
            <Link
              to={`/clinic/patients/${item.patientId}`}
              className="inline-flex min-h-11 cursor-pointer items-center font-semibold text-navy"
            >
              Open file
            </Link>
          </div>
        </Card>
      ))}
    </div>
  )
}
