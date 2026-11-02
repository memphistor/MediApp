import type { Schedule, WizardErrors, WizardFormState } from '@mediapp/core'
import { StyleSheet, Switch, Text, View } from 'react-native'

import { FormDateField } from '@/src/components/medication/FormDateField'
import { FormSelect } from '@/src/components/medication/FormSelect'
import { FormTextField } from '@/src/components/medication/FormTextField'
import { WeekdayToggleRow } from '@/src/components/medication/WeekdayToggleRow'
import { WizardSectionTitle } from '@/src/components/wizard/WizardSectionTitle'
import { useColorScheme } from '@/components/useColorScheme'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'

const DAY_LABELS = ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So']

const SCHEDULE_OPTIONS: Schedule['type'][] = [
  'daily',
  'weekdays',
  'everyNDays',
  'weekly',
  'monthly',
  'cycle',
  'asNeeded',
]

type WizardStep2ScheduleProps = {
  form: WizardFormState
  errors: WizardErrors
  patch: (partial: Partial<WizardFormState>) => void
  toggleWeekday: (day: number) => void
}

export function WizardStep2Schedule({
  form,
  errors,
  patch,
  toggleWeekday,
}: WizardStep2ScheduleProps) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)

  return (
    <View style={styles.gap}>
      <WizardSectionTitle>{pl.wizard.sections.schedule}</WizardSectionTitle>
      <FormSelect
        label={pl.wizard.fields.schedule}
        value={form.scheduleType}
        options={SCHEDULE_OPTIONS.map((t) => ({
          value: t,
          label: pl.wizard.schedules[t],
        }))}
        onChange={(t) => {
          const scheduleType = t as Schedule['type']
          const partial: Partial<WizardFormState> = { scheduleType }
          if (scheduleType === 'asNeeded') {
            partial.remindersEnabled = false
          } else if (form.scheduleType === 'asNeeded') {
            partial.remindersEnabled = true
          }
          patch(partial)
        }}
        error={errors.scheduleType}
      />

      {form.scheduleType !== 'asNeeded' ? (
        <>
          <FormTextField
            label={pl.wizard.fields.times}
            value={form.timesRaw}
            onChangeText={(timesRaw) => patch({ timesRaw })}
            placeholder="07:30, 20:00"
            error={errors.times}
          />
          <View style={styles.reminderBox}>
            <Switch
              value={form.remindersEnabled}
              onValueChange={(remindersEnabled) =>
                patch({ remindersEnabled })
              }
            />
            <View style={styles.reminderText}>
              <Text style={[styles.reminderTitle, { color: c.text }]}>
                {pl.wizard.fields.remindersEnable}
              </Text>
              <Text style={[styles.hint, { color: c.textMuted }]}>
                {pl.wizard.fields.remindersHint}
              </Text>
            </View>
          </View>
        </>
      ) : null}

      {form.scheduleType === 'weekdays' ? (
        <View>
          <Text style={[styles.label, { color: c.text }]}>
            {pl.wizard.fields.weekdays}
          </Text>
          <WeekdayToggleRow
            selected={form.weekdayDays}
            onToggle={toggleWeekday}
          />
          {errors.weekdays ? (
            <Text style={styles.error}>{errors.weekdays}</Text>
          ) : null}
        </View>
      ) : null}

      {form.scheduleType === 'everyNDays' ? (
        <FormTextField
          label={pl.wizard.fields.everyNDays}
          value={String(form.everyNInterval)}
          onChangeText={(t) =>
            patch({ everyNInterval: Number(t) || 2 })
          }
          keyboardType="number-pad"
          error={errors.everyN}
        />
      ) : null}

      {form.scheduleType === 'weekly' ? (
        <FormSelect
          label={pl.wizard.fields.weeklyDay}
          value={String(form.weeklyDay)}
          options={DAY_LABELS.map((label, day) => ({
            value: String(day),
            label,
          }))}
          onChange={(v) => patch({ weeklyDay: Number(v) })}
        />
      ) : null}

      {form.scheduleType === 'monthly' ? (
        <FormTextField
          label={pl.wizard.fields.monthlyDay}
          value={String(form.monthlyDay)}
          onChangeText={(t) => patch({ monthlyDay: Number(t) || 1 })}
          keyboardType="number-pad"
        />
      ) : null}

      {form.scheduleType === 'cycle' ? (
        <View style={styles.row}>
          <View style={styles.half}>
            <FormTextField
              label={pl.wizard.fields.cycleActive}
              value={String(form.cycleActive)}
              onChangeText={(t) =>
                patch({ cycleActive: Number(t) || 1 })
              }
              keyboardType="number-pad"
            />
          </View>
          <View style={styles.half}>
            <FormTextField
              label={pl.wizard.fields.cycleBreak}
              value={String(form.cycleBreak)}
              onChangeText={(t) =>
                patch({ cycleBreak: Number(t) || 1 })
              }
              keyboardType="number-pad"
            />
          </View>
        </View>
      ) : null}

      <View style={styles.row}>
        <FormDateField
          label={pl.wizard.fields.dateFrom}
          value={form.dateStart}
          onChange={(dateStart) => patch({ dateStart })}
        />
        <FormDateField
          label={pl.wizard.fields.dateTo}
          value={form.dateEnd}
          onChange={(dateEnd) => patch({ dateEnd })}
        />
      </View>

      <WizardSectionTitle>{pl.wizard.sections.notes}</WizardSectionTitle>
      <FormTextField
        label={pl.wizard.fields.purpose}
        value={form.purpose}
        onChangeText={(purpose) => patch({ purpose })}
        placeholder="np. tarczyca, odporność"
      />
      <FormTextField
        label={pl.wizard.fields.note}
        value={form.note}
        onChangeText={(note) => patch({ note })}
        multiline
      />
    </View>
  )
}

const styles = StyleSheet.create({
  gap: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  half: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  error: {
    marginTop: 4,
    fontSize: 12,
    color: '#dc2626',
  },
  hint: {
    fontSize: 12,
    marginTop: 4,
  },
  reminderBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  reminderText: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
})
