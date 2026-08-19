import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Building2,
  FlaskConical,
  MessageCircle,
  Pill,
  ShieldCheck,
} from 'lucide-react'
import { Logo, Mark } from '../components/Logo'
import { Button, ButtonLink, Card } from '../components/ui'
import { useVita } from '../context'

const features = [
  {
    icon: MessageCircle,
    title: 'AI symptom guidance',
    body: 'Describe symptoms in text or voice. Vita asks follow-ups and sorts the visit into self-care, see a clinician, or emergency — labelled as AI guidance, never a diagnosis.',
  },
  {
    icon: Pill,
    title: 'Medication adherence',
    body: 'Clinic-set reminders, taken or skipped logs, and a weekly adherence percentage. Three unresolved missed doses flag the clinic and an invited caregiver.',
  },
  {
    icon: FlaskConical,
    title: 'Lab result explanation',
    body: 'Plain-language meaning against the range printed on that report. Out-of-range values are flagged with a one-tap follow-up request.',
  },
]

export function Landing() {
  const { demoBooked, setDemoBooked } = useVita()

  return (
    <div className="bg-navy text-white">
      <header className="sticky top-0 z-30 border-b border-black/10 bg-white text-black">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5">
          <Link to="/" aria-label="Vita Health home">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-semibold md:flex">
            <a href="#features" className="text-muted hover:text-black">
              For patients
            </a>
            <a href="#clinics" className="text-muted hover:text-black">
              For clinics
            </a>
            <ButtonLink to="/login" variant="ghost">
              Log in
            </ButtonLink>
            <ButtonLink to="/login">Get started</ButtonLink>
          </nav>
          <ButtonLink to="/login" className="md:hidden">
            Get started
          </ButtonLink>
        </div>
      </header>

      <main id="main">
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 text-center md:grid-cols-2 md:py-24 md:text-left">
          <div>
            <p className="mb-3 text-sm font-semibold tracking-[0.18em] text-white/80 uppercase">
              AI-powered patient companion
            </p>
            <h1 className="font-display text-4xl font-bold text-balance md:text-6xl">
              Support between visits, visibility for the clinic
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/75 md:mx-0">
              Vita Health bridges the consultation and daily self-management.
              Patients get conversational guidance, medication reminders, and
              plain-language labs. Partner clinics see who is at risk — without
              Vita diagnosing, prescribing, or replacing a licensed clinician.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
              <ButtonLink to="/login">Get started</ButtonLink>
              <Button
                variant="secondary"
                onClick={() => setDemoBooked(true)}
                type="button"
              >
                Book demo
              </Button>
            </div>
            {demoBooked ? (
              <p className="mt-4 text-sm font-medium text-white" role="status">
                Demo request saved. A clinic lead will follow up with a time.
              </p>
            ) : null}
            <p className="mt-6 flex items-center justify-center gap-2 text-sm text-white/75 md:justify-start">
              <ShieldCheck className="size-4 text-white" aria-hidden />
              Decision-support only. Uncertain or severe cases go to a human.
            </p>
          </div>
          <PhonePreview />
        </section>

        <section id="features" className="bg-white text-black">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Three patient layers, one clinic dashboard
            </h2>
            <p className="mt-3 max-w-2xl text-muted">
              Built for deployment through partner clinics and health programmes
              in Nigeria — not as a generic consumer chatbot. English and Hausa
              at launch; Yoruba and Igbo in Phase 2.
            </p>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title}>
                  <span className="grid size-11 place-items-center rounded-xl bg-navy/10 text-navy">
                    <feature.icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-display text-xl font-semibold">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-muted">{feature.body}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Product, at a glance
          </h2>
          <p className="mt-3 max-w-2xl text-white/75">
            Today’s summary, medicines, labs, and a path to a clinician — the
            same screens patients and clinics use after sign-in.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ['Today', 'Adherence 67% · 2 doses still due'],
              ['Labs', 'HbA1c 8.2% flagged against your report'],
              ['Clinic', 'Queue sorted by missed doses and flags'],
            ].map(([title, body]) => (
              <Card key={title} className="min-h-36">
                <p className="text-sm font-semibold text-burgundy">{title}</p>
                <p className="mt-2 text-lg font-medium">{body}</p>
              </Card>
            ))}
          </div>
        </section>

        <section id="clinics" className="bg-navy-ink text-white">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2">
            <div>
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-wide text-white/70 uppercase">
                <Building2 className="size-4" aria-hidden />
                For clinics
              </p>
              <h2 className="font-display text-3xl font-bold md:text-4xl">
                A real-time panel for stretched clinical teams
              </h2>
              <p className="mt-4 text-white/80">
                Staff see enrolled patients, adherence percentages, last
                check-in, and an escalation queue sorted by urgency — missed
                doses, flagged labs, and severe symptom reports — without
                reviewing every record by hand.
              </p>
              <ButtonLink
                to="/login"
                variant="secondary"
                className="mt-8 bg-white text-navy"
              >
                Open clinic preview
                <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
            </div>
            <Card className="bg-white/95 text-ink">
              <p className="text-sm font-semibold text-muted">Escalation queue</p>
              <ul className="mt-4 grid gap-3">
                <li className="flex justify-between gap-3 border-b border-line pb-3">
                  <span>Amara Okafor · flagged HbA1c</span>
                  <span className="font-semibold text-burgundy">High</span>
                </li>
                <li className="flex justify-between gap-3 border-b border-line pb-3">
                  <span>Fatima Diallo · missed inhaler</span>
                  <span className="font-semibold text-burgundy">High</span>
                </li>
                <li className="flex justify-between gap-3">
                  <span>Joseph Adeyemi · lab review</span>
                  <span className="font-semibold text-navy">Medium</span>
                </li>
              </ul>
            </Card>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 text-center">
          <Mark className="mx-auto size-12" />
          <h2 className="mt-6 font-display text-3xl font-bold md:text-4xl">
            Care plan → support → monitoring → risk detection → escalation
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/75">
            Open this prototype as a patient or as clinic staff. Consent and
            profile setup come first for patients.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink to="/login">Get started</ButtonLink>
            <Button variant="secondary" onClick={() => setDemoBooked(true)}>
              Book demo
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/15 px-4 py-8 text-center text-sm text-white/60">
        Vita Health · Hive XI · Decision-support only · Not a diagnostic service
      </footer>
    </div>
  )
}

function PhonePreview() {
  return (
    <div className="mx-auto w-full max-w-sm rounded-[2rem] bg-navy-ink p-3 ring-1 ring-white/20">
      <div className="rounded-[1.5rem] bg-white p-5 text-black">
        <p className="text-sm text-muted">Good evening, Amara</p>
        <h3 className="font-display mt-1 text-2xl font-bold">Today</h3>
        <div className="mt-5 grid gap-3">
          <div className="rounded-2xl bg-white p-4 ring-1 ring-line">
            <p className="text-sm text-muted">Adherence this week</p>
            <p className="font-display text-3xl font-semibold text-navy">67%</p>
            <p className="text-sm text-muted">2 of 3 doses logged today</p>
          </div>
          <div className="rounded-2xl bg-white p-4 ring-1 ring-line">
            <p className="text-sm font-semibold">Lisinopril 10 mg</p>
            <p className="text-sm text-muted">Due · 08:00 reminder</p>
          </div>
          <div className="rounded-2xl bg-burgundy/10 p-4 ring-1 ring-burgundy/30">
            <p className="text-sm font-semibold text-burgundy">HbA1c flagged</p>
            <p className="text-sm text-muted">Book a clinic follow-up</p>
          </div>
        </div>
      </div>
    </div>
  )
}
