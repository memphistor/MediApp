const sizePx = {
  sm: 28,
  md: 36,
  lg: 52,
} as const

type AppLogoProps = {
  size?: keyof typeof sizePx
  className?: string
  /** When true, hidden from assistive tech (use beside visible app name). */
  decorative?: boolean
  label?: string
}

/** Matches `public/favicon.svg` — pill/cross mark on brand teal. */
export function AppLogo({
  size = 'md',
  className = '',
  decorative = false,
  label = 'MediApp',
}: AppLogoProps) {
  const px = sizePx[size]
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      width={px}
      height={px}
      className={`shrink-0 ${className}`.trim()}
      {...(decorative
        ? { 'aria-hidden': true }
        : { role: 'img', 'aria-label': label })}
    >
      <rect width="32" height="32" rx="8" fill="#0f766e" />
      <path
        d="M10 16h12M16 10v12"
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
