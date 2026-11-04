import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { Pressable, StyleSheet, View } from 'react-native'
import * as Haptics from 'expo-haptics'

import type { MedicationEntry } from '@mediapp/core'

import { useColorScheme } from '@/components/useColorScheme'
import { DoseStatusBadge } from '@/src/components/dose/DoseStatusBadge'
import { MedicationIconBadge } from '@/src/components/medication/MedicationIconBadge'
import { MedicationStockLine } from '@/src/components/medication/detail/MedicationStockLine'
import { AppText } from '@/src/components/ui/AppText'
import { Button } from '@/src/components/ui/Button'
import { Card } from '@/src/components/ui/Card'
import { useStorage } from '@/src/context/StorageContext'
import {
  getTodayPrnLogForMedication,
  logAsNeededIntake,
  logAsNeededSkip,
} from '@/src/storage/repositories/doseLogRepository'
import { pl } from '@/src/i18n/pl'
import { space } from '@/src/theme/tokens'

type AsNeededRowProps = {
  med: MedicationEntry
}

export function AsNeededRow({ med }: AsNeededRowProps) {
  const router = useRouter()
  const { bumpRefresh, refreshKey } = useStorage()
  const [todayLog, setTodayLog] = useState<Awaited<
    ReturnType<typeof getTodayPrnLogForMedication>
  >>(undefined)

  useEffect(() => {
    void getTodayPrnLogForMedication(med.id).then(setTodayLog)
  }, [med.id, refreshKey])

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <MedicationIconBadge icon={med.icon} color={med.color} size={22} />
        <View style={styles.main}>
          <Pressable onPress={() => router.push(`/medication/${med.id}`)}>
            <AppText variant="section">{med.name}</AppText>
          </Pressable>
          <AppText variant="secondary" tone="muted" style={{ marginTop: 2 }}>
            {med.doseText}
          </AppText>
          <MedicationStockLine medication={med} compact />
          <View style={styles.statusWrap}>
            {todayLog ? (
              <DoseStatusBadge
                status={todayLog.status}
                log={todayLog}
                medication={med}
              />
            ) : (
              <AppText variant="caption" tone="muted">
                {pl.asNeeded.noneToday}
              </AppText>
            )}
          </View>
        </View>
      </View>
      <View style={styles.actions}>
        <Button
          label={pl.reminder.taken}
          onPress={() => {
            void logAsNeededIntake(med.id).then(async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              bumpRefresh()
            })
          }}
          style={styles.taken}
        />
        <Button
          label={pl.asNeeded.skipOk}
          variant="text"
          onPress={() => {
            void logAsNeededSkip(med.id).then(async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              bumpRefresh()
            })
          }}
        />
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  card: { marginBottom: space.md },
  row: { flexDirection: 'row', gap: space.md },
  main: { flex: 1, minWidth: 0 },
  statusWrap: { marginTop: space.sm },
  actions: {
    marginTop: space.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taken: { alignSelf: 'flex-start', minWidth: 128 },
})
