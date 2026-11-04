import { StyleSheet, Text, View } from 'react-native'

import {
  doseStatusContextFromLog,
  isAsNeededDoseContext,
  type DoseStatusDisplayContext,
} from '@mediapp/core'
import type { DoseLog, DoseStatus } from '@mediapp/core'
import type { MedicationEntry } from '@mediapp/core'

import { useColorScheme } from '@/components/useColorScheme'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'

function pillColors(
  status: DoseStatus,
  muted: string,
): { backgroundColor: string; color: string } {
  switch (status) {
    case 'taken':
      return { backgroundColor: '#d1fae5', color: '#047857' }
    case 'skipped':
      return { backgroundColor: '#fef3c7', color: '#b45309' }
    case 'missed':
      return { backgroundColor: '#fee2e2', color: '#b91c1c' }
    default:
      return { backgroundColor: `${muted}20`, color: muted }
  }
}

type DoseStatusBadgeProps = {
  status: DoseStatus
  context?: DoseStatusDisplayContext
  log?: DoseLog
  medication?: MedicationEntry
}

export function DoseStatusBadge({
  status,
  context,
  log,
  medication,
}: DoseStatusBadgeProps) {
  const scheme = useColorScheme()
  const c = themeColors(scheme)
  const ctx =
    context ??
    (log && medication
      ? doseStatusContextFromLog(log, medication)
      : ({} as DoseStatusDisplayContext))
  const pill = pillColors(status, c.textMuted)

  let label: string = pl.doseStatus[status] ?? status
  if (isAsNeededDoseContext(ctx) && status === 'skipped') {
    label = pl.asNeeded.skipOk
  }

  return (
    <View style={[styles.pill, { backgroundColor: pill.backgroundColor }]}>
      <Text style={[styles.text, { color: pill.color }]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  text: { fontSize: 13, fontWeight: '600' },
})
