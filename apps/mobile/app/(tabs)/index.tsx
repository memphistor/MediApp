import { useCallback, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native'
import * as Haptics from 'expo-haptics'
import { Link, useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { DueReminderPanel } from '@/src/components/reminders/DueReminderPanel'
import { SkipDoseModal } from '@/src/components/today/SkipDoseModal'
import { TodayDoseRow } from '@/src/components/today/TodayDoseRow'
import { useSettings } from '@/src/context/SettingsContext'
import { useStorage } from '@/src/context/StorageContext'
import { useTodayData } from '@/src/hooks/useTodayData'
import { pl } from '@/src/i18n/pl'
import { updateDoseStatus } from '@/src/storage/repositories/doseLogRepository'
import { themeColors } from '@/src/theme/colors'
import { useColorScheme } from '@/components/useColorScheme'

export default function TodayScreen() {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const today = useMemo(() => new Date(), [])
  const { entries, medMap, medications, loading } = useTodayData(today)
  const { settings } = useSettings()
  const { bumpRefresh } = useStorage()
  const { focusLog } = useLocalSearchParams<{ focusLog?: string }>()
  const focusId = typeof focusLog === 'string' ? focusLog : undefined
  const router = useRouter()
  const [skipTarget, setSkipTarget] = useState<string | null>(null)

  const hasMedications = medications.length > 0
  const showNotificationsOff =
    !settings.notificationsEnabled && entries.length > 0

  const handleTaken = useCallback(
    async (id: string) => {
      await updateDoseStatus(id, 'taken', { takenAt: new Date().toISOString() })
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      bumpRefresh()
    },
    [bumpRefresh],
  )

  const handleSkipConfirm = useCallback(
    async (reason: string) => {
      if (!skipTarget) return
      await updateDoseStatus(skipTarget, 'skipped', {
        skipReason: reason || undefined,
      })
      setSkipTarget(null)
      bumpRefresh()
    },
    [skipTarget, bumpRefresh],
  )

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: c.surface }]}
      edges={['bottom']}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: c.text }]}>{pl.today.title}</Text>
          <Pressable
            onPress={() => router.push('/settings')}
            accessibilityRole="button"
          >
            <Text style={[styles.settingsLink, { color: c.brand }]}>
              {pl.settings.title}
            </Text>
          </Pressable>
        </View>

        {showNotificationsOff && (
          <Text style={[styles.notificationsOff, { color: c.textMuted }]}>
            {pl.today.notificationsOff}
          </Text>
        )}

        {__DEV__ && hasMedications && (
          <Text style={[styles.devHint, { color: c.textMuted }]}>
            {medications.some((m) => m.name.includes('demo'))
              ? 'Tryb dev: załadowano lek demo.'
              : null}
          </Text>
        )}

        <DueReminderPanel />

        {loading ? (
          <ActivityIndicator style={styles.loader} color={c.brand} />
        ) : entries.length === 0 ? (
          <View
            style={[
              styles.empty,
              { borderColor: c.border, backgroundColor: c.surfaceElevated },
            ]}
          >
            <Text style={[styles.emptyText, { color: c.textMuted }]}>
              {hasMedications ? pl.today.empty : pl.today.emptyNoMeds}
            </Text>
            {!hasMedications && (
              <Link href="/(tabs)/add" style={styles.addLink}>
                <Text style={[styles.addLinkText, { color: c.brand }]}>
                  {pl.today.addFirst}
                </Text>
              </Link>
            )}
          </View>
        ) : (
          <View style={styles.list}>
            {entries.map((log) => {
              const med = medMap.get(log.medicationId)!
              return (
                <TodayDoseRow
                  key={log.id}
                  log={log}
                  medication={med}
                  onMarkTaken={handleTaken}
                  onSkip={setSkipTarget}
                  focused={focusId === log.id}
                />
              )
            })}
          </View>
        )}
      </ScrollView>

      <SkipDoseModal
        visible={skipTarget != null}
        onClose={() => setSkipTarget(null)}
        onConfirm={handleSkipConfirm}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    padding: 16,
    paddingBottom: 32,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    flex: 1,
  },
  settingsLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  notificationsOff: {
    marginTop: 8,
    fontSize: 14,
  },
  devHint: {
    marginTop: 8,
    fontSize: 12,
  },
  loader: {
    marginTop: 32,
  },
  empty: {
    marginTop: 24,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  addLink: {
    marginTop: 16,
  },
  addLinkText: {
    fontSize: 15,
    fontWeight: '600',
  },
  list: {
    marginTop: 16,
    gap: 12,
  },
})
