import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Building2,
  FlaskConical,
  MessageCircle,
  Pill,
  ShieldCheck,
} from 'lucide-react'
import { ClinicianPhoto } from '../components/ClinicianPhoto'
import { Logo } from '../components/Logo'
import { BrandAtmosphere, PlusField } from '../components/BrandStage'
import { Button, ButtonLink, Card } from '../components/ui'
import { useVita } from '../context'

const features = [
  {
    icon: MessageCircle,
    title: 'Symptom guidance',
    body: 'Text or voice. Self-care, clinic review, or emergency — with your care team.',
  },
  {
    icon: Pill,
    title: 'Medications',
    body: 'Reminders and a weekly adherence %. Three missed doses alert the clinic.',
  },
  {
    icon: FlaskConical,
    title: 'Labs',
    body: 'Plain language against the range on your report. Out of range? Book follow-up.',
  },
]

export function Landing() {
  const { demoBooked, setDemoBooked } = useVita()

  return (
    <div className="relative min-h-svh overflow-hidden bg-navy-ink text-white">
      <BrandAtmosphere />
      <div className="relative z-10">
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

      <main id="main" className="relative z-10">
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 text-center md:grid-cols-2 md:py-24 md:text-left">
          <div>
            <p className="kicker mb-3 text-sm text-white/90">
              AI-powered patient companion
            </p>
            <h1 className="font-display text-4xl font-bold text-balance md:text-6xl">
              Support between visits
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg font-medium text-white/90 md:mx-0">
              Guidance, reminders, and lab explainers between visits. Partner
              clinics see who needs them first.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
              <ButtonLink to="/login">Get started</ButtonLink>
              <Button
                variant="outline"
                onClick={() => setDemoBooked(true)}
                type="button"
              >
                Book demo
              </Button>
            </div>
            {demoBooked ? (
              <p className="mt-4 text-sm font-medium text-white" role="status">
                Demo saved. A clinic lead will follow up.
              </p>
            ) : null}
            <p className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-white/90 md:justify-start">
              <ShieldCheck className="size-4 text-white" aria-hidden />
              Daily care with partner clinics. Emergencies: call 112.
            </p>
          </div>
          <ClinicianFrame />
        </section>

        <section id="features" className="bg-white text-black">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              For patients
            </h2>
            <p className="mt-3 max-w-2xl text-muted">
              Built for partner clinics in Nigeria. English and Hausa at launch.
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

        <section id="clinics" className="bg-navy-ink text-white">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2">
            <div>
              <p className="kicker mb-3 flex items-center gap-2 text-sm text-white/90">
                <Building2 className="size-4" aria-hidden />
                For clinics
              </p>
              <h2 className="font-display text-3xl font-bold md:text-4xl">
                See who needs you first
              </h2>
              <p className="mt-4 font-medium text-white/90">
                Adherence, last check-in, and an urgency queue so you can act
                first.
              </p>
              <ButtonLink to="/login" variant="outline" className="mt-8">
                Open clinic preview
                <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
            </div>
            <Card className="bg-white/95 text-ink">
              <p className="text-sm font-semibold text-muted">Escalation queue</p>
              <p className="mt-4 text-sm text-muted">
                After patients check in, adherence gaps and flagged labs appear
                here so your team can act first.
              </p>
              <ul className="mt-4 grid gap-2 text-sm text-muted">
                <li className="border-b border-line pb-2">Missed doses</li>
                <li className="border-b border-line pb-2">Flagged labs</li>
                <li>Symptom escalations</li>
              </ul>
            </Card>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 text-center">
          <PlusField className="mx-auto size-14" />
          <h2 className="mt-6 font-display text-3xl font-bold md:text-4xl">
            Try the prototype
          </h2>
          <p className="mx-auto mt-3 max-w-xl font-medium text-white/90">
            Sign in as a patient or as clinic staff.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink to="/login">Get started</ButtonLink>
            <Button variant="outline" onClick={() => setDemoBooked(true)}>
              Book demo
            </Button>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/15 px-4 py-8 text-center text-sm font-medium text-white/80">
        Vita Health · Patient companion for partner clinics
      </footer>
    </div>
    </div>
  )
}

function ClinicianFrame() {
  return (
    <div className="ticket mx-auto w-full max-w-md">
      <div className="relative overflow-hidden rounded-[2rem] bg-[#f4f1ea]">
        <ClinicianPhoto className="aspect-[4/5] w-full sm:aspect-[3/4]" />
      </div>
    </div>
  )
}
