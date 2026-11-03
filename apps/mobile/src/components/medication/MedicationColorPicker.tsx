import { medicationColorChoices } from '@mediapp/core'
import { Pressable, StyleSheet, View } from 'react-native'

import { useColorScheme } from '@/components/useColorScheme'
import { themeColors } from '@/src/theme/colors'

type MedicationColorPickerProps = {
  value: string
  onChange: (color: string) => void
}

export function MedicationColorPicker({
  value,
  onChange,
}: MedicationColorPickerProps) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const choices = medicationColorChoices(value)
  const selected = value.trim().toLowerCase()

  return (
    <View style={styles.grid}>
      {choices.map((color) => {
        const isSelected = selected === color
        return (
          <Pressable
            key={color}
            onPress={() => onChange(color)}
            style={[
              styles.swatch,
              { backgroundColor: color },
              isSelected && {
                borderColor: c.text,
                borderWidth: 2,
              },
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
          />
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
    marginTop: 8,
  },
  swatch: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
})
