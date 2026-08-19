import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BrandAtmosphere } from '../components/BrandStage'
import { Logo } from '../components/Logo'
import { LogoutButton } from '../components/LogoutButton'
import { Button, Card } from '../components/ui'
import { useVita } from '../context'

export function Consent() {
  const navigate = useNavigate()
  const { setConsent } = useVita()
  const [ai, setAi] = useState(false)
  const [data, setData] = useState(false)

  return (
    <div className="relative min-h-svh overflow-hidden bg-[#f4f1ea] text-black lg:bg-navy-ink lg:text-white">
      <div className="hidden lg:block">
        <BrandAtmosphere />
      </div>
      <div className="relative z-10 mx-auto min-h-svh max-w-lg">
        <header className="flex items-center justify-between bg-[#f4f1ea] px-4 py-3 text-black">
          <Link to="/" aria-label="Vita Health home">
            <Logo />
          </Link>
          <LogoutButton className="px-3 text-sm" />
        </header>
        <main id="main" className="bg-[#f4f1ea] px-4 py-8 lg:bg-transparent lg:py-10">
          <h1 className="font-display text-4xl font-bold">
            Disclaimer and consent
          </h1>
          <p className="mt-2 font-medium text-muted lg:text-white/90">
            Decision-support only. Not a diagnosis or prescription.
          </p>

          <div className="ticket mt-6">
            <Card>
              <h2 className="font-display text-lg font-semibold">
                AI is not a diagnosis
              </h2>
              <p className="mt-2 text-muted">
                Replies are labelled AI. Unclear cases go to your clinic. Chest
                pain, breathing trouble, or stroke signs skip chat.
              </p>
              <label className="mt-4 flex min-h-11 cursor-pointer items-start gap-3 text-sm font-medium">
                <input
                  type="checkbox"
                  className="mt-1 size-5 accent-navy"
                  checked={ai}
                  onChange={(event) => setAi(event.target.checked)}
                />
                I understand Vita does not diagnose, prescribe, or replace
                emergency care.
              </label>
            </Card>
          </div>

          <div className="ticket mt-4">
            <Card>
              <h2 className="font-display text-lg font-semibold">
                Data consent (NDPA)
              </h2>
              <p className="mt-2 text-muted">
                Only care-plan data is stored. Caregiver sharing is opt-in. Your
                clinic stays clinically responsible.
              </p>
              <label className="mt-4 flex min-h-11 cursor-pointer items-start gap-3 text-sm font-medium">
                <input
                  type="checkbox"
                  className="mt-1 size-5 accent-navy"
                  checked={data}
                  onChange={(event) => setData(event.target.checked)}
                />
                I consent to my clinic storing this data, and to a caregiver only
                if I invite one.
              </label>
            </Card>
          </div>

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
        </main>
      </div>
    </div>
  )
}
