import { Button, ButtonLink, Card } from '../components/ui'
import { adherencePercent, useVita } from '../context'

export function Meds() {
  const { medications, medicationEvents, markMedication } = useVita()
  const percent = adherencePercent(medications)
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - index))
    const key = date.toISOString().slice(0, 10)
    const taken = medicationEvents.filter(
      (event) => event.occurredAt.slice(0, 10) === key && event.status === 'taken',
    ).length
    return { label: date.toLocaleDateString('en', { weekday: 'short' }), value: medications.length ? Math.round((taken / medications.length) * 100) : 0 }
  })

  return (
    <div className="grid gap-4">
      <div className="flex flex-col items-center gap-3 text-center md:flex-row md:items-end md:justify-between md:text-left">
        <div>
          <h1 className="font-display text-4xl font-bold">
            Medication tracker
          </h1>
          <p className="text-sm font-medium text-white/90">
            Today · {percent}% logged
          </p>
        </div>
        <ButtonLink to="/app/meds/add" variant="secondary">
          Add
        </ButtonLink>
      </div>
      {medications.map((med) => (
        <Card key={med.id}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-semibold">{med.name}</h2>
              <p className="text-sm text-muted">
                {med.dosage} · {med.frequency} · reminder {med.reminder}
              </p>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                med.status === 'taken'
                  ? 'bg-navy/10 text-navy'
                  : med.status === 'skipped'
                    ? 'bg-burgundy/10 text-burgundy'
                    : 'bg-paper text-muted'
              }`}
            >
              {med.status}
            </span>
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              type="button"
              className="flex-1"
              onClick={() => markMedication(med.id, 'taken')}
            >
              Taken
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => markMedication(med.id, 'skipped')}
            >
              Skipped
            </Button>
          </div>
        </Card>
      ))}
      <Card>
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold">Weekly adherence</h2>
            <p className="mt-1 text-sm text-muted">Dated dose history, not just a current status.</p>
          </div>
          <span className="text-2xl font-semibold text-navy">{percent}%</span>
        </div>
        <div className="mt-5 grid grid-cols-7 items-end gap-2" aria-label="Seven day adherence chart">
          {days.map((day) => (
            <div key={day.label} className="grid gap-2 text-center text-xs text-muted">
              <div className="flex h-24 items-end justify-center rounded-lg bg-line/60">
                <div className="w-full rounded-lg bg-navy" style={{ height: `${Math.max(day.value, 6)}%` }} title={`${day.value}%`} />
              </div>
              <span>{day.label}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">Reminder history is recorded when you mark a dose taken or skipped.</p>
      </Card>
    </div>
  )
}
