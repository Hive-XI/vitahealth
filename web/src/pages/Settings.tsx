import { useState } from 'react'
import { LogoutButton } from '../components/LogoutButton'
import { Button, ButtonLink, Card, Field, inputClass } from '../components/ui'
import { useVita } from '../context'
import { appLanguages } from '../languages'

export function Settings() {
  const { profile, setProfile, language, setLanguage } = useVita()
  const [saved, setSaved] = useState(false)

  return (
    <div className="grid gap-4">
      <h1 className="font-display text-4xl font-bold">
        Profile and settings
      </h1>
      <Card className="grid gap-4">
        <h2 className="font-display text-lg font-semibold">Personal info</h2>
        <Field id="set-name" label="Name">
          <input
            id="set-name"
            className={inputClass}
            value={profile.name}
            onChange={(event) =>
              setProfile({ ...profile, name: event.target.value })
            }
          />
        </Field>
        <Field id="set-age" label="Age">
          <input
            id="set-age"
            className={inputClass}
            value={profile.age}
            onChange={(event) =>
              setProfile({ ...profile, age: event.target.value })
            }
          />
        </Field>
        <Field id="set-conditions" label="Known conditions">
          <textarea
            id="set-conditions"
            className={`${inputClass} min-h-20 py-3`}
            value={profile.conditions}
            onChange={(event) =>
              setProfile({ ...profile, conditions: event.target.value })
            }
          />
        </Field>
      </Card>
      <Card className="grid gap-4">
        <h2 className="font-display text-lg font-semibold">
          Caregiver access
        </h2>
        <Field
          id="set-caregiver"
          label="Invited caregiver"
          hint="Missed doses and flagged labs only."
        >
          <input
            id="set-caregiver"
            className={inputClass}
            value={profile.caregiver}
            onChange={(event) =>
              setProfile({ ...profile, caregiver: event.target.value })
            }
            placeholder="Name or phone"
          />
        </Field>
        <ButtonLink to="/app/caregiver" variant="secondary">
          Preview caregiver view
        </ButtonLink>
      </Card>
      <Card className="grid gap-4">
        <h2 className="font-display text-lg font-semibold">
          Language and notifications
        </h2>
        <Field id="set-language" label="Language">
          <select
            id="set-language"
            className={inputClass}
            value={language}
            onChange={(event) => {
              setLanguage(event.target.value)
              setProfile({ ...profile, language: event.target.value })
            }}
          >
            {appLanguages.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </Field>
        <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-medium">
          <input
            type="checkbox"
            className="size-5 accent-navy"
            checked={profile.notifications}
            onChange={(event) =>
              setProfile({ ...profile, notifications: event.target.checked })
            }
          />
          Medication reminders and clinic alerts
        </label>
        <Button
          type="button"
          onClick={() => {
            setSaved(true)
            window.setTimeout(() => setSaved(false), 2000)
          }}
        >
          Save changes
        </Button>
        {saved ? (
          <p className="text-sm font-medium text-navy" role="status">
            Settings saved on this device.
          </p>
        ) : null}
      </Card>
      <Card className="grid gap-3">
        <h2 className="font-display text-lg font-semibold">Account</h2>
        <p className="text-sm text-muted">
          Log out returns you to the home page.
        </p>
        <LogoutButton variant="danger" className="w-full" />
      </Card>
    </div>
  )
}
