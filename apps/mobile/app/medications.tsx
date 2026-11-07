import { useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'
import { useRouter } from 'expo-router'
import type { MedicationEntry } from '@mediapp/core'

import { useColorScheme } from '@/components/useColorScheme'
import { MedicationIconBadge } from '@/src/components/medication/MedicationIconBadge'
import { AppText } from '@/src/components/ui/AppText'
import { Card } from '@/src/components/ui/Card'
import { CircleButton } from '@/src/components/ui/CircleButton'
import { BackIcon, ChevronRightIcon, PlusIcon } from '@/src/components/ui/icons'
import { Screen } from '@/src/components/ui/Screen'
import { useStorage } from '@/src/context/StorageContext'
import { pl } from '@/src/i18n/pl'
import { listMedications } from '@/src/storage/repositories/medicationRepository'
import { themeColors } from '@/src/theme/colors'

export default function MedicationsScreen() {
  const router = useRouter()
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const { refreshKey } = useStorage()
  const [medications, setMedications] = useState<MedicationEntry[] | null>(null)

  useEffect(() => {
    let cancelled = false
    void listMedications().then((rows) => {
      if (cancelled) return
      setMedications(
        rows.slice().sort((a, b) => a.name.localeCompare(b.name, 'pl')),
      )
    })
    return () => {
      cancelled = true
    }
  }, [refreshKey])

  return (
    <Screen variant="stack" topSafe>
      <CircleButton onPress={() => router.back()} accessibilityLabel={pl.wizard.back}>
        <BackIcon color={c.text} />
      </CircleButton>
      <AppText variant="title" style={{ marginTop: 28 }}>
        {pl.meds.title}
      </AppText>
      <AppText variant="secondary" tone="muted" style={{ marginTop: 10 }}>
        {pl.today.medListHint}
      </AppText>

      {medications === null ? null : medications.length === 0 ? (
        <AppText variant="secondary" tone="muted" style={{ marginTop: 28 }}>
          {pl.meds.empty}
        </AppText>
      ) : (
        <Card padded={false} style={{ marginTop: 28 }}>
          {medications.map((med, index) => (
            <Pressable
              key={med.id}
              accessibilityRole="button"
              onPress={() => router.push(`/medication/${med.id}`)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 16,
                paddingHorizontal: 22,
                paddingVertical: 18,
                borderTopWidth: index === 0 ? 0 : 1,
                borderTopColor: c.line,
              }}
            >
              <MedicationIconBadge icon={med.icon} color={med.color} boxSize={52} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <AppText variant="body" style={{ fontWeight: '500' }} numberOfLines={1}>
                  {med.name}
                </AppText>
                <AppText variant="secondary" tone="muted" style={{ marginTop: 3 }} numberOfLines={1}>
                  {pl.wizard.forms[med.form]} · {med.doseText}
                </AppText>
              </View>
              <ChevronRightIcon color={c.faint} />
            </Pressable>
          ))}
        </Card>
      )}

      <Pressable
        onPress={() => router.push('/(tabs)/add')}
        style={{ marginTop: 18 }}
      >
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: c.brand,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PlusIcon color="#ffffff" />
            </View>
            <AppText variant="body" style={{ flex: 1, fontWeight: '500' }}>
              {pl.meds.add}
            </AppText>
            <ChevronRightIcon color={c.faint} />
          </View>
        </Card>
      </Pressable>
    </Screen>
  )
}
