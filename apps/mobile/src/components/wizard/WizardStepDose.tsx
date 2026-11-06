import { useEffect, useRef } from 'react'
import type { WizardErrors, WizardFormState } from '@mediapp/core'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'

import { useColorScheme } from '@/components/useColorScheme'
import { ChoiceGroup } from '@/src/components/ui/ChoiceGroup'
import { MinusIcon, PlusIcon } from '@/src/components/ui/icons'
import { doseUnit, fallbackDose } from '@/src/components/wizard/doseText'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'
import { cardShadow } from '@/src/theme/tokens'

type WizardStepDoseProps = {
  form: WizardFormState
  errors: WizardErrors
  patch: (partial: Partial<WizardFormState>) => void
}

function leadingAmount(doseText: string): number {
  const match = doseText.trim().match(/^(\d+(?:[.,]\d+)?)/)
  if (!match) return 1
  const value = Number(match[1].replace(',', '.'))
  return Number.isFinite(value) && value > 0 ? value : 1
}

const COUNTED_DOSE =
  /^\d+(?:[.,]\d+)?(?:\s+(?:tabletka|tabl\.?|szt\.?|kapsułka|krople|saszetka|zastrzyk|ml|porcja))?$/i

function stepAmount(doseText: string, delta: number, unit: string): string {
  const next = Math.max(1, Math.round(leadingAmount(doseText) + delta))
  const trimmed = doseText.trim()
  if (!trimmed || COUNTED_DOSE.test(trimmed)) return `${next} ${unit}`
  if (/^\d+(?:[.,]\d+)?/.test(trimmed)) {
    return trimmed.replace(/^\d+(?:[.,]\d+)?/, String(next))
  }
  return `${next} ${unit}`
}

function amountFieldValue(doseText: string): string {
  const match = doseText.trim().match(/^(\d+(?:[.,]\d+)?)(?:\s+\S+)?$/)
  if (match && COUNTED_DOSE.test(doseText.trim())) return match[1]
  return doseText
}

export function WizardStepDose({ form, errors, patch }: WizardStepDoseProps) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const unit = doseUnit(form.form)
  const seeded = useRef(false)

  useEffect(() => {
    if (seeded.current) return
    seeded.current = true
    if (!form.doseText.trim()) {
      patch({ doseText: fallbackDose(form.form) })
    }
  }, [form.doseText, form.form, patch])

  return (
    <View>
      <View style={[styles.stepper, cardShadow(scheme), { backgroundColor: c.surfaceElevated }]}>
        <View style={styles.row}>
          <Pressable
            accessibilityLabel="-"
            onPress={() => patch({ doseText: stepAmount(form.doseText, -1, unit) })}
            style={[styles.round, { backgroundColor: c.track }]}
          >
            <MinusIcon color="#5F6E77" size={22} />
          </Pressable>
          <TextInput
            value={amountFieldValue(form.doseText)}
            onChangeText={(text) => {
              const trimmed = text.trim()
              if (trimmed === '' || /^\d+(?:[.,]\d+)?$/.test(trimmed)) {
                patch({ doseText: trimmed ? `${trimmed} ${unit}` : '' })
                return
              }
              patch({ doseText: text })
            }}
            keyboardType="decimal-pad"
            style={[styles.amount, { color: c.text }]}
          />
          <Pressable
            accessibilityLabel="+"
            onPress={() => patch({ doseText: stepAmount(form.doseText, 1, unit) })}
            style={[styles.round, { backgroundColor: c.tint }]}
          >
            <PlusIcon color={c.brand} size={22} />
          </Pressable>
        </View>
        <Text style={[styles.unit, { color: c.textMuted }]}>{unit}</Text>
      </View>
      {errors.doseText ? <Text style={styles.error}>{errors.doseText}</Text> : null}

      <Text style={[styles.label, { color: c.textMuted }]}>{pl.wizard.fasting}</Text>
      <ChoiceGroup
        value={form.emptyStomach || 'na'}
        options={(['yes', 'no', 'na'] as const).map((value) => ({
          value,
          label: pl.wizard.emptyStomach[value],
        }))}
        onChange={(emptyStomach) =>
          patch({ emptyStomach: emptyStomach as WizardFormState['emptyStomach'] })
        }
        error={errors.emptyStomach}
      />

      <Text style={[styles.label, { color: c.textMuted }]}>{pl.wizard.mealRelation}</Text>
      <ChoiceGroup
        value={form.meal || 'skipped'}
        options={(['before', 'during', 'after', 'skipped'] as const).map((value) => ({
          value,
          label: pl.wizard.mealShort[value],
        }))}
        onChange={(meal) => patch({ meal: meal as WizardFormState['meal'] })}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  stepper: {
    marginTop: 30,
    borderRadius: 32,
    paddingVertical: 26,
    paddingHorizontal: 22,
    alignItems: 'center',
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  round: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amount: {
    flex: 1,
    textAlign: 'center',
    fontSize: 64,
    lineHeight: 72,
    fontWeight: '200',
    letterSpacing: -2,
  },
  unit: {
    marginTop: 2,
    fontSize: 17,
  },
  label: {
    marginTop: 28,
    marginBottom: 12,
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  error: {
    marginTop: 8,
    color: '#C22E40',
    fontSize: 13,
  },
})
