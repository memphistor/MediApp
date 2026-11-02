import { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Picker } from '@react-native-picker/picker'

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
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'

type PeriodAdherencePanelProps = {
  logs: DoseLog[]
  referenceDate?: Date
}

function pct(rate: number): number {
  return Math.round(rate * 100)
}

function periodSignature(counts: DoseTimingCounts): string {
  const taken =
    counts.onTime + counts.early + counts.late + counts.unknown
  return `${taken}|${counts.totalScheduled}|${counts.onTime}`
}

function PeriodCard({
  period,
  counts,
}: {
  period: ProgressPeriod
  counts: DoseTimingCounts
}) {
  const scheme = useColorScheme()
  const c = themeColors(scheme)
  const title = pl.progress.periods[period]
  const taken =
    counts.onTime + counts.early + counts.late + counts.unknown
  const adherence = pct(takenAdherenceRate(counts))

  return (
    <View style={[styles.periodCard, { borderColor: c.border }]}>
      <Text style={[styles.periodTitle, { color: c.text }]}>{title}</Text>
      {counts.totalScheduled === 0 ? (
        <Text style={[styles.muted, { color: c.textMuted }]}>
          {pl.progress.timing.noData}
        </Text>
      ) : (
        <>
          <Text style={[styles.pct, { color: c.brand }]}>{adherence}%</Text>
          <Text style={[styles.muted, { color: c.textMuted }]}>
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
  const scheme = useColorScheme()
  const c = themeColors(scheme)
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
    ? [
        dayCard,
        longer.find((card) => card.period === longerPeriod) ?? longer[0],
      ].filter((card): card is (typeof cards)[number] => card != null)
    : cards

  return (
    <View
      style={[
        styles.card,
        { borderColor: c.border, backgroundColor: c.surfaceElevated },
      ]}
    >
      <Text style={[styles.title, { color: c.text }]}>
        {pl.progress.periodTitle}
      </Text>
      <Text style={[styles.hint, { color: c.textMuted }]}>
        {pl.progress.periodHint}
      </Text>
      {sameLonger && (
        <View style={styles.pickerWrap}>
          <Text style={[styles.label, { color: c.text }]}>
            {pl.progress.perMed.period}
          </Text>
          <View
            style={[styles.pickerBox, { borderColor: c.border, backgroundColor: c.surface }]}
          >
            <Picker
              selectedValue={longerPeriod}
              onValueChange={(v) => setLongerPeriod(v as ProgressPeriod)}
            >
              {longer.map((card) => (
                <Picker.Item
                  key={card.period}
                  label={pl.progress.periods[card.period]}
                  value={card.period}
                />
              ))}
            </Picker>
          </View>
        </View>
      )}
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
  card: { borderWidth: 1, borderRadius: 16, padding: 16, gap: 8 },
  title: { fontSize: 16, fontWeight: '600' },
  hint: { fontSize: 12, lineHeight: 18 },
  pickerWrap: { marginTop: 8 },
  label: { fontSize: 14, fontWeight: '500' },
  pickerBox: { borderWidth: 1, borderRadius: 12, marginTop: 4, overflow: 'hidden' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  gridItem: { width: '48%' },
  periodCard: { borderWidth: 1, borderRadius: 12, padding: 12 },
  periodTitle: { fontSize: 14, fontWeight: '500' },
  pct: { fontSize: 20, fontWeight: '700', marginTop: 4 },
  muted: { fontSize: 12, marginTop: 4, lineHeight: 16 },
})
