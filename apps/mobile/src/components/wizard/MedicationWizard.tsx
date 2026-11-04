import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { WizardStep1Basic } from '@/src/components/wizard/WizardStep1Basic'
import { WizardStep2Schedule } from '@/src/components/wizard/WizardStep2Schedule'
import { WizardStep3Appearance } from '@/src/components/wizard/WizardStep3Appearance'
import { AppText } from '@/src/components/ui/AppText'
import { Button } from '@/src/components/ui/Button'
import { useMedicationWizard } from '@/src/hooks/useMedicationWizard'
import { pl } from '@/src/i18n/pl'
import { useColorScheme } from '@/components/useColorScheme'
import { themeColors } from '@/src/theme/colors'
import { space } from '@/src/theme/tokens'

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
        <AppText variant="secondary" tone="muted">{loadError}</AppText>
      </View>
    )
  }

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: c.surface }]}
      edges={isEdit ? [] : ['top']}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          contentInsetAdjustmentBehavior={isEdit ? 'automatic' : 'never'}
          keyboardShouldPersistTaps="handled"
        >
          {isEdit ? null : (
            <AppText variant="title">{pl.wizard.title}</AppText>
          )}
          <AppText
            variant="secondary"
            tone="muted"
            style={{ marginTop: isEdit ? 0 : space.sm }}
          >
            {pl.wizard.step} {step} {pl.wizard.of} 3 — {stepTitle}
          </AppText>

          {saveError ? (
            <AppText variant="secondary" style={styles.saveError}>
              {saveError}
            </AppText>
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
              <Button label={pl.wizard.back} variant="text" onPress={goBack} />
            ) : (
              <View />
            )}
            <Button
              label={
                step < 3
                  ? pl.wizard.next
                  : saving
                    ? pl.wizard.saving
                    : pl.wizard.save
              }
              disabled={saving}
              onPress={goNextOrSave}
              style={styles.btnNext}
            />
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
    paddingHorizontal: space.xl,
    paddingTop: space.lg,
    paddingBottom: 120,
    gap: space.lg,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveError: {
    color: '#dc2626',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.sm,
    marginTop: space.sm,
  },
  btnNext: {
    alignSelf: 'flex-end',
    minWidth: 140,
  },
})
