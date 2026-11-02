import { useState } from 'react'
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import { useRouter } from 'expo-router'

import { SnapshotValidationError } from '@mediapp/core'

import { useColorScheme } from '@/components/useColorScheme'
import { useSettings } from '@/src/context/SettingsContext'
import { useStorage } from '@/src/context/StorageContext'
import { pl } from '@/src/i18n/pl'
import {
  isLargeBackupText,
  pickBackupJson,
  shareBackupJson,
} from '@/src/storage/services/backupFile'
import { themeColors } from '@/src/theme/colors'

type BackupControlsProps = {
  onMessage: (text: string | null) => void
}

export function BackupControls({ onMessage }: BackupControlsProps) {
  const scheme = useColorScheme()
  const c = themeColors(scheme)
  const router = useRouter()
  const { replaceSettings } = useSettings()
  const { importSnapshot, syncing } = useStorage()
  const [busy, setBusy] = useState(false)

  const runExport = () => {
    setBusy(true)
    onMessage(null)
    void shareBackupJson()
      .then(() => onMessage(pl.settings.backupExportDone))
      .catch(() => onMessage(pl.settings.backupExportFailed))
      .finally(() => setBusy(false))
  }

  const runImportPick = () => {
    if (syncing || busy) return
    onMessage(null)
    void pickBackupJson().then((raw) => {
      if (raw == null) return
      const preview = JSON.stringify(raw)
      if (isLargeBackupText(preview)) {
        Alert.alert(pl.settings.backupLargeTitle, pl.settings.backupLargeBody)
      }
      Alert.alert(
        pl.settings.backupImportConfirmTitle,
        pl.settings.backupImportConfirmBody,
        [
          { text: pl.common.cancel, style: 'cancel' },
          {
            text: pl.settings.backupImport,
            style: 'destructive',
            onPress: () => {
              setBusy(true)
              void importSnapshot(raw)
                .then((settings) => {
                  replaceSettings(settings)
                  onMessage(pl.settings.backupImportSuccess)
                  router.replace('/(tabs)/')
                })
                .catch((err: unknown) => {
                  if (err instanceof SnapshotValidationError) {
                    onMessage(pl.settings.backupInvalid)
                  } else {
                    onMessage(pl.settings.backupImportFailed)
                  }
                })
                .finally(() => setBusy(false))
            },
          },
        ],
      )
    })
  }

  const disabled = syncing || busy

  return (
    <View>
      <Text style={[styles.sectionTitle, styles.sectionTop, { color: c.textMuted }]}>
        {pl.settings.backupTitle}
      </Text>
      <Text style={[styles.hint, { color: c.textMuted }]}>{pl.settings.backupHint}</Text>
      <Pressable
        disabled={disabled}
        style={[
          styles.primaryBtn,
          { backgroundColor: c.brand, opacity: disabled ? 0.6 : 1 },
        ]}
        onPress={runExport}
      >
        {busy ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryText}>{pl.settings.backupExport}</Text>
        )}
      </Pressable>
      <Pressable
        disabled={disabled}
        style={[
          styles.outlineBtn,
          { borderColor: c.border, opacity: disabled ? 0.6 : 1 },
        ]}
        onPress={runImportPick}
      >
        <Text style={[styles.outlineText, { color: c.text }]}>
          {pl.settings.backupImport}
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  sectionTop: { marginTop: 24 },
  hint: { marginTop: 0, marginBottom: 12, fontSize: 13, lineHeight: 18 },
  primaryBtn: {
    minHeight: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  outlineBtn: {
    marginTop: 12,
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineText: { fontSize: 14 },
})
