import type { Schedule } from '@mediapp/core'
import { StyleSheet, Text } from 'react-native'

import { useColorScheme } from '@/components/useColorScheme'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'

import { scheduleSummaryText } from './scheduleSummaryText'

type ScheduleSummaryProps = {
  schedule: Schedule
  compact?: boolean
}

export function ScheduleSummary({ schedule, compact }: ScheduleSummaryProps) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const text = scheduleSummaryText(schedule, pl)

  return (
    <Text
      style={[
        compact ? styles.compact : styles.normal,
        { color: compact ? c.textMuted : c.text },
      ]}
    >
      {text}
    </Text>
  )
}

const styles = StyleSheet.create({
  compact: {
    fontSize: 13,
  },
  normal: {
    fontSize: 14,
  },
})
