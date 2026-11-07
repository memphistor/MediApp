import { MEDICATION_ICON_OPTIONS, medicationAccentColor } from '@mediapp/core'
import { Pressable, StyleSheet, View } from 'react-native'

import { MedicationLineIcon } from '@/src/components/medication/MedicationLineIcon'

import { useColorScheme } from '@/components/useColorScheme'
import { themeColors } from '@/src/theme/colors'

type MedicationIconPickerProps = {
  value: string
  onChange: (icon: string) => void
  color?: string
}

function withAlpha(hex: string, alpha: number): string {
  const raw = hex.replace('#', '')
  const full = raw.length === 3 ? raw.split('').map((ch) => ch + ch).join('') : raw
  const parsed = Number.parseInt(full, 16)
  if (!Number.isFinite(parsed) || full.length !== 6) return `rgba(11,135,123,${alpha})`
  const r = (parsed >> 16) & 255
  const g = (parsed >> 8) & 255
  const b = parsed & 255
  return `rgba(${r},${g},${b},${alpha})`
}

export function MedicationIconPicker({
  value,
  onChange,
  color,
}: MedicationIconPickerProps) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const accent = medicationAccentColor(color)

  return (
    <View style={styles.grid}>
      {MEDICATION_ICON_OPTIONS.map((icon) => {
        const selected = value === icon
        return (
          <Pressable
            key={icon}
            onPress={() => onChange(icon)}
            style={[
              styles.cell,
              {
                backgroundColor: selected ? withAlpha(accent, 0.14) : c.track,
                borderColor: selected ? accent : 'transparent',
              },
            ]}
          >
            <MedicationLineIcon icon={icon} color={selected ? accent : '#7E8D95'} size={28} />
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cell: {
    width: '22%',
    flexGrow: 1,
    flexBasis: '22%',
    height: 66,
    borderRadius: 22,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
