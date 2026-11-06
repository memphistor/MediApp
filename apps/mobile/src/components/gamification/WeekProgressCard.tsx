import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import {
  addDays,
  calendarWeekBounds,
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
import { DayRing } from '@/src/components/gamification/DayRing'
import { Card } from '@/src/components/ui/Card'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'

const WEEKDAY_LABELS = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'] as const

type WeekProgressCardProps = {
  logs: DoseLog[]
  referenceDate?: Date
}

function shortRange(monday: Date): string {
  const end = addDays(monday, 6)
  const month = (date: Date) =>
    date.toLocaleDateString('pl-PL', { month: 'short' }).replace('.', '')
  if (monday.getMonth() === end.getMonth()) {
    return `${monday.getDate()}–${end.getDate()} ${month(end)}`
  }
  return `${monday.getDate()} ${month(monday)} – ${end.getDate()} ${month(end)}`
}

export function WeekProgressCard({
  logs,
  referenceDate = new Date(),
}: WeekProgressCardProps) {
  const scheme = useColorScheme() ?? 'light'
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
  const percent = Math.round(progress * 100)

  return (
    <Card>
      <View style={styles.center}>
        <DayRing
          progress={progress}
          taken={taken}
          total={total}
          centerLabel={`${percent}%`}
        />
        <Text style={[styles.cap, { color: c.text }]}>{pl.progress.thisWeek}</Text>
        <Text style={[styles.sub, { color: c.textMuted }]}>
          {pl.progress.weekLine
            .replace('{taken}', String(taken))
            .replace('{total}', String(total))}
          {' · '}
          {shortRange(weekMonday)}
        </Text>
        <View style={styles.bars}>
          {dayKeys.map((key, index) => {
            const planned = scheduledDoses(byDay.get(key) ?? [])
            const dayTaken = planned.filter((log) => log.status === 'taken').length
            const ratio = planned.length > 0 ? dayTaken / planned.length : 0
            const isToday = key === todayKey
            return (
              <View key={key} style={styles.barCol}>
                <View style={[styles.track, { backgroundColor: c.ringTrack }]}>
                  <View
                    style={{
                      height: `${Math.round(ratio * 100)}%`,
                      backgroundColor: c.brand,
                      borderRadius: 5,
                      width: '100%',
                    }}
                  />
                </View>
                <Text style={{ fontSize: 12, fontWeight: '500', color: isToday ? c.brand : c.textMuted }}>
                  {WEEKDAY_LABELS[index]}
                </Text>
              </View>
            )
          })}
        </View>
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  center: { alignItems: 'center' },
  cap: { marginTop: 16, fontSize: 17, fontWeight: '500' },
  sub: { marginTop: 4, fontSize: 15, textAlign: 'center' },
  bars: {
    width: '100%',
    marginTop: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  barCol: { alignItems: 'center', gap: 8 },
  track: {
    width: 10,
    height: 52,
    borderRadius: 5,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
})
