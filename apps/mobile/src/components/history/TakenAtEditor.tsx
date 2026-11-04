import { useState } from 'react'
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'

import {
  formatLocaleDateTime,
  formatLocaleTime,
} from '@mediapp/core'

import { useColorScheme } from '@/components/useColorScheme'
import { useStorage } from '@/src/context/StorageContext'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'
import { updateDoseTakenAt } from '@/src/storage/repositories/doseLogRepository'

type TakenAtEditorProps = {
  logId: string
  takenAt: string
  showDate?: boolean
}

export function TakenAtEditor({
  logId,
  takenAt,
  showDate = false,
}: TakenAtEditorProps) {
  const scheme = useColorScheme()
  const c = themeColors(scheme)
  const { bumpRefresh } = useStorage()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(() => new Date(takenAt))
  const [error, setError] = useState<string | null>(null)

  const display = showDate
    ? formatLocaleDateTime(takenAt)
    : formatLocaleTime(takenAt)

  const save = async (date: Date) => {
    const iso = date.toISOString()
    const ok = await updateDoseTakenAt(logId, iso)
    if (!ok) {
      setError(pl.history.takenAtSaveFailed)
      return
    }
    setError(null)
    setEditing(false)
    bumpRefresh()
  }

  return (
    <View style={styles.wrap}>
      {!editing ? (
        <View style={styles.row}>
          <Text style={[styles.text, { color: c.text }]}>
            {pl.history.takenAt}: {display}
          </Text>
          <Pressable onPress={() => setEditing(true)} hitSlop={8}>
            <Text style={[styles.link, { color: c.brand }]}>
              {pl.history.editTakenAt}
            </Text>
          </Pressable>
        </View>
      ) : (
        <>
          {Platform.OS === 'ios' ? (
            <DateTimePicker
              value={draft}
              mode="datetime"
              onChange={(_, selected) => {
                if (selected) setDraft(selected)
              }}
            />
          ) : (
            <DateTimePicker
              value={draft}
              mode="datetime"
              onChange={(_, selected) => {
                if (selected) {
                  void save(selected)
                }
              }}
            />
          )}
          {Platform.OS === 'ios' && (
            <View style={styles.actions}>
              <Pressable
                onPress={() => {
                  setEditing(false)
                  setDraft(new Date(takenAt))
                }}
              >
                <Text style={{ color: c.textMuted }}>{pl.common.cancel}</Text>
              </Pressable>
              <Pressable onPress={() => void save(draft)}>
                <Text style={[styles.link, { color: c.brand }]}>
                  {pl.history.saveTakenAt}
                </Text>
              </Pressable>
            </View>
          )}
        </>
      )}
      {error ? (
        <Text style={[styles.error, { color: '#dc2626' }]}>{error}</Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { marginTop: 4 },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  text: { fontSize: 13 },
  link: { fontSize: 13, fontWeight: '600' },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    marginTop: 8,
  },
  error: { fontSize: 13, marginTop: 4 },
})
