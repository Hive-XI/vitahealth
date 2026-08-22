import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { BrandAtmosphere, PlusField } from '../components/BrandStage'
import { ClinicianPhoto } from '../components/ClinicianPhoto'
import { Logo } from '../components/Logo'
import { Button, Card, Field, inputClass } from '../components/ui'
import { useVita } from '../context'
import { appLanguages } from '../languages'
import type { Role } from '../types'

export function Auth() {
  const navigate = useNavigate()
  const {
    language,
    setLanguage,
    identifier,
    setIdentifier,
    authMethod,
    setAuthMethod,
    logout,
    refreshWorkspace,
  } = useVita()
  const [selectedRole, setSelectedRole] = useState<Role>('patient')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Clear any previous clinic/patient session so the role toggle is not sticky.
    logout()
    setSelectedRole('patient')
    // Run once when opening the sign-in screen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function continueOn() {
    setError('')
    setLoading(true)
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: identifier,
          password,
          role: selectedRole,
          language,
        }),
      })
      const result = (await response.json()) as {
        token?: string
        error?: string
        user?: { role: Role; language: string; email: string }
      }
      if (!response.ok || !result.token || !result.user) {
        setError(result.error ?? 'Unable to authenticate. Try again.')
        return
      }
      if (mode === 'login' && result.user.role !== selectedRole) {
        window.localStorage.removeItem('vita.token')
        setError(
          result.user.role === 'clinic'
            ? 'This email is a clinic staff account. Choose Clinic staff to sign in, or use a different email for a patient account.'
            : 'This email is a patient account. Choose Patient to sign in, or use a different email for clinic staff.',
        )
        return
      }
      window.localStorage.setItem('vita.token', result.token)
      setLanguage(result.user.language)
      setIdentifier(result.user.email)
      await refreshWorkspace()
      if (result.user.role === 'clinic') navigate('/clinic')
      else navigate(mode === 'signup' ? '/consent' : '/app')
    } catch {
      setError('The server is unavailable. Start the API and try again.')
    } finally {
      setLoading(false)
    }
  }

  function switchMode() {
    setMode((current) => (current === 'login' ? 'signup' : 'login'))
    setError('')
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
            <h1 className="mt-3 font-display text-4xl font-bold text-balance lg:text-5xl">
              Care between visits
            </h1>
            <p className="mt-4 text-sm font-medium text-muted">
              Choose patient or clinic staff.
            </p>
          </div>
          <div className="relative mt-6 hidden flex-1 lg:mt-10 lg:block">
            <ClinicianPhoto className="h-full min-h-80 w-full" />
          </div>
          <p className="relative mt-6 hidden text-sm text-muted lg:block">
            Care between visits
          </p>
        </aside>

        <section className="flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-12 lg:py-12">
          <div className="lg:hidden">
            <div className="max-w-md">
              <p className="kicker text-sm text-burgundy">Partner clinics</p>
              <h1 className="mt-3 font-display text-3xl font-bold text-balance">
                Care between visits
              </h1>
              <p className="mt-3 text-sm font-medium text-muted">
                Choose patient or clinic staff.
              </p>
            </div>
            <div className="mt-5">
              <ClinicianPhoto className="mx-auto aspect-[4/5] w-full max-w-[17rem] rounded-2xl md:mx-0 md:aspect-auto md:h-[26rem] md:max-w-none md:rounded-3xl" />
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
                onClick={() => {
                  setSelectedRole(option)
                  setError('')
                }}
                className={`min-h-16 cursor-pointer rounded-2xl border px-4 text-left font-semibold transition-colors duration-200 lg:min-h-20 ${
                  selectedRole === option
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
              <Field id="password" label="Password" hint="At least 8 characters.">
                <input
                  id="password"
                  type="password"
                  className={inputClass}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
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
              {error ? (
                <p className="text-sm font-medium text-burgundy" role="alert">
                  {error}
                </p>
              ) : null}
              <Button type="button" onClick={continueOn} disabled={loading}>
                {loading
                  ? 'Working…'
                  : mode === 'login'
                    ? 'Sign in'
                    : 'Create account'}
              </Button>
              <button
                type="button"
                className="text-sm font-semibold text-burgundy underline"
                onClick={switchMode}
              >
                {mode === 'login'
                  ? 'Need an account? Sign up'
                  : 'Already have an account? Sign in'}
              </button>
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
