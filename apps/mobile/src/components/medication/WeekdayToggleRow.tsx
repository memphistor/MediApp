import { Pressable, StyleSheet, Text, View } from 'react-native'

import { useColorScheme } from '@/components/useColorScheme'
import { themeColors } from '@/src/theme/colors'

const DAY_LABELS = ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So']
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0]

type WeekdayToggleRowProps = {
  selected: number[]
  onToggle: (day: number) => void
}

export function WeekdayToggleRow({ selected, onToggle }: WeekdayToggleRowProps) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)

  return (
    <View style={styles.row}>
      {DAY_ORDER.map((day) => {
        const active = selected.includes(day)
        return (
          <Pressable
            key={day}
            onPress={() => onToggle(day)}
            style={[
              styles.chip,
              {
                borderColor: active ? c.brand : c.border,
                backgroundColor: active ? `${c.brand}18` : c.surfaceElevated,
              },
            ]}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: '600',
                color: active ? c.brand : c.text,
              }}
            >
              {DAY_LABELS[day]}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    minWidth: 36,
    minHeight: 36,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
