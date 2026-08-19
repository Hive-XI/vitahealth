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
        You must acknowledge both notices before Vita opens a patient workspace.
      </p>

      <Card className="mt-6">
        <h2 className="font-display text-lg font-semibold">
          Vita is not a diagnosis
        </h2>
        <p className="mt-2 text-muted">
          Symptom chat can ask questions and list possible causes. It does not
          decide whether you have a serious condition. A separate safety layer
          sends severe symptoms to emergency care and to your clinic.
        </p>
        <label className="mt-4 flex min-h-11 cursor-pointer items-start gap-3 text-sm font-medium">
          <input
            type="checkbox"
            className="mt-1 size-5 accent-navy"
            checked={ai}
            onChange={(event) => setAi(event.target.checked)}
          />
          I understand Vita is not a diagnosis and will not replace emergency or
          clinic care.
        </label>
      </Card>

      <Card className="mt-4">
        <h2 className="font-display text-lg font-semibold">Data consent</h2>
        <p className="mt-2 text-muted">
          Adherence logs, lab values you enter, and chat summaries can be shared
          with clinicians you enrol with, and with a caregiver you invite. You
          can change this later in Profile.
        </p>
        <label className="mt-4 flex min-h-11 cursor-pointer items-start gap-3 text-sm font-medium">
          <input
            type="checkbox"
            className="mt-1 size-5 accent-navy"
            checked={data}
            onChange={(event) => setData(event.target.checked)}
          />
          I consent to Vita storing my care-plan data and sharing it with my
          clinic and invited caregiver.
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
