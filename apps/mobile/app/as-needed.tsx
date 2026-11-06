import { Pressable, View } from 'react-native'
import { useRouter } from 'expo-router'
import * as Haptics from 'expo-haptics'
import type { MedicationEntry } from '@mediapp/core'

import { useColorScheme } from '@/components/useColorScheme'
import { MedicationIconBadge } from '@/src/components/medication/MedicationIconBadge'
import { AppText } from '@/src/components/ui/AppText'
import { Card } from '@/src/components/ui/Card'
import { CircleButton } from '@/src/components/ui/CircleButton'
import { BackIcon, PlusIcon } from '@/src/components/ui/icons'
import { Screen } from '@/src/components/ui/Screen'
import { useStorage } from '@/src/context/StorageContext'
import { useAsNeededMedications } from '@/src/hooks/useProgressData'
import { pl } from '@/src/i18n/pl'
import { logAsNeededIntake } from '@/src/storage/repositories/doseLogRepository'
import { themeColors } from '@/src/theme/colors'

function AsNeededLine({
  med,
  divider,
}: {
  med: MedicationEntry
  divider: boolean
}) {
  const router = useRouter()
  const { bumpRefresh } = useStorage()
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingHorizontal: 22,
        paddingVertical: 18,
        borderTopWidth: divider ? 1 : 0,
        borderTopColor: c.line,
      }}
    >
      <Pressable onPress={() => router.push(`/medication/${med.id}`)}>
        <MedicationIconBadge icon={med.icon} color={med.color} boxSize={52} />
      </Pressable>
      <Pressable style={{ flex: 1 }} onPress={() => router.push(`/medication/${med.id}`)}>
        <AppText variant="body" style={{ fontWeight: '500' }}>{med.name}</AppText>
        <AppText variant="secondary" tone="muted" style={{ marginTop: 3 }}>
          {pl.wizard.forms[med.form]} · {med.doseText}
        </AppText>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={pl.today.logIntake}
        onPress={() => {
          void logAsNeededIntake(med.id).then(async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            bumpRefresh()
          })
        }}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: c.tint,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <PlusIcon color={c.brand} />
      </Pressable>
    </View>
  )
}

export default function AsNeededScreen() {
  const medications = useAsNeededMedications()
  const router = useRouter()
  const c = themeColors(useColorScheme() ?? 'light')

  return (
    <Screen variant="stack" topSafe>
      <CircleButton onPress={() => router.back()} accessibilityLabel={pl.wizard.back}>
        <BackIcon color={c.text} />
      </CircleButton>
      <AppText variant="title" style={{ marginTop: 28 }}>
        {pl.asNeeded.title}
      </AppText>
      <AppText variant="secondary" tone="muted" style={{ marginTop: 10, lineHeight: 23 }}>
        {pl.asNeeded.intro}
      </AppText>
      <AppText variant="caption" tone="muted" style={{ marginTop: 40, marginBottom: 12 }}>
        {pl.asNeeded.yours}
      </AppText>
      {medications.length === 0 ? (
        <AppText variant="secondary" tone="muted">
          {pl.asNeeded.empty}
        </AppText>
      ) : (
        <Card padded={false}>
          {medications.map((med, index) => (
            <AsNeededLine key={med.id} med={med} divider={index > 0} />
          ))}
        </Card>
      )}
      <AppText variant="caption" tone="muted" style={{ marginTop: 18, lineHeight: 21 }}>
        {pl.asNeeded.plusHint}
      </AppText>
    </Screen>
  )
}
