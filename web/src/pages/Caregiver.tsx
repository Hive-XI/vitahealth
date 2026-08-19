import { Card } from '../components/ui'
import { adherencePercent, useVita } from '../context'

export function Caregiver() {
  const { profile, medications, labs } = useVita()
  const percent = adherencePercent(medications)
  const skipped = medications.filter((med) => med.status === 'skipped')
  const flagged = labs.filter((lab) => lab.flagged)

  return (
    <div className="grid gap-4">
      <h1 className="font-display text-4xl font-bold">Caregiver view</h1>
      <p className="text-sm font-medium text-white/90">
        Supporting {profile.name}. Adherence and flags only — not the full file.
      </p>
      <Card>
        <p className="text-sm text-muted">Linked patient adherence</p>
        <p className="text-4xl font-semibold text-navy">{percent}%</p>
      </Card>
      <Card>
        <h2 className="font-display text-lg font-semibold">Missed dose alerts</h2>
        {skipped.length === 0 ? (
          <p className="mt-2 text-sm text-muted">No skipped doses logged today.</p>
        ) : (
          <ul className="mt-2 list-disc pl-5 text-sm">
            {skipped.map((med) => (
              <li key={med.id}>
                {med.name} marked skipped at {med.reminder}
              </li>
            ))}
          </ul>
        )}
      </Card>
      <Card>
        <h2 className="font-display text-lg font-semibold">
          Flagged result notices
        </h2>
        {flagged.length === 0 ? (
          <p className="mt-2 text-sm text-muted">No flagged labs right now.</p>
        ) : (
          <ul className="mt-2 list-disc pl-5 text-sm">
            {flagged.map((lab) => (
              <li key={lab.id}>
                {lab.name} {lab.value}
                {lab.unit} is outside the report range
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
