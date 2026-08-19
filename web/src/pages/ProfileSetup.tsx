import { useNavigate } from 'react-router-dom'
import { LogoutButton } from '../components/LogoutButton'
import { Button, Card, Field, inputClass } from '../components/ui'
import { useVita } from '../context'

export function ProfileSetup() {
  const navigate = useNavigate()
  const { profile, setProfile } = useVita()

  return (
    <div className="mx-auto min-h-svh max-w-lg bg-navy px-4 py-10 text-white">
      <div className="mb-6 flex justify-end">
        <LogoutButton className="px-3 text-sm text-white hover:bg-white/10" />
      </div>
      <h1 className="text-center font-display text-4xl font-bold md:text-left">
        Profile setup
      </h1>
      <p className="mt-2 text-center text-white/75 md:text-left">
        This helps reminders and clinic visibility. Your clinic can still verify
        the medication plan later.
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
          hint="Your clinic can create or verify this plan so reminders stay accurate."
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
          hint="They will see adherence and flagged results you allow — not the full chat."
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
    </div>
  )
}
