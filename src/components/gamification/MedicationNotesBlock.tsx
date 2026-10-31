import { useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import {
  formatLocaleDateTime,
  fromDatetimeLocalValue,
  toDatetimeLocalValue,
} from '@/lib/dates'
import { periodBounds, type ProgressPeriod } from '@/lib/gamification/progressPeriods'
import {
  createMedicationNote,
  deleteMedicationNote,
  filterNotesByLocalRange,
  listMedicationNotes,
} from '@/repositories/medicationNoteRepository'
import { pl } from '@/i18n/pl'

type MedicationNotesBlockProps = {
  medicationId: string
  period: ProgressPeriod
  referenceDate?: Date
}

export function MedicationNotesBlock({
  medicationId,
  period,
  referenceDate = new Date(),
}: MedicationNotesBlockProps) {
  const [draftBody, setDraftBody] = useState('')
  const [draftWhen, setDraftWhen] = useState(() =>
    toDatetimeLocalValue(new Date()),
  )
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const allNotes = useLiveQuery(
    () => (medicationId ? listMedicationNotes(medicationId) : []),
    [medicationId],
    [],
  )

  const notes = useMemo(() => {
    const { from, to } = periodBounds(period, referenceDate)
    return filterNotesByLocalRange(allNotes ?? [], from, to)
  }, [allNotes, period, referenceDate])

  const saveNote = async () => {
    const parsed = fromDatetimeLocalValue(draftWhen)
    if (!parsed) {
      setError(pl.progress.perMed.notesWhenInvalid)
      return
    }
    if (!draftBody.trim()) {
      setError(pl.progress.perMed.notesBodyRequired)
      return
    }
    setSaving(true)
    setError(null)
    try {
      await createMedicationNote({
        medicationId,
        body: draftBody,
        recordedAt: parsed.toISOString(),
      })
      setDraftBody('')
      setDraftWhen(toDatetimeLocalValue(new Date()))
    } catch {
      setError(pl.progress.perMed.notesSaveFailed)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-3 border-t border-[var(--color-border)] pt-4">
      <div>
        <p className="text-sm font-medium">{pl.progress.perMed.notesTitle}</p>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          {pl.progress.perMed.notesHint}
        </p>
      </div>

      <label className="block">
        <span className="text-xs font-medium">
          {pl.progress.perMed.notesWhen}
        </span>
        <input
          type="datetime-local"
          className="mt-1 w-full min-h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm"
          value={draftWhen}
          onChange={(e) => setDraftWhen(e.target.value)}
        />
      </label>

      <label className="block">
        <span className="text-xs font-medium">
          {pl.progress.perMed.notesBody}
        </span>
        <textarea
          className="mt-1 w-full min-h-20 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
          value={draftBody}
          onChange={(e) => setDraftBody(e.target.value)}
          placeholder={pl.progress.perMed.notesPlaceholder}
        />
      </label>

      {error && (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="button"
        disabled={saving}
        className="min-h-11 w-full rounded-xl bg-brand text-sm font-semibold text-white disabled:opacity-60"
        onClick={() => void saveNote()}
      >
        {saving ? pl.progress.perMed.notesSaving : pl.progress.perMed.notesSave}
      </button>

      {notes.length === 0 ? (
        <p className="text-xs text-[var(--color-text-muted)]">
          {pl.progress.perMed.notesEmpty}
        </p>
      ) : (
        <ul className="max-h-56 space-y-2 overflow-y-auto">
          {notes.map((note) => (
            <li
              key={note.id}
              className="rounded-xl border border-[var(--color-border)] px-3 py-2 text-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <time className="font-medium text-[var(--color-text)]">
                  {formatLocaleDateTime(note.recordedAt)}
                </time>
                <button
                  type="button"
                  className="shrink-0 text-[var(--color-text-muted)] underline-offset-2 hover:underline"
                  onClick={() => void deleteMedicationNote(note.id)}
                >
                  {pl.progress.perMed.notesDelete}
                </button>
              </div>
              <p className="mt-1 whitespace-pre-wrap text-[var(--color-text-muted)]">
                {note.body}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
