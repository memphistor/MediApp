import type { MedicationEntry } from '@/types/medication'
import type { DoseLog } from '@/types/dose'

export const DEMO_MEDICATION: MedicationEntry = {
  id: 'demo-1',
  name: 'Euthyrox',
  kind: 'prescription',
  form: 'tablet',
  doseText: '1 tabletka',
  onEmptyStomach: 'yes',
  mealTiming: 'skipped',
  times: ['07:30'],
  schedule: { type: 'daily' },
  purposeLabel: 'tarczyca',
  color: '#0ea5e9',
  icon: '💊',
  userNote: 'Popić pełną szklanką wody — zalecenie dr Kowalskiej',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export const DEMO_MEDICATION_2: MedicationEntry = {
  id: 'demo-2',
  name: 'Magnesium',
  kind: 'supplement',
  form: 'capsule',
  doseText: '2 kapsułki',
  onEmptyStomach: 'no',
  mealTiming: 'after',
  times: ['20:00'],
  schedule: { type: 'weekdays', days: [1, 2, 3, 4, 5] },
  color: '#a855f7',
  icon: '🌙',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

const today = new Date()
today.setHours(7, 30, 0, 0)

export const DEMO_DOSE_LOGS: DoseLog[] = [
  {
    id: 'log-1',
    medicationId: 'demo-1',
    scheduledAt: today.toISOString(),
    status: 'taken',
    takenAt: today.toISOString(),
  },
  {
    id: 'log-2',
    medicationId: 'demo-2',
    scheduledAt: new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      20,
      0,
    ).toISOString(),
    status: 'planned',
  },
]
