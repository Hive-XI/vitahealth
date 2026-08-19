import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { Button, Card, Field, inputClass } from '../components/ui'
import { useVita } from '../context'

const languages = ['English', 'Français', 'Hausa', 'Yoruba', 'Kiswahili']

export function Auth() {
  const navigate = useNavigate()
  const {
    role,
    setRole,
    language,
    setLanguage,
    identifier,
    setIdentifier,
    authMethod,
    setAuthMethod,
  } = useVita()

  function continueOn() {
    if (role === 'clinic') navigate('/clinic')
    else navigate('/consent')
  }

  return (
    <div className="flex min-h-svh flex-col bg-navy px-4 py-8 text-white">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 flex justify-center md:justify-start">
          <Link to="/" aria-label="Vita Health home">
            <Logo className="brightness-0 invert" />
          </Link>
        </div>
        <h1 className="text-center font-display text-4xl font-bold md:text-left">
          Sign up / Log in
        </h1>
        <p className="mt-2 text-center text-white/75 md:text-left">
          Choose who you are. Vita keeps patient and clinic workspaces separate.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3" role="group" aria-label="Role">
          {(['patient', 'clinic'] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setRole(option)}
              className={`min-h-20 cursor-pointer rounded-2xl border px-4 text-left font-semibold capitalize transition-colors duration-200 ${
                role === option
                  ? 'border-white bg-white text-navy'
                  : 'border-white/25 bg-white/10 text-white hover:bg-white/15'
              }`}
            >
              {option === 'patient' ? 'Patient' : 'Clinic staff'}
            </button>
          ))}
        </div>

        <Card className="mt-6 grid gap-4">
          <div className="flex gap-2" role="group" aria-label="Sign-in method">
            {(['email', 'phone'] as const).map((method) => (
              <Button
                key={method}
                type="button"
                variant={authMethod === method ? 'primary' : 'secondary'}
                onClick={() => setAuthMethod(method)}
                className="flex-1 capitalize"
              >
                {method}
              </Button>
            ))}
          </div>
          <Field
            id="identifier"
            label={authMethod === 'email' ? 'Email' : 'Phone number'}
          >
            <input
              id="identifier"
              className={inputClass}
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder={
                authMethod === 'email' ? 'you@clinic.org' : '+234 800 000 0000'
              }
              autoComplete={authMethod === 'email' ? 'email' : 'tel'}
            />
          </Field>
          <Field id="language" label="Language preference">
            <select
              id="language"
              className={inputClass}
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
            >
              {languages.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </Field>
          <Button type="button" onClick={continueOn}>
            Continue
          </Button>
        </Card>
      </div>
    </div>
  )
}
