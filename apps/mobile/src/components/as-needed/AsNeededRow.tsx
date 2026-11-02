import { useEffect, useState } from 'react'
import { Link } from 'expo-router'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import * as Haptics from 'expo-haptics'

import { medicationAccentColor } from '@mediapp/core'
import type { MedicationEntry } from '@mediapp/core'

import { useColorScheme } from '@/components/useColorScheme'
import { DoseStatusBadge } from '@/src/components/dose/DoseStatusBadge'
import { MedicationIconBadge } from '@/src/components/medication/MedicationIconBadge'
import { MedicationStockLine } from '@/src/components/medication/detail/MedicationStockLine'
import { useStorage } from '@/src/context/StorageContext'
import {
  getTodayPrnLogForMedication,
  logAsNeededIntake,
  logAsNeededSkip,
} from '@/src/storage/repositories/doseLogRepository'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'

type AsNeededRowProps = {
  med: MedicationEntry
}

export function AsNeededRow({ med }: AsNeededRowProps) {
  const scheme = useColorScheme()
  const c = themeColors(scheme)
  const { bumpRefresh, refreshKey } = useStorage()
  const [todayLog, setTodayLog] = useState<Awaited<
    ReturnType<typeof getTodayPrnLogForMedication>
  >>(undefined)

  useEffect(() => {
    void getTodayPrnLogForMedication(med.id).then(setTodayLog)
  }, [med.id, refreshKey])

  const accent = medicationAccentColor(med.color)

  return (
    <View
      style={[
        styles.card,
        {
          borderColor: c.border,
          backgroundColor: c.surfaceElevated,
          borderLeftColor: accent,
        },
      ]}
    >
      <View style={styles.row}>
        <MedicationIconBadge icon={med.icon} color={med.color} size={28} />
        <View style={styles.main}>
          <Link href={`/medication/${med.id}`} asChild>
            <Pressable>
              <Text style={[styles.name, { color: c.text }]}>{med.name}</Text>
            </Pressable>
          </Link>
          <Text style={[styles.dose, { color: c.textMuted }]}>{med.doseText}</Text>
          <MedicationStockLine medication={med} compact />
          <View style={styles.statusWrap}>
            {todayLog ? (
              <DoseStatusBadge
                status={todayLog.status}
                log={todayLog}
                medication={med}
              />
            ) : (
              <Text style={[styles.noneToday, { color: c.textMuted }]}>
                {pl.asNeeded.noneToday}
              </Text>
            )}
          </View>
        </View>
      </View>
      <View style={styles.actions}>
        <Pressable
          style={[styles.takenBtn, { backgroundColor: c.brand }]}
          onPress={() => {
            void logAsNeededIntake(med.id).then(async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              bumpRefresh()
            })
          }}
        >
          <Text style={styles.takenText}>{pl.reminder.taken}</Text>
        </Pressable>
        <Pressable
          style={[styles.skipBtn, { borderColor: c.border }]}
          onPress={() => {
            void logAsNeededSkip(med.id).then(async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              bumpRefresh()
            })
          }}
        >
          <Text style={[styles.skipText, { color: c.text }]}>{pl.asNeeded.skipOk}</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderLeftWidth: 6,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  row: { flexDirection: 'row', gap: 12 },
  main: { flex: 1, minWidth: 0 },
  name: { fontSize: 16, fontWeight: '600' },
  dose: { fontSize: 14, marginTop: 2 },
  statusWrap: { marginTop: 8 },
  noneToday: { fontSize: 12 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  takenBtn: {
    flex: 1,
    minHeight: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  takenText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  skipBtn: {
    flex: 1,
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipText: { fontWeight: '500', fontSize: 14 },
})
