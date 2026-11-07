import { Pressable, Text, View } from 'react-native'

import { useColorScheme } from '@/components/useColorScheme'
import { themeColors } from '@/src/theme/colors'
import { radius, softShadow, space } from '@/src/theme/tokens'
import { useTypeScale } from '@/src/theme/useTypeScale'

export type ChoiceOption = { value: string; label: string }

type ChoiceGroupProps = {
  label?: string
  value: string
  options: ChoiceOption[]
  onChange: (value: string) => void
  error?: string
  layout?: 'wrap' | 'equal'
}

export function ChoiceGroup({
  label,
  value,
  options,
  onChange,
  error,
  layout = 'wrap',
}: ChoiceGroupProps) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const type = useTypeScale()

  return (
    <View style={{ gap: space.sm }}>
      {label ? (
        <Text style={[type.secondary, { color: c.text, fontWeight: '500' }]}>
          {label}
        </Text>
      ) : null}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>
        {options.map((opt) => {
          const selected = opt.value === value
          return (
            <Pressable
              key={opt.value}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => onChange(opt.value)}
              style={[
                {
                  flexGrow: layout === 'equal' ? 1 : 0,
                  flexBasis: layout === 'equal' ? 0 : undefined,
                  maxWidth: '100%',
                  minHeight: 46,
                  paddingHorizontal: 17,
                  borderRadius: radius.chip,
                  borderWidth: 1.5,
                  borderColor: selected ? c.brand : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: selected ? c.tint : c.surfaceElevated,
                },
                softShadow(c.scheme),
              ]}
            >
              <Text
                style={[
                  type.secondary,
                  {
                    color: selected ? c.brandDark : c.text,
                    fontWeight: selected ? '500' : '400',
                    textAlign: 'center',
                    flexShrink: 1,
                  },
                ]}
              >
                {opt.label}
              </Text>
            </Pressable>
          )
        })}
      </View>
      {error ? (
        <Text style={[type.caption, { color: '#dc2626' }]}>{error}</Text>
      ) : null}
    </View>
  )
}
