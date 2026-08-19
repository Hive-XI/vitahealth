import { Link } from 'react-router-dom'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

const btn =
  'inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[15px] font-semibold tracking-normal transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50'

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
}) {
  const styles = {
    primary: 'bg-burgundy text-white hover:bg-burgundy-ink',
    secondary:
      'bg-white text-navy ring-1 ring-line hover:bg-burgundy hover:text-white',
    ghost: 'bg-transparent text-navy hover:bg-navy/10',
    outline:
      'bg-transparent text-white ring-1 ring-white hover:bg-white hover:text-navy',
    danger: 'bg-burgundy text-white hover:bg-burgundy-ink',
  }[variant]
  return <button className={`${btn} ${styles} ${className}`} {...props} />
}

export function ButtonLink({
  to,
  children,
  variant = 'primary',
  className = '',
}: {
  to: string
  children: ReactNode
  className?: string
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
}) {
  const styles = {
    primary: 'bg-burgundy text-white hover:bg-burgundy-ink',
    secondary:
      'bg-white text-navy ring-1 ring-line hover:bg-burgundy hover:text-white',
    ghost: 'bg-transparent text-navy hover:bg-navy/10',
    outline:
      'bg-transparent text-white ring-1 ring-white hover:bg-white hover:text-navy',
    danger: 'bg-burgundy text-white hover:bg-burgundy-ink',
  }[variant]
  return (
    <Link to={to} className={`${btn} ${styles} ${className}`}>
      {children}
    </Link>
  )
}

export function Card({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={`rounded-2xl bg-white p-5 text-black ring-1 ring-line ${className}`}
    >
      {children}
    </section>
  )
}

export function Field({
  id,
  label,
  children,
  hint,
}: {
  id: string
  label: string
  children: ReactNode
  hint?: string
}) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-black">
        {label}
      </label>
      {children}
      {hint ? <p className="text-sm text-muted">{hint}</p> : null}
    </div>
  )
}

export const inputClass =
  'min-h-11 w-full rounded-xl border border-line bg-white px-3 text-[16px] tracking-normal text-black outline-none transition-colors duration-200 placeholder:text-muted focus:border-navy'
