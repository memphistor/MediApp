import {
  isEntryInDateRange,
  isMedicationRemindersEnabled,
  medicationAccentColor,
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

import { MedicationIconBadge } from '@/src/components/medication/MedicationIconBadge'
import { ScheduleSummary } from '@/src/components/medication/ScheduleSummary'
import { MedicationStockLine } from '@/src/components/medication/detail/MedicationStockLine'
import { MedicationStockPanel } from '@/src/components/medication/detail/MedicationStockPanel'
import { useStorage } from '@/src/context/StorageContext'
import { useMedication } from '@/src/hooks/useMedication'
import { pl } from '@/src/i18n/pl'
import { useColorScheme } from '@/components/useColorScheme'
import { themeColors } from '@/src/theme/colors'
import { logAsNeededIntake } from '@/src/storage/repositories/doseLogRepository'
import {
  deleteMedication,
  updateMedication,
} from '@/src/storage/repositories/medicationRepository'
import { syncAllDoseLogs } from '@/src/storage/services/syncDoseLogs'

type MedicationDetailViewProps = {
  medicationId: string
}

export function MedicationDetailView({
  medicationId,
}: MedicationDetailViewProps) {
  const router = useRouter()
  const { bumpRefresh } = useStorage()
  const { medication, loading } = useMedication(medicationId)
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={c.brand} />
      </View>
    )
  }

  if (!medication) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: c.textMuted }}>{pl.detail.notFound}</Text>
      </View>
    )
  }

  const stomach =
    medication.onEmptyStomach === 'yes'
      ? pl.wizard.emptyStomach.yes
      : medication.onEmptyStomach === 'no'
        ? pl.wizard.emptyStomach.no
        : pl.wizard.emptyStomach.na

  const canLogPrn =
    medication.schedule.type === 'asNeeded' &&
    isEntryInDateRange(new Date(), medication)

  const showRemindersToggle =
    medication.schedule.type !== 'asNeeded' && medication.times.length > 0
  const remindersOn = isMedicationRemindersEnabled(medication)
  const accent = medicationAccentColor(medication.color)

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
      { text: pl.wizard.back, style: 'cancel' },
      {
        text: pl.detail.delete,
        style: 'destructive',
        onPress: () => {
          void (async () => {
            await deleteMedication(medication.id)
            await syncAllDoseLogs()
            bumpRefresh()
            router.replace('/(tabs)/')
          })()
        },
      },
    ])
  }

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: c.surface }]}
      edges={['bottom']}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View
          style={[
            styles.card,
            {
              borderColor: c.border,
              backgroundColor: c.surfaceElevated,
              borderTopColor: accent,
            },
          ]}
        >
          <View style={styles.header}>
            <MedicationIconBadge
              icon={medication.icon}
              color={medication.color}
              size={40}
            />
            <View style={styles.headerText}>
              <Text style={[styles.name, { color: c.text }]}>
                {medication.name}
              </Text>
              <Text style={[styles.sub, { color: c.textMuted }]}>
                {pl.wizard.kinds[medication.kind]} ·{' '}
                {pl.wizard.forms[medication.form]}
              </Text>
            </View>
          </View>

          <View style={styles.dl}>
            <Text style={[styles.dt, { color: c.textMuted }]}>Dawka</Text>
            <Text style={[styles.dd, { color: c.text }]}>
              {medication.doseText}
            </Text>
            {medication.stockRemaining != null ? (
              <>
                <Text style={[styles.dt, { color: c.textMuted, marginTop: 8 }]}>
                  {pl.stock.replenishTitle}
                </Text>
                <MedicationStockLine medication={medication} />
              </>
            ) : null}
            <Text style={[styles.dt, { color: c.textMuted, marginTop: 8 }]}>
              {pl.detail.schedule}
            </Text>
            <View style={styles.scheduleRow}>
              <ScheduleSummary schedule={medication.schedule} />
              {medication.times.length > 0 ? (
                <Text style={{ color: c.textMuted }}>
                  {' '}
                  · {medication.times.join(', ')}
                </Text>
              ) : null}
            </View>
            {medication.purposeLabel ? (
              <>
                <Text
                  style={[styles.dt, { color: c.textMuted, marginTop: 8 }]}
                >
                  {pl.wizard.fields.purpose}
                </Text>
                <Text style={[styles.dd, { color: c.text }]}>
                  {medication.purposeLabel}
                </Text>
              </>
            ) : null}
          </View>
        </View>

        {showRemindersToggle ? (
          <View
            style={[
              styles.card,
              { borderColor: c.border, backgroundColor: c.surfaceElevated },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: c.text }]}>
              {pl.detail.reminders}
            </Text>
            <View style={styles.switchRow}>
              <Switch
                value={remindersOn}
                onValueChange={() => void handleRemindersToggle()}
              />
              <View style={styles.switchText}>
                <Text style={[styles.switchTitle, { color: c.text }]}>
                  {pl.wizard.fields.remindersEnable}
                </Text>
                <Text style={[styles.hint, { color: c.textMuted }]}>
                  {pl.detail.remindersHint}
                </Text>
              </View>
            </View>
          </View>
        ) : null}

        <Text style={[styles.sectionTitle, { color: c.text }]}>
          {pl.detail.yourNotes}
        </Text>
        <View
          style={[
            styles.noteItem,
            { borderColor: c.border, backgroundColor: c.surfaceElevated },
          ]}
        >
          <Text style={{ color: c.text }}>
            {pl.wizard.fields.emptyStomach}:{' '}
            <Text style={styles.strong}>{stomach}</Text>
          </Text>
        </View>
        {medication.mealTiming ? (
          <View
            style={[
              styles.noteItem,
              { borderColor: c.border, backgroundColor: c.surfaceElevated },
            ]}
          >
            <Text style={{ color: c.text }}>
              {pl.wizard.fields.meal}:{' '}
              <Text style={styles.strong}>
                {pl.wizard.meal[medication.mealTiming]}
              </Text>
            </Text>
          </View>
        ) : null}
        {medication.userNote ? (
          <View
            style={[
              styles.noteItem,
              { borderColor: c.border, backgroundColor: c.surfaceElevated },
            ]}
          >
            <Text style={{ color: c.text }}>{medication.userNote}</Text>
          </View>
        ) : null}

        <MedicationStockPanel medicationId={medication.id} />

        <Pressable
          onPress={() => router.push(`/medication/${medication.id}/edit`)}
          style={[styles.btnPrimary, { backgroundColor: c.brand }]}
        >
          <Text style={styles.btnPrimaryText}>{pl.detail.edit}</Text>
        </Pressable>
        {canLogPrn ? (
          <Pressable
            onPress={() => void handleLogIntake()}
            style={[styles.btnOutline, { borderColor: c.brand }]}
          >
            <Text style={[styles.btnOutlineText, { color: c.brand }]}>
              {pl.detail.logIntake}
            </Text>
          </Pressable>
        ) : null}
        <Pressable
          onPress={handleDelete}
          style={[styles.btnOutline, { borderColor: '#fca5a5' }]}
        >
          <Text style={[styles.btnOutlineText, { color: '#b91c1c' }]}>
            {pl.detail.delete}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    borderTopWidth: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
  },
  sub: {
    fontSize: 14,
    marginTop: 2,
  },
  dl: {
    marginTop: 16,
  },
  dt: {
    fontSize: 13,
  },
  dd: {
    fontSize: 15,
    fontWeight: '500',
    marginTop: 2,
  },
  scheduleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 12,
  },
  switchText: {
    flex: 1,
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  hint: {
    fontSize: 12,
    marginTop: 4,
  },
  noteItem: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  strong: {
    fontWeight: '600',
  },
  btnPrimary: {
    minHeight: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  btnPrimaryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  btnOutline: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOutlineText: {
    fontWeight: '600',
    fontSize: 15,
  },
})
