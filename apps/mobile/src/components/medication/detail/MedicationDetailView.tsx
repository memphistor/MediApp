import { useEffect, useState } from 'react'
import {
  isEntryInDateRange,
  isMedicationRemindersEnabled,
  formatDailyDosesLeft,
  type DoseLog,
} from '@mediapp/core'
import * as Haptics from 'expo-haptics'
import { useRouter } from 'expo-router'
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { DoseStatusBadge } from '@/src/components/dose/DoseStatusBadge'
import { MedicationIconBadge } from '@/src/components/medication/MedicationIconBadge'
import { MedicationStockPanel } from '@/src/components/medication/detail/MedicationStockPanel'
import { useStorage } from '@/src/context/StorageContext'
import { useMedication } from '@/src/hooks/useMedication'
import { pl } from '@/src/i18n/pl'
import { useColorScheme } from '@/components/useColorScheme'
import { themeColors } from '@/src/theme/colors'
import { cardShadow } from '@/src/theme/tokens'
import { BackIcon } from '@/src/components/ui/icons'
import { CircleButton } from '@/src/components/ui/CircleButton'
import { logAsNeededIntake, getDoseLogsForDay } from '@/src/storage/repositories/doseLogRepository'
import {
  deleteMedication,
  updateMedication,
} from '@/src/storage/repositories/medicationRepository'
import { syncAllDoseLogs } from '@/src/storage/services/syncDoseLogs'
import { getSettings } from '@/src/storage/repositories/settingsRepository'
import { requestReminderRescheduleImmediate } from '@/src/notifications/reminderReschedule'

