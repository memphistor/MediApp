import { useMemo, useState } from 'react'
import { ActivityIndicator, Pressable, Text, View } from 'react-native'
import { useRouter } from 'expo-router'

import {
  calendarWeekBounds,
  periodBounds,
  takenAdherenceRate,
  timingCountsForRange,
  type DoseTimingCounts,
} from '@mediapp/core'

import { useColorScheme } from '@/components/useColorScheme'
import { DayRing } from '@/src/components/gamification/DayRing'
import { MedicationProgressPanel } from '@/src/components/gamification/MedicationProgressPanel'
import { CollapsibleSection } from '@/src/components/layout/CollapsibleSection'
import { AppText } from '@/src/components/ui/AppText'
import { Card } from '@/src/components/ui/Card'
import { CircleButton } from '@/src/components/ui/CircleButton'
import { BackIcon } from '@/src/components/ui/icons'
import { Screen } from '@/src/components/ui/Screen'
import { SegmentedControl } from '@/src/components/ui/SegmentedControl'
import { useHistoryData, useProgressLogs } from '@/src/hooks/useProgressData'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'

type AnalyticsPeriod = 'day' | 'week' | 'month'

function takenCount(counts: DoseTimingCounts): number {
  return counts.onTime + counts.early + counts.late + counts.unknown
}

export default function ProgressAnalyticsScreen() {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const router = useRouter()
  const logs = useProgressLogs()
  const history = useHistoryData()
  const [period, setPeriod] = useState<AnalyticsPeriod>('week')

  const medOptions = useMemo(
    () =>
      (history?.medications ?? [])
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name, 'pl'))
        .map((med) => ({
          id: med.id,
          name: med.name,
          icon: med.icon,
          kind: med.kind,
          scheduleType: med.schedule.type,
        })),
    [history?.medications],
  )

  const counts = useMemo(() => {
    if (!logs) return null
    if (period === 'week') {
      const { from, to } = calendarWeekBounds()
      return timingCountsForRange(logs, from, to)
    }
    const { from, to } = periodBounds(period === 'day' ? 'day' : 'month')
    return timingCountsForRange(logs, from, to)
  }, [logs, period])

  const taken = counts ? takenCount(counts) : 0
  const adherence = counts ? Math.round(takenAdherenceRate(counts) * 100) : 0
  const rows = counts
    ? [
        [pl.progress.timing.onTime, counts.onTime],
        [pl.progress.timing.early, counts.early],
        [pl.progress.timing.late, counts.late],
        [pl.progress.timing.unknownShort, counts.unknown],
        [pl.progress.timing.missedCombined, counts.missed],
      ]
    : []

  return (
    <Screen variant="stack" topSafe>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <CircleButton onPress={() => router.back()} accessibilityLabel={pl.wizard.back}>
          <BackIcon color={c.text} />
        </CircleButton>
        <AppText variant="body" style={{ fontWeight: '500' }}>
          {pl.progress.analyticsTitle}
        </AppText>
        <View style={{ width: 46 }} />
      </View>

      <View style={{ marginTop: 22 }}>
        <SegmentedControl
          value={period}
          onChange={setPeriod}
          options={[
            { value: 'day', label: pl.progress.periods.day },
            { value: 'week', label: pl.progress.periodWeek },
            { value: 'month', label: pl.progress.periodChip.month },
          ]}
        />
      </View>

      {logs === null || counts === null ? (
        <ActivityIndicator color={c.brand} style={{ marginTop: 32 }} />
      ) : (
        <View style={{ marginTop: 22 }}>
          <Card>
            <View style={{ alignItems: 'center', paddingVertical: 8 }}>
              <DayRing
                progress={counts.totalScheduled > 0 ? taken / counts.totalScheduled : 0}
                taken={taken}
                total={counts.totalScheduled}
                centerLabel={`${adherence}%`}
              />
              <Text style={{ marginTop: 16, fontSize: 17, fontWeight: '500', color: c.text }}>
                {pl.progress.adherenceTitle}
              </Text>
              <Text style={{ marginTop: 4, fontSize: 15, color: c.textMuted }}>
                {pl.progress.onTimeLine
                  .replace('{onTime}', String(counts.onTime))
                  .replace('{taken}', String(taken))}
              </Text>
            </View>
          </Card>

          <AppText variant="caption" tone="muted" style={{ marginTop: 30, marginBottom: 12, marginLeft: 4 }}>
            {pl.progress.breakdown}
          </AppText>
          <Card padded={false}>
            {rows.map(([label, value], index) => (
              <View
                key={label}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 24,
                  paddingVertical: 16,
                  borderTopWidth: index === 0 ? 0 : 1,
                  borderTopColor: c.line,
                }}
              >
                <Text style={{ fontSize: 17, fontWeight: '400', color: c.text }}>{label}</Text>
                <Text style={{ fontSize: 20, fontWeight: '300', color: c.text }}>{value}</Text>
              </View>
            ))}
          </Card>
          <AppText variant="caption" tone="muted" style={{ marginTop: 18, lineHeight: 21 }}>
            {pl.progress.timing.hint}
          </AppText>

          <View style={{ marginTop: 28 }}>
            <CollapsibleSection title={pl.progress.perMed.title}>
              <MedicationProgressPanel logs={logs} medications={medOptions} embedded />
            </CollapsibleSection>
          </View>
        </View>
      )}
    </Screen>
  )
}
