import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { BrandAtmosphere, PlusField } from '../components/BrandStage'
import { ClinicianPhoto } from '../components/ClinicianPhoto'
import { Logo } from '../components/Logo'
import { Button, Card, Field, inputClass } from '../components/ui'
import { useVita } from '../context'
import { appLanguages } from '../languages'

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
    logout,
  } = useVita()

  function continueOn() {
    if (role === 'clinic') navigate('/clinic')
    else navigate('/consent')
  }

  function goHome() {
    logout()
    navigate('/')
  }

  return (
    <div className="relative min-h-svh overflow-hidden bg-[#f4f1ea] text-black lg:bg-navy-ink lg:text-white">
      <div className="hidden lg:block">
        <BrandAtmosphere />
      </div>
      <div
        id="main"
        className="relative z-10 mx-auto grid min-h-svh max-w-6xl lg:grid-cols-2"
      >
        <aside className="relative flex flex-col overflow-hidden bg-[#f4f1ea] px-4 py-4 text-black sm:px-6 lg:min-h-svh lg:px-12 lg:py-12">
          <PlusField className="pointer-events-none absolute -right-8 -bottom-10 hidden size-80 rotate-12 opacity-[0.14] lg:block" />
          <div className="relative flex w-full items-center justify-between gap-3 lg:items-start">
            <Link
              to="/"
              aria-label="Vita Health home"
              className="w-fit"
              onClick={logout}
            >
              <Logo />
            </Link>
            <Button type="button" variant="secondary" onClick={goHome}>
              <ArrowLeft className="size-4" aria-hidden />
              Back to home
            </Button>
          </div>
          <div className="relative hidden max-w-md lg:mt-8 lg:block">
            <p className="kicker text-sm text-burgundy">Partner clinics</p>
            <h1 className="font-display mt-3 text-6xl font-bold">Sign in</h1>
            <p className="mt-3 max-w-sm font-medium text-muted">
              Choose patient or clinic staff.
            </p>
          </div>
          <div className="relative mt-8 hidden min-h-0 flex-1 overflow-hidden rounded-3xl lg:block">
            <ClinicianPhoto className="h-full min-h-80 w-full" />
          </div>
          <p className="relative mt-6 hidden text-sm text-muted lg:block">
            Care between visits
          </p>
        </aside>

        <section className="flex flex-col justify-center bg-[#f4f1ea] px-4 pb-10 pt-2 sm:px-6 lg:bg-transparent lg:px-12 lg:py-12">
          <div className="lg:hidden">
            <div className="md:grid md:grid-cols-2 md:items-end md:gap-8">
              <div>
                <p className="kicker text-sm text-burgundy">Partner clinics</p>
                <h1 className="font-display mt-2 text-4xl font-bold">Sign in</h1>
                <p className="mt-2 font-medium text-muted">
                  Choose patient or clinic staff.
                </p>
              </div>
              <ClinicianPhoto className="mx-auto mt-5 aspect-[4/5] w-full max-w-[17rem] rounded-2xl md:mx-0 md:mt-0 md:aspect-auto md:h-[26rem] md:max-w-none md:rounded-3xl" />
            </div>
          </div>

          <div
            className="mt-6 grid grid-cols-2 gap-3 lg:mt-0"
            role="group"
            aria-label="Role"
          >
            {(['patient', 'clinic'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setRole(option)}
                className={`min-h-16 cursor-pointer rounded-2xl border px-4 text-left font-semibold transition-colors duration-200 lg:min-h-20 ${
                  role === option
                    ? 'border-burgundy bg-burgundy text-white'
                    : 'border-navy/15 bg-white text-navy hover:bg-navy/5 lg:border-white/25 lg:bg-white/10 lg:text-white lg:hover:bg-white/15'
                }`}
              >
                {option === 'patient' ? 'Patient' : 'Clinic staff'}
              </button>
            ))}
          </div>

          <div className="ticket mt-6">
            <Card className="grid gap-4 ring-0 lg:ring-1">
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
                    authMethod === 'email'
                      ? 'you@clinic.org'
                      : '+234 800 000 0000'
                  }
                  autoComplete={authMethod === 'email' ? 'email' : 'tel'}
                />
              </Field>
              <Field id="language" label="Language">
                <select
                  id="language"
                  className={inputClass}
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                >
                  {appLanguages.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </Field>
              <Button type="button" onClick={continueOn}>
                Continue
              </Button>
            </Card>
          </div>
          <p className="mt-8 text-center text-sm text-muted lg:hidden">
            Care between visits
          </p>
        </section>
      </div>
    </div>
  )
}
