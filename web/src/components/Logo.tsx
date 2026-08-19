type LogoProps = {
  className?: string
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <svg
      viewBox="2480 4680 8100 3380"
      className={`h-11 w-auto md:h-12 ${className}`}
      fillRule="evenodd"
      clipRule="evenodd"
      role="img"
      aria-label="Vita Health"
    >
      <path
        fill="#3D3C89"
        d="M4287.87 7670.71l776.21 -2215.72 -746.7 0 -419.39 1197.96c-23.48,70.46 -126.83,89.25 -159.71,0l-419.39 -1197.96 -746.7 0 776.21 2215.72c164.41,450.94 775.06,450.94 939.47,0z"
      />
      <rect fill="#3D3C89" x="5588.33" y="5454.99" width="543.33" height="1840" />
      <rect fill="#A44546" x="5588.33" y="4728.32" width="543.33" height="543.33" />
      <rect fill="#3D3C89" x="5588.33" y="7461.66" width="543.33" height="543.33" />
      <path
        fill="#A44546"
        d="M7557.72 4714.99l2627.27 0c183.33,0 333.33,150 333.33,333.33l0 2627.26c0,183.33 -150,333.33 -333.33,333.33l-2627.27 0c-183.33,0 -333.33,-150 -333.33,-333.33l0 -2627.26c0,-183.34 150,-333.33 333.33,-333.33zm1041.97 726.96l543.33 0 0 648.33 648.33 0 0 543.33 -648.33 0 0 648.33 -543.33 0 0 -648.33 -648.33 0 0 -543.33 648.33 0 0 -648.33z"
      />
      <path
        fill="#A44546"
        d="M5128.31 5271.66l192.98 -550.87 -746.88 0 -192.85 550.87 746.75 0zm-1873.59 0l-192.85 -550.87 -746.87 0 192.98 550.87 746.74 0z"
      />
      <polygon
        fill="#A44546"
        points="3816.98,5894.35 3700.99,5675.5 3584.99,5456.66 3816.98,5456.66 4048.98,5456.66 3932.98,5675.5"
      />
    </svg>
  )
}

export function Mark({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      width={32}
      height={32}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" fill="#A44546" />
      <path d="M14 8h4v16h-4V8zm-6 6h16v4H8v-4z" fill="#fff" />
    </svg>
  )
}
