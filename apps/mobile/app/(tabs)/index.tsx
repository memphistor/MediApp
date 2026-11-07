import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, Pressable, View } from 'react-native'
import * as Haptics from 'expo-haptics'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { scheduledDoses } from '@mediapp/core'

import { useColorScheme } from '@/components/useColorScheme'
import { DueReminderPanel } from '@/src/components/reminders/DueReminderPanel'
import { SkipDoseModal } from '@/src/components/today/SkipDoseModal'
import { RegisterDoseSheet } from '@/src/components/today/RegisterDoseSheet'
import { TodayDoseRow } from '@/src/components/today/TodayDoseRow'
import { WeekStrip } from '@/src/components/today/WeekStrip'
import { AppText } from '@/src/components/ui/AppText'
import { Card } from '@/src/components/ui/Card'
import { BellIcon, ChevronRightIcon, ListIcon, PlusIcon } from '@/src/components/ui/icons'
import { Screen } from '@/src/components/ui/Screen'
import { SettingsButton } from '@/src/components/ui/SettingsIcon'
import { useSettings } from '@/src/context/SettingsContext'
import { useStorage } from '@/src/context/StorageContext'
import { capitalizePl, formatHm } from '@/src/format/dayLabel'
import { useTodayData, useWeekDoseLogs } from '@/src/hooks/useTodayData'
import { pl } from '@/src/i18n/pl'
import { updateDoseStatus } from '@/src/storage/repositories/doseLogRepository'
import { themeColors } from '@/src/theme/colors'
import { space } from '@/src/theme/tokens'

export default function TodayScreen() {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const today = useMemo(() => new Date(), [])
  const { entries, medMap, medications, loading } = useTodayData(today)
  const weekLogs = useWeekDoseLogs(today)
  const { settings } = useSettings()
  const { bumpRefresh } = useStorage()
  const { focusLog } = useLocalSearchParams<{ focusLog?: string }>()
  const focusId = typeof focusLog === 'string' ? focusLog : undefined
  const router = useRouter()
  const [skipTarget, setSkipTarget] = useState<string | null>(null)
  const [sheetId, setSheetId] = useState<string | null>(null)

  const hasMedications = medications.length > 0
  const showNotificationsOff =
    !settings.notificationsEnabled && entries.length > 0
  const plan = scheduledDoses(entries)
  const taken = plan.filter((log) => log.status === 'taken').length

  const groups = useMemo(() => {
    const map = new Map<string, typeof entries>()
    for (const log of entries) {
      const time = formatHm(log.scheduledAt)
      const list = map.get(time) ?? []
      list.push(log)
      map.set(time, list)
    }
    return [...map.entries()]
  }, [entries])

  const dateLabel = capitalizePl(
    today.toLocaleDateString('pl-PL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }),
  )

  const openedFocus = useRef<string | null>(null)
  useEffect(() => {
    if (!focusId || openedFocus.current === focusId) return
    if (entries.some((log) => log.id === focusId)) {
      openedFocus.current = focusId
      setSheetId(focusId)
    }
  }, [focusId, entries])

  const sheetLog = entries.find((log) => log.id === sheetId) ?? null
  const sheetMed = sheetLog ? medMap.get(sheetLog.medicationId) ?? null : null

  const handleTaken = useCallback(
    async (id: string, takenAt: string) => {
      await updateDoseStatus(id, 'taken', { takenAt })
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      setSheetId(null)
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
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <AppText variant="title">{pl.today.title}</AppText>
          <AppText variant="secondary" tone="muted" style={{ marginTop: 4 }}>
            {dateLabel}
          </AppText>
        </View>
        <SettingsButton />
      </View>

      <WeekStrip today={today} logs={weekLogs} />

      {showNotificationsOff ? (
        <Pressable
          onPress={() => router.push('/settings')}
          style={{
            marginTop: 26,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
            padding: 18,
            borderRadius: 26,
            backgroundColor: c.tint,
          }}
        >
          <View
            style={{
              width: 46,
              height: 46,
              borderRadius: 16,
              backgroundColor: c.surfaceElevated,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BellIcon color={c.brand} />
          </View>
          <View style={{ flex: 1 }}>
            <AppText variant="body" style={{ fontWeight: '500' }}>
              {pl.today.notificationsOffTitle}
            </AppText>
            <AppText variant="secondary" tone="muted" style={{ marginTop: 3 }}>
              {pl.today.notificationsOffHint}
            </AppText>
          </View>
          <ChevronRightIcon color={c.faint} />
        </Pressable>
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
        <View style={{ marginTop: 34 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <AppText variant="section">{pl.today.planTitle}</AppText>
            <AppText variant="secondary" tone="muted">
              {pl.today.planCount
                .replace('{taken}', String(taken))
                .replace('{total}', String(plan.length))}
            </AppText>
          </View>
          <View style={{ gap: 14 }}>
            {groups.map(([time, logs]) => (
              <View key={time}>
                <AppText
                  variant="caption"
                  tone="muted"
                  style={{ marginLeft: 6, marginBottom: 8, fontVariant: ['tabular-nums'] }}
                >
                  {time}
                </AppText>
                <Card padded={false}>
                  {logs.map((log, index) => {
                    const med = medMap.get(log.medicationId)
                    if (!med) return null
                    return (
                      <TodayDoseRow
                        key={log.id}
                        log={log}
                        medication={med}
                        divider={index > 0}
                        onOpen={() => setSheetId(log.id)}
                      />
                    )
                  })}
                </Card>
              </View>
            ))}
          </View>
        </View>
      )}

      <Pressable onPress={() => router.push('/medications')} style={{ marginTop: 28 }}>
        <Card>
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
              <ListIcon color={c.brand} />
            </View>
            <View style={{ flex: 1 }}>
              <AppText variant="body" style={{ fontWeight: '500' }}>
                {pl.meds.title}
              </AppText>
              <AppText variant="secondary" tone="muted" style={{ marginTop: 3 }}>
                {pl.today.medListHint}
              </AppText>
            </View>
            <ChevronRightIcon color={c.faint} />
          </View>
        </Card>
      </Pressable>

      <View style={{ marginTop: 30 }}>
        <AppText variant="section" style={{ marginBottom: 14 }}>
          {pl.today.outsidePlan}
        </AppText>
        <Pressable onPress={() => router.push('/as-needed')}>
          <Card>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <View style={{ flex: 1 }}>
                <AppText variant="body" style={{ fontWeight: '500' }}>
                  {pl.today.asNeededLink}
                </AppText>
                <AppText variant="secondary" tone="muted" style={{ marginTop: 3 }}>
                  {pl.today.asNeededLinkHint}
                </AppText>
              </View>
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
                <PlusIcon color={c.brand} />
              </View>
            </View>
          </Card>
        </Pressable>
      </View>

      <RegisterDoseSheet
        log={sheetLog}
        medication={sheetMed ?? null}
        onClose={() => setSheetId(null)}
        onTaken={(id, takenAt) => {
          void handleTaken(id, takenAt)
        }}
        onSkip={(id) => {
          setSheetId(null)
          setSkipTarget(id)
        }}
      />
      <SkipDoseModal
        visible={skipTarget != null}
        onClose={() => setSkipTarget(null)}
        onConfirm={handleSkipConfirm}
      />
    </Screen>
  )
}
