import { useState } from 'react'
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import type { Schedule, WizardErrors, WizardFormState } from '@mediapp/core'

import { useColorScheme } from '@/components/useColorScheme'
import { FormDateField } from '@/src/components/medication/FormDateField'
import { FormTextField } from '@/src/components/medication/FormTextField'
import { Card } from '@/src/components/ui/Card'
import { CheckIcon, MinusIcon, PlusIcon } from '@/src/components/ui/icons'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'
import { softShadow } from '@/src/theme/tokens'

const SCHEDULES: Schedule['type'][] = [
  'daily',
  'weekdays',
  'everyNDays',
  'weekly',
  'monthly',
  'cycle',
  'asNeeded',
]

const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0] as const
const DAY_NAME = ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So']
const PRESET_TIMES = ['08:00', '12:00', '16:00', '20:00', '09:00', '22:00']

function readTimes(raw: string): string[] {
  return raw
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
}

function writeTimes(times: string[]): string {
  return times.join(', ')
}

function nextTime(existing: string[]): string {
  return PRESET_TIMES.find((time) => !existing.includes(time)) ?? '08:00'
}

function timeToDate(value: string): Date {
  const [hour, minute] = value.split(':').map(Number)
  const date = new Date()
  date.setHours(hour || 8, minute || 0, 0, 0)
  return date
}

