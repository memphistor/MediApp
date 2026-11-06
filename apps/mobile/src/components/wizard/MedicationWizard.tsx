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
import { useRouter } from 'expo-router'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import { useColorScheme } from '@/components/useColorScheme'
import { WizardStepAppearance } from '@/src/components/wizard/WizardStepAppearance'
import { WizardStepDose } from '@/src/components/wizard/WizardStepDose'
import { WizardStepFormTiles } from '@/src/components/wizard/WizardStepFormTiles'
import { WizardStepKind } from '@/src/components/wizard/WizardStepKind'
import { WizardStepName } from '@/src/components/wizard/WizardStepName'
import { WizardStepSchedule } from '@/src/components/wizard/WizardStepSchedule'
import { WizardStepStock } from '@/src/components/wizard/WizardStepStock'
import { fallbackDose } from '@/src/components/wizard/doseText'
import { AppText } from '@/src/components/ui/AppText'
import { Button } from '@/src/components/ui/Button'
import { CircleButton } from '@/src/components/ui/CircleButton'
import { BackIcon, CloseIcon, FormGlyph } from '@/src/components/ui/icons'
import { useMedicationWizard } from '@/src/hooks/useMedicationWizard'
import { tabBeforeWizard } from '@/src/navigation/lastTab'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'

const TOTAL = 7

const TITLES = [
  pl.wizard.nameTitle,
  pl.wizard.kindTitle,
  pl.wizard.formTitle,
  pl.wizard.doseTitle,
  pl.wizard.scheduleTitle,
  pl.wizard.lookTitle,
  pl.wizard.stockTitle,
]

const HINTS = [
  pl.wizard.nameHint,
  pl.wizard.kindHint,
  pl.wizard.formHint,
  '',
  '',
  '',
  pl.wizard.stockLead,
]

type MedicationWizardProps = {
  medicationId?: string
}

export function MedicationWizard({ medicationId }: MedicationWizardProps) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const router = useRouter()
  const insets = useSafeAreaInsets()
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
    skipCurrent,
    isEdit,
  } = useMedicationWizard({ medicationId })

  const close = () => {
    if (isEdit) {
      router.back()
      return
    }
    const tab = tabBeforeWizard()
    if (tab === 'index') router.navigate('/(tabs)')
    else router.navigate(`/(tabs)/${tab}`)
  }

  const go = (action: () => boolean | void) => {
    action()
  }

  if (!hydrated) {
    return (
      <View style={[styles.centered, { backgroundColor: c.surface }]}>
        <ActivityIndicator color={c.brand} />
      </View>
    )
  }

  if (loadError) {
    return (
      <View style={[styles.centered, { backgroundColor: c.surface }]}>
        <AppText variant="secondary" tone="muted">{loadError}</AppText>
      </View>
    )
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.surface }]} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.head}>
          <CircleButton
            onPress={() => (step === 1 ? close() : go(goBack))}
            accessibilityLabel={step === 1 ? pl.wizard.close : pl.wizard.back}
          >
            {step === 1 ? <CloseIcon color={c.text} /> : <BackIcon color={c.text} />}
          </CircleButton>
          <View style={[styles.track, { backgroundColor: c.track }]}>
            <View
              style={[
                styles.fill,
                { width: `${(step / TOTAL) * 100}%`, backgroundColor: c.brand },
              ]}
            />
          </View>
          <Text style={[styles.step, { color: c.textMuted }]}>
            {step} {pl.wizard.of} {TOTAL}
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {step === 1 ? (
            <View style={[styles.mark, { backgroundColor: c.tint }]}>
              <FormGlyph name="capsule" color={c.brand} />
            </View>
          ) : null}
          <Text style={[styles.title, { color: c.text }]}>{TITLES[step - 1]}</Text>
          {HINTS[step - 1] ? (
            <Text style={[styles.hint, { color: c.textMuted }]}>{HINTS[step - 1]}</Text>
          ) : null}
          {saveError ? <Text style={styles.error}>{saveError}</Text> : null}

          {step === 1 ? (
            <WizardStepName form={form} errors={errors} patch={patch} />
          ) : null}
          {step === 2 ? <WizardStepKind form={form} patch={patch} /> : null}
          {step === 3 ? <WizardStepFormTiles form={form} patch={patch} /> : null}
          {step === 4 ? (
            <WizardStepDose form={form} errors={errors} patch={patch} />
          ) : null}
          {step === 5 ? (
            <WizardStepSchedule
              form={form}
              errors={errors}
              patch={patch}
              toggleWeekday={toggleWeekday}
            />
          ) : null}
          {step === 6 ? <WizardStepAppearance form={form} patch={patch} /> : null}
          {step === 7 ? (
            <WizardStepStock form={form} errors={errors} patch={patch} />
          ) : null}
        </ScrollView>

        <View style={[styles.cta, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <Button
            label={
              step < TOTAL
                ? pl.wizard.next
                : saving
                  ? pl.wizard.saving
                  : pl.wizard.save
            }
            disabled={saving}
            onPress={() => go(goNextOrSave)}
          />
          {step === 4 || step === 7 ? (
            <Pressable
              onPress={() => go(() => skipCurrent(fallbackDose(form.form)))}
              style={styles.skip}
            >
              <Text style={{ color: c.brand, fontSize: 16, fontWeight: '500' }}>
                {pl.wizard.skip}
              </Text>
            </Pressable>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 24,
    paddingTop: 6,
  },
  track: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 2 },
  step: { fontSize: 14, fontWeight: '500', minWidth: 36, textAlign: 'right' },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  mark: {
    width: 60,
    height: 60,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 36,
  },
  title: {
    marginTop: 22,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '300',
    letterSpacing: -0.8,
  },
  hint: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 22,
  },
  error: {
    marginTop: 12,
    color: '#C22E40',
    fontSize: 14,
  },
  cta: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  skip: {
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
