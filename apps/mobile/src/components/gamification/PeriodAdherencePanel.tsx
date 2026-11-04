import { useMemo, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import {
  PROGRESS_PERIODS,
  periodBounds,
  takenAdherenceRate,
  timingCountsForRange,
  type DoseLog,
  type DoseTimingCounts,
  type ProgressPeriod,
} from '@mediapp/core'

import { useColorScheme } from '@/components/useColorScheme'
import { ChoiceGroup } from '@/src/components/ui/ChoiceGroup'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'
import { radius, space } from '@/src/theme/tokens'
import { useTypeScale } from '@/src/theme/useTypeScale'

type PeriodAdherencePanelProps = {
  logs: DoseLog[]
  referenceDate?: Date
}

function pct(rate: number): number {
  return Math.round(rate * 100)
}

function periodSignature(counts: DoseTimingCounts): string {
  const taken = counts.onTime + counts.early + counts.late + counts.unknown
  return `${taken}|${counts.totalScheduled}|${counts.onTime}`
}

function PeriodCard({
  period,
  counts,
}: {
  period: ProgressPeriod
  counts: DoseTimingCounts
}) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const type = useTypeScale()
  const title = pl.progress.periods[period]
  const taken = counts.onTime + counts.early + counts.late + counts.unknown
  const adherence = pct(takenAdherenceRate(counts))

  return (
    <View style={[styles.periodCard, { backgroundColor: c.surface }]}>
      <Text style={[type.caption, { color: c.textMuted }]}>{title}</Text>
      {counts.totalScheduled === 0 ? (
        <Text style={[type.caption, { color: c.textMuted, marginTop: space.sm }]}>
          {pl.progress.timing.noData}
        </Text>
      ) : (
        <>
          <Text style={[type.metric, { color: c.brand, marginTop: space.xs }]}>
            {adherence}%
          </Text>
          <Text style={[type.caption, { color: c.textMuted, marginTop: space.xs }]}>
            {pl.progress.periodCardDetail
              .replaceAll('{taken}', String(taken))
              .replace('{due}', String(counts.totalScheduled))
              .replace('{onTime}', String(counts.onTime))}
          </Text>
        </>
      )}
    </View>
  )
}

export function PeriodAdherencePanel({
  logs,
  referenceDate = new Date(),
}: PeriodAdherencePanelProps) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const type = useTypeScale()
  const [longerPeriod, setLongerPeriod] = useState<ProgressPeriod>('month')

  const cards = PROGRESS_PERIODS.map((period) => {
    const { from, to } = periodBounds(period, referenceDate)
    return {
      period,
      counts: timingCountsForRange(logs, from, to),
    }
  })
  const dayCard = cards.find((card) => card.period === 'day')
  const longer = cards.filter((card) => card.period !== 'day')
  const sameLonger = longer.every(
    (card) => periodSignature(card.counts) === periodSignature(longer[0].counts),
  )
  const visible = sameLonger
    ? [dayCard, longer.find((card) => card.period === longerPeriod) ?? longer[0]].filter(
        (card): card is (typeof cards)[number] => card != null,
      )
    : cards

  return (
    <View style={[styles.card, { backgroundColor: c.surfaceElevated }]}>
      <Text style={[type.section, { color: c.text }]}>{pl.progress.periodTitle}</Text>
      <Text style={[type.caption, { color: c.textMuted, marginTop: space.xs }]}>
        {pl.progress.periodHint}
      </Text>
      {sameLonger ? (
        <View style={{ marginTop: space.md }}>
          <ChoiceGroup
            label={pl.progress.perMed.period}
            layout="equal"
            value={longerPeriod}
            options={longer.map((card) => ({
              value: card.period,
              label: pl.progress.periodChip[card.period],
            }))}
            onChange={(value) => setLongerPeriod(value as ProgressPeriod)}
          />
        </View>
      ) : null}
      <View style={styles.grid}>
        {visible.map(({ period, counts }) => (
          <View key={period} style={styles.gridItem}>
            <PeriodCard period={period} counts={counts} />
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.card, padding: space.lg },
  grid: { flexDirection: 'row', gap: space.sm, marginTop: space.lg, alignItems: 'stretch' },
  gridItem: { flex: 1 },
  periodCard: {
    borderRadius: radius.control,
    padding: space.md,
    flex: 1,
    minHeight: 120,
  },
})