function dateToTime(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

type WizardStepScheduleProps = {
  form: WizardFormState
  errors: WizardErrors
  patch: (partial: Partial<WizardFormState>) => void
  toggleWeekday: (day: number) => void
}

export function WizardStepSchedule({
  form,
  errors,
  patch,
  toggleWeekday,
}: WizardStepScheduleProps) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const [pickingType, setPickingType] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const times = readTimes(form.timesRaw)
  const asNeeded = form.scheduleType === 'asNeeded'

  const setTimes = (next: string[]) => patch({ timesRaw: writeTimes(next) })

  const chooseType = (scheduleType: Schedule['type']) => {
    const partial: Partial<WizardFormState> = { scheduleType }
    if (scheduleType === 'asNeeded') partial.remindersEnabled = false
    else if (form.scheduleType === 'asNeeded') partial.remindersEnabled = true
    patch(partial)
    setPickingType(false)
  }

  if (pickingType) {
    return (
      <View style={styles.list}>
        {SCHEDULES.map((type) => {
          const selected = form.scheduleType === type
          return (
            <Pressable
              key={type}
              onPress={() => chooseType(type)}
              style={[
                styles.opt,
                softShadow(scheme),
                {
                  backgroundColor: selected ? c.tint : c.surfaceElevated,
                  borderColor: selected ? c.brand : 'transparent',
                },
              ]}
            >
              <Text style={{ fontSize: 17, color: c.text }}>{pl.wizard.schedules[type]}</Text>
              <View
                style={[
                  styles.radio,
                  {
                    backgroundColor: selected ? c.brand : 'transparent',
                    borderColor: selected ? c.brand : c.faint,
                  },
                ]}
              >
                {selected ? <CheckIcon color="#ffffff" size={15} /> : null}
              </View>
            </Pressable>
          )
        })}
      </View>
    )
  }

  return (
    <View>
      <Card padded={false} style={{ marginTop: 28 }}>
        <View style={styles.summary}>
          <Text style={[styles.summaryTitle, { color: c.text }]}>
            {form.scheduleType ? pl.wizard.schedules[form.scheduleType] : pl.wizard.notSelected}
          </Text>
          <Pressable onPress={() => setPickingType(true)}>
            <Text style={{ color: c.brand, fontSize: 16, fontWeight: '500' }}>{pl.wizard.change}</Text>
          </Pressable>
        </View>

        {form.scheduleType === 'daily' || form.scheduleType === 'weekdays' ? (
          <View style={styles.days}>
            {DAY_ORDER.map((day) => {
              const active = form.scheduleType === 'daily' || form.weekdayDays.includes(day)
              return (
                <Pressable
                  key={day}
                  disabled={form.scheduleType === 'daily'}
                  onPress={() => toggleWeekday(day)}
                  style={[
                    styles.day,
                    { backgroundColor: active ? c.tint : c.track },
                  ]}
                >
                  <Text style={{ color: active ? c.brandDark : c.textMuted, fontWeight: '500', fontSize: 13 }}>
                    {DAY_NAME[day]}
                  </Text>
                </Pressable>
              )
            })}
          </View>
        ) : null}

        {form.scheduleType === 'everyNDays' ? (
          <View style={styles.pad}>
            <FormTextField
              label={pl.wizard.fields.everyNDays}
              value={String(form.everyNInterval)}
              onChangeText={(value) => patch({ everyNInterval: Number(value) || 2 })}
              keyboardType="number-pad"
              error={errors.everyN}
            />
          </View>
        ) : null}

        {form.scheduleType === 'weekly' ? (
          <View style={styles.days}>
            {DAY_ORDER.map((day) => {
              const active = form.weeklyDay === day
              return (
                <Pressable
                  key={day}
                  onPress={() => patch({ weeklyDay: day })}
                  style={[styles.day, { backgroundColor: active ? c.tint : c.track }]}
                >
                  <Text style={{ color: active ? c.brandDark : c.textMuted, fontSize: 12 }}>
                    {DAY_NAME[day]}
                  </Text>
                </Pressable>
              )
            })}
          </View>
        ) : null}

        {form.scheduleType === 'monthly' ? (
          <View style={styles.pad}>
            <FormTextField
              label={pl.wizard.fields.monthlyDay}
              value={String(form.monthlyDay)}
              onChangeText={(value) => patch({ monthlyDay: Number(value) || 1 })}
              keyboardType="number-pad"
            />
          </View>
        ) : null}

        {form.scheduleType === 'cycle' ? (
          <View style={[styles.pad, { flexDirection: 'row', gap: 12 }]}>
            <View style={{ flex: 1 }}>
              <FormTextField
                label={pl.wizard.fields.cycleActive}
                value={String(form.cycleActive)}
                onChangeText={(value) => patch({ cycleActive: Number(value) || 1 })}
                keyboardType="number-pad"
              />
            </View>
            <View style={{ flex: 1 }}>
              <FormTextField
                label={pl.wizard.fields.cycleBreak}
                value={String(form.cycleBreak)}
                onChangeText={(value) => patch({ cycleBreak: Number(value) || 1 })}
                keyboardType="number-pad"
              />
            </View>
          </View>
        ) : null}

        {!asNeeded
          ? times.map((time, index) => (
              <View
                key={`${time}-${index}`}
                style={[styles.timeRow, { borderTopColor: c.line }]}
              >
                <Pressable
                  onPress={() => setTimes(times.filter((_, item) => item !== index))}
                  style={styles.minus}
                >
                  <MinusIcon color="#D13A4B" />
                </Pressable>
                <Pressable
                  onPress={() => setEditingIndex(index)}
                  style={[styles.timePill, { backgroundColor: c.track }]}
                >
                  <Text style={{ fontSize: 20, color: c.text }}>{time}</Text>
                </Pressable>
                <Text style={[styles.doseLink, { color: c.brand }]}>{form.doseText}</Text>
              </View>
            ))
          : null}

        {!asNeeded ? (
          <Pressable
            onPress={() => setTimes([...times, nextTime(times)])}
            style={styles.addRow}
          >
            <View style={[styles.add, { backgroundColor: c.tint }]}>
              <PlusIcon color={c.brand} size={16} />
            </View>
            <Text style={{ color: c.brand, fontSize: 16, fontWeight: '500' }}>
              {pl.wizard.addTime}
            </Text>
          </Pressable>
        ) : null}

        {editingIndex != null && times[editingIndex] ? (
          <DateTimePicker
            value={timeToDate(times[editingIndex])}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_, selected) => {
              if (Platform.OS === 'android') setEditingIndex(null)
              if (!selected || editingIndex == null) return
              const next = [...times]
              next[editingIndex] = dateToTime(selected)
              setTimes(next)
            }}
          />
        ) : null}
        {editingIndex != null && Platform.OS === 'ios' ? (
          <Pressable onPress={() => setEditingIndex(null)} style={styles.done}>
            <Text style={{ color: c.brand, fontWeight: '500' }}>{pl.common.close}</Text>
          </Pressable>
        ) : null}
      </Card>
      {errors.times ? <Text style={styles.error}>{errors.times}</Text> : null}
      {errors.weekdays ? <Text style={styles.error}>{errors.weekdays}</Text> : null}
      {errors.scheduleType ? <Text style={styles.error}>{errors.scheduleType}</Text> : null}

      <Text style={[styles.duration, { color: c.textMuted }]}>{pl.wizard.duration}</Text>
      <Card padded={false}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, padding: 20 }}>
            <FormDateField
              bare
              label={pl.wizard.dateStartShort}
              value={form.dateStart}
              onChange={(dateStart) => patch({ dateStart })}
            />
          </View>
          <View style={{ width: 1, backgroundColor: c.line }} />
          <View style={{ flex: 1, padding: 20 }}>
            <FormDateField
              bare
              label={pl.wizard.dateEndShort}
              value={form.dateEnd}
              emptyLabel={pl.wizard.noEnd}
              onChange={(dateEnd) => patch({ dateEnd })}
            />
          </View>
        </View>
      </Card>
    </View>
  )
}

const styles = StyleSheet.create({
  list: { marginTop: 28, gap: 12 },
  opt: {
    height: 64,
    borderRadius: 24,
    borderWidth: 1.5,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  radio: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 6,
  },
  summaryTitle: { fontSize: 18, fontWeight: '500' },
  days: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 6,
  },
  day: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pad: { paddingHorizontal: 22, paddingTop: 12 },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderTopWidth: 1,
  },
  minus: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FDE9EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timePill: {
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 16,
    justifyContent: 'center',
  },
  doseLink: { marginLeft: 'auto', fontSize: 16, fontWeight: '500' },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 22,
    paddingVertical: 16,
  },
  add: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  done: { alignSelf: 'flex-end', padding: 12 },
  error: { marginTop: 8, color: '#C22E40', fontSize: 13 },
  duration: {
    marginTop: 26,
    marginBottom: 12,
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
})
