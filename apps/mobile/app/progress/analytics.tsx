import { useMemo } from 'react'
import { ActivityIndicator, View } from 'react-native'

import { useColorScheme } from '@/components/useColorScheme'
import { MedicationProgressPanel } from '@/src/components/gamification/MedicationProgressPanel'
import { PeriodAdherencePanel } from '@/src/components/gamification/PeriodAdherencePanel'
import { TimingStatsPanel } from '@/src/components/gamification/TimingStatsPanel'
import { CollapsibleSection } from '@/src/components/layout/CollapsibleSection'
import { AppText } from '@/src/components/ui/AppText'
import { Screen } from '@/src/components/ui/Screen'
import { useProgressLogs, useHistoryData } from '@/src/hooks/useProgressData'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'
import { space } from '@/src/theme/tokens'

export default function ProgressAnalyticsScreen() {
  const scheme = useColorScheme() ?? 'light'
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
    <Screen variant="stack">
      <AppText variant="secondary" tone="muted">
        {pl.progress.analyticsIntro}
      </AppText>

      {logs === null ? (
        <ActivityIndicator color={c.brand} style={{ marginTop: space.xl }} />
      ) : (
        <View style={{ marginTop: space.xl, gap: space.xxxl }}>
          <PeriodAdherencePanel logs={logs} />
          <CollapsibleSection title={pl.progress.perMed.title}>
            <MedicationProgressPanel
              logs={logs}
              medications={medOptions}
              embedded
            />
          </CollapsibleSection>
          <CollapsibleSection title={pl.progress.timing.title}>
            <TimingStatsPanel logs={logs} embedded />
          </CollapsibleSection>
        </View>
      )}
    </Screen>
  )
}
