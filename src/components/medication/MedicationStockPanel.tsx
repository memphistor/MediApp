import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { MedicationStockLine } from '@/components/medication/MedicationStockLine'
import { pl } from '@/i18n/pl'
import { getMedicationById } from '@/repositories/medicationRepository'
import { addMedicationStock } from '@/services/medicationStock'

type MedicationStockPanelProps = {
  medicationId: string
}

export function MedicationStockPanel({ medicationId }: MedicationStockPanelProps) {
  const med = useLiveQuery(
    () => getMedicationById(medicationId),
    [medicationId],
  )
  const [amount, setAmount] = useState(30)
  const [saving, setSaving] = useState(false)

  if (!med || med.stockRemaining == null) return null

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4">
      <p className="text-sm font-semibold">{pl.stock.replenishTitle}</p>
      <MedicationStockLine medication={med} />
      <p className="mt-2 text-xs text-[var(--color-text-muted)]">
        {pl.stock.replenishHint}
      </p>
      <label className="mt-3 block text-sm">
        {pl.stock.replenishAmount}
        <input
          type="number"
          min={1}
          className="mt-1 w-full min-h-11 rounded-xl border border-[var(--color-border)] px-3"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </label>
      <button
        type="button"
        disabled={saving || amount < 1}
        className="mt-3 min-h-11 w-full rounded-xl border border-brand text-sm font-semibold text-brand disabled:opacity-50"
        onClick={() => {
          setSaving(true)
          void addMedicationStock(medicationId, amount).finally(() =>
            setSaving(false),
          )
        }}
      >
        {pl.stock.replenishAction}
      </button>
    </div>
  )
}
