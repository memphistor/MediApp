import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import {
  addDays,
  calendarWeekBounds,
  dayComplianceTone,
  dayRingProgress,
  groupLogsByDateKey,
  logsInLocalDateRange,
  scheduledDoses,
  startOfWeekMonday,
  toDateKey,
  weekDayKeys,
  weekPlanProgress,
  type DoseLog,
} from '@mediapp/core'

import { useColorScheme } from '@/components/useColorScheme'
import { calendarDayStyle } from '@/src/components/calendar/calendarDayStyle'
import { DayRing } from '@/src/components/gamification/DayRing'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'

const WEEKDAY_LABELS = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'] as const

type WeekProgressCardProps = {
  logs: DoseLog[]
  referenceDate?: Date
}

export function WeekProgressCard({
  logs,
  referenceDate = new Date(),
}: WeekProgressCardProps) {
  const scheme = useColorScheme()
  const c = themeColors(scheme)
  const weekMonday = startOfWeekMonday(referenceDate)
  const dayKeys = weekDayKeys(weekMonday)
  const todayKey = toDateKey(referenceDate)

  const byDay = useMemo(() => {
    const { from, to } = calendarWeekBounds(referenceDate)
    return groupLogsByDateKey(logsInLocalDateRange(logs, from, to))
  }, [logs, referenceDate])

  const { taken, total, progress } = useMemo(
    () => weekPlanProgress(logs, referenceDate),
    [logs, referenceDate],
  )

  const weekRangeLabel = `${weekMonday.toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'short',
  })} – ${addDays(weekMonday, 6).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'short',
  })}`

  return (
    <View
      style={[
        styles.card,
        { borderColor: c.border, backgroundColor: c.surfaceElevated },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: c.text }]}>
          {pl.progress.weekRing}
        </Text>
        <Text style={[styles.range, { color: c.textMuted }]}>
          {weekRangeLabel}
        </Text>
      </View>
      <DayRing
        progress={progress}
        taken={taken}
        total={total}
        sublabel={pl.progress.weekCount
          .replace('{taken}', String(taken))
          .replace('{total}', String(total))}
      />
      <View style={styles.weekGrid}>
        {dayKeys.map((key, index) => {
          const date = addDays(weekMonday, index)
          const planned = scheduledDoses(byDay.get(key) ?? [])
          const tone = dayComplianceTone(planned)
          const ring = dayRingProgress(planned)
          const dayStyle = calendarDayStyle(tone, c)
          const isToday = key === todayKey
          return (
            <View
              key={key}
              style={[
                styles.dayCell,
                {
                  backgroundColor: dayStyle.backgroundColor,
                  borderColor: isToday ? c.brand : dayStyle.borderColor,
                  borderWidth: isToday ? 2 : dayStyle.borderWidth,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 10,
                  color: dayStyle.textColor,
                  fontWeight: dayStyle.fontWeight,
                }}
              >
                {WEEKDAY_LABELS[index]}
              </Text>
              <Text style={{ fontSize: 12, color: dayStyle.textColor }}>
                {date.getDate()}
              </Text>
              <Text style={{ fontSize: 9, color: dayStyle.textColor }}>
                {planned.length === 0
                  ? '—'
                  : tone === 'full'
                    ? '✓'
                    : `${ring.taken}/${ring.total}`}
              </Text>
            </View>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 16, padding: 16 },
  header: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  title: { fontSize: 14, fontWeight: '600' },
  range: { fontSize: 12 },
  weekGrid: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 4,
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 6,
    gap: 2,
  },
})
