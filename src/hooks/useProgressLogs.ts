import { useLiveQuery } from 'dexie-react-hooks'
import { addDays, startOfLocalDay } from '@/lib/dates'
import { db } from '@/db/database'

/** Scheduled dose logs for progress/analytics (last ~year). */
export function useProgressLogs() {
  return useLiveQuery(async () => {
    const from = startOfLocalDay(addDays(new Date(), -364))
    return db.doseLogs
      .where('scheduledAt')
      .above(from.toISOString())
      .toArray()
  }, [])
}
