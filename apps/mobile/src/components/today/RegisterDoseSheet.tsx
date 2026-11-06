import { useEffect, useState } from 'react'
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import type { DoseLog, MedicationEntry } from '@mediapp/core'

import { useColorScheme } from '@/components/useColorScheme'
import { MedicationIconBadge } from '@/src/components/medication/MedicationIconBadge'
import { Button } from '@/src/components/ui/Button'
import { Card } from '@/src/components/ui/Card'
import { ChevronRightIcon, CloseIcon } from '@/src/components/ui/icons'
import { formatHm } from '@/src/format/dayLabel'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'

type RegisterDoseSheetProps = {
  log: DoseLog | null
  medication: MedicationEntry | null
  onClose: () => void
  onTaken: (id: string, takenAt: string) => void
  onSkip: (id: string) => void
}

export function RegisterDoseSheet({
  log,
  medication,
  onClose,
  onTaken,
  onSkip,
}: RegisterDoseSheetProps) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const [takenAt, setTakenAt] = useState(() => new Date())
  const [picking, setPicking] = useState(false)

  useEffect(() => {
    if (log) {
      setTakenAt(new Date())
      setPicking(false)
    }
  }, [log?.id])

  if (!log || !medication) return null

  const planned = formatHm(log.scheduledAt)
  const subtitle = pl.today.dosePlanLine
    .replace('{form}', pl.wizard.forms[medication.form])
    .replace('{dose}', medication.doseText)
    .replace('{time}', planned)

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.dim} onPress={onClose} />
      <View style={[styles.sheet, { backgroundColor: c.surface }]}>
        <View style={[styles.grab, { backgroundColor: c.faint }]} />
        <View style={styles.bar}>
          <View style={{ width: 42 }} />
          <Text style={[styles.title, { color: c.text }]}>{pl.today.registerDose}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={pl.common.close}
            onPress={onClose}
            style={[styles.close, { backgroundColor: c.surfaceElevated }]}
          >
            <CloseIcon color={c.text} />
          </Pressable>
        </View>
        <View style={styles.center}>
          <MedicationIconBadge icon={medication.icon} color={medication.color} boxSize={88} />
          <Text style={[styles.name, { color: c.text }]}>{medication.name}</Text>
          <Text style={[styles.sub, { color: c.textMuted }]}>{subtitle}</Text>
        </View>
        <Card padded={false} style={{ marginTop: 28 }}>
          <Pressable style={styles.timeRow} onPress={() => setPicking((open) => !open)}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.timeLabel, { color: c.textMuted }]}>
                {pl.today.intakeTime}
              </Text>
              <Text style={[styles.timeValue, { color: c.text }]}>
                {pl.today.takenNow.replace('{time}', formatHm(takenAt))}
              </Text>
            </View>
            <ChevronRightIcon color={c.faint} />
          </Pressable>
          {picking ? (
            <DateTimePicker
              value={takenAt}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(_, selected) => {
                if (Platform.OS === 'android') setPicking(false)
                if (selected) setTakenAt(selected)
              }}
            />
          ) : null}
        </Card>
        <Text style={[styles.hint, { color: c.textMuted }]}>{pl.today.intakeHint}</Text>
        <View style={{ marginTop: 22 }}>
          <Button
            label={pl.today.markTaken}
            onPress={() => onTaken(log.id, takenAt.toISOString())}
          />
          <Button
            label={pl.today.skipThis}
            variant="warning"
            onPress={() => onSkip(log.id)}
          />
        </View>
        <View style={{ height: 12 }} />
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  dim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(18,32,38,0.38)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 24,
    paddingBottom: 28,
  },
  grab: {
    width: 40,
    height: 5,
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 10,
  },
  bar: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 17,
    fontWeight: '500',
  },
  close: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
    marginTop: 28,
  },
  name: {
    marginTop: 18,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '300',
    letterSpacing: -0.6,
  },
  sub: {
    marginTop: 6,
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 18,
    gap: 12,
  },
  timeLabel: {
    fontSize: 15,
    marginBottom: 3,
  },
  timeValue: {
    fontSize: 19,
    fontWeight: '400',
  },
  hint: {
    marginTop: 12,
    marginHorizontal: 8,
    fontSize: 14,
    lineHeight: 20,
  },
})
