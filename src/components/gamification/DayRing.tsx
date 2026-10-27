interface DayRingProps {
  progress: number
  taken: number
  total: number
  label?: string
  sublabel?: string
  size?: 'sm' | 'md'
}

export function DayRing({
  progress,
  taken,
  total,
  label,
  sublabel,
  size = 'md',
}: DayRingProps) {
  const dim = size === 'sm' ? 72 : 120
  const r = size === 'sm' ? 30 : 52
  const stroke = size === 'sm' ? 7 : 10
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - Math.min(1, Math.max(0, progress)))
  const cx = dim / 2

  return (
    <div className="flex flex-col items-center">
      {label && (
        <p className="mb-2 text-sm font-medium">{label}</p>
      )}
      <svg
        width={dim}
        height={dim}
        viewBox={`0 0 ${dim} ${dim}`}
        role="progressbar"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={sublabel}
      >
        <circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={stroke}
        />
        <circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke="#0f766e"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${cx} ${cx})`}
        />
      </svg>
      {total > 0 && (
        <p className={`mt-2 font-bold ${size === 'sm' ? 'text-lg' : 'text-2xl'}`}>
          {taken} / {total}
        </p>
      )}
      {sublabel && (
        <p className="mt-1 text-center text-sm text-[var(--color-text-muted)]">
          {sublabel}
        </p>
      )}
    </div>
  )
}
