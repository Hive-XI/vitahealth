import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, CheckCircle2, FlaskConical, MessageCircle, Pill, UserRound } from 'lucide-react'
import { Card } from '../components/ui'
import { adherencePercent, useVita } from '../context'

export function PatientDashboard() {
  const { profile, medications, labs, timeline, appointments, messages } = useVita()
  const percent = adherencePercent(medications)
  const due = medications.filter((med) => med.status === 'due')
  const flagged = labs.filter((lab) => lab.flagged)
  const nextDue = [...due].sort((a, b) => a.reminder.localeCompare(b.reminder))[0]
  const nextAppointment = appointments.find((appointment) => appointment.status === 'requested' || appointment.status === 'confirmed')
  const unreadClinicMessages = messages.filter((message) => message.from === 'vita').length
  const firstName = profile.name.split(' ')[0] || 'there'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const careStatus = flagged.length > 0 ? 'Clinic review recommended' : due.length > 0 ? 'One step at a time' : 'Care plan on track'

  return (
    <div className="grid gap-6">
      <header className="text-center md:text-left">
        <p className="text-sm font-medium text-white/90">{greeting} · Today</p>
        <h1 className="font-display text-4xl font-bold">
          {greeting}, {firstName}
        </h1>
        <p className="mt-2 text-sm font-medium text-white/85">Your care plan, reminders, and clinic support in one place.</p>
      </header>

      <Card className="bg-white/95 lg:col-span-2">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-navy/10 text-navy">
            <CheckCircle2 className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-muted">Care status</p>
            <h2 className="font-display mt-1 text-xl font-semibold text-black">{careStatus}</h2>
            <p className="mt-1 text-sm text-muted">
              {nextDue ? `Next reminder: ${nextDue.name} at ${nextDue.reminder}.` : 'You have no medication reminders waiting.'}
            </p>
          </div>
          <Link to="/app/chat" aria-label="Talk to Vita" className="grid size-11 shrink-0 place-items-center rounded-xl bg-burgundy text-white hover:bg-burgundy-ink">
            <MessageCircle className="size-5" aria-hidden />
          </Link>
        </div>
      </Card>

      <Card className="lg:col-span-2">
        <p className="text-sm text-muted">Adherence this week</p>
        <p className="mt-1 text-4xl font-semibold text-navy">{percent}%</p>
        <p className="mt-1 text-sm text-muted">
          {medications.filter((med) => med.status === 'taken').length} of{' '}
          {medications.length} logged today.
        </p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-navy"
            style={{ width: `${percent}%` }}
          />
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
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
            {flagged[0].name} flagged
          </h2>
          <p className="mt-2 text-sm text-muted">
            {flagged[0].value}
            {flagged[0].unit} is above the report range ({flagged[0].range}).
            Book a clinic review.
          </p>
          <Link
            to="/app/labs/follow-up"
            className="mt-3 inline-flex min-h-11 cursor-pointer items-center gap-1 font-semibold text-navy"
          >
            Book follow-up <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Card>
      ) : null}
      </div>

      {nextAppointment ? (
        <Card>
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-burgundy/10 text-burgundy">
              <CalendarDays className="size-5" aria-hidden />
            </span>
            <div>
              <p className="text-sm text-muted">Upcoming clinic follow-up</p>
              <h2 className="font-display text-lg font-semibold">{nextAppointment.clinic}</h2>
              <p className="text-sm text-muted">{nextAppointment.preferredTime} · {nextAppointment.status}</p>
            </div>
          </div>
        </Card>
      ) : null}

      <nav aria-label="Shortcuts" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
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

      <Card className="lg:col-span-2">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold">Your care timeline</h2>
            <p className="mt-1 text-sm text-muted">A shared record between you and your clinic.</p>
          </div>
          <span className="rounded-full bg-navy/10 px-2.5 py-1 text-xs font-semibold text-navy">{unreadClinicMessages} Vita updates</span>
        </div>
        <ol className="mt-4 grid gap-4 border-l border-line pl-4">
          {timeline.slice(0, 5).map((event) => (
            <li key={event.id} className="relative">
              <span className="absolute -left-[21px] top-1 size-2 rounded-full bg-burgundy" />
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                {event.type} · {new Date(event.occurredAt).toLocaleDateString()}
              </p>
              <p className="mt-1 font-semibold">{event.title}</p>
              <p className="text-sm text-muted">{event.description}</p>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  )
}
