import { Phone } from 'lucide-react'
import { ButtonLink, Card } from '../components/ui'

export function Emergency() {
  return (
    <div className="grid gap-4">
      <Card className="bg-burgundy text-white ring-0">
        <p className="kicker text-sm text-white/90">
          Emergency escalation
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold">
          Get help now
        </h1>
        <p className="mt-3 font-medium text-white/90">
          Call 112 now, then your clinic or caregiver.
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
          <li>Call 112 or your nearest emergency department</li>
          <li>Contact your clinic’s on-call number</li>
          <li>Alert your caregiver if one is invited</li>
        </ul>
      </Card>
      <ButtonLink to="/app" variant="secondary">
        Return if you are safe
      </ButtonLink>
    </div>
  )
}
