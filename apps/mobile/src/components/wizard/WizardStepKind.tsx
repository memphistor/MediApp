import type { MedicationKind, WizardFormState } from '@mediapp/core'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { useColorScheme } from '@/components/useColorScheme'
import { CheckIcon } from '@/src/components/ui/icons'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'
import { softShadow } from '@/src/theme/tokens'

const KINDS: MedicationKind[] = ['prescription', 'otc', 'supplement', 'other']

type WizardStepKindProps = {
  form: WizardFormState
  patch: (partial: Partial<WizardFormState>) => void
}

export function WizardStepKind({ form, patch }: WizardStepKindProps) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)

  return (
    <View style={styles.list}>
      {KINDS.map((kind) => {
        const selected = form.kind === kind
        return (
          <Pressable
            key={kind}
            onPress={() => patch({ kind })}
            style={[
              styles.opt,
              softShadow(scheme),
              {
                backgroundColor: selected ? c.tint : c.surfaceElevated,
                borderColor: selected ? c.brand : 'transparent',
              },
            ]}
          >
            <Text style={{ fontSize: 18, color: c.text }}>{pl.wizard.kinds[kind]}</Text>
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

const styles = StyleSheet.create({
  list: {
    marginTop: 36,
    gap: 12,
  },
  opt: {
    height: 68,
    borderRadius: 26,
    borderWidth: 1.5,
    paddingHorizontal: 24,
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
})
