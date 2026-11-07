import type { WizardErrors, WizardFormState } from '@mediapp/core'
import { Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native'

import { useColorScheme } from '@/components/useColorScheme'
import { Card } from '@/src/components/ui/Card'
import { MinusIcon, PlusIcon } from '@/src/components/ui/icons'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'

type WizardStepStockProps = {
  form: WizardFormState
  errors: WizardErrors
  patch: (partial: Partial<WizardFormState>) => void
}

function Stepper({
  value,
  onChange,
  min,
}: {
  value: number
  onChange: (value: number) => void
  min: number
}) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  return (
    <View style={styles.mini}>
      <Pressable
        onPress={() => onChange(Math.max(min, value - 1))}
        style={[styles.round, { backgroundColor: c.track }]}
      >
        <MinusIcon color="#5F6E77" />
      </Pressable>
      <Text style={[styles.count, { color: c.text }]}>{value}</Text>
      <Pressable
        onPress={() => onChange(value + 1)}
        style={[styles.round, { backgroundColor: c.tint }]}
      >
        <PlusIcon color={c.brand} size={16} />
      </Pressable>
    </View>
  )
}

export function WizardStepStock({ form, errors, patch }: WizardStepStockProps) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const showReminders = form.scheduleType !== 'asNeeded'

  return (
    <View>
      <Card padded={false} style={{ marginTop: 30 }}>
        <View style={[styles.row, { borderBottomWidth: form.trackStock ? 1 : 0, borderBottomColor: c.line }]}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={[styles.title, { color: c.text }]}>{pl.wizard.trackTitle}</Text>
            <Text style={[styles.hint, { color: c.textMuted }]}>{pl.wizard.trackHint}</Text>
          </View>
          <Switch
            value={form.trackStock}
            onValueChange={(trackStock) => patch({ trackStock })}
            trackColor={{ false: c.track, true: c.brand }}
          />
        </View>
        {form.trackStock ? (
          <>
            <View style={[styles.row, { borderBottomColor: c.line }]}>
              <Text style={[styles.plain, { color: c.text }]}>{pl.wizard.inPack}</Text>
              <Stepper
                value={form.stockRemaining}
                min={0}
                onChange={(stockRemaining) => patch({ stockRemaining })}
              />
            </View>
            {errors.stockRemaining ? (
              <Text style={styles.error}>{errors.stockRemaining}</Text>
            ) : null}
            <View style={[styles.row, { borderBottomWidth: 0 }]}>
              <Text style={[styles.plain, { color: c.text }]}>{pl.wizard.perDose}</Text>
              <Stepper
                value={form.stockUnitsPerIntake}
                min={1}
                onChange={(stockUnitsPerIntake) => patch({ stockUnitsPerIntake })}
              />
            </View>
            {errors.stockUnitsPerIntake ? (
              <Text style={styles.error}>{errors.stockUnitsPerIntake}</Text>
            ) : null}
          </>
        ) : null}
      </Card>

      {showReminders ? (
        <>
          <Text style={[styles.section, { color: c.textMuted }]}>{pl.wizard.remindersTitle}</Text>
          <Card padded={false}>
            <View style={[styles.row, { borderBottomWidth: 0 }]}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={[styles.title, { color: c.text }]}>{pl.wizard.remindRow}</Text>
                <Text style={[styles.hint, { color: c.textMuted }]}>{pl.wizard.remindHint}</Text>
              </View>
              <Switch
                value={form.remindersEnabled}
                onValueChange={(remindersEnabled) => patch({ remindersEnabled })}
                trackColor={{ false: c.track, true: c.brand }}
              />
            </View>
          </Card>
        </>
      ) : null}

      <Text style={[styles.section, { color: c.textMuted }]}>{pl.wizard.fields.purpose}</Text>
      <Card>
        <TextInput
          value={form.purpose}
          onChangeText={(purpose) => patch({ purpose })}
          placeholder={pl.wizard.fields.purpose}
          placeholderTextColor={c.faint}
          style={{ color: c.text, fontSize: 16, minHeight: 28 }}
        />
      </Card>
      <Text style={[styles.section, { color: c.textMuted }]}>{pl.wizard.fields.note}</Text>
      <Card>
        <TextInput
          value={form.note}
          onChangeText={(note) => patch({ note })}
          placeholder={pl.wizard.fields.note}
          placeholderTextColor={c.faint}
          multiline
          style={{ color: c.text, fontSize: 16, minHeight: 44 }}
        />
      </Card>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: { fontSize: 17, fontWeight: '500' },
  plain: { fontSize: 17, fontWeight: '400', flex: 1 },
  hint: { marginTop: 3, fontSize: 15, lineHeight: 20 },
  section: {
    marginTop: 26,
    marginBottom: 12,
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  mini: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  round: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: { fontSize: 18, fontWeight: '400', minWidth: 28, textAlign: 'center' },
  error: { color: '#C22E40', fontSize: 13, paddingHorizontal: 22 },
})
