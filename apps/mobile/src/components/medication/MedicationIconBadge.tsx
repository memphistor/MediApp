import { medicationAccentColor, resolveMedicationIconDisplay } from '@mediapp/core'
import { StyleSheet, Text, View } from 'react-native'

import {
  hasMedicationLineIcon,
  MedicationLineIcon,
} from '@/src/components/medication/MedicationLineIcon'

type MedicationIconBadgeProps = {
  icon: string
  color: string | undefined
  size?: number
  boxSize?: number
}

function withAlpha(hex: string, alpha: number): string {
  const raw = hex.replace('#', '')
  const full = raw.length === 3 ? raw.split('').map((ch) => ch + ch).join('') : raw
  const value = Number.parseInt(full, 16)
  if (!Number.isFinite(value) || full.length !== 6) {
    return `rgba(11,135,123,${alpha})`
  }
  const r = (value >> 16) & 255
  const g = (value >> 8) & 255
  const b = value & 255
  return `rgba(${r},${g},${b},${alpha})`
}

export function MedicationIconBadge({
  icon,
  color,
  size = 22,
  boxSize,
}: MedicationIconBadgeProps) {
  const accent = medicationAccentColor(color)
  const box = boxSize ?? size + 26
  const font = boxSize ? Math.round(boxSize * 0.44) : size
  const radius = Math.round(box * 0.38)
  const display = resolveMedicationIconDisplay(icon)

  return (
    <View
      style={[
        styles.badge,
        {
          width: box,
          height: box,
          borderRadius: radius,
          backgroundColor: withAlpha(accent, 0.13),
          borderColor: withAlpha(accent, 0.22),
        },
      ]}
    >
      {hasMedicationLineIcon(display) ? (
        <MedicationLineIcon icon={display} color={accent} size={Math.round(box * 0.46)} />
      ) : (
        <Text style={{ fontSize: font }}>{display}</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
})
