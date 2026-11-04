import { useState } from 'react'
import { ActivityIndicator, Alert, View } from 'react-native'
import { useRouter } from 'expo-router'

import { SnapshotValidationError } from '@mediapp/core'

import { useSettings } from '@/src/context/SettingsContext'
import { useStorage } from '@/src/context/StorageContext'
import { AppText } from '@/src/components/ui/AppText'
import { Button } from '@/src/components/ui/Button'
import { pl } from '@/src/i18n/pl'
import {
  isLargeBackupText,
  pickBackupJson,
} from '@/src/storage/services/backupFile'
import { space } from '@/src/theme/tokens'
import { useColorScheme } from '@/components/useColorScheme'
import { themeColors } from '@/src/theme/colors'

type BackupControlsProps = {
  onMessage: (text: string | null) => void
}

export function BackupControls({ onMessage }: BackupControlsProps) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const router = useRouter()
  const { replaceSettings } = useSettings()
  const { importSnapshot, syncing } = useStorage()
  const [busy, setBusy] = useState(false)

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
                  router.replace('/')
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

  return (
    <View style={{ marginTop: space.xxl }}>
      <AppText variant="section">{pl.settings.backupTitle}</AppText>
      <AppText variant="caption" tone="muted" style={{ marginTop: space.sm }}>
        {pl.settings.backupHint}
      </AppText>
      {busy ? (
        <ActivityIndicator color={c.brand} style={{ marginTop: space.lg }} />
      ) : (
        <Button
          label={pl.settings.backupImport}
          variant="quiet"
          disabled={syncing}
          onPress={runImportPick}
          style={{ alignSelf: 'stretch', marginTop: space.md }}
        />
      )}
    </View>
  )
}
