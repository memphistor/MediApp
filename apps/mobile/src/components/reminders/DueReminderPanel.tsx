import * as Haptics from 'expo-haptics'
import { View } from 'react-native'

import { useSettings } from '@/src/context/SettingsContext'
import { useStorage } from '@/src/context/StorageContext'
import { useInAppDueGroups } from '@/src/hooks/useInAppDueGroups'
import { pl } from '@/src/i18n/pl'
import { AppText } from '@/src/components/ui/AppText'
import { Button } from '@/src/components/ui/Button'
import { Card } from '@/src/components/ui/Card'
import {
  applyReminderAction,
  type ReminderAction,
} from '@/src/notifications/reminderActions'
import { requestReminderRescheduleImmediate } from '@/src/notifications/reminderReschedule'
import { space } from '@/src/theme/tokens'

export function DueReminderPanel() {
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
    <Card>
      <AppText variant="section" tone="brand">
        {pl.reminder.activeTitle}
      </AppText>
      {group.logIds.length > 1 ? (
        <AppText variant="secondary" tone="muted" style={{ marginTop: space.xs }}>
          {pl.reminder.groupedCount.replace('{count}', String(group.logIds.length))}
        </AppText>
      ) : null}
      {group.lines.map((line) => (
        <AppText key={line} variant="body" style={{ marginTop: space.sm }}>
          {line}
        </AppText>
      ))}
      <View style={{ marginTop: space.lg, gap: space.xs }}>
        {group.logIds.length > 1 ? (
          <Button label={pl.reminder.takeAll} onPress={() => run('taken-all')} />
        ) : null}
        <Button label={pl.reminder.snooze} variant="text" onPress={() => run('snooze')} />
      </View>
    </Card>
  )
}
