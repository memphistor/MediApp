import { StyleSheet, Text } from 'react-native'
import { validateWizard, type WizardFormState } from '@mediapp/core'

import { PlaceholderScreen } from '@/components/PlaceholderScreen'
import { useColorScheme } from '@/components/useColorScheme'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'

/** Proof that @mediapp/core is wired in the mobile bundle. */
const emptyWizard: WizardFormState = {
  name: '',
  kind: 'otc',
  form: 'tablet',
  doseText: '',
  emptyStomach: 'na',
  meal: '',
  timesRaw: '',
  scheduleType: 'daily',
  weekdayDays: [1, 2, 3, 4, 5],
  everyNInterval: 2,
  weeklyDay: 1,
  monthlyDay: 1,
  cycleActive: 21,
  cycleBreak: 7,
  dateStart: '',
  dateEnd: '',
  purpose: '',
  note: '',
  color: '#0f766e',
  icon: '💊',
  trackStock: false,
  stockRemaining: 30,
  stockUnitsPerIntake: 1,
  remindersEnabled: true,
}

export default function TodayScreen() {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const errors = validateWizard(emptyWizard)
  const errorCount = Object.keys(errors).length

  return (
    <PlaceholderScreen title={pl.nav.today}>
      <Text style={[styles.meta, { color: c.textMuted }]}>
        @mediapp/core: walidacja pustego kreatora → {errorCount} błędów (oczekiwane
        &gt; 0)
      </Text>
    </PlaceholderScreen>
  )
}

const styles = StyleSheet.create({
  meta: {
    marginTop: 16,
    fontSize: 13,
    lineHeight: 18,
  },
})
