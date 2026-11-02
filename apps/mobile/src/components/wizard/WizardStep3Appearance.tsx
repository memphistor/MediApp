import type { WizardFormState } from '@mediapp/core'
import { StyleSheet, Text, View } from 'react-native'

import { MedicationColorPicker } from '@/src/components/medication/MedicationColorPicker'
import { MedicationIconBadge } from '@/src/components/medication/MedicationIconBadge'
import { MedicationIconPicker } from '@/src/components/medication/MedicationIconPicker'
import { WizardSectionTitle } from '@/src/components/wizard/WizardSectionTitle'
import { useColorScheme } from '@/components/useColorScheme'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'

type WizardStep3AppearanceProps = {
  form: WizardFormState
  patch: (partial: Partial<WizardFormState>) => void
}

export function WizardStep3Appearance({
  form,
  patch,
}: WizardStep3AppearanceProps) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)

  return (
    <View style={styles.gap}>
      <WizardSectionTitle>{pl.wizard.sections.appearance}</WizardSectionTitle>
      <View
        style={[
          styles.preview,
          { borderColor: c.border, backgroundColor: c.surfaceElevated },
        ]}
      >
        <MedicationIconBadge icon={form.icon} color={form.color} size={28} />
        <Text style={[styles.previewText, { color: c.textMuted }]}>
          Podgląd na liście dziś
        </Text>
      </View>
      <Text style={[styles.legend, { color: c.text }]}>
        {pl.wizard.fields.color}
      </Text>
      <MedicationColorPicker
        value={form.color}
        onChange={(color) => patch({ color })}
      />
      <Text style={[styles.legend, { color: c.text, marginTop: 12 }]}>
        {pl.wizard.fields.icon}
      </Text>
      <MedicationIconPicker
        value={form.icon}
        onChange={(icon) => patch({ icon })}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  gap: {
    gap: 12,
  },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  previewText: {
    fontSize: 14,
  },
  legend: {
    fontSize: 14,
    fontWeight: '500',
  },
})
