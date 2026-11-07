import { useEffect, useMemo, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import {
  PROGRESS_PERIODS,
  formatLocaleDateTime,
  formatLocaleTime,
  logsForMedicationInPeriod,
  medicationIconLabel,
  takenAdherenceRate,
  timingCountsForLogs,
  type DoseLog,
  type MedicationEntry,
  type ProgressPeriod,
} from '@mediapp/core'

import { useColorScheme } from '@/components/useColorScheme'
import { DoseStatusBadge } from '@/src/components/dose/DoseStatusBadge'
import { CollapsibleSection } from '@/src/components/layout/CollapsibleSection'
import { ChoiceGroup } from '@/src/components/ui/ChoiceGroup'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'

type MedOption = {
  id: string
  name: string
  icon: string
  kind: MedicationEntry['kind']
  scheduleType: MedicationEntry['schedule']['type']
}

type MedicationProgressPanelProps = {
  logs: DoseLog[]
  medications: MedOption[]
  referenceDate?: Date
  embedded?: boolean
}

function pct(rate: number): number {
  return Math.round(rate * 100)
}

export function MedicationProgressPanel({
  logs,
  medications,
  referenceDate = new Date(),
  embedded = false,
}: MedicationProgressPanelProps) {
  const scheme = useColorScheme()
  const c = themeColors(scheme)
  const [medId, setMedId] = useState('')
  const [period, setPeriod] = useState<ProgressPeriod>('month')

  useEffect(() => {
    if (!medId && medications[0]) setMedId(medications[0].id)
  }, [medications, medId])

  const medLogs = useMemo(() => {
    if (!medId) return []
    return logsForMedicationInPeriod(logs, medId, period, referenceDate)
  }, [logs, medId, period, referenceDate])

  const counts = useMemo(() => timingCountsForLogs(medLogs), [medLogs])

  if (medications.length === 0) {
    return (
      <View
        style={[
          embedded ? styles.embedded : styles.card,
          !embedded ? { backgroundColor: c.surfaceElevated } : null,
        ]}
      >
        <Text style={[styles.title, { color: c.text }]}>{pl.progress.perMed.title}</Text>
        <Text style={[styles.hint, { color: c.textMuted }]}>
          {pl.progress.perMed.noMedications}
        </Text>
      </View>
    )
  }

  const taken =
    counts.onTime + counts.early + counts.late + counts.unknown
  const due = counts.totalScheduled
  const selectedMed = medications.find((m) => m.id === medId)

  return (
    <View style={embedded ? styles.embedded : [styles.card, { backgroundColor: c.surfaceElevated }]}>
      {embedded ? null : (
        <>
          <Text style={[styles.title, { color: c.text }]}>{pl.progress.perMed.title}</Text>
          <Text style={[styles.hint, { color: c.textMuted }]}>{pl.progress.perMed.hint}</Text>
        </>
      )}

      <View style={{ marginTop: 12 }}>
        <ChoiceGroup
          label={pl.progress.perMed.select}
          value={medId}
          options={medications.map((m) => ({
            value: m.id,
            label: `${medicationIconLabel(m.icon)} ${m.name}`,
          }))}
          onChange={setMedId}
        />
      </View>
      <View style={{ marginTop: 12 }}>
        <ChoiceGroup
          label={pl.progress.perMed.period}
          layout="equal"
          value={period}
          options={PROGRESS_PERIODS.filter((p) => p !== 'day').map((p) => ({
            value: p,
            label: pl.progress.periodChip[p],
          }))}
          onChange={(value) => setPeriod(value as ProgressPeriod)}
        />
      </View>

      {selectedMed ? (
        <Text style={[styles.subtitle, { color: c.textMuted, marginTop: 12 }]}>
          {medicationIconLabel(selectedMed.icon)} {selectedMed.name}
        </Text>
      ) : null}

      {due === 0 ? (
        <Text style={[styles.hint, { color: c.textMuted, marginTop: 8 }]}>
          {pl.progress.timing.noData}
        </Text>
      ) : (
        <Text style={[styles.summary, { color: c.text, marginTop: 8 }]}>
          {pl.progress.perMed.summary
            .replace('{pct}', String(pct(takenAdherenceRate(counts))))
            .replace('{taken}', String(taken))
            .replace('{due}', String(due))}
        </Text>
      )}

      {medLogs.length > 0 ? (
        <View style={{ marginTop: 12 }}>
          <CollapsibleSection title={pl.progress.perMed.intakeList}>
            {medLogs.slice(0, 30).map((log) => (
              <View key={log.id} style={[styles.logRow, { borderBottomColor: c.border }]}>
                <Text style={{ color: c.text, fontSize: 13 }}>
                  {formatLocaleDateTime(log.scheduledAt)}
                </Text>
                {log.takenAt ? (
                  <Text style={{ color: c.textMuted, fontSize: 13 }}>
                    {formatLocaleTime(log.takenAt)}
                  </Text>
                ) : null}
                <DoseStatusBadge status={log.status} log={log} />
              </View>
            ))}
          </CollapsibleSection>
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  card: { borderRadius: 20, padding: 16 },
  embedded: { paddingTop: 12 },
  title: { fontSize: 17, fontWeight: '600' },
  subtitle: { fontSize: 15 },
  hint: { fontSize: 13, marginTop: 4, lineHeight: 18 },
  summary: { fontSize: 15, lineHeight: 20 },
  logRow: {
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
})
