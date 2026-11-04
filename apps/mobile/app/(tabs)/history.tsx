import { useMemo } from 'react'
import { ActivityIndicator, Pressable, View } from 'react-native'
import { useRouter } from 'expo-router'

import { splitHistoryLogs, toDateKey } from '@mediapp/core'

import { useColorScheme } from '@/components/useColorScheme'
import { HistoryLogList } from '@/src/components/history/HistoryLogList'
import { CollapsibleSection } from '@/src/components/layout/CollapsibleSection'
import { AppText } from '@/src/components/ui/AppText'
import { Card } from '@/src/components/ui/Card'
import { Screen } from '@/src/components/ui/Screen'
import { useHistoryData } from '@/src/hooks/useProgressData'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'
import { space } from '@/src/theme/tokens'

export default function HistoryScreen() {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const router = useRouter()
  const data = useHistoryData()

  const nameById = useMemo(() => {
    const m = new Map<string, string>()
    for (const med of data?.medications ?? []) m.set(med.id, med.name)
    return m
  }, [data?.medications])

  const { past, planned } = useMemo(
    () => splitHistoryLogs(data?.logs ?? []),
    [data?.logs],
  )
  const todayKey = toDateKey(new Date())
  const dueToday = planned.filter(
    (log) => toDateKey(new Date(log.scheduledAt)) === todayKey,
  )
  const laterPlanned = planned.filter(
    (log) => toDateKey(new Date(log.scheduledAt)) !== todayKey,
  )

  const total = (data?.logs ?? []).length
  const medications = data?.medications ?? []

  return (
    <Screen>
      <AppText variant="title">{pl.history.title}</AppText>
      <Pressable
        onPress={() => router.push('/progress/analytics')}
        style={{ marginTop: space.sm, minHeight: 44, justifyContent: 'center' }}
      >
        <AppText variant="secondary" tone="brand">
          {pl.history.analyticsLink}
        </AppText>
      </Pressable>

      {!data ? (
        <ActivityIndicator color={c.brand} style={{ marginTop: space.xl }} />
      ) : !total ? (
        <AppText variant="secondary" tone="muted" style={{ marginTop: space.lg }}>
          {pl.history.empty}
        </AppText>
      ) : (
        <View style={{ marginTop: space.lg, gap: space.lg }}>
          <CollapsibleSection title={pl.history.sectionPast} defaultOpen>
            <HistoryLogList
              logs={past}
              nameById={nameById}
              medications={medications}
              emptyLabel={pl.history.sectionEmpty}
            />
          </CollapsibleSection>

          {dueToday.length > 0 ? (
            <Card>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: space.sm,
                  marginBottom: space.sm,
                }}
              >
                <AppText variant="section" style={{ flex: 1 }}>
                  {pl.history.dueToday}{' '}
                  <AppText variant="section" tone="muted">
                    {dueToday.length}
                  </AppText>
                </AppText>
                <Pressable
                  onPress={() => router.push('/')}
                  style={{ minHeight: 44, justifyContent: 'center' }}
                >
                  <AppText variant="secondary" tone="brand">
                    {pl.history.backToToday}
                  </AppText>
                </Pressable>
              </View>
              <HistoryLogList
                logs={dueToday}
                nameById={nameById}
                medications={medications}
                emptyLabel={pl.history.sectionEmpty}
              />
            </Card>
          ) : null}

          <CollapsibleSection title={pl.history.sectionPlanned}>
            <HistoryLogList
              logs={laterPlanned}
              nameById={nameById}
              medications={medications}
              emptyLabel={pl.history.sectionEmpty}
            />
          </CollapsibleSection>
        </View>
      )}
    </Screen>
  )
}
