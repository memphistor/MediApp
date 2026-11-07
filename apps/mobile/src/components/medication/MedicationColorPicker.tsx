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
    <View style={styles.row}>
      {choices.map((color) => {
        const isSelected = selected === color
        return (
          <Pressable
            key={color}
            onPress={() => onChange(color)}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            style={[
              styles.ring,
              {
                borderColor: isSelected ? color : 'transparent',
              },
            ]}
          >
            <View
              style={[
                styles.swatch,
                {
                  backgroundColor: color,
                  borderWidth: isSelected ? 3 : 0,
                  borderColor: c.surfaceElevated,
                },
              ]}
            />
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  ring: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatch: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
})
