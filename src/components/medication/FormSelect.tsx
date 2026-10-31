import type { ReactNode } from 'react'

const selectClassName =
  'mt-1 w-full min-h-12 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 text-sm'

type FormSelectProps = {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  children: ReactNode
  name?: string
}

export function FormSelect({
  label,
  value,
  onChange,
  error,
  children,
  name,
}: FormSelectProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <select
        name={name}
        className={selectClassName}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </label>
  )
}

export { selectClassName }
