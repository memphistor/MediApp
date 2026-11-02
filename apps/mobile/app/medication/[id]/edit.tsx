import { useLocalSearchParams } from 'expo-router'

import { MedicationWizard } from '@/src/components/wizard/MedicationWizard'

export default function MedicationEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  return <MedicationWizard medicationId={id} />
}
