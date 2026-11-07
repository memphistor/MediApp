import { useEffect, useMemo, useState } from 'react'
import {
  addDays,
  endOfLocalDay,
  startOfWeekMonday,
  toDateKey,
  type DoseLog,
  type MedicationEntry,
} from '@mediapp/core'

import { useStorage } from '@/src/context/StorageContext'
import {
  getDoseLogsBetween,
  getDoseLogsForDay,
} from '@/src/storage/repositories/doseLogRepository'
import { listMedications } from '@/src/storage/repositories/medicationRepository'

export function useTodayData(today: Date = new Date()) {
  const { refreshKey } = useStorage()
  const [logs, setLogs] = useState<DoseLog[]>([])
  const [medications, setMedications] = useState<MedicationEntry[]>([])
  const [loading, setLoading] = useState(true)

  const dateKey = today.toDateString()

  useEffect(() => {
    let cancelled = false
    void (async () => {
      setLoading(true)
      try {
        const [dayLogs, meds] = await Promise.all([
          getDoseLogsForDay(today),
          listMedications(),
        ])
        if (!cancelled) {
          setLogs(dayLogs)
          setMedications(meds)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [refreshKey, dateKey, today])

  const medMap = useMemo(() => {
    const m = new Map<string, MedicationEntry>()
    for (const med of medications) m.set(med.id, med)
    return m
  }, [medications])

  const entries = useMemo(
    () =>
      logs.filter(
        (log) => medMap.has(log.medicationId) && log.source !== 'prn',
      ),
    [logs, medMap],
  )

  return { entries, medMap, medications, loading }
}

export function useWeekDoseLogs(today: Date) {
  const { refreshKey } = useStorage()
  const [logs, setLogs] = useState<DoseLog[]>([])
  const weekKey = toDateKey(startOfWeekMonday(today))

  useEffect(() => {
    const monday = startOfWeekMonday(today)
    const end = endOfLocalDay(addDays(monday, 6))
    let cancelled = false
    void getDoseLogsBetween(monday.toISOString(), end.toISOString()).then((rows) => {
      if (!cancelled) setLogs(rows)
    })
    return () => {
      cancelled = true
    }
  }, [refreshKey, weekKey, today])

  return logs
}
