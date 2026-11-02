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

const takenGreen = '#16a34a'
const missedRed = '#dc2626'
const skippedYellow = '#ca8a04'
const skippedRed = '#dc2626'

function pillColors(
  status: DoseStatus,
  ctx: DoseStatusDisplayContext,
  muted: string,
): { backgroundColor: string; color: string } {
  const asNeeded = isAsNeededDoseContext(ctx)
  if (status === 'taken') {
    return { backgroundColor: `${takenGreen}33`, color: takenGreen }
  }
  if (asNeeded && status === 'skipped') {
    return { backgroundColor: `${takenGreen}33`, color: takenGreen }
  }
  switch (status) {
    case 'missed':
      return { backgroundColor: `${missedRed}33`, color: missedRed }
    case 'skipped':
      if (ctx.medicationKind === 'supplement') {
        return { backgroundColor: `${skippedYellow}33`, color: skippedYellow }
      }
      return { backgroundColor: `${skippedRed}33`, color: skippedRed }
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
  const pill = pillColors(status, ctx, c.textMuted)

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
  text: { fontSize: 12, fontWeight: '600' },
})
