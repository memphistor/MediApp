import { pl } from '@/i18n/pl'
import {
  doseStatusPillStyle,
  isAsNeededDoseContext,
  type DoseStatusDisplayContext,
} from '@/lib/dose/doseStatusDisplay'
import type { DoseStatus } from '@/types/dose'

type DoseStatusBadgeProps = {
  status: DoseStatus
  context?: DoseStatusDisplayContext
  className?: string
}

export function DoseStatusBadge({
  status,
  context = {},
  className = '',
}: DoseStatusBadgeProps) {
  const style = doseStatusPillStyle(status, context)
  const label =
    status === 'skipped' && isAsNeededDoseContext(context)
      ? pl.doseStatus.skippedAsNeededOk
      : pl.doseStatus[status]

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${className}`}
      style={style}
    >
      {label}
    </span>
  )
}

export { doseStatusPillStyle, type DoseStatusDisplayContext } from '@/lib/dose/doseStatusDisplay'
