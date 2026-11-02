import { useLocalSearchParams } from 'expo-router'

import { PlaceholderScreen } from '@/components/PlaceholderScreen'
import { pl } from '@/src/i18n/pl'

export default function MedicationEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()

  return (
    <PlaceholderScreen
      title={pl.wizard.editTitle}
      subtitle={`ID: ${id ?? '—'} — w budowie`}
    />
  )
}
