import { useEffect, useState } from 'react'

import { useStorage } from '@/src/context/StorageContext'
import { getMedicationById } from '@/src/storage/repositories/medicationRepository'
import type { MedicationEntry } from '@mediapp/core'

export function useMedication(id: string | undefined) {
  const { refreshKey } = useStorage()
  const [medication, setMedication] = useState<MedicationEntry | undefined>()
  const [loading, setLoading] = useState(Boolean(id))

  useEffect(() => {
    if (!id) {
      setMedication(undefined)
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    void getMedicationById(id).then((med) => {
      if (cancelled) return
      setMedication(med)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [id, refreshKey])

  return { medication, loading, found: medication !== undefined }
}
