import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogoutButton } from '../components/LogoutButton'
import { Button, Card } from '../components/ui'
import { useVita } from '../context'

export function Consent() {
  const navigate = useNavigate()
  const { setConsent } = useVita()
  const [ai, setAi] = useState(false)
  const [data, setData] = useState(false)

  return (
    <div className="mx-auto min-h-svh max-w-lg bg-navy px-4 py-10 text-white">
      <div className="mb-6 flex justify-end">
        <LogoutButton className="px-3 text-sm text-white hover:bg-white/10" />
      </div>
      <h1 className="text-center font-display text-4xl font-bold md:text-left">
        Disclaimer and consent
      </h1>
      <p className="mt-2 text-center text-white/75 md:text-left">
        Vita is a decision-support and adherence tool. It does not diagnose,
        prescribe, or replace a licensed clinician.
      </p>

      <Card className="mt-6">
        <h2 className="font-display text-lg font-semibold">
          AI guidance is not a diagnosis
        </h2>
        <p className="mt-2 text-muted">
          Every chat reply is labelled as AI-generated. Possible causes are never
          confirmed. Uncertain cases defer to your clinic. Chest pain, trouble
          breathing, stroke signs, and similar patterns skip the chat and open
          emergency steps.
        </p>
        <label className="mt-4 flex min-h-11 cursor-pointer items-start gap-3 text-sm font-medium">
          <input
            type="checkbox"
            className="mt-1 size-5 accent-navy"
            checked={ai}
            onChange={(event) => setAi(event.target.checked)}
          />
          I understand Vita will not diagnose or prescribe, and will not replace
          emergency or clinic care.
        </label>
      </Card>

      <Card className="mt-4">
        <h2 className="font-display text-lg font-semibold">
          Data consent (NDPA)
        </h2>
        <p className="mt-2 text-muted">
          Hive XI collects the minimum needed for reminders, lab explanation, and
          clinic review. Data is used only for that care-plan purpose. Sharing
          with a caregiver is opt-in. Partner clinics remain clinically
          responsible.
        </p>
        <label className="mt-4 flex min-h-11 cursor-pointer items-start gap-3 text-sm font-medium">
          <input
            type="checkbox"
            className="mt-1 size-5 accent-navy"
            checked={data}
            onChange={(event) => setData(event.target.checked)}
          />
          I consent to my partner clinic storing this data, and to sharing it
          with a caregiver only if I invite one.
        </label>
      </Card>

      <Button
        className="mt-6 w-full"
        disabled={!ai || !data}
        onClick={() => {
          setConsent(ai, data)
          navigate('/setup')
        }}
      >
        Acknowledge and continue
      </Button>
    </div>
  )
}
