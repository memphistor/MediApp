import { Picker } from '@react-native-picker/picker'
import { Platform, StyleSheet, Text, View } from 'react-native'

import { useColorScheme } from '@/components/useColorScheme'
import { themeColors } from '@/src/theme/colors'

export type FormSelectOption = { value: string; label: string }

type FormSelectProps = {
  label: string
  value: string
  options: FormSelectOption[]
  onChange: (value: string) => void
  error?: string
}

export function FormSelect({
  label,
  value,
  options,
  onChange,
  error,
}: FormSelectProps) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: c.text }]}>{label}</Text>
      <View
        style={[
          styles.pickerWrap,
          {
            borderColor: error ? '#dc2626' : c.border,
            backgroundColor: c.surfaceElevated,
          },
        ]}
      >
        <Picker
          selectedValue={value}
          onValueChange={(v) => onChange(String(v))}
          style={[
            styles.picker,
            Platform.OS === 'ios' ? styles.pickerIos : undefined,
            { color: c.text },
          ]}
          dropdownIconColor={c.textMuted}
        >
          {options.map((opt) => (
            <Picker.Item
              key={opt.value}
              label={opt.label}
              value={opt.value}
            />
          ))}
        </Picker>
      </View>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  pickerWrap: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    minHeight: 44,
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
  },
  pickerIos: {
    height: 120,
  },
  error: {
    fontSize: 12,
    color: '#dc2626',
  },
})
