import { useState } from 'react'
import {
  formatLocaleDateTime,
  formatLocaleTime,
  fromDatetimeLocalValue,
  toDatetimeLocalValue,
} from '@/lib/dates'
import { updateDoseTakenAt } from '@/repositories/doseLogRepository'
import { pl } from '@/i18n/pl'

type TakenAtEditorProps = {
  logId: string
  takenAt: string
  /** Show full date+time in read mode (History). Default: time only. */
  showDate?: boolean
}

export function TakenAtEditor({
  logId,
  takenAt,
  showDate = false,
}: TakenAtEditorProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(() => toDatetimeLocalValue(new Date(takenAt)))
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const display = showDate
    ? formatLocaleDateTime(takenAt)
    : formatLocaleTime(takenAt)

  const startEdit = () => {
    setDraft(toDatetimeLocalValue(new Date(takenAt)))
    setError(null)
    setEditing(true)
  }

  const save = async () => {
    const parsed = fromDatetimeLocalValue(draft)
    if (!parsed) {
      setError(pl.history.takenAtInvalid)
      return
    }
    setSaving(true)
    setError(null)
    const ok = await updateDoseTakenAt(logId, parsed.toISOString())
    setSaving(false)
    if (!ok) {
      setError(pl.history.takenAtSaveFailed)
      return
    }
    setEditing(false)
  }

  if (!editing) {
    return (
      <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="text-xs text-[var(--color-text)]">
          {pl.history.takenAt}: {display}
        </span>
        <button
          type="button"
          className="min-h-9 text-xs font-medium text-brand underline-offset-2 hover:underline"
          onClick={startEdit}
        >
          {pl.history.editTakenAt}
        </button>
      </div>
    )
  }

  return (
    <div className="mt-2 space-y-2">
      <label className="block text-xs font-medium">
        {pl.history.takenAtLabel}
        <input
          type="datetime-local"
          className="mt-1 w-full min-h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
      </label>
      {error && (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
      <div className="flex gap-2">
        <button
          type="button"
          disabled={saving}
          className="min-h-10 flex-1 rounded-xl bg-brand text-sm font-semibold text-white disabled:opacity-60"
          onClick={() => void save()}
        >
          {pl.history.saveTakenAt}
        </button>
        <button
          type="button"
          disabled={saving}
          className="min-h-10 flex-1 rounded-xl border border-[var(--color-border)] text-sm font-medium"
          onClick={() => {
            setEditing(false)
            setError(null)
          }}
        >
          {pl.history.cancelEdit}
        </button>
      </div>
    </div>
  )
}
