import { NavLink, Outlet } from 'react-router-dom'
import { ClipboardList, LayoutGrid } from 'lucide-react'
import { Logo } from './Logo'
import { BrandAtmosphere } from './BrandStage'
import { LogoutButton } from './LogoutButton'

const items = [
  { to: '/clinic', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/clinic/queue', label: 'Escalation queue', icon: ClipboardList },
]

export function ClinicShell() {
  return (
    <div className="relative min-h-svh overflow-hidden bg-navy-ink text-white">
      <BrandAtmosphere />
      <div className="relative z-10 min-h-svh lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-black/10 bg-white text-black lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-3">
          <Logo />
          <LogoutButton className="px-3 text-sm lg:hidden" />
        </div>
        <nav aria-label="Clinic" className="px-3 pb-4">
          <ul className="flex gap-1 overflow-x-auto lg:flex-col">
            {items.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex min-h-11 cursor-pointer items-center gap-2 rounded-xl px-3 text-sm font-semibold whitespace-nowrap transition-colors duration-200 ${
                      isActive
                        ? 'bg-navy text-white'
                        : 'text-muted hover:bg-navy/10 hover:text-black'
                    }`
                  }
                >
                  <item.icon className="size-4" aria-hidden />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="mt-3 hidden lg:block">
            <LogoutButton className="w-full justify-start px-3 text-sm" />
          </div>
        </nav>
      </aside>
      <div className="relative z-10">
        <header className="hidden border-b border-white/15 px-8 py-4 lg:block">
          <p className="text-sm font-medium text-white/90">
            Clinic workspace
          </p>
        </header>
        <main id="main" className="px-4 py-6 lg:px-8">
          <Outlet />
        </main>
      </div>
      </div>
    </div>
  )
}
