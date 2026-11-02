import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import {
  addDays,
  lastDayTimingRows,
  onTimeRateAmongTaken,
  takenAdherenceRate,
  timingCountsForRange,
  toDateKey,
  type DoseLog,
  type DoseTimingCounts,
} from '@mediapp/core'

import { useColorScheme } from '@/components/useColorScheme'
import { CollapsibleSection } from '@/src/components/layout/CollapsibleSection'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'

type TimingStatsPanelProps = {
  logs: DoseLog[]
  referenceDate?: Date
  embedded?: boolean
}

function pct(n: number): number {
  return Math.round(n * 100)
}

function StatBar({
  label,
  value,
  max,
  color,
  trackColor,
}: {
  label: string
  value: number
  max: number
  color: string
  trackColor: string
}) {
  const width = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return (
    <View style={styles.barWrap}>
      <View style={styles.barHeader}>
        <Text style={styles.barLabel}>{label}</Text>
        <Text style={styles.barValue}>{value}</Text>
      </View>
      <View style={[styles.barTrack, { backgroundColor: trackColor }]}>
        <View style={[styles.barFill, { width: `${width}%`, backgroundColor: color }]} />
      </View>
    </View>
  )
}

function SummaryLine({
  title,
  counts,
  c,
}: {
  title: string
  counts: DoseTimingCounts
  c: ReturnType<typeof themeColors>
}) {
  const onTimePct = pct(onTimeRateAmongTaken(counts))
  const adherencePct = pct(takenAdherenceRate(counts))
  const taken =
    counts.onTime + counts.early + counts.late + counts.unknown

  return (
    <View style={[styles.summary, { borderColor: c.border }]}>
      <Text style={[styles.summaryTitle, { color: c.text }]}>{title}</Text>
      {counts.totalScheduled === 0 ? (
        <Text style={[styles.muted, { color: c.textMuted }]}>
          {pl.progress.timing.noData}
        </Text>
      ) : taken === 0 ? (
        <Text style={[styles.muted, { color: c.textMuted }]}>
          {pl.progress.timing.noneTaken.replace(
            '{adherencePct}',
            String(adherencePct),
          )}
        </Text>
      ) : (
        <Text style={[styles.muted, { color: c.textMuted }]}>
          {pl.progress.timing.summaryLine
            .replace('{onTime}', String(counts.onTime))
            .replace('{taken}', String(taken))
            .replace('{onTimePct}', String(onTimePct))
            .replace('{adherencePct}', String(adherencePct))}
        </Text>
      )}
    </View>
  )
}

