import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { WizardStep1Basic } from '@/src/components/wizard/WizardStep1Basic'
import { WizardStep2Schedule } from '@/src/components/wizard/WizardStep2Schedule'
import { WizardStep3Appearance } from '@/src/components/wizard/WizardStep3Appearance'
import { useMedicationWizard } from '@/src/hooks/useMedicationWizard'
import { pl } from '@/src/i18n/pl'
import { useColorScheme } from '@/components/useColorScheme'
import { themeColors } from '@/src/theme/colors'

type MedicationWizardProps = {
  medicationId?: string
}

export function MedicationWizard({ medicationId }: MedicationWizardProps) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const {
    form,
    patch,
    errors,
    saveError,
    saving,
    step,
    hydrated,
    loadError,
    toggleWeekday,
    goNextOrSave,
    goBack,
    isEdit,
  } = useMedicationWizard({ medicationId })

  const stepTitle =
    step === 1
      ? pl.wizard.sections.basic
      : step === 2
        ? pl.wizard.sections.schedule
        : pl.wizard.sections.appearance

  if (!hydrated) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={c.brand} />
      </View>
    )
  }

  if (loadError) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: c.textMuted }}>{loadError}</Text>
      </View>
    )
  }

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: c.surface }]}
      edges={['bottom']}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.title, { color: c.text }]}>
            {isEdit ? pl.wizard.editTitle : pl.wizard.title}
          </Text>
          <Text style={[styles.stepLine, { color: c.textMuted }]}>
            {pl.wizard.step} {step} {pl.wizard.of} 3 — {stepTitle}
          </Text>

          {saveError ? (
            <Text style={styles.saveError}>{saveError}</Text>
          ) : null}

          {step === 1 ? (
            <WizardStep1Basic form={form} errors={errors} patch={patch} />
          ) : null}
          {step === 2 ? (
            <WizardStep2Schedule
              form={form}
              errors={errors}
              patch={patch}
              toggleWeekday={toggleWeekday}
            />
          ) : null}
          {step === 3 ? (
            <WizardStep3Appearance form={form} patch={patch} />
          ) : null}

          <View style={styles.actions}>
            {step > 1 ? (
              <Pressable
                onPress={goBack}
                style={[
                  styles.btnSecondary,
                  { borderColor: c.border },
                ]}
              >
                <Text style={[styles.btnSecondaryText, { color: c.text }]}>
                  {pl.wizard.back}
                </Text>
              </Pressable>
            ) : null}
            <Pressable
              onPress={goNextOrSave}
              disabled={saving}
              style={[
                styles.btnPrimary,
                { backgroundColor: c.brand, opacity: saving ? 0.6 : 1 },
                step === 1 ? styles.btnFull : styles.btnFlex,
              ]}
            >
              <Text style={styles.btnPrimaryText}>
                {step < 3
                  ? pl.wizard.next
                  : saving
                    ? pl.wizard.saving
                    : pl.wizard.save}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    padding: 16,
    paddingBottom: 32,
    gap: 16,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
  },
  stepLine: {
    fontSize: 14,
  },
  saveError: {
    color: '#dc2626',
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  btnPrimary: {
    minHeight: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  btnPrimaryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  btnSecondary: {
    flex: 1,
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSecondaryText: {
    fontWeight: '600',
    fontSize: 16,
  },
  btnFlex: {
    flex: 1,
  },
  btnFull: {
    flex: 1,
  },
})
