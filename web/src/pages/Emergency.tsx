import { Phone } from 'lucide-react'
import { ButtonLink, Card } from '../components/ui'

export function Emergency() {
  return (
    <div className="grid gap-4">
      <Card className="bg-burgundy text-white ring-0">
        <p className="text-sm font-semibold uppercase tracking-wide text-white/80">
          Emergency escalation
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold">
          Stop the chat. Get help now.
        </h1>
        <p className="mt-3 text-white/90">
          Severe symptoms are not handled by Vita’s AI. Call emergency services,
          then tell a caregiver or your clinic.
        </p>
      </Card>
      <a
        href="tel:112"
        className="flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-navy text-lg font-semibold text-white"
      >
        <Phone className="size-5" aria-hidden />
        Call 112
      </a>
      <Card>
        <h2 className="font-display text-lg font-semibold">
          Approved next steps
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
          <li>Nearest emergency unit: St. Mary’s District Hospital, 1.8 km</li>
          <li>Clinic on-call: +234 800 111 2222</li>
          <li>Caregiver alert: sent to the number on your profile, if invited</li>
        </ul>
      </Card>
      <ButtonLink to="/app" variant="secondary">
        Return to dashboard only if you are safe
      </ButtonLink>
    </div>
  )
}
