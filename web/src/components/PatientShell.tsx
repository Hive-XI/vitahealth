import { NavLink, Outlet } from 'react-router-dom'
import { MessageCircle, Pill, FlaskConical, UserRound, LayoutDashboard, HeartPulse } from 'lucide-react'
import { Logo } from './Logo'
import { BrandAtmosphere } from './BrandStage'
import { LogoutButton } from './LogoutButton'

const items = [
  { to: '/app', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/app/chat', label: 'Chat', icon: MessageCircle },
  { to: '/app/meds', label: 'Meds', icon: Pill },
  { to: '/app/labs', label: 'Labs', icon: FlaskConical },
  { to: '/app/profile', label: 'Profile', icon: UserRound },
]

export function PatientShell() {
  return (
    <div className="relative min-h-svh overflow-hidden bg-navy-ink text-white">
      <BrandAtmosphere />
      <div className="relative z-10 min-h-svh lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="hidden border-r border-black/10 bg-white text-black lg:flex lg:flex-col">
        <div className="flex items-center gap-3 border-b border-line px-6 py-5">
          <span className="grid size-9 place-items-center rounded-xl bg-burgundy text-sm font-bold text-white">Vi</span>
          <div><Logo /><p className="mt-0.5 text-xs font-medium text-muted">Patient workspace</p></div>
        </div>
        <div className="px-4 py-6">
          <p className="kicker px-3 text-[11px] text-muted">Care navigation</p>
          <nav aria-label="Patient desktop navigation" className="mt-3 grid gap-1">
            {items.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors ${isActive ? 'bg-navy text-white' : 'text-muted hover:bg-navy/10 hover:text-black'}`}>
                <item.icon className="size-5" aria-hidden />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="mt-auto border-t border-line p-4">
          <div className="mb-3 flex items-center gap-2 rounded-xl bg-line/50 p-3 text-sm">
            <HeartPulse className="size-4 text-burgundy" aria-hidden />
            <span className="font-medium">Care between visits</span>
          </div>
          <LogoutButton className="w-full justify-start px-3 text-sm" />
        </div>
      </aside>
      <div className="relative z-10 min-w-0">
      <header className="sticky top-0 z-20 border-b border-black/10 bg-white px-4 py-2.5 text-black lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="lg:hidden"><Logo /></div>
          <div className="flex items-center gap-3"><span className="hidden text-sm font-medium text-muted sm:inline">Patient workspace</span><LogoutButton className="px-3 text-sm lg:hidden" /></div>
        </div>
      </header>
      <main id="main" className="mx-auto w-full max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10 lg:pt-8">
        <Outlet />
      </main>
      <nav
        aria-label="Patient"
        className="fixed inset-x-0 bottom-0 z-20 border-t border-black/10 bg-white text-black lg:hidden"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-5">
          {items.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex min-h-14 cursor-pointer flex-col items-center justify-center gap-1 text-xs font-semibold transition-colors duration-200 ${
                    isActive ? 'text-burgundy' : 'text-muted hover:text-black'
                  }`
                }
              >
                <item.icon className="size-5" aria-hidden />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      </div>
      </div>
    </div>
  )
}
