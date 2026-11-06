import type { MedicationForm, WizardFormState } from '@mediapp/core'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { useColorScheme } from '@/components/useColorScheme'
import { FormGlyph } from '@/src/components/ui/icons'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'
import { softShadow } from '@/src/theme/tokens'

const FORMS: MedicationForm[] = [
  'tablet',
  'capsule',
  'drops',
  'sachet',
  'injection',
  'liquid',
  'other',
]

type WizardStepFormProps = {
  form: WizardFormState
  patch: (partial: Partial<WizardFormState>) => void
}

export function WizardStepFormTiles({ form, patch }: WizardStepFormProps) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)

  return (
    <View style={styles.grid}>
      {FORMS.map((item) => {
        const selected = form.form === item
        const wide = item === 'other'
        return (
          <Pressable
            key={item}
            onPress={() => patch({ form: item })}
            style={[
              styles.tile,
              wide && styles.wide,
              softShadow(scheme),
              {
                backgroundColor: selected ? c.tint : c.surfaceElevated,
                borderColor: selected ? c.brand : 'transparent',
              },
            ]}
          >
            <FormGlyph name={item} color={selected ? c.brand : '#7E8D95'} size={28} />
            <Text style={{ fontSize: 17, color: c.text }}>{pl.wizard.forms[item]}</Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  grid: {
    marginTop: 36,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tile: {
    width: '48%',
    flexGrow: 1,
    height: 112,
    borderRadius: 28,
    borderWidth: 1.5,
    padding: 20,
    justifyContent: 'space-between',
  },
  wide: {
    width: '100%',
    height: 76,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 16,
  },
})
