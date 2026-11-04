import type {
  MedicationForm,
  MedicationKind,
  WizardErrors,
  WizardFormState,
} from '@mediapp/core'
import { StyleSheet, Switch, Text, View } from 'react-native'

import { FormSelect } from '@/src/components/medication/FormSelect'
import { FormTextField } from '@/src/components/medication/FormTextField'
import { WizardSectionTitle } from '@/src/components/wizard/WizardSectionTitle'
import { pl } from '@/src/i18n/pl'
import { useColorScheme } from '@/components/useColorScheme'
import { themeColors } from '@/src/theme/colors'

const KIND_OPTIONS: MedicationKind[] = [
  'prescription',
  'otc',
  'supplement',
  'other',
]

const FORM_OPTIONS: MedicationForm[] = [
  'tablet',
  'capsule',
  'drops',
  'sachet',
  'injection',
  'liquid',
  'other',
]

type WizardStep1BasicProps = {
  form: WizardFormState
  errors: WizardErrors
  patch: (partial: Partial<WizardFormState>) => void
}

export function WizardStep1Basic({
  form,
  errors,
  patch,
}: WizardStep1BasicProps) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)

  return (
    <View style={styles.gap}>
      <WizardSectionTitle>{pl.wizard.sections.basic}</WizardSectionTitle>
      <FormTextField
        label={pl.wizard.fields.name}
        value={form.name}
        onChangeText={(name) => patch({ name })}
        error={errors.name}
        autoComplete="off"
      />
      <FormSelect
        label={pl.wizard.fields.kind}
        value={form.kind}
        options={KIND_OPTIONS.map((k) => ({
          value: k,
          label: pl.wizard.kinds[k],
        }))}
        onChange={(kind) => patch({ kind: kind as MedicationKind })}
        error={errors.kind}
      />
      <FormSelect
        label={pl.wizard.fields.form}
        value={form.form}
        options={FORM_OPTIONS.map((f) => ({
          value: f,
          label: pl.wizard.forms[f],
        }))}
        onChange={(f) => patch({ form: f as MedicationForm })}
        error={errors.form}
      />

      <WizardSectionTitle>{pl.wizard.sections.intake}</WizardSectionTitle>
      <FormTextField
        label={pl.wizard.fields.dose}
        value={form.doseText}
        onChangeText={(doseText) => patch({ doseText })}
        error={errors.doseText}
      />
      <FormSelect
        label={pl.wizard.fields.emptyStomach}
        value={form.emptyStomach}
        options={(['yes', 'no', 'na'] as const).map((v) => ({
          value: v,
          label: pl.wizard.emptyStomach[v],
        }))}
        onChange={(v) =>
          patch({ emptyStomach: v as WizardFormState['emptyStomach'] })
        }
        error={errors.emptyStomach}
      />
      <FormSelect
        label={pl.wizard.fields.meal}
        value={form.meal || 'skipped'}
        options={(['before', 'during', 'after', 'skipped'] as const).map(
          (v) => ({
            value: v,
            label: pl.wizard.meal[v],
          }),
        )}
        onChange={(v) => patch({ meal: v as WizardFormState['meal'] })}
      />

      <WizardSectionTitle>{pl.wizard.sections.stock}</WizardSectionTitle>
      <View style={styles.switchRow}>
        <Switch
          value={form.trackStock}
          onValueChange={(trackStock) => patch({ trackStock })}
        />
        <Text style={[styles.switchLabel, { color: c.text }]}>
          {pl.wizard.fields.trackStock}
        </Text>
      </View>
      {form.trackStock ? (
        <View style={styles.row}>
          <View style={styles.half}>
            <FormTextField
              label={pl.wizard.fields.stockRemaining}
              value={String(form.stockRemaining)}
              onChangeText={(t) =>
                patch({ stockRemaining: Number(t) || 0 })
              }
              keyboardType="number-pad"
              error={errors.stockRemaining}
            />
          </View>
          <View style={styles.half}>
            <FormTextField
              label={pl.wizard.fields.stockUnitsPerIntake}
              value={String(form.stockUnitsPerIntake)}
              onChangeText={(t) =>
                patch({ stockUnitsPerIntake: Number(t) || 1 })
              }
              keyboardType="number-pad"
              error={errors.stockUnitsPerIntake}
            />
          </View>
        </View>
      ) : null}
      <Text style={[styles.hint, { color: c.textMuted }]}>
        {pl.wizard.fields.stockHint}
      </Text>
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
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  switchLabel: {
    flex: 1,
    fontSize: 15,
  },
  hint: {
    fontSize: 13,
    lineHeight: 18,
  },
})
