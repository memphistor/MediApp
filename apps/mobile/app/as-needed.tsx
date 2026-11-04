import { View } from 'react-native'

import { AsNeededRow } from '@/src/components/as-needed/AsNeededRow'
import { AppText } from '@/src/components/ui/AppText'
import { Screen } from '@/src/components/ui/Screen'
import { useAsNeededMedications } from '@/src/hooks/useProgressData'
import { pl } from '@/src/i18n/pl'
import { space } from '@/src/theme/tokens'

export default function AsNeededScreen() {
  const medications = useAsNeededMedications()

  return (
    <Screen variant="stack">
      <AppText variant="secondary" tone="muted">
        {pl.asNeeded.intro}
      </AppText>
      {medications.length === 0 ? (
        <AppText
          variant="secondary"
          tone="muted"
          style={{ textAlign: 'center', marginTop: space.xl }}
        >
          {pl.asNeeded.empty}
        </AppText>
      ) : (
        <View style={{ marginTop: space.lg }}>
          {medications.map((med) => (
            <AsNeededRow key={med.id} med={med} />
          ))}
        </View>
      )}
    </Screen>
  )
}
