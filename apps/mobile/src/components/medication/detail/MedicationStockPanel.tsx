import { useState } from 'react'
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native'

import { MedicationStockLine } from '@/src/components/medication/detail/MedicationStockLine'
import { useMedication } from '@/src/hooks/useMedication'
import { pl } from '@/src/i18n/pl'
import { useColorScheme } from '@/components/useColorScheme'
import { themeColors } from '@/src/theme/colors'
import { addMedicationStock } from '@/src/storage/services/medicationStock'
import { useStorage } from '@/src/context/StorageContext'
import { FormTextField } from '@/src/components/medication/FormTextField'

type MedicationStockPanelProps = {
  medicationId: string
}

export function MedicationStockPanel({
  medicationId,
}: MedicationStockPanelProps) {
  const { medication } = useMedication(medicationId)
  const { bumpRefresh } = useStorage()
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const [amount, setAmount] = useState('30')
  const [saving, setSaving] = useState(false)

  if (!medication || medication.stockRemaining == null) return null

  const parsed = Number(amount)
  const valid = Number.isFinite(parsed) && parsed >= 1

  return (
    <View
      style={[
        styles.panel,
        { borderColor: c.border, backgroundColor: c.surfaceElevated },
      ]}
    >
      <Text style={[styles.title, { color: c.text }]}>
        {pl.stock.replenishTitle}
      </Text>
      <MedicationStockLine medication={medication} />
      <Text style={[styles.hint, { color: c.textMuted }]}>
        {pl.stock.replenishHint}
      </Text>
      <FormTextField
        label={pl.stock.replenishAmount}
        value={amount}
        onChangeText={setAmount}
        keyboardType="number-pad"
      />
      <Pressable
        disabled={saving || !valid}
        onPress={() => {
          setSaving(true)
          void addMedicationStock(medicationId, parsed)
            .then(() => bumpRefresh())
            .finally(() => setSaving(false))
        }}
        style={[
          styles.btn,
          {
            borderColor: c.brand,
            opacity: saving || !valid ? 0.5 : 1,
          },
        ]}
      >
        {saving ? (
          <ActivityIndicator color={c.brand} />
        ) : (
          <Text style={[styles.btnText, { color: c.brand }]}>
            {pl.stock.replenishAction}
          </Text>
        )}
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  panel: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  hint: {
    fontSize: 12,
  },
  btn: {
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  btnText: {
    fontWeight: '600',
    fontSize: 14,
  },
})
