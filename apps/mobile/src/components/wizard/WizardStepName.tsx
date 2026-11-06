import type { WizardErrors, WizardFormState } from '@mediapp/core'
import { StyleSheet, Text, TextInput, View } from 'react-native'

import { useColorScheme } from '@/components/useColorScheme'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'
import { cardShadow } from '@/src/theme/tokens'

type WizardStepNameProps = {
  form: WizardFormState
  errors: WizardErrors
  patch: (partial: Partial<WizardFormState>) => void
}

export function WizardStepName({ form, errors, patch }: WizardStepNameProps) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)

  return (
    <View>
      <View
        style={[
          styles.field,
          cardShadow(scheme),
          {
            backgroundColor: c.surfaceElevated,
            borderColor: errors.name ? '#C22E40' : 'rgba(11,135,123,0.28)',
          },
        ]}
      >
        <Text style={{ color: c.brand, fontSize: 13, fontWeight: '500' }}>
          {pl.wizard.fields.name}
        </Text>
        <TextInput
          value={form.name}
          onChangeText={(name) => patch({ name })}
          autoFocus
          autoComplete="off"
          placeholder="Wpisz nazwę"
          placeholderTextColor={c.faint}
          style={[styles.input, { color: c.text }]}
        />
      </View>
      {errors.name ? <Text style={styles.error}>{errors.name}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  field: {
    marginTop: 36,
    height: 92,
    borderRadius: 28,
    borderWidth: 2,
    paddingHorizontal: 26,
    justifyContent: 'center',
  },
  input: {
    marginTop: 2,
    padding: 0,
    fontSize: 28,
    fontWeight: '300',
    letterSpacing: -0.5,
  },
  error: {
    marginTop: 8,
    marginLeft: 8,
    color: '#C22E40',
    fontSize: 13,
  },
})
