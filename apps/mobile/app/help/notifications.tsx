import { AppText } from '@/src/components/ui/AppText'
import { Screen } from '@/src/components/ui/Screen'
import { pl } from '@/src/i18n/pl'
import { space } from '@/src/theme/tokens'

export default function NotificationLimitsScreen() {
  const copy = pl.notificationHelp
  const paragraphs = [
    copy.lead,
    copy.tick,
    copy.ios,
    copy.noPermission,
    copy.persistent,
    copy.closed,
  ]

  return (
    <Screen variant="stack">
      {paragraphs.map((text) => (
        <AppText key={text} variant="body" style={{ marginTop: space.lg }}>
          {text}
        </AppText>
      ))}
    </Screen>
  )
}
