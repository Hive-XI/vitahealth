import { useNavigate } from 'react-router-dom'
import { BrandAtmosphere } from '../components/BrandStage'
import { Logo } from '../components/Logo'
import { LogoutButton } from '../components/LogoutButton'
import { Button, Card, Field, inputClass } from '../components/ui'
import { useVita } from '../context'

export function ProfileSetup() {
  const navigate = useNavigate()
  const { profile, setProfile } = useVita()

  return (
    <div className="relative min-h-svh overflow-hidden bg-[#f4f1ea] text-black lg:bg-navy-ink lg:text-white">
      <div className="hidden lg:block">
        <BrandAtmosphere />
      </div>
      <div className="relative z-10 mx-auto min-h-svh max-w-lg">
        <header className="flex items-center justify-between bg-[#f4f1ea] px-4 py-3 text-black">
          <Logo />
          <LogoutButton className="px-3 text-sm" />
        </header>
        <main id="main" className="bg-[#f4f1ea] px-4 py-8 lg:bg-transparent lg:py-10">
      <h1 className="font-display text-4xl font-bold">
        Profile setup
      </h1>
      <p className="mt-2 font-medium text-muted lg:text-white/90">
        Used for reminders. Your clinic can verify the med plan later.
      </p>
      <Card className="mt-6 grid gap-4">
        <Field id="name" label="Name">
          <input
            id="name"
            className={inputClass}
            value={profile.name}
            onChange={(event) =>
              setProfile({ ...profile, name: event.target.value })
            }
          />
        </Field>
        <Field id="age" label="Age">
          <input
            id="age"
            className={inputClass}
            inputMode="numeric"
            value={profile.age}
            onChange={(event) =>
              setProfile({ ...profile, age: event.target.value })
            }
          />
        </Field>
        <Field id="conditions" label="Known conditions">
          <textarea
            id="conditions"
            className={`${inputClass} min-h-24 py-3`}
            value={profile.conditions}
            onChange={(event) =>
              setProfile({ ...profile, conditions: event.target.value })
            }
          />
        </Field>
        <Field
          id="medications"
          label="Current medications"
          hint="Clinic can verify this plan."
        >
          <textarea
            id="medications"
            className={`${inputClass} min-h-24 py-3`}
            value={profile.medications}
            onChange={(event) =>
              setProfile({ ...profile, medications: event.target.value })
            }
          />
        </Field>
        <Field
          id="caregiver"
          label="Invite a caregiver (optional)"
          hint="Adherence and flags only."
        >
          <input
            id="caregiver"
            className={inputClass}
            placeholder="Name or phone"
            value={profile.caregiver}
            onChange={(event) =>
              setProfile({ ...profile, caregiver: event.target.value })
            }
          />
        </Field>
        <Button type="button" onClick={() => navigate('/app')}>
          Save and open dashboard
        </Button>
      </Card>
        </main>
      </div>
    </div>
  )
}
