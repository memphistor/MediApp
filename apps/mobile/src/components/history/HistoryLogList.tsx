import { StyleSheet, Text, View } from 'react-native'

import type { DoseLog, MedicationEntry } from '@mediapp/core'
import { formatLocaleDateTime } from '@mediapp/core'

import { useColorScheme } from '@/components/useColorScheme'
import { DoseStatusBadge } from '@/src/components/dose/DoseStatusBadge'
import { TakenAtEditor } from '@/src/components/history/TakenAtEditor'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'

type HistoryLogListProps = {
  logs: DoseLog[]
  nameById: Map<string, string>
  medications: MedicationEntry[]
  emptyLabel: string
}

export function HistoryLogList({
  logs,
  nameById,
  medications,
  emptyLabel,
}: HistoryLogListProps) {
  const scheme = useColorScheme()
  const c = themeColors(scheme)

  if (!logs.length) {
    return (
      <Text style={[styles.empty, { color: c.textMuted }]}>{emptyLabel}</Text>
    )
  }

  return (
    <View>
      {logs.map((log) => {
        const med = medications.find((m) => m.id === log.medicationId)
        return (
          <View
            key={log.id}
            style={[styles.row, { borderBottomColor: c.border }]}
          >
            <View style={styles.rowTop}>
              <Text style={[styles.name, { color: c.text }]}>
                {nameById.get(log.medicationId) ?? '—'}
              </Text>
              <DoseStatusBadge log={log} medication={med} status={log.status} />
            </View>
            <Text style={[styles.time, { color: c.textMuted }]}>
              {pl.history.plannedAt}: {formatLocaleDateTime(log.scheduledAt)}
            </Text>
            {log.status === 'taken' && log.takenAt ? (
              <TakenAtEditor logId={log.id} takenAt={log.takenAt} showDate />
            ) : null}
            {log.skipReason ? (
              <Text style={[styles.skip, { color: c.textMuted }]}>
                {log.skipReason}
              </Text>
            ) : null}
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  empty: { padding: 16, fontSize: 15 },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  name: { fontSize: 17, fontWeight: '600', flex: 1 },
  time: { marginTop: 4, fontSize: 13 },
  skip: { marginTop: 4, fontSize: 13 },
})
