import { useEffect, useMemo, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { Picker } from '@react-native-picker/picker'

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
      <View style={embedded ? styles.embedded : [styles.card, { borderColor: c.border, backgroundColor: c.surfaceElevated }]}>
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
    <View style={embedded ? styles.embedded : [styles.card, { borderColor: c.border, backgroundColor: c.surfaceElevated }]}>
      <Text style={[styles.title, { color: c.text }]}>{pl.progress.perMed.title}</Text>
      <Text style={[styles.hint, { color: c.textMuted }]}>{pl.progress.perMed.hint}</Text>

      <Text style={[styles.label, { color: c.text }]}>{pl.progress.perMed.select}</Text>
      <View style={[styles.pickerBox, { borderColor: c.border, backgroundColor: c.surface }]}>
        <Picker selectedValue={medId} onValueChange={setMedId}>
          {medications.map((m) => (
            <Picker.Item
              key={m.id}
              label={`${medicationIconLabel(m.icon)} ${m.name}`}
              value={m.id}
            />
          ))}
        </Picker>
      </View>

      <Text style={[styles.label, { color: c.text, marginTop: 12 }]}>
        {pl.progress.perMed.period}
      </Text>
      <View style={[styles.pickerBox, { borderColor: c.border, backgroundColor: c.surface }]}>
        <Picker
          selectedValue={period}
          onValueChange={(v) => setPeriod(v as ProgressPeriod)}
        >
          {PROGRESS_PERIODS.filter((p) => p !== 'day').map((p) => (
            <Picker.Item key={p} label={pl.progress.periods[p]} value={p} />
          ))}
        </Picker>
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
        <ScrollView style={{ maxHeight: 220, marginTop: 12 }}>
          {medLogs.slice(0, 30).map((log) => (
            <View key={log.id} style={[styles.logRow, { borderBottomColor: c.border }]}>
              <Text style={{ color: c.text, fontSize: 13 }}>
                {formatLocaleDateTime(log.scheduledAt)}
              </Text>
              {log.takenAt ? (
                <Text style={{ color: c.textMuted, fontSize: 12 }}>
                  {formatLocaleTime(log.takenAt)}
                </Text>
              ) : null}
              <DoseStatusBadge status={log.status} log={log} />
            </View>
          ))}
        </ScrollView>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 16, padding: 16 },
  embedded: { padding: 16, paddingTop: 12 },
  title: { fontSize: 16, fontWeight: '600' },
  subtitle: { fontSize: 13 },
  hint: { fontSize: 12, marginTop: 4 },
  label: { fontSize: 14, fontWeight: '500', marginTop: 8 },
  pickerBox: { borderWidth: 1, borderRadius: 12, marginTop: 4, overflow: 'hidden' },
  summary: { fontSize: 14, lineHeight: 20 },
  logRow: {
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
})
