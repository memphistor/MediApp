import {
  MEDICATION_ICON_OPTIONS,
  resolveMedicationIconDisplay,
} from '@mediapp/core'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { useColorScheme } from '@/components/useColorScheme'
import { themeColors } from '@/src/theme/colors'

type MedicationIconPickerProps = {
  value: string
  onChange: (icon: string) => void
}

export function MedicationIconPicker({
  value,
  onChange,
}: MedicationIconPickerProps) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)

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
                borderColor: selected ? c.brand : c.border,
                backgroundColor: selected ? `${c.brand}18` : c.surfaceElevated,
              },
            ]}
          >
            <Text style={styles.emoji}>
              {resolveMedicationIconDisplay(icon)}
            </Text>
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
    gap: 8,
    marginTop: 8,
  },
  cell: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 24,
  },
})
