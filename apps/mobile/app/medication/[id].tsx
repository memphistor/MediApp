import { useLocalSearchParams } from 'expo-router'

import { MedicationDetailView } from '@/src/components/medication/detail/MedicationDetailView'

export default function MedicationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  if (!id) return null
  return <MedicationDetailView medicationId={id} />
}
