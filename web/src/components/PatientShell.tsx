import { NavLink, Outlet } from 'react-router-dom'
import { MessageCircle, Pill, FlaskConical, UserRound } from 'lucide-react'
import { Logo } from './Logo'
import { LogoutButton } from './LogoutButton'

const items = [
  { to: '/app', label: 'Home', icon: null, end: true },
  { to: '/app/chat', label: 'Chat', icon: MessageCircle },
  { to: '/app/meds', label: 'Meds', icon: Pill },
  { to: '/app/labs', label: 'Labs', icon: FlaskConical },
  { to: '/app/profile', label: 'Profile', icon: UserRound },
]

export function PatientShell() {
  return (
    <div className="min-h-svh bg-navy text-white">
      <header className="sticky top-0 z-20 border-b border-black/10 bg-white px-4 py-2.5 text-black">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          <Logo />
          <LogoutButton className="px-3 text-sm" />
        </div>
      </header>
      <main id="main" className="mx-auto max-w-lg px-4 pb-28 pt-5">
        <Outlet />
      </main>
      <nav
        aria-label="Patient"
        className="fixed inset-x-0 bottom-0 z-20 border-t border-black/10 bg-white text-black"
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
                {item.icon ? (
                  <item.icon className="size-5" aria-hidden />
                ) : (
                  <span className="grid size-5 place-items-center rounded-md bg-burgundy text-[10px] text-white">
                    Vi
                  </span>
                )}
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