export function TimingStatsPanel({
  logs,
  referenceDate = new Date(),
  embedded = false,
}: TimingStatsPanelProps) {
  const scheme = useColorScheme()
  const c = themeColors(scheme)
  const dateKey = toDateKey(referenceDate)

  const { todayCounts, weekCounts, monthCounts, dayRows } = useMemo(() => {
    const weekStart = addDays(referenceDate, -6)
    const monthStart = new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth(),
      1,
    )
    return {
      todayCounts: timingCountsForRange(logs, referenceDate, referenceDate),
      weekCounts: timingCountsForRange(logs, weekStart, referenceDate),
      monthCounts: timingCountsForRange(logs, monthStart, referenceDate),
      dayRows: lastDayTimingRows(logs, referenceDate, 7),
    }
  }, [logs, dateKey, referenceDate])

  const breakdown = todayCounts
  const breakdownMax = Math.max(
    breakdown.onTime,
    breakdown.early,
    breakdown.late,
    breakdown.missed,
    breakdown.unknown,
    1,
  )

  return (
    <View style={embedded ? styles.embedded : [styles.card, { borderColor: c.border, backgroundColor: c.surfaceElevated }]}>
      <Text style={[styles.title, { color: c.text }]}>
        {pl.progress.timing.title}
      </Text>
      <Text style={[styles.hint, { color: c.textMuted }]}>
        {pl.progress.timing.hint}
      </Text>

      <SummaryLine title={pl.progress.timing.today} counts={todayCounts} c={c} />
      <SummaryLine title={pl.progress.timing.last7Days} counts={weekCounts} c={c} />
      <SummaryLine title={pl.progress.timing.thisMonth} counts={monthCounts} c={c} />

      {breakdown.totalScheduled > 0 ? (
        <View style={styles.breakdown}>
          <Text style={[styles.breakdownTitle, { color: c.text }]}>
            {pl.progress.timing.todayBreakdown}
          </Text>
          <StatBar
            label={pl.progress.timing.onTime}
            value={breakdown.onTime}
            max={breakdownMax}
            color={c.brand}
            trackColor={c.border}
          />
          <StatBar
            label={pl.progress.timing.early}
            value={breakdown.early}
            max={breakdownMax}
            color="#f59e0b"
            trackColor={c.border}
          />
          <StatBar
            label={pl.progress.timing.late}
            value={breakdown.late}
            max={breakdownMax}
            color="#f59e0b"
            trackColor={c.border}
          />
          <StatBar
            label={pl.progress.timing.unknown}
            value={breakdown.unknown}
            max={breakdownMax}
            color={c.textMuted}
            trackColor={c.border}
          />
          <StatBar
            label={pl.progress.timing.missed}
            value={breakdown.missed}
            max={breakdownMax}
            color="#f59e0b"
            trackColor={c.border}
          />
        </View>
      ) : null}

      <CollapsibleSection title={pl.progress.timing.dailyTitle}>
        {dayRows.map(({ dateKey: dk, counts }) => {
          const label = new Date(`${dk}T12:00:00`).toLocaleDateString('pl-PL', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
          })
          let status: string = pl.progress.timing.dayNoPlan
          if (counts.totalScheduled > 0) {
            if (counts.missed > 0) {
              status = pl.progress.timing.dayMissed
            } else if (
              counts.early + counts.late + counts.unknown >
              0
            ) {
              status = pl.progress.timing.dayOffTime
                .replace('{onTime}', String(counts.onTime))
                .replace(
                  '{taken}',
                  String(
                    counts.onTime +
                      counts.early +
                      counts.late +
                      counts.unknown,
                  ),
                )
            } else if (counts.onTime > 0) {
              status = pl.progress.timing.dayAllOnTime
            } else if (counts.planned === counts.totalScheduled) {
              status = pl.progress.timing.dayPending
            }
          }
          return (
            <View key={dk} style={styles.dayRow}>
              <Text style={[styles.muted, { color: c.textMuted }]}>{label}</Text>
              <Text style={[styles.dayStatus, { color: c.text }]}>{status}</Text>
            </View>
          )
        })}
      </CollapsibleSection>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 16, padding: 16, gap: 12 },
  embedded: { padding: 16, paddingTop: 12, gap: 12 },
  title: { fontSize: 16, fontWeight: '600' },
  hint: { fontSize: 12, lineHeight: 18 },
  summary: { borderWidth: 1, borderRadius: 12, padding: 12, marginTop: 4 },
  summaryTitle: { fontSize: 14, fontWeight: '500' },
  muted: { fontSize: 12, marginTop: 4, lineHeight: 16 },
  breakdown: { gap: 8, marginTop: 8 },
  breakdownTitle: { fontSize: 14, fontWeight: '500' },
  barWrap: { marginTop: 4 },
  barHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  barLabel: { fontSize: 12 },
  barValue: { fontSize: 12, opacity: 0.7 },
  barTrack: { height: 8, borderRadius: 4, marginTop: 4, overflow: 'hidden' },
  barFill: { height: '100%' },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    paddingVertical: 4,
  },
  dayStatus: { fontSize: 12, fontWeight: '500', flex: 1, textAlign: 'right' },
})
