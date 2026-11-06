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
import { statusPillColors, themeColors } from '@/src/theme/colors'

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
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const ctx =
    context ??
    (log && medication
      ? doseStatusContextFromLog(log, medication)
      : ({} as DoseStatusDisplayContext))
  const pill = statusPillColors(status, c.scheme)

  let label: string = pl.doseStatus[status] ?? status
  if (isAsNeededDoseContext(ctx) && status === 'skipped') {
    label = pl.asNeeded.skipOk
  }

  return (
    <View style={[styles.pill, { backgroundColor: pill.backgroundColor }]}>
      <View style={[styles.dot, { backgroundColor: pill.color }]} />
      <Text style={[styles.text, { color: pill.color }]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  pill: {
    height: 30,
    borderRadius: 15,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: { fontSize: 13, fontWeight: '500' },
})
