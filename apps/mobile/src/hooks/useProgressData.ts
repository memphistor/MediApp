import { useEffect, useState } from 'react'

import {
  addDays,
  isEntryInDateRange,
  startOfLocalDay,
  type DoseLog,
  type GamificationState,
  type MedicationEntry,
} from '@mediapp/core'

import { useStorage } from '@/src/context/StorageContext'
import { getAllDoseLogs } from '@/src/storage/repositories/doseLogRepository'
import { getGamificationState } from '@/src/storage/repositories/gamificationRepository'
import { listMedications } from '@/src/storage/repositories/medicationRepository'
import { getDoseLogsBetween, getDoseLogsSince } from '@/src/storage/repositories/doseLogRepository'

export function useGamificationState(): {
  state: GamificationState | null
  loading: boolean
} {
  const { refreshKey } = useStorage()
  const [state, setState] = useState<GamificationState | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    void getGamificationState().then((s) => {
      if (!cancelled) {
        setState(s)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [refreshKey])

  return { state, loading }
}

export function useProgressLogs(): DoseLog[] | null {
  const { refreshKey } = useStorage()
  const [logs, setLogs] = useState<DoseLog[] | null>(null)

  useEffect(() => {
    let cancelled = false
    const from = startOfLocalDay(addDays(new Date(), -364)).toISOString()
    void getDoseLogsSince(from).then((rows) => {
      if (!cancelled) setLogs(rows)
    })
    return () => {
      cancelled = true
    }
  }, [refreshKey])

  return logs
}

export function useCalendarMonthLogs(
  year: number,
  month: number,
): DoseLog[] | null {
  const { refreshKey } = useStorage()
  const [logs, setLogs] = useState<DoseLog[] | null>(null)

  useEffect(() => {
    let cancelled = false
    const start = new Date(year, month, 1).toISOString()
    const end = new Date(year, month + 1, 0, 23, 59, 59, 999).toISOString()
    void getDoseLogsBetween(start, end).then((rows) => {
      if (!cancelled) setLogs(rows)
    })
    return () => {
      cancelled = true
    }
  }, [year, month, refreshKey])

  return logs
}

export function useHistoryData(): {
  logs: DoseLog[]
  medications: MedicationEntry[]
} | null {
  const { refreshKey } = useStorage()
  const [data, setData] = useState<{
    logs: DoseLog[]
    medications: MedicationEntry[]
  } | null>(null)

  useEffect(() => {
    let cancelled = false
    void Promise.all([getAllDoseLogs(), listMedications()]).then(
      ([logs, medications]) => {
        if (!cancelled) setData({ logs, medications })
      },
    )
    return () => {
      cancelled = true
    }
  }, [refreshKey])

  return data
}

export function useAsNeededMedications(): MedicationEntry[] {
  const { refreshKey } = useStorage()
  const [medications, setMedications] = useState<MedicationEntry[]>([])

  useEffect(() => {
    let cancelled = false
    void listMedications().then((all: MedicationEntry[]) => {
      const today = new Date()
      const filtered = all.filter(
        (m) => m.schedule.type === 'asNeeded' && isEntryInDateRange(today, m),
      )
      if (!cancelled) setMedications(filtered)
    })
    return () => {
      cancelled = true
    }
  }, [refreshKey])

  return medications
}
