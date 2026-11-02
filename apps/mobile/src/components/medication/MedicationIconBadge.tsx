import {
  medicationAccentColor,
  medicationAccentSurface,
  resolveMedicationIconDisplay,
} from '@mediapp/core'
import { StyleSheet, Text, View } from 'react-native'

type MedicationIconBadgeProps = {
  icon: string
  color: string | undefined
  size?: number
}

export function MedicationIconBadge({
  icon,
  color,
  size = 28,
}: MedicationIconBadgeProps) {
  const accent = medicationAccentColor(color)
  const box = size + 14
  const display = resolveMedicationIconDisplay(icon)

  return (
    <View
      style={[
        styles.badge,
        {
          width: box,
          height: box,
          borderColor: accent,
          backgroundColor: medicationAccentSurface(color ?? accent),
        },
      ]}
    >
      <Text style={{ fontSize: size * 0.85 }}>{display}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 2,
  },
})
