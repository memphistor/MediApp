import { useMemo } from 'react'
import { ActivityIndicator, Pressable, View } from 'react-native'
import { useRouter } from 'expo-router'

import {
  periodBounds,
  plantEmojiForStreak,
  takenAdherenceRate,
  timingCountsForRange,
} from '@mediapp/core'

import { useColorScheme } from '@/components/useColorScheme'
import { ProgressBadges } from '@/src/components/gamification/ProgressBadges'
import { WeekProgressCard } from '@/src/components/gamification/WeekProgressCard'
import { AppText } from '@/src/components/ui/AppText'
import { Card } from '@/src/components/ui/Card'
import { Screen } from '@/src/components/ui/Screen'
import {
  useGamificationState,
  useProgressLogs,
} from '@/src/hooks/useProgressData'
import { DEFAULT_GAMIFICATION } from '@/src/storage/defaults'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'
import { space } from '@/src/theme/tokens'
import { useTypeScale } from '@/src/theme/useTypeScale'

function pct(rate: number): number {
  return Math.round(rate * 100)
}

export default function ProgressScreen() {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const type = useTypeScale()
  const router = useRouter()
  const { state, loading } = useGamificationState()
  const logs = useProgressLogs()
  const gam = state ?? DEFAULT_GAMIFICATION

  const monthSummary = useMemo(() => {
    if (!logs) return { taken: 0, due: 0, pct: 0 }
    const { from, to } = periodBounds('month')
    const counts = timingCountsForRange(logs, from, to)
    const taken = counts.onTime + counts.early + counts.late + counts.unknown
    return {
      taken,
      due: counts.totalScheduled,
      pct: pct(takenAdherenceRate(counts)),
    }
  }, [logs])

  return (
    <Screen>
      <AppText variant="caption" style={{ fontSize: type.metric.fontSize }}>
        {plantEmojiForStreak(gam.currentStreak)}
      </AppText>
      <AppText variant="title" style={{ marginTop: space.xs }}>
        {pl.progress.title}
      </AppText>

      {loading || logs === null ? (
        <ActivityIndicator color={c.brand} style={{ marginTop: space.xl }} />
      ) : (
        <View style={{ marginTop: space.lg, gap: space.lg }}>
          <ProgressBadges gam={gam} />
          <WeekProgressCard logs={logs} />
          <Card>
            <AppText variant="section">{pl.progress.streak}</AppText>
            <AppText variant="section" tone="brand" style={{ marginTop: space.xs }}>
              {pl.progress.streakDays.replace('{n}', String(gam.currentStreak))}
            </AppText>
            <AppText variant="caption" tone="muted" style={{ marginTop: space.sm }}>
              {gam.shieldAvailable
                ? pl.progress.shieldActive
                : pl.progress.shieldRecharge}
            </AppText>
          </Card>
          <Card>
            <AppText variant="section">{pl.progress.overviewTitle}</AppText>
            <AppText variant="secondary" tone="muted" style={{ marginTop: space.sm }}>
              {monthSummary.due > 0
                ? pl.progress.overviewMonth
                    .replace('{pct}', String(monthSummary.pct))
                    .replace('{taken}', String(monthSummary.taken))
                    .replace('{due}', String(monthSummary.due))
                : pl.progress.overviewEmpty}
            </AppText>
            <Pressable
              onPress={() => router.push('/progress/analytics')}
              style={{ marginTop: space.md, minHeight: 44, justifyContent: 'center' }}
            >
              <AppText variant="section" tone="brand">
                {pl.progress.analyticsCta}
              </AppText>
              <AppText variant="caption" tone="muted" style={{ marginTop: space.xs }}>
                {pl.progress.analyticsHint}
              </AppText>
            </Pressable>
          </Card>
        </View>
      )}
    </Screen>
  )
}
