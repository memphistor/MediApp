import { Link } from 'react-router-dom'
import { pl } from '@/i18n/pl'

export function NotificationLimitsView() {
  const copy = pl.notificationHelp
  const paragraphs = [copy.lead, copy.tick, copy.ios, copy.noPermission, copy.persistent, copy.closed]

  return (
    <div className="space-y-4">
      <Link to="/settings" className="text-sm font-medium text-brand">
        ← {pl.wizard.back}
      </Link>
      <h2 className="text-xl font-semibold">{copy.title}</h2>
      {paragraphs.map((text) => (
        <p key={text} className="text-sm leading-relaxed text-[var(--color-text)]">
          {text}
        </p>
      ))}
    </div>
  )
}
