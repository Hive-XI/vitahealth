import { Button, ButtonLink, Card } from '../components/ui'
import { adherencePercent, useVita } from '../context'

export function Meds() {
  const { medications, markMedication } = useVita()
  const percent = adherencePercent(medications)

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
        <h2 className="font-display text-lg font-semibold">History</h2>
        <p className="mt-2 text-sm text-muted">
          This week: {percent}%. Three missed doses in a row flag the clinic.
          Vita does not change prescribed doses.
        </p>
      </Card>
    </div>
  )
}
