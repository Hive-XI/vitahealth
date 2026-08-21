import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, CalendarDays, Clock3, Search, Users } from 'lucide-react'
import { Card, inputClass } from '../components/ui'
import { useVita } from '../context'

export function ClinicDashboard() {
  const { clinicPatients, escalations, appointments } = useVita()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [range, setRange] = useState('today')
  const open = escalations.filter((item) => item.status !== 'resolved').length
  const unresolvedHigh = escalations.filter((item) => item.status !== 'resolved' && item.urgency === 'high').length
  const responseTimes = escalations.flatMap((item) => item.firstRespondedAt ? [new Date(item.firstRespondedAt).getTime() - new Date(item.createdAt).getTime()] : [])
  const averageResponse = responseTimes.length ? `${Math.max(1, Math.round(responseTimes.reduce((sum, value) => sum + value, 0) / responseTimes.length / 60000))}m` : '—'
  const ranked = [...clinicPatients]
    .filter((patient) => `${patient.name} ${patient.conditions}`.toLowerCase().includes(query.toLowerCase()))
    .filter((patient) => status === 'all' || (status === 'attention' ? patient.adherence < 80 : patient.adherence >= 80))
    .sort((a, b) => a.adherence - b.adherence)
  const needingAttention = ranked.filter((patient) => patient.adherence < 80).slice(0, 3)

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="font-display text-4xl font-bold">Clinic dashboard</h1>
        <p className="font-medium text-white/90">
          A focused view of the patients and tasks needing attention.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <Users className="size-5 text-navy" aria-hidden />
          <p className="mt-3 text-sm text-muted">Enrolled</p>
          <p className="text-3xl font-semibold">{clinicPatients.length}</p>
        </Card>
        <Card>
          <Activity className="size-5 text-burgundy" aria-hidden />
          <p className="mt-3 text-sm text-muted">Open escalations</p>
          <p className="text-3xl font-semibold text-burgundy">{open}</p>
        </Card>
        <Card>
          <Clock3 className="size-5 text-navy" aria-hidden />
          <p className="mt-3 text-sm text-muted">Avg. response</p>
          <p className="text-3xl font-semibold">{averageResponse}</p>
        </Card>
        <Card>
          <CalendarDays className="size-5 text-navy" aria-hidden />
          <p className="mt-3 text-sm text-muted">Appointments</p>
          <p className="text-3xl font-semibold">{appointments.filter((item) => item.status !== 'cancelled').length}</p>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-semibold">Patients needing attention</h2>
              <p className="mt-1 text-sm text-muted">Low adherence or active care risk.</p>
            </div>
            <span className="rounded-full bg-burgundy/10 px-2.5 py-1 text-xs font-semibold text-burgundy">{unresolvedHigh} high priority</span>
          </div>
          <ul className="mt-4 grid gap-3">
            {needingAttention.length === 0 ? <li className="text-sm text-muted">No patients need immediate attention.</li> : needingAttention.map((patient) => (
              <li key={patient.id} className="flex items-center justify-between gap-3 rounded-xl bg-line/40 p-3">
                <div><Link to={`/clinic/patients/${patient.id}`} className="font-semibold text-navy">{patient.name}</Link><p className="text-sm text-muted">{patient.risk}</p></div>
                <span className="font-semibold text-burgundy">{patient.adherence}%</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2 className="font-display text-xl font-semibold">Appointment overview</h2>
          <div className="mt-4 grid gap-3 text-sm">
            {appointments.length === 0 ? <p className="text-muted">No appointment requests yet.</p> : appointments.slice(0, 3).map((appointment) => <div key={appointment.id} className="flex justify-between gap-3 border-b border-line pb-3"><span className="font-semibold">{appointment.clinic}</span><span className="capitalize text-muted">{appointment.status}</span></div>)}
          </div>
        </Card>
      </div>
      <Card>
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div><h2 className="font-display text-xl font-semibold">Patient panel</h2><p className="mt-1 text-sm text-muted">{range === 'today' ? 'Today’s outreach view' : 'Last 7 days'}.</p></div>
          <Link to="/clinic/queue" className="cursor-pointer text-sm font-semibold text-navy">Open queue</Link>
        </div>
        <div className="mb-4 grid gap-2 sm:grid-cols-[1fr_auto_auto]">
          <label className="relative"><span className="sr-only">Search patients</span><Search className="absolute left-3 top-3 size-4 text-muted" aria-hidden /><input className={`${inputClass} pl-9`} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search patients" /></label>
          <select className={inputClass} value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter patients"><option value="all">All patients</option><option value="attention">Needs attention</option><option value="on-track">On track</option></select>
          <select className={inputClass} value={range} onChange={(event) => setRange(event.target.value)} aria-label="Date range"><option value="today">Today</option><option value="week">Last 7 days</option></select>
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
