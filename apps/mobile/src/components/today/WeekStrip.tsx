import { StyleSheet, Text, View } from 'react-native'
import {
  dayComplianceTone,
  groupLogsByDateKey,
  startOfWeekMonday,
  toDateKey,
  weekDayKeys,
  type DoseLog,
} from '@mediapp/core'

import { useColorScheme } from '@/components/useColorScheme'
import { calendarDayStyle } from '@/src/components/calendar/calendarDayStyle'
import { themeColors } from '@/src/theme/colors'

const LABELS = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'] as const

type WeekStripProps = {
  today: Date
  logs: DoseLog[]
}

export function WeekStrip({ today, logs }: WeekStripProps) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const monday = startOfWeekMonday(today)
  const keys = weekDayKeys(monday)
  const todayKey = toDateKey(today)
  const byDay = groupLogsByDateKey(logs)

  return (
    <View style={styles.row}>
      {keys.map((key, index) => {
        const date = new Date(`${key}T12:00:00`)
        const tone = dayComplianceTone(byDay.get(key) ?? [])
        const look = calendarDayStyle(tone, c)
        const isToday = key === todayKey
        const backgroundColor = isToday ? c.surfaceElevated : look.backgroundColor
        const textColor = isToday ? c.brand : look.textColor
        const borderWidth = isToday ? 2 : look.borderWidth
        const borderColor = isToday ? c.brand : look.borderColor
        return (
          <View key={key} style={styles.day}>
            <Text style={[styles.label, { color: c.textMuted }]}>{LABELS[index]}</Text>
            <View
              style={[
                styles.circle,
                { backgroundColor, borderWidth, borderColor },
              ]}
            >
              <Text style={{ color: textColor, fontSize: 16, fontWeight: '500' }}>
                {date.getDate()}
              </Text>
            </View>
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 26,
  },
  day: {
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
  circle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
