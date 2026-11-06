import { Pressable, StyleSheet, Text, View } from 'react-native'

import { useColorScheme } from '@/components/useColorScheme'
import { themeColors } from '@/src/theme/colors'
import { softShadow } from '@/src/theme/tokens'

type SegmentedControlProps<T extends string> = {
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: SegmentedControlProps<T>) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)

  return (
    <View style={[styles.track, { backgroundColor: c.track }]}>
      {options.map((opt) => {
        const selected = opt.value === value
        return (
          <Pressable
            key={opt.value}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(opt.value)}
            style={[
              styles.item,
              selected && { backgroundColor: c.surfaceElevated },
              selected ? softShadow(scheme) : null,
            ]}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: '500',
                color: selected ? c.text : c.textMuted,
              }}
            >
              {opt.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  track: {
    height: 48,
    borderRadius: 24,
    padding: 4,
    flexDirection: 'row',
  },
  item: {
    flex: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
