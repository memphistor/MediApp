import { Link } from 'react-router-dom'
import { MedicationCard } from '@/components/medication/MedicationCard'
import { ReminderMock } from '@/components/reminders/ReminderMock'
import { DEMO_DOSE_LOGS, DEMO_MEDICATION, DEMO_MEDICATION_2 } from '@/data/demo'
import { pl } from '@/i18n/pl'

const demoMeds = {
  'demo-1': DEMO_MEDICATION,
  'demo-2': DEMO_MEDICATION_2,
}

export function TodayView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">{pl.today.title}</h2>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          {pl.today.demoNote}
        </p>
      </div>

      <ReminderMock />

      <ul className="space-y-3">
        {DEMO_DOSE_LOGS.map((log) => {
          const med = demoMeds[log.medicationId as keyof typeof demoMeds]
          if (!med) return null
          const time = new Date(log.scheduledAt).toLocaleTimeString('pl-PL', {
            hour: '2-digit',
            minute: '2-digit',
          })
          return (
            <li key={log.id}>
              <MedicationCard
                medication={med}
                time={time}
                status={log.status}
              />
            </li>
          )
        })}
      </ul>

      <Link
        to="/add"
        className="flex min-h-12 items-center justify-center rounded-2xl border border-dashed border-brand text-sm font-semibold text-brand"
      >
        {pl.today.addFirst}
      </Link>
    </div>
  )
}
