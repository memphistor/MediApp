import Svg, { Circle } from 'react-native-svg'
import { StyleSheet, Text, View } from 'react-native'

import { useColorScheme } from '@/components/useColorScheme'
import { themeColors } from '@/src/theme/colors'

type DayRingProps = {
  progress: number
  taken: number
  total: number
  label?: string
  sublabel?: string
  size?: 'sm' | 'md'
}

export function DayRing({
  progress,
  taken,
  total,
  label,
  sublabel,
  size = 'md',
}: DayRingProps) {
  const scheme = useColorScheme()
  const c = themeColors(scheme)
  const dim = size === 'sm' ? 72 : 120
  const r = size === 'sm' ? 30 : 52
  const stroke = size === 'sm' ? 7 : 10
  const circumference = 2 * Math.PI * r
  const clamped = Math.min(1, Math.max(0, progress))
  const offset = circumference * (1 - clamped)
  const cx = dim / 2

  return (
    <View style={styles.wrap} accessibilityRole="progressbar">
      {label ? (
        <Text style={[styles.label, { color: c.text }]}>{label}</Text>
      ) : null}
      <Svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`}>
        <Circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke={c.border}
          strokeWidth={stroke}
        />
        <Circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke={c.brand}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          transform={`rotate(-90, ${cx}, ${cx})`}
        />
      </Svg>
      {total > 0 ? (
        <Text
          style={[
            styles.count,
            size === 'sm' ? styles.countSm : styles.countMd,
            { color: c.text },
          ]}
        >
          {taken} / {total}
        </Text>
      ) : null}
      {sublabel ? (
        <Text style={[styles.sublabel, { color: c.textMuted }]}>{sublabel}</Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  label: { marginBottom: 8, fontSize: 14, fontWeight: '500' },
  count: { marginTop: 8, fontWeight: '700' },
  countSm: { fontSize: 18 },
  countMd: { fontSize: 24 },
  sublabel: { marginTop: 4, fontSize: 14, textAlign: 'center' },
})
