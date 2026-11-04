import { useCallback, useMemo, useState } from 'react'
import { ActivityIndicator, Pressable, View } from 'react-native'
import * as Haptics from 'expo-haptics'
import { useLocalSearchParams, useRouter } from 'expo-router'

import {
  dayRingProgress,
  isEntryInDateRange,
  scheduledDoses,
} from '@mediapp/core'

import { useColorScheme } from '@/components/useColorScheme'
import { DueReminderPanel } from '@/src/components/reminders/DueReminderPanel'
import { DayRing } from '@/src/components/gamification/DayRing'
import { SkipDoseModal } from '@/src/components/today/SkipDoseModal'
import { TodayDoseRow } from '@/src/components/today/TodayDoseRow'
import { AppText } from '@/src/components/ui/AppText'
import { Card } from '@/src/components/ui/Card'
import { Screen } from '@/src/components/ui/Screen'
import { SettingsIcon } from '@/src/components/ui/SettingsIcon'
import { useSettings } from '@/src/context/SettingsContext'
import { useStorage } from '@/src/context/StorageContext'
import { useTodayData } from '@/src/hooks/useTodayData'
import { pl } from '@/src/i18n/pl'
import { updateDoseStatus } from '@/src/storage/repositories/doseLogRepository'
import { themeColors } from '@/src/theme/colors'
import { space } from '@/src/theme/tokens'

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

  const ring = useMemo(
    () => dayRingProgress(scheduledDoses(entries)),
    [entries],
  )

  const asNeededCount = useMemo(
    () =>
      medications.filter(
        (med) =>
          med.schedule.type === 'asNeeded' && isEntryInDateRange(today, med),
      ).length,
    [medications, today],
  )

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
    <Screen>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <AppText variant="title" style={{ flex: 1 }}>
          {pl.today.title}
        </AppText>
        <Pressable
          onPress={() => router.push('/settings')}
          accessibilityRole="button"
          accessibilityLabel={pl.settings.title}
          hitSlop={8}
          style={{ minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}
        >
          <SettingsIcon color={c.text} knob={c.surface} />
        </Pressable>
      </View>

      {showNotificationsOff ? (
        <AppText variant="secondary" tone="muted" style={{ marginTop: space.sm }}>
          {pl.today.notificationsOff}
        </AppText>
      ) : null}

      {ring.total > 0 ? (
        <View style={{ marginTop: space.lg, alignItems: 'center' }}>
          <DayRing
            size="sm"
            progress={ring.progress}
            taken={ring.taken}
            total={ring.total}
            sublabel={pl.progress.todayCount
              .replace('{taken}', String(ring.taken))
              .replace('{total}', String(ring.total))}
          />
        </View>
      ) : null}

      <View style={{ marginTop: space.lg }}>
        <DueReminderPanel />
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: space.xxxl }} color={c.brand} />
      ) : entries.length === 0 ? (
        <Card style={{ marginTop: space.xl, alignItems: 'center' }}>
          <AppText variant="secondary" tone="muted" style={{ textAlign: 'center' }}>
            {hasMedications ? pl.today.empty : pl.today.emptyNoMeds}
          </AppText>
          {!hasMedications ? (
            <Pressable
              onPress={() => router.push('/(tabs)/add')}
              style={{ marginTop: space.lg, minHeight: 44, justifyContent: 'center' }}
            >
              <AppText variant="section" tone="brand">
                {pl.today.addFirst}
              </AppText>
            </Pressable>
          ) : null}
        </Card>
      ) : (
        <View style={{ marginTop: space.lg, gap: space.md }}>
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

      {asNeededCount > 0 ? (
        <Pressable
          onPress={() => router.push('/as-needed')}
          style={{ marginTop: space.lg }}
        >
          <Card>
            <AppText variant="section">{pl.today.asNeededLink}</AppText>
            <AppText variant="secondary" tone="muted" style={{ marginTop: space.xs }}>
              {pl.today.asNeededLinkHint}
            </AppText>
            <AppText variant="caption" tone="brand" style={{ marginTop: space.sm }}>
              {asNeededCount} {asNeededCount === 1 ? 'pozycja' : 'pozycje'}
            </AppText>
          </Card>
        </Pressable>
      ) : null}

      <SkipDoseModal
        visible={skipTarget != null}
        onClose={() => setSkipTarget(null)}
        onConfirm={handleSkipConfirm}
      />
    </Screen>
  )
}
