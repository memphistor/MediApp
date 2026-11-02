import { useMemo } from 'react'
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Link } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { splitHistoryLogs, toDateKey } from '@mediapp/core'

import { useColorScheme } from '@/components/useColorScheme'
import { HistoryLogList } from '@/src/components/history/HistoryLogList'
import { CollapsibleSection } from '@/src/components/layout/CollapsibleSection'
import { useHistoryData } from '@/src/hooks/useProgressData'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'

export default function HistoryScreen() {
  const scheme = useColorScheme()
  const c = themeColors(scheme)
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
    <SafeAreaView style={[styles.safe, { backgroundColor: c.surface }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: c.text }]}>{pl.history.title}</Text>
          <Link href="/progress/analytics" asChild>
            <Pressable>
              <Text style={[styles.link, { color: c.brand }]}>
                {pl.history.analyticsLink}
              </Text>
            </Pressable>
          </Link>
        </View>

        {!data ? (
          <ActivityIndicator color={c.brand} style={{ marginTop: 24 }} />
        ) : !total ? (
          <Text style={[styles.empty, { color: c.textMuted }]}>{pl.history.empty}</Text>
        ) : (
          <>
            <CollapsibleSection title={pl.history.sectionPast} defaultOpen>
              <HistoryLogList
                logs={past}
                nameById={nameById}
                medications={medications}
                emptyLabel={pl.history.sectionEmpty}
              />
            </CollapsibleSection>

            {dueToday.length > 0 ? (
              <View
                style={[
                  styles.dueToday,
                  { borderColor: `${c.brand}4D`, backgroundColor: c.surfaceElevated },
                ]}
              >
                <View style={styles.dueHeader}>
                  <Text style={[styles.dueTitle, { color: c.text }]}>
                    {pl.history.dueToday}{' '}
                    <Text style={{ color: c.textMuted }}>{dueToday.length}</Text>
                  </Text>
                  <Link href="/(tabs)/" asChild>
                    <Pressable>
                      <Text style={{ color: c.brand, fontWeight: '600', fontSize: 14 }}>
                        {pl.history.backToToday}
                      </Text>
                    </Pressable>
                  </Link>
                </View>
                <HistoryLogList
                  logs={dueToday}
                  nameById={nameById}
                  medications={medications}
                  emptyLabel={pl.history.sectionEmpty}
                />
              </View>
            ) : null}

            <View style={styles.sectionGap}>
              <CollapsibleSection title={pl.history.sectionPlanned}>
                <HistoryLogList
                  logs={laterPlanned}
                  nameById={nameById}
                  medications={medications}
                  emptyLabel={pl.history.sectionEmpty}
                />
              </CollapsibleSection>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  title: { fontSize: 22, fontWeight: '600', flex: 1 },
  link: { fontSize: 14, fontWeight: '600' },
  empty: { fontSize: 14 },
  dueToday: { marginTop: 16, borderWidth: 1, borderRadius: 16, overflow: 'hidden' },
  dueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  dueTitle: { fontSize: 14, fontWeight: '600', flex: 1 },
  sectionGap: { marginTop: 16 },
})
