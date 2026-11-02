import * as Haptics from 'expo-haptics'
import { StyleSheet, Text, View, Pressable } from 'react-native'

import { useSettings } from '@/src/context/SettingsContext'
import { useStorage } from '@/src/context/StorageContext'
import { useInAppDueGroups } from '@/src/hooks/useInAppDueGroups'
import { pl } from '@/src/i18n/pl'
import {
  applyReminderAction,
  type ReminderAction,
} from '@/src/notifications/reminderActions'
import { requestReminderRescheduleImmediate } from '@/src/notifications/reminderReschedule'
import { themeColors } from '@/src/theme/colors'
import { useColorScheme } from '@/components/useColorScheme'

export function DueReminderPanel() {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const { settings, replaceSettings } = useSettings()
  const { bumpRefresh } = useStorage()
  const groups = useInAppDueGroups()
  const group = groups[0]
  if (!group) return null

  const run = (action: ReminderAction) => {
    void applyReminderAction(action, group.logIds, settings).then(
      async (next) => {
        replaceSettings(next)
        await requestReminderRescheduleImmediate(next)
        bumpRefresh()
        if (action === 'taken' || action === 'taken-all') {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        }
      },
    )
  }

  return (
    <View
      style={[
        styles.panel,
        { borderColor: c.brand, backgroundColor: c.surfaceElevated },
      ]}
      accessibilityLabel={pl.reminder.activeTitle}
    >
      <Text style={[styles.kicker, { color: c.brand }]}>
        {pl.reminder.activeTitle}
      </Text>
      {group.logIds.length > 1 && (
        <Text style={[styles.muted, { color: c.textMuted }]}>
          {pl.reminder.groupedCount.replace(
            '{count}',
            String(group.logIds.length),
          )}
        </Text>
      )}
      {group.lines.map((line) => (
        <Text key={line} style={[styles.line, { color: c.text }]}>
          {line}
        </Text>
      ))}
      <View style={styles.actions}>
        {group.logIds.length > 1 && (
          <Pressable
            style={[styles.primaryBtn, { backgroundColor: c.brand }]}
            onPress={() => run('taken-all')}
          >
            <Text style={styles.primaryBtnText}>{pl.reminder.takeAll}</Text>
          </Pressable>
        )}
        <Pressable
          style={[
            styles.secondaryBtn,
            { borderColor: c.border, backgroundColor: c.surface },
          ]}
          onPress={() => run('snooze')}
        >
          <Text style={[styles.secondaryBtnText, { color: c.text }]}>
            {pl.reminder.snooze}
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  panel: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  kicker: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  muted: {
    marginTop: 4,
    fontSize: 14,
  },
  line: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  actions: {
    marginTop: 16,
    gap: 8,
  },
  primaryBtn: {
    minHeight: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryBtn: {
    minHeight: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderWidth: 1,
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '500',
  },
})
