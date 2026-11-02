import { useMemo } from 'react'
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Link } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useColorScheme } from '@/components/useColorScheme'
import { MedicationProgressPanel } from '@/src/components/gamification/MedicationProgressPanel'
import { PeriodAdherencePanel } from '@/src/components/gamification/PeriodAdherencePanel'
import { TimingStatsPanel } from '@/src/components/gamification/TimingStatsPanel'
import { useProgressLogs, useHistoryData } from '@/src/hooks/useProgressData'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'

export default function ProgressAnalyticsScreen() {
  const scheme = useColorScheme()
  const c = themeColors(scheme)
  const logs = useProgressLogs()
  const history = useHistoryData()

  const medOptions = useMemo(
    () =>
      (history?.medications ?? [])
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name, 'pl'))
        .map((m) => ({
          id: m.id,
          name: m.name,
          icon: m.icon,
          kind: m.kind,
          scheduleType: m.schedule.type,
        })),
    [history?.medications],
  )

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.surface }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Link href="/(tabs)/progress" asChild>
          <Pressable style={styles.back}>
            <Text style={[styles.backText, { color: c.brand }]}>
              {pl.progress.analyticsBack}
            </Text>
          </Pressable>
        </Link>
        <Text style={[styles.title, { color: c.text }]}>
          {pl.progress.analyticsTitle}
        </Text>
        <Text style={[styles.intro, { color: c.textMuted }]}>
          {pl.progress.analyticsIntro}
        </Text>

        {logs === null ? (
          <ActivityIndicator color={c.brand} style={{ marginTop: 24 }} />
        ) : (
          <View style={styles.sections}>
            <PeriodAdherencePanel logs={logs} />
            <View
              style={[
                styles.highlight,
                { borderColor: `${c.brand}40`, backgroundColor: `${c.brand}0D` },
              ]}
            >
              <Text style={[styles.kicker, { color: c.brand }]}>
                {pl.progress.perMed.kicker}
              </Text>
              <MedicationProgressPanel
                logs={logs}
                medications={medOptions}
                embedded
              />
            </View>
            <View
              style={[
                styles.card,
                { borderColor: c.border, backgroundColor: c.surfaceElevated },
              ]}
            >
              <Text style={[styles.kickerMuted, { color: c.textMuted }]}>
                {pl.progress.timing.scopeAll}
              </Text>
              <TimingStatsPanel logs={logs} embedded />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 40 },
  back: { marginBottom: 8, minHeight: 44, justifyContent: 'center' },
  backText: { fontSize: 14, fontWeight: '600' },
  title: { fontSize: 22, fontWeight: '600' },
  intro: { fontSize: 14, marginTop: 4, lineHeight: 20 },
  sections: { marginTop: 16, gap: 20 },
  highlight: { borderWidth: 1, borderRadius: 16, overflow: 'hidden' },
  kicker: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  card: { borderWidth: 1, borderRadius: 16, overflow: 'hidden' },
  kickerMuted: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
})
