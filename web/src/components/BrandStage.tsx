import type { ReactNode } from 'react'

/** Official Vi+ plus tile, used as a field pattern — not a generic medical icon. */
export function PlusField({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 80"
      aria-hidden="true"
      fill="none"
    >
      <rect width="80" height="80" rx="18" fill="#A44546" />
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M34 18h12v16h16v12H46v16H34V46H18V34h16V18Z"
      />
    </svg>
  )
}

export function BrandAtmosphere() {
  return (
    <div className="brand-atmosphere" aria-hidden>
      <div className="brand-atmosphere__glow" />
      <div className="brand-atmosphere__plus" />
    </div>
  )
}

export function BrandStage({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-svh overflow-hidden bg-navy-ink text-white">
      <BrandAtmosphere />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
