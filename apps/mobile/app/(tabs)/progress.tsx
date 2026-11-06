import { useMemo } from 'react'
import { ActivityIndicator, Pressable, View } from 'react-native'
import { useRouter } from 'expo-router'

import {
  periodBounds,
  takenAdherenceRate,
  timingCountsForRange,
} from '@mediapp/core'

import { useColorScheme } from '@/components/useColorScheme'
import { ProgressBadges } from '@/src/components/gamification/ProgressBadges'
import { WeekProgressCard } from '@/src/components/gamification/WeekProgressCard'
import { AppText } from '@/src/components/ui/AppText'
import { Card } from '@/src/components/ui/Card'
import { ChevronRightIcon, TrendIcon } from '@/src/components/ui/icons'
import { Screen } from '@/src/components/ui/Screen'
import { SettingsButton } from '@/src/components/ui/SettingsIcon'
import {
  useGamificationState,
  useProgressLogs,
} from '@/src/hooks/useProgressData'
import { DEFAULT_GAMIFICATION } from '@/src/storage/defaults'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'

function pct(rate: number): number {
  return Math.round(rate * 100)
}

function streakCaption(streak: number, shieldAvailable: boolean): string {
  if (!shieldAvailable) return pl.progress.shieldRecharge
  if (streak > 0) return pl.progress.shieldActive
  return pl.progress.streakIdle
}

export default function ProgressScreen() {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
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
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <AppText variant="title" style={{ flex: 1 }}>{pl.progress.title}</AppText>
        <SettingsButton />
      </View>

      {loading || logs === null ? (
        <ActivityIndicator color={c.brand} style={{ marginTop: 24 }} />
      ) : (
        <View style={{ marginTop: 26, gap: 16 }}>
          <WeekProgressCard logs={logs} />
          <View style={{ flexDirection: 'row', gap: 14 }}>
            <Card style={{ flex: 1 }}>
              <AppText variant="secondary" tone="muted">{pl.progress.streak}</AppText>
              <AppText variant="metric" style={{ marginTop: 8 }}>
                {String(gam.currentStreak)}
              </AppText>
              <AppText variant="caption" tone="muted" style={{ marginTop: 6 }}>
                {streakCaption(gam.currentStreak, gam.shieldAvailable)}
              </AppText>
            </Card>
            <Card style={{ flex: 1 }}>
              <AppText variant="secondary" tone="muted">{pl.progress.monthShort}</AppText>
              <AppText variant="metric" style={{ marginTop: 8 }}>
                {monthSummary.due > 0 ? `${monthSummary.pct}%` : '—'}
              </AppText>
              <AppText variant="caption" tone="muted" style={{ marginTop: 6 }}>
                {monthSummary.due > 0
                  ? pl.progress.monthLine
                      .replace('{taken}', String(monthSummary.taken))
                      .replace('{due}', String(monthSummary.due))
                  : pl.progress.overviewEmpty}
              </AppText>
            </Card>
          </View>
          <View style={{ marginTop: 12 }}>
            <AppText variant="caption" tone="muted" style={{ marginBottom: 12, marginLeft: 4 }}>
              {pl.progress.badges}
            </AppText>
            <ProgressBadges gam={gam} />
          </View>
          <Pressable onPress={() => router.push('/progress/analytics')} style={{ marginTop: 10 }}>
            <Card style={{ backgroundColor: scheme === 'dark' ? '#1C3D38' : '#D5EFEA' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: c.tint,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TrendIcon color={c.brand} />
                </View>
                <AppText variant="body" style={{ flex: 1, fontWeight: '500' }}>
                  {pl.progress.analyticsCta}
                </AppText>
                <ChevronRightIcon color={c.faint} />
              </View>
            </Card>
          </Pressable>
        </View>
      )}
    </Screen>
  )
}
