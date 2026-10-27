import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { CURRENT_PRIVACY_POLICY_VERSION } from '@/legal/policyVersion'
import { pl } from '@/i18n/pl'
import type { ExportBundle } from '@/services/export/exportUserData'

export function buildPdfReport(bundle: ExportBundle): Blob {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  doc.setFontSize(16)
  doc.text(pl.export.pdfTitle, 14, 18)
  doc.setFontSize(10)
  doc.text(
    `${pl.export.generatedAt}: ${new Date().toLocaleString('pl-PL')}`,
    14,
    26,
  )
  doc.text(`${pl.export.policyVersion}: ${CURRENT_PRIVACY_POLICY_VERSION}`, 14, 32)
  doc.text(pl.export.disclaimer, 14, 38, { maxWidth: 180 })

  let startY = 46

  doc.setFontSize(12)
  doc.text(pl.export.medicationsSection, 14, startY)
  startY += 4

  autoTable(doc, {
    startY,
    head: [
      [
        'Nazwa',
        'Dawka',
        'Harmonogram',
        'Godziny',
      ],
    ],
    body: bundle.medications.map((m) => [
      m.name,
      m.doseText,
      m.schedule.type,
      m.times.join(', '),
    ]),
    styles: { fontSize: 8 },
    margin: { left: 14, right: 14 },
  })

  const afterMeds =
    (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
      ?.finalY ?? startY + 20

  doc.setFontSize(12)
  doc.text(pl.export.logsSection, 14, afterMeds + 10)

  autoTable(doc, {
    startY: afterMeds + 14,
    head: [['Pozycja', 'Plan', 'Status', 'Wzięte', 'Powód pominięcia']],
    body: bundle.doseLogs.map((log) => [
      bundle.nameById.get(log.medicationId) ?? '—',
      new Date(log.scheduledAt).toLocaleString('pl-PL'),
      pl.doseStatus[log.status],
      log.takenAt ? new Date(log.takenAt).toLocaleString('pl-PL') : '',
      log.skipReason ?? '',
    ]),
    styles: { fontSize: 7 },
    margin: { left: 14, right: 14 },
  })

  return doc.output('blob')
}
