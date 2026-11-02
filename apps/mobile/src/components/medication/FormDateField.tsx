import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker'
import { useMemo, useState } from 'react'
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native'

import { useColorScheme } from '@/components/useColorScheme'
import { themeColors } from '@/src/theme/colors'

function parseDateKey(value: string): Date | null {
  if (!value.trim()) return null
  const [y, m, d] = value.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d, 12, 0, 0, 0)
}

function toDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

type FormDateFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
}

export function FormDateField({ label, value, onChange }: FormDateFieldProps) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const [open, setOpen] = useState(false)
  const date = useMemo(
    () => parseDateKey(value) ?? new Date(),
    [value],
  )

  const onPickerChange = (_event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') setOpen(false)
    if (selected) onChange(toDateKey(selected))
  }

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: c.text }]}>{label}</Text>
      <Pressable
        onPress={() => setOpen(true)}
        style={[
          styles.field,
          { borderColor: c.border, backgroundColor: c.surfaceElevated },
        ]}
      >
        <Text style={{ color: value ? c.text : c.textMuted }}>
          {value || '—'}
        </Text>
      </Pressable>
      {open ? (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onPickerChange}
        />
      ) : null}
      {open && Platform.OS === 'ios' ? (
        <Pressable onPress={() => setOpen(false)} style={styles.done}>
          <Text style={{ color: c.brand, fontWeight: '600' }}>Gotowe</Text>
        </Pressable>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  field: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  done: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
  },
})
