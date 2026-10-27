import type { DoseLog } from '@/types/dose'

export function monthCompletionRate(
  logs: DoseLog[],
  year: number,
  month: number,
): number {
  const resolved = logs.filter((l) => {
    const d = new Date(l.scheduledAt)
    if (d.getFullYear() !== year || d.getMonth() !== month) return false
    return l.status !== 'planned'
  })
  if (resolved.length === 0) return 0
  const taken = resolved.filter((l) => l.status === 'taken').length
  return taken / resolved.length
}
