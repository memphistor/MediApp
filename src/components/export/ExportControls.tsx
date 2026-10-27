import { useState } from 'react'
import { buildDoseLogsCsv, buildMedicationsCsv } from '@/services/export/buildCsv'
import { buildPdfReport } from '@/services/export/buildPdf'
import { downloadBlob, downloadTextFile } from '@/services/export/download'
import {
  bundleIsEmpty,
  loadExportBundle,
  type ExportRange,
} from '@/services/export/exportUserData'
import { pl } from '@/i18n/pl'

const RANGES: { value: ExportRange; label: string }[] = [
  { value: 'all', label: pl.export.rangeAll },
  { value: '30', label: pl.export.range30 },
  { value: '90', label: pl.export.range90 },
]

export function ExportControls({ compact = false }: { compact?: boolean }) {
  const [range, setRange] = useState<ExportRange>('all')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runExport = async (kind: 'csv' | 'pdf') => {
    setError(null)
    setBusy(true)
    try {
      const bundle = await loadExportBundle(range)
      if (bundleIsEmpty(bundle)) {
        setError(pl.export.empty)
        return
      }
      const stamp = new Date().toISOString().slice(0, 10)
      if (kind === 'csv') {
        downloadTextFile(
          `mediapp-pozycje-${stamp}.csv`,
          buildMedicationsCsv(bundle.medications),
        )
        downloadTextFile(
          `mediapp-dziennik-${stamp}.csv`,
          buildDoseLogsCsv(bundle.doseLogs, bundle.nameById),
        )
      } else {
        if (bundle.doseLogs.length > 500) {
          const ok = window.confirm(pl.export.largePdfConfirm)
          if (!ok) return
        }
        const blob = buildPdfReport(bundle)
        downloadBlob(`mediapp-eksport-${stamp}.pdf`, blob)
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={compact ? 'space-y-2' : 'space-y-3'}>
      <label className="block text-sm">
        <span className="font-medium text-[var(--color-text-muted)]">
          {pl.export.rangeLabel}
        </span>
        <select
          className="mt-1 w-full min-h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3"
          value={range}
          onChange={(e) => setRange(e.target.value as ExportRange)}
          disabled={busy}
        >
          {RANGES.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </label>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={busy}
          className="min-h-11 flex-1 rounded-xl border border-[var(--color-border)] text-sm font-medium disabled:opacity-50"
          onClick={() => void runExport('pdf')}
        >
          {pl.history.exportPdf}
        </button>
        <button
          type="button"
          disabled={busy}
          className="min-h-11 flex-1 rounded-xl border border-[var(--color-border)] text-sm font-medium disabled:opacity-50"
          onClick={() => void runExport('csv')}
        >
          {pl.history.exportCsv}
        </button>
      </div>
      {busy && (
        <p className="text-xs text-[var(--color-text-muted)]">{pl.export.working}</p>
      )}
      {error && <p className="text-xs text-red-600" role="alert">{error}</p>}
    </div>
  )
}
