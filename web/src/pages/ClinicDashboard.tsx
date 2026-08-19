import { Link } from 'react-router-dom'
import { Card } from '../components/ui'
import { useVita } from '../context'

export function ClinicDashboard() {
  const { clinicPatients, escalations } = useVita()
  const open = escalations.filter((item) => !item.reviewed).length
  const ranked = [...clinicPatients].sort((a, b) => a.adherence - b.adherence)

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="font-display text-4xl font-bold">Clinic dashboard</h1>
        <p className="text-white/75">
          Enrolled panel with adherence, last check-in, and status flags.
          Escalations are sorted by urgency so outreach is not a full-record
          review.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-muted">Enrolled</p>
          <p className="font-display text-3xl font-semibold">
            {clinicPatients.length}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Open escalations</p>
          <p className="font-display text-3xl font-semibold text-burgundy">
            {open}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Lowest adherence</p>
          <p className="font-display text-3xl font-semibold">
            {ranked[0]?.adherence}%
          </p>
        </Card>
      </div>
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Patient panel</h2>
          <Link
            to="/clinic/queue"
            className="cursor-pointer text-sm font-semibold text-navy"
          >
            Open queue
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-muted">
              <tr>
                <th className="pb-3 font-medium">Patient</th>
                <th className="pb-3 font-medium">Adherence</th>
                <th className="pb-3 font-medium">Last check-in</th>
                <th className="pb-3 font-medium">Why they need you</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((patient) => (
                <tr key={patient.id} className="border-t border-line">
                  <td className="py-3">
                    <Link
                      to={`/clinic/patients/${patient.id}`}
                      className="cursor-pointer font-semibold text-navy"
                    >
                      {patient.name}
                    </Link>
                    <p className="text-muted">
                      {patient.age} · {patient.conditions}
                    </p>
                  </td>
                  <td className="py-3 font-semibold">{patient.adherence}%</td>
                  <td className="py-3 text-muted">{patient.lastContact}</td>
                  <td className="py-3">{patient.risk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
