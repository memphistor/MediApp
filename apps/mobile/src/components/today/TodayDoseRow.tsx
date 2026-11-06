import { Pressable, StyleSheet, Text, View } from 'react-native'
import { medicationAccentColor, type DoseLog, type MedicationEntry } from '@mediapp/core'

import { DoseStatusBadge } from '@/src/components/dose/DoseStatusBadge'
import { MedicationIconBadge } from '@/src/components/medication/MedicationIconBadge'
import { themeColors } from '@/src/theme/colors'
import { useColorScheme } from '@/components/useColorScheme'

interface TodayDoseRowProps {
  log: DoseLog
  medication: MedicationEntry
  onOpen: () => void
  divider?: boolean
}

export function TodayDoseRow({
  log,
  medication,
  onOpen,
  divider = false,
}: TodayDoseRowProps) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const accent = medicationAccentColor(medication.color)

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${medication.name}, ${medication.doseText}`}
      onPress={onOpen}
      style={[styles.row, divider && { borderTopWidth: 1, borderTopColor: c.line }]}
    >
      <View style={[styles.accent, { backgroundColor: accent }]} />
      <MedicationIconBadge icon={medication.icon} color={medication.color} boxSize={52} />
      <View style={styles.text}>
        <Text style={[styles.name, { color: c.text }]} numberOfLines={1}>
          {medication.name}
        </Text>
        <Text style={[styles.dose, { color: c.textMuted }]} numberOfLines={1}>
          {medication.doseText}
        </Text>
      </View>
      <DoseStatusBadge status={log.status} log={log} medication={medication} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 18,
    paddingRight: 22,
    paddingLeft: 34,
  },
  accent: {
    position: 'absolute',
    left: 14,
    top: 22,
    bottom: 22,
    width: 3,
    borderRadius: 2,
  },
  text: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  dose: {
    marginTop: 3,
    fontSize: 15,
    lineHeight: 20,
  },
})
