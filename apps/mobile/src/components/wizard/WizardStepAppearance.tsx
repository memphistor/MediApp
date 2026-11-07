import type { WizardFormState } from '@mediapp/core'
import { StyleSheet, Text, View } from 'react-native'

import { useColorScheme } from '@/components/useColorScheme'
import { MedicationColorPicker } from '@/src/components/medication/MedicationColorPicker'
import { MedicationIconBadge } from '@/src/components/medication/MedicationIconBadge'
import { MedicationIconPicker } from '@/src/components/medication/MedicationIconPicker'
import { Card } from '@/src/components/ui/Card'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'

type WizardStepAppearanceProps = {
  form: WizardFormState
  patch: (partial: Partial<WizardFormState>) => void
}

export function WizardStepAppearance({ form, patch }: WizardStepAppearanceProps) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const formLabel = form.form ? pl.wizard.forms[form.form] : ''

  return (
    <View>
      <Card style={{ marginTop: 24 }}>
        <View style={styles.preview}>
          <MedicationIconBadge icon={form.icon} color={form.color} boxSize={56} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.name, { color: c.text }]} numberOfLines={1}>
              {form.name || pl.wizard.fields.name}
            </Text>
            <Text style={{ marginTop: 3, color: c.textMuted, fontSize: 15 }}>
              {formLabel}
              {form.doseText ? ` · ${form.doseText}` : ''}
            </Text>
          </View>
        </View>
      </Card>
      <Text style={[styles.label, { color: c.textMuted }]}>{pl.wizard.fields.color}</Text>
      <Card>
        <MedicationColorPicker value={form.color} onChange={(color) => patch({ color })} />
      </Card>
      <Text style={[styles.label, { color: c.textMuted }]}>{pl.wizard.fields.icon}</Text>
      <Card>
        <MedicationIconPicker
          value={form.icon}
          color={form.color}
          onChange={(icon) => patch({ icon })}
        />
      </Card>
    </View>
  )
}

const styles = StyleSheet.create({
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  name: {
    fontSize: 19,
    fontWeight: '500',
  },
  label: {
    marginTop: 26,
    marginBottom: 12,
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
})
