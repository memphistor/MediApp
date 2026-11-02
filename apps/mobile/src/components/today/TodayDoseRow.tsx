import { Pressable, StyleSheet, Text, View } from 'react-native'
import {
  doseStatusContextFromLog,
  doseStatusPillStyle,
  medicationAccentColor,
  type DoseLog,
  type MedicationEntry,
} from '@mediapp/core'

import { useColorScheme } from '@/components/useColorScheme'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'

function statusLabel(
  status: DoseLog['status'],
  med: MedicationEntry,
  log: DoseLog,
): string {
  const ctx = doseStatusContextFromLog(log, med)
  if (ctx.source === 'prn' && status === 'skipped') {
    return pl.doseStatus.skippedAsNeededOk
  }
  return pl.doseStatus[status]
}

function pillColorsForRn(
  status: DoseLog['status'],
  med: MedicationEntry,
  log: DoseLog,
): { backgroundColor: string; color: string } {
  const ctx = doseStatusContextFromLog(log, med)
  const web = doseStatusPillStyle(status, ctx)
  if (web.backgroundColor.includes('color-mix')) {
    return { backgroundColor: '#e2e8f0', color: '#64748b' }
  }
  return web
}

interface TodayDoseRowProps {
  log: DoseLog
  medication: MedicationEntry
  onMarkTaken: (id: string) => void
  onSkip: (id: string) => void
}

export function TodayDoseRow({
  log,
  medication,
  onMarkTaken,
  onSkip,
}: TodayDoseRowProps) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const accent = medicationAccentColor(medication.color)
  const time = new Date(log.scheduledAt).toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const pill = pillColorsForRn(log.status, medication, log)
  const canAct = log.status === 'planned' || log.status === 'missed'

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: c.surfaceElevated,
          borderColor: c.border,
          borderLeftColor: accent,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.icon]}>{medication.icon}</Text>
        <View style={styles.headerText}>
          <View style={styles.titleRow}>
            <Text style={[styles.name, { color: c.text }]} numberOfLines={1}>
              {medication.name}
            </Text>
            <Text style={[styles.time, { color: c.textMuted }]}>{time}</Text>
          </View>
          <Text style={[styles.dose, { color: c.textMuted }]}>
            {medication.doseText}
          </Text>
          <View
            style={[styles.badge, { backgroundColor: pill.backgroundColor }]}
          >
            <Text style={[styles.badgeText, { color: pill.color }]}>
              {statusLabel(log.status, medication, log)}
            </Text>
          </View>
        </View>
      </View>
      {canAct && (
        <View style={styles.actions}>
          <Pressable
            style={[styles.takenBtn, { backgroundColor: c.brand }]}
            onPress={() => onMarkTaken(log.id)}
          >
            <Text style={styles.takenBtnText}>{pl.reminder.taken}</Text>
          </Pressable>
          <Pressable
            style={[styles.skipBtn, { borderColor: c.border }]}
            onPress={() => onSkip(log.id)}
          >
            <Text style={[styles.skipBtnText, { color: c.text }]}>
              {pl.reminder.skip}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderLeftWidth: 6,
    borderRadius: 16,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    gap: 12,
  },
  icon: {
    fontSize: 28,
  },
  headerText: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
  },
  time: {
    fontSize: 14,
  },
  dose: {
    marginTop: 4,
    fontSize: 14,
  },
  badge: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  takenBtn: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  takenBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  skipBtn: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
  },
  skipBtnText: {
    fontSize: 15,
    fontWeight: '500',
  },
})
