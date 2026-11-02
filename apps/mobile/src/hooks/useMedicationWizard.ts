import {
  DEFAULT_MEDICATION_COLOR,
  DEFAULT_MEDICATION_ICON,
  buildMedicationFromWizard,
  firstWizardStepWithErrors,
  medicationToWizardState,
  validateWizard,
  validateWizardStep,
  type WizardErrors,
  type WizardFormState,
} from '@mediapp/core'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'

import { useStorage } from '@/src/context/StorageContext'
import { pl } from '@/src/i18n/pl'
import {
  createMedication,
  getMedicationById,
  updateMedication,
} from '@/src/storage/repositories/medicationRepository'
import { syncDoseLogsForMedication } from '@/src/storage/services/syncDoseLogs'

export const wizardInitialForm: WizardFormState = {
  name: '',
  kind: 'otc',
  form: 'tablet',
  doseText: '',
  emptyStomach: 'na',
  meal: '',
  timesRaw: '08:00',
  scheduleType: 'daily',
  weekdayDays: [1, 2, 3, 4, 5],
  everyNInterval: 2,
  weeklyDay: 1,
  monthlyDay: 1,
  cycleActive: 21,
  cycleBreak: 7,
  dateStart: '',
  dateEnd: '',
  purpose: '',
  note: '',
  color: DEFAULT_MEDICATION_COLOR,
  icon: DEFAULT_MEDICATION_ICON,
  trackStock: false,
  stockRemaining: 30,
  stockUnitsPerIntake: 1,
  remindersEnabled: true,
}

type UseMedicationWizardOptions = {
  medicationId?: string
}

export function useMedicationWizard({ medicationId }: UseMedicationWizardOptions) {
  const router = useRouter()
  const { bumpRefresh } = useStorage()
  const formRef = useRef<WizardFormState>(wizardInitialForm)
  const [form, setForm] = useState<WizardFormState>(wizardInitialForm)
  const [errors, setErrors] = useState<WizardErrors>({})
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [step, setStep] = useState(1)
  const [hydrated, setHydrated] = useState(!medicationId)
  const [loadError, setLoadError] = useState<string | null>(null)

  const patch = useCallback((partial: Partial<WizardFormState>) => {
    const next = { ...formRef.current, ...partial }
    formRef.current = next
    setForm(next)
  }, [])

  useEffect(() => {
    if (!medicationId) {
      formRef.current = { ...wizardInitialForm }
      setForm({ ...wizardInitialForm })
      setHydrated(true)
      return
    }
    let cancelled = false
    void getMedicationById(medicationId).then((existing) => {
      if (cancelled) return
      if (!existing) {
        setLoadError(pl.detail.notFound)
        setHydrated(true)
        return
      }
      const state = medicationToWizardState(existing)
      formRef.current = state
      setForm(state)
      setHydrated(true)
    })
    return () => {
      cancelled = true
    }
  }, [medicationId])

  const toggleWeekday = useCallback((day: number) => {
    const current = formRef.current
    const has = current.weekdayDays.includes(day)
    const weekdayDays = has
      ? current.weekdayDays.filter((d) => d !== day)
      : [...current.weekdayDays, day]
    patch({ weekdayDays })
  }, [patch])

  const persistMedication = useCallback(
    async (current: WizardFormState) => {
      setSaving(true)
      try {
        const prior = medicationId
          ? await getMedicationById(medicationId)
          : undefined
        const entry = buildMedicationFromWizard(
          current,
          prior ? { id: prior.id, createdAt: prior.createdAt } : undefined,
        )
        if (prior) await updateMedication(entry)
        else await createMedication(entry)
        await syncDoseLogsForMedication(entry.id)
        bumpRefresh()
        if (prior) {
          router.replace(`/medication/${entry.id}`)
        } else {
          router.replace('/(tabs)/')
        }
      } catch (err) {
        console.error(err)
        setSaveError(pl.wizard.saveFailed)
      } finally {
        setSaving(false)
      }
    },
    [medicationId, bumpRefresh, router],
  )

  const goNextOrSave = useCallback(() => {
    setSaveError(null)
    const current = formRef.current
    if (step < 3) {
      const stepErrors = validateWizardStep(step, current)
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors)
        return false
      }
      setErrors({})
      setStep((s) => s + 1)
      return true
    }
    const validation = validateWizard(current)
    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      const errorStep = firstWizardStepWithErrors(validation)
      if (errorStep) setStep(errorStep)
      return false
    }
    setErrors({})
    void persistMedication(current)
    return true
  }, [step, persistMedication])

  const goBack = useCallback(() => {
    setErrors({})
    setStep((s) => Math.max(1, s - 1))
  }, [])

  return {
    form,
    patch,
    errors,
    saveError,
    saving,
    step,
    hydrated,
    loadError,
    toggleWeekday,
    goNextOrSave,
    goBack,
    isEdit: Boolean(medicationId),
  }
}
