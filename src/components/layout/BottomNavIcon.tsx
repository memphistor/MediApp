export type BottomNavIconId =
  | 'today'
  | 'calendar'
  | 'add'
  | 'progress'
  | 'settings'

type BottomNavIconProps = {
  id: BottomNavIconId
  active?: boolean
  className?: string
}

const stroke = 1.75

export function BottomNavIcon({
  id,
  active = false,
  className = '',
}: BottomNavIconProps) {
  if (id === 'add') {
    return (
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-2xl transition-colors ${
          active
            ? 'bg-brand text-white shadow-sm shadow-brand/25'
            : 'bg-brand/12 text-brand'
        } ${className}`}
        aria-hidden
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 6v12M6 12h12"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
          />
        </svg>
      </span>
    )
  }

  const tone = active
    ? 'text-brand'
    : 'text-[var(--color-text-muted)] opacity-70'

  const body = (() => {
    switch (id) {
      case 'today':
        return (
          <>
            <rect
              x="5"
              y="6"
              width="14"
              height="14"
              rx="3"
              stroke="currentColor"
              strokeWidth={stroke}
            />
            <path
              d="M9 4v3M15 4v3M8 11l2.5 2.5L16 9"
              stroke="currentColor"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )
      case 'calendar':
        return (
          <>
            <rect
              x="4"
              y="5"
              width="16"
              height="16"
              rx="2.5"
              stroke="currentColor"
              strokeWidth={stroke}
            />
            <path
              d="M4 10h16M8 3v3M16 3v3"
              stroke="currentColor"
              strokeWidth={stroke}
              strokeLinecap="round"
            />
            <circle cx="9" cy="14" r="1" fill="currentColor" />
            <circle cx="12" cy="14" r="1" fill="currentColor" />
            <circle cx="15" cy="14" r="1" fill="currentColor" />
          </>
        )
      case 'progress':
        return (
          <>
            <circle
              cx="12"
              cy="12"
              r="8"
              stroke="currentColor"
              strokeWidth={stroke}
            />
            <path
              d="M12 12V7M12 12l3.5 3.5"
              stroke="currentColor"
              strokeWidth={stroke}
              strokeLinecap="round"
            />
          </>
        )
      case 'settings':
        return (
          <>
            <circle
              cx="12"
              cy="12"
              r="2.5"
              stroke="currentColor"
              strokeWidth={stroke}
            />
            <path
              d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4"
              stroke="currentColor"
              strokeWidth={stroke}
              strokeLinecap="round"
            />
          </>
        )
      default:
        return null
    }
  })()

  return (
    <span
      className={`relative flex h-8 w-8 items-center justify-center transition-colors ${tone} ${className}`}
      aria-hidden
    >
      {active && (
        <span className="absolute inset-0 rounded-xl bg-brand/10" />
      )}
      <svg
        className="relative z-[1]"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
      >
        {body}
      </svg>
    </span>
  )
}
