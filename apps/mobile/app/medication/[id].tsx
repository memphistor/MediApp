import { useLocalSearchParams } from 'expo-router'

import { PlaceholderScreen } from '@/components/PlaceholderScreen'
import { pl } from '@/src/i18n/pl'

export default function MedicationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()

  return (
    <PlaceholderScreen
      title={pl.detail.title}
      subtitle={`ID: ${id ?? '—'} — w budowie`}
    />
  )
}
