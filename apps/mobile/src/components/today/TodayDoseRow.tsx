import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import {
  doseStatusContextFromLog,
  medicationAccentColor,
  type DoseLog,
  type MedicationEntry,
} from '@mediapp/core'

import { useColorScheme } from '@/components/useColorScheme'
import { DoseStatusBadge } from '@/src/components/dose/DoseStatusBadge'
import { MedicationIconBadge } from '@/src/components/medication/MedicationIconBadge'
import { Button } from '@/src/components/ui/Button'
import { Card } from '@/src/components/ui/Card'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'
import { space } from '@/src/theme/tokens'
import { useTypeScale } from '@/src/theme/useTypeScale'

interface TodayDoseRowProps {
  log: DoseLog
  medication: MedicationEntry
  onMarkTaken: (id: string) => void
  onSkip: (id: string) => void
  focused?: boolean
}

export function TodayDoseRow({
  log,
  medication,
  onMarkTaken,
  onSkip,
  focused = false,
}: TodayDoseRowProps) {
  const router = useRouter()
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const type = useTypeScale()
  const accent = medicationAccentColor(medication.color)
  const time = new Date(log.scheduledAt).toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const canAct = log.status === 'planned' || log.status === 'missed'

  return (
    <Card
      style={{
        borderLeftWidth: 3,
        borderLeftColor: accent,
        backgroundColor: focused ? `${c.brand}10` : c.surfaceElevated,
      }}
    >
      <Pressable
        onPress={() => router.push(`/medication/${medication.id}`)}
        style={styles.header}
        accessibilityRole="button"
      >
        <MedicationIconBadge icon={medication.icon} color={medication.color} size={22} />
        <View style={styles.headerText}>
          <View style={styles.titleRow}>
            <Text
              style={[type.section, { color: c.text, flex: 1 }]}
              numberOfLines={1}
            >
              {medication.name}
            </Text>
            <Text style={[type.secondary, { color: c.textMuted }]}>{time}</Text>
          </View>
          <Text style={[type.secondary, { color: c.textMuted, marginTop: space.xs }]}>
            {medication.doseText}
          </Text>
          <View style={styles.badge}>
            <DoseStatusBadge status={log.status} log={log} medication={medication} />
          </View>
        </View>
      </Pressable>
      {canAct ? (
        <View style={styles.actions}>
          <Button
            label={pl.reminder.taken}
            onPress={() => onMarkTaken(log.id)}
            style={styles.taken}
          />
          <Button
            label={pl.reminder.skip}
            variant="text"
            onPress={() => onSkip(log.id)}
          />
        </View>
      ) : null}
    </Card>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    gap: space.md,
  },
  headerText: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: space.sm,
  },
  badge: {
    marginTop: space.sm,
  },
  actions: {
    marginTop: space.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.sm,
  },
  taken: {
    alignSelf: 'flex-start',
    minWidth: 128,
  },
})
