import type { MedicationEntry } from '@mediapp/core'
import { formatDailyDosesLeft, stockAlertLevel } from '@mediapp/core'
import { StyleSheet, Text } from 'react-native'

import { useColorScheme } from '@/components/useColorScheme'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'

type MedicationStockLineProps = {
  medication: MedicationEntry
  compact?: boolean
}

const toneColor: Record<'ok' | 'warn' | 'critical', string> = {
  ok: '#64748b',
  warn: '#b45309',
  critical: '#b91c1c',
}

export function MedicationStockLine({
  medication,
  compact,
}: MedicationStockLineProps) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  if (medication.stockRemaining == null) return null
  const level = stockAlertLevel(medication) ?? 'ok'
  const daysLeft = formatDailyDosesLeft(medication)
  const text = pl.stock.remaining.replace(
    '{n}',
    String(medication.stockRemaining),
  )
  const suffix =
    level === 'critical'
      ? pl.stock.criticalDays.replace('{n}', String(daysLeft))
      : level === 'warn'
        ? pl.stock.warnDays.replace('{n}', String(daysLeft))
        : null

  return (
    <Text
      style={[
        compact ? styles.compact : styles.normal,
        { color: level === 'ok' ? c.textMuted : toneColor[level] },
        level !== 'ok' && styles.emphasis,
      ]}
    >
      {text}
      {suffix ? ` · ${suffix}` : ''}
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
  emphasis: {
    fontWeight: '600',
  },
})
