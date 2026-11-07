import { useState } from 'react'
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

import { useColorScheme } from '@/components/useColorScheme'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'

interface SkipDoseModalProps {
  visible: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
}

export function SkipDoseModal({
  visible,
  onClose,
  onConfirm,
}: SkipDoseModalProps) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const [reason, setReason] = useState('')

  const handleConfirm = () => {
    onConfirm(reason.trim())
    setReason('')
  }

  const handleClose = () => {
    setReason('')
    onClose()
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <Pressable
          style={[styles.sheet, { backgroundColor: c.surfaceElevated }]}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={[styles.title, { color: c.text }]}>
            {pl.today.skipTitle}
          </Text>
          <Text style={[styles.label, { color: c.textMuted }]}>
            {pl.today.skipReasonLabel}
          </Text>
          <TextInput
            value={reason}
            onChangeText={setReason}
            style={[
              styles.input,
              { borderColor: c.border, color: c.text, backgroundColor: c.surface },
            ]}
            placeholderTextColor={c.textMuted}
          />
          <View style={styles.actions}>
            <Pressable
              style={[styles.btnSecondary, { borderColor: c.border }]}
              onPress={handleClose}
            >
              <Text style={{ color: c.text }}>{pl.common.cancel}</Text>
            </Pressable>
            <Pressable
              style={[styles.btnPrimary, { backgroundColor: c.brand }]}
              onPress={handleConfirm}
            >
              <Text style={styles.btnPrimaryText}>{pl.reminder.skip}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 16,
  },
  sheet: {
    borderRadius: 16,
    padding: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  label: {
    marginTop: 12,
    fontSize: 14,
  },
  input: {
    marginTop: 8,
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  btnSecondary: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
  },
  btnPrimary: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  btnPrimaryText: {
    color: '#fff',
    fontWeight: '600',
  },
})
