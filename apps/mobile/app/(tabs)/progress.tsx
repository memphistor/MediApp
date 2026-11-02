import { useMemo } from 'react'
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { Link } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import {
  periodBounds,
  plantEmojiForStreak,
  takenAdherenceRate,
  timingCountsForRange,
} from '@mediapp/core'

import { useColorScheme } from '@/components/useColorScheme'
import { ProgressBadges } from '@/src/components/gamification/ProgressBadges'
import { WeekProgressCard } from '@/src/components/gamification/WeekProgressCard'
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

export default function ProgressScreen() {
  const scheme = useColorScheme()
  const c = themeColors(scheme)
  const { state, loading } = useGamificationState()
  const logs = useProgressLogs()
  const gam = state ?? DEFAULT_GAMIFICATION

  const monthSummary = useMemo(() => {
    if (!logs) return { taken: 0, due: 0, pct: 0 }
    const { from, to } = periodBounds('month')
    const counts = timingCountsForRange(logs, from, to)
    const taken =
      counts.onTime + counts.early + counts.late + counts.unknown
    return {
      taken,
      due: counts.totalScheduled,
      pct: pct(takenAdherenceRate(counts)),
    }
  }, [logs])

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.surface }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.emoji]} aria-hidden>
          {plantEmojiForStreak(gam.currentStreak)}
        </Text>
        <Text style={[styles.title, { color: c.text }]}>{pl.progress.title}</Text>

        {loading || logs === null ? (
          <ActivityIndicator color={c.brand} style={{ marginTop: 24 }} />
        ) : (
          <>
            <ProgressBadges gam={gam} />
            <View style={styles.gap}>
              <WeekProgressCard logs={logs} />
            </View>
            <View
              style={[
                styles.card,
                styles.gap,
                { borderColor: c.border, backgroundColor: c.surfaceElevated },
              ]}
            >
              <Text style={[styles.cardTitle, { color: c.text }]}>
                {pl.progress.streak}
              </Text>
              <Text style={[styles.streakValue, { color: c.brand }]}>
                {pl.progress.streakDays.replace('{n}', String(gam.currentStreak))}
              </Text>
              <Text style={[styles.hint, { color: c.textMuted }]}>
                {gam.shieldAvailable
                  ? pl.progress.shieldActive
                  : pl.progress.shieldRecharge}
              </Text>
            </View>
            <View
              style={[
                styles.card,
                { borderColor: c.border, backgroundColor: c.surfaceElevated },
              ]}
            >
              <Text style={[styles.cardTitle, { color: c.text }]}>
                {pl.progress.overviewTitle}
              </Text>
              {monthSummary.due > 0 ? (
                <Text style={[styles.hint, { color: c.textMuted }]}>
                  {pl.progress.overviewMonth
                    .replace('{pct}', String(monthSummary.pct))
                    .replace('{taken}', String(monthSummary.taken))
                    .replace('{due}', String(monthSummary.due))}
                </Text>
              ) : (
                <Text style={[styles.hint, { color: c.textMuted }]}>
                  {pl.progress.overviewEmpty}
                </Text>
              )}
              <Link href="/progress/analytics" asChild>
                <Pressable
                  style={[styles.cta, { backgroundColor: c.brand }]}
                >
                  <Text style={styles.ctaText}>{pl.progress.analyticsCta}</Text>
                </Pressable>
              </Link>
              <Text style={[styles.ctaHint, { color: c.textMuted }]}>
                {pl.progress.analyticsHint}
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 32 },
  emoji: { fontSize: 28 },
  title: { fontSize: 22, fontWeight: '600', marginTop: 4 },
  gap: { marginTop: 16 },
  card: { borderWidth: 1, borderRadius: 16, padding: 16 },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  streakValue: { fontSize: 18, fontWeight: '700', marginTop: 4 },
  hint: { fontSize: 12, marginTop: 8, lineHeight: 18 },
  cta: {
    marginTop: 16,
    minHeight: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  ctaHint: { fontSize: 12, textAlign: 'center', marginTop: 8 },
})
