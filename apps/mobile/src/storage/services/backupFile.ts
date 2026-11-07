import { parseSnapshotJson } from '@mediapp/core'
import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system/legacy'
import * as Sharing from 'expo-sharing'

import { exportAppSnapshot } from './appSnapshot'

export function backupFileName(date = new Date()): string {
  const iso = date.toISOString().slice(0, 10)
  return `MediApp-kopia-${iso}.json`
}

export async function shareBackupJson(): Promise<void> {
  const snapshot = await exportAppSnapshot()
  const json = JSON.stringify(snapshot, null, 2)
  const dir = FileSystem.cacheDirectory
  if (!dir) {
    throw new Error('Brak katalogu cache.')
  }
  const uri = `${dir}${backupFileName()}`
  await FileSystem.writeAsStringAsync(uri, json)
  const canShare = await Sharing.isAvailableAsync()
  if (!canShare) {
    throw new Error('Udostępnianie niedostępne na tym urządzeniu.')
  }
  await Sharing.shareAsync(uri, {
    mimeType: 'application/json',
    UTI: 'public.json',
    dialogTitle: backupFileName(),
  })
}

export async function pickBackupJson(): Promise<unknown | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: ['application/json', 'text/json', 'text/plain'],
    copyToCacheDirectory: true,
  })
  if (result.canceled || !result.assets?.[0]?.uri) {
    return null
  }
  const text = await FileSystem.readAsStringAsync(result.assets[0].uri)
  return parseSnapshotJson(text)
}

export function isLargeBackupText(text: string): boolean {
  return text.length > 10 * 1024 * 1024
}
