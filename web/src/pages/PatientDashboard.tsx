import { Link } from 'react-router-dom'
import { ArrowRight, FlaskConical, MessageCircle, Pill, UserRound } from 'lucide-react'
import { Card } from '../components/ui'
import { adherencePercent, useVita } from '../context'

export function PatientDashboard() {
  const { profile, medications, labs } = useVita()
  const percent = adherencePercent(medications)
  const due = medications.filter((med) => med.status === 'due')
  const flagged = labs.filter((lab) => lab.flagged)

  return (
    <div className="grid gap-4">
      <header className="text-center md:text-left">
        <p className="text-sm text-white/70">Today</p>
        <h1 className="font-display text-4xl font-bold">
          Hello, {profile.name.split(' ')[0]}
        </h1>
      </header>

      <Card>
        <p className="text-sm text-muted">Adherence this week</p>
        <p className="font-display mt-1 text-4xl font-semibold text-navy">
          {percent}%
        </p>
        <p className="mt-1 text-sm text-muted">
          {medications.filter((med) => med.status === 'taken').length} of{' '}
          {medications.length} doses logged today. Three missed doses in a row
          trigger a check-in, then a clinic flag.
        </p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-navy"
            style={{ width: `${percent}%` }}
          />
        </div>
      </Card>

      {due.length > 0 ? (
        <Card>
          <h2 className="font-display text-lg font-semibold">Still due</h2>
          <ul className="mt-3 grid gap-2">
            {due.map((med) => (
              <li key={med.id} className="flex justify-between text-sm">
                <span className="font-medium">
                  {med.name} {med.dosage}
                </span>
                <span className="text-muted">{med.reminder}</span>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      {flagged.length > 0 ? (
        <Card className="ring-burgundy/30">
          <h2 className="font-display text-lg font-semibold text-burgundy">
            HbA1c flagged
          </h2>
          <p className="mt-2 text-sm text-muted">
            HbA1c is a blood test of average sugar over about three months. Your
            result ({flagged[0].value}
            {flagged[0].unit}) sits above the range printed on your report (
            {flagged[0].range}). Vita flagged it for your clinician and will not
            interpret a cause.
          </p>
          <Link
            to="/app/labs/follow-up"
            className="mt-3 inline-flex min-h-11 cursor-pointer items-center gap-1 font-semibold text-navy"
          >
            Book follow-up <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Card>
      ) : null}

      <nav aria-label="Shortcuts" className="grid grid-cols-2 gap-3">
        {[
          { to: '/app/chat', label: 'Guidance', icon: MessageCircle },
          { to: '/app/meds', label: 'Meds', icon: Pill },
          { to: '/app/labs', label: 'Labs', icon: FlaskConical },
          { to: '/app/profile', label: 'Profile', icon: UserRound },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex min-h-20 cursor-pointer items-center gap-3 rounded-2xl bg-white px-4 font-semibold text-navy ring-1 ring-white/20 transition-colors duration-200 hover:bg-white/90"
          >
            <item.icon className="size-5 text-navy" aria-hidden />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