function clock(iso: string): string {
  const date = new Date(iso)
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

type MedicationDetailViewProps = {
  medicationId: string
}

export function MedicationDetailView({
  medicationId,
}: MedicationDetailViewProps) {
  const router = useRouter()
  const { bumpRefresh, refreshKey } = useStorage()
  const { medication, loading } = useMedication(medicationId)
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const [todayLogs, setTodayLogs] = useState<DoseLog[]>([])

  useEffect(() => {
    let cancelled = false
    void getDoseLogsForDay(new Date()).then((rows) => {
      if (cancelled) return
      setTodayLogs(
        rows.filter(
          (log) => log.medicationId === medicationId && log.source !== 'prn',
        ),
      )
    })
    return () => {
      cancelled = true
    }
  }, [medicationId, refreshKey])

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: c.surface }]}>
        <ActivityIndicator color={c.brand} />
      </View>
    )
  }

  if (!medication) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: c.surface }]} edges={['top']}>
        <View style={styles.scroll}>
          <View style={styles.nav}>
            <CircleButton
              onPress={() => {
                if (router.canGoBack()) router.back()
                else router.replace('/')
              }}
              accessibilityLabel={pl.wizard.back}
            >
              <BackIcon color={c.text} />
            </CircleButton>
          </View>
          <Text style={[styles.name, { color: c.text, marginTop: 28, fontSize: 28 }]}>
            {pl.detail.notFound}
          </Text>
          <Text style={[styles.sub, { color: c.textMuted }]}>{pl.detail.notFoundHint}</Text>
        </View>
      </SafeAreaView>
    )
  }

  const canLogPrn =
    medication.schedule.type === 'asNeeded' &&
    isEntryInDateRange(new Date(), medication)
  const showRemindersToggle =
    medication.schedule.type !== 'asNeeded' && medication.times.length > 0
  const remindersOn = isMedicationRemindersEnabled(medication)
  const daysLeft =
    medication.stockRemaining == null
      ? null
      : formatDailyDosesLeft(medication)
  const stockRatio =
    daysLeft == null ? 0 : Math.max(0.08, Math.min(1, daysLeft / 30))

  const handleRemindersToggle = async () => {
    await updateMedication({
      ...medication,
      remindersEnabled: !remindersOn,
      updatedAt: new Date().toISOString(),
    })
    bumpRefresh()
  }

  const handleLogIntake = async () => {
    await logAsNeededIntake(medication.id)
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    bumpRefresh()
  }

  const handleDelete = () => {
    Alert.alert(pl.detail.delete, pl.detail.deleteConfirm, [
      { text: pl.common.cancel, style: 'cancel' },
      {
        text: pl.detail.delete,
        style: 'destructive',
        onPress: () => {
          void (async () => {
            await deleteMedication(medication.id)
            await syncAllDoseLogs()
            const settings = await getSettings()
            await requestReminderRescheduleImmediate(settings)
            bumpRefresh()
            router.replace('/')
          })()
        },
      },
    ])
  }

  const scheduleLabel = pl.wizard.schedules[medication.schedule.type].toLocaleLowerCase('pl-PL')
  const startLabel = medication.dateRange?.start
    ? pl.detail.fromDate.replace(
        '{date}',
        new Date(`${medication.dateRange.start}T12:00:00`).toLocaleDateString('pl-PL', {
          day: 'numeric',
          month: 'long',
        }),
      )
    : scheduleLabel

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.surface }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.nav}>
          <CircleButton onPress={() => router.back()} accessibilityLabel={pl.wizard.back}>
            <BackIcon color={c.text} />
          </CircleButton>
          <Text style={[styles.navTitle, { color: c.text }]}>{pl.detail.title}</Text>
          <Pressable
            onPress={() => router.push(`/medication/${medication.id}/edit`)}
            style={[styles.edit, { backgroundColor: c.tint }]}
          >
            <Text style={{ color: c.brandDark, fontSize: 16, fontWeight: '500' }}>
              {pl.detail.edit}
            </Text>
          </Pressable>
        </View>

        <View style={styles.hero}>
          <MedicationIconBadge icon={medication.icon} color={medication.color} boxSize={80} />
          <Text style={[styles.name, { color: c.text }]}>{medication.name}</Text>
          <Text style={[styles.sub, { color: c.textMuted }]}>
            {pl.wizard.forms[medication.form]} · {medication.doseText} · {scheduleLabel}
          </Text>
        </View>

        {medication.times.length > 0 ? (
          <View style={[styles.card, cardShadow(scheme), { backgroundColor: c.surfaceElevated, marginTop: 26 }]}>
            {medication.times.map((time, index) => {
              const log = todayLogs.find((item) => clock(item.scheduledAt) === time)
              return (
                <View
                  key={time}
                  style={[
                    styles.timeRow,
                    index > 0 && { borderTopWidth: 1, borderTopColor: c.line },
                  ]}
                >
                  <View style={[styles.timePill, { backgroundColor: c.track }]}>
                    <Text style={{ fontSize: 17, color: c.text }}>{time}</Text>
                  </View>
                  <Text style={[styles.dose, { color: c.text }]}>{medication.doseText}</Text>
                  {log ? (
                    <DoseStatusBadge
                      status={log.status}
                      log={log}
                      medication={medication}
                    />
                  ) : null}
                </View>
              )
            })}
          </View>
        ) : null}

        <View style={[styles.card, cardShadow(scheme), { backgroundColor: c.surfaceElevated, marginTop: 14 }]}>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: c.text }]}>{pl.detail.schedule}</Text>
            <Text style={{ color: c.textMuted, fontSize: 15 }}>{startLabel}</Text>
          </View>
          {showRemindersToggle ? (
            <View style={[styles.infoRow, { borderTopWidth: 1, borderTopColor: c.line }]}>
              <Text style={[styles.infoLabel, { color: c.text }]}>{pl.detail.reminders}</Text>
              <Switch
                value={remindersOn}
                onValueChange={() => void handleRemindersToggle()}
                trackColor={{ false: c.track, true: c.brand }}
              />
            </View>
          ) : null}
        </View>

        {medication.stockRemaining != null ? (
          <View style={[styles.card, cardShadow(scheme), { backgroundColor: c.surfaceElevated, marginTop: 14, padding: 18 }]}>
            <View style={styles.stockHead}>
              <Text style={[styles.infoLabel, { color: c.text }]}>{pl.wizard.stockTitle}</Text>
              <Text style={[styles.stockCount, { color: c.text }]}>
                {medication.stockRemaining} szt.
              </Text>
            </View>
            <View style={[styles.bar, { backgroundColor: c.track }]}>
              <View style={{ width: `${stockRatio * 100}%`, backgroundColor: c.brand, height: '100%' }} />
            </View>
            {daysLeft != null ? (
              <Text style={{ marginTop: 10, color: c.textMuted, fontSize: 14 }}>
                {pl.detail.stockDays.replace('{n}', String(daysLeft))}
              </Text>
            ) : null}
          </View>
        ) : null}

        {medication.userNote ? (
          <View style={[styles.card, cardShadow(scheme), { backgroundColor: c.surfaceElevated, marginTop: 14, padding: 18 }]}>
            <Text style={{ color: c.textMuted, fontSize: 13 }}>{pl.detail.noteLabel}</Text>
            <Text style={{ marginTop: 4, color: c.text, fontSize: 17 }}>{medication.userNote}</Text>
          </View>
        ) : null}

        <MedicationStockPanel medicationId={medication.id} />

        {canLogPrn ? (
          <Pressable onPress={() => void handleLogIntake()} style={{ marginTop: 16 }}>
            <Text style={{ textAlign: 'center', color: c.brand, fontSize: 16, fontWeight: '500' }}>
              {pl.detail.logIntake}
            </Text>
          </Pressable>
        ) : null}

        <Pressable onPress={handleDelete} style={styles.delete}>
          <Text style={styles.deleteText}>{pl.detail.delete}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingHorizontal: 24, paddingBottom: 40 },
  nav: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '500',
    pointerEvents: 'none',
  },
  edit: {
    height: 42,
    paddingHorizontal: 20,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: { alignItems: 'center', marginTop: 18 },
  name: {
    marginTop: 16,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '300',
    letterSpacing: -0.8,
    textAlign: 'center',
  },
  sub: { marginTop: 6, fontSize: 16, textAlign: 'center' },
  card: { borderRadius: 28 },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 22,
    paddingVertical: 15,
  },
  timePill: {
    height: 38,
    paddingHorizontal: 16,
    borderRadius: 16,
    justifyContent: 'center',
  },
  dose: { flex: 1, fontSize: 17, fontWeight: '400' },
  infoRow: {
    minHeight: 56,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoLabel: { fontSize: 17, fontWeight: '400' },
  stockHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  stockCount: { fontSize: 22, fontWeight: '300' },
  bar: { height: 8, borderRadius: 4, marginTop: 14, overflow: 'hidden' },
  delete: { marginTop: 22, alignItems: 'center', paddingVertical: 12 },
  deleteText: { color: '#C22E40', fontSize: 16, fontWeight: '500' },
})
