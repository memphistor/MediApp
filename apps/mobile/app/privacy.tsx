import { AppText } from '@/src/components/ui/AppText'
import { Screen } from '@/src/components/ui/Screen'
import { privacyPl } from '@/src/i18n/privacy-pl'
import { space } from '@/src/theme/tokens'

export default function PrivacyScreen() {
  return (
    <Screen variant="stack">
      {privacyPl.sections.map((section) => (
        <AppText key={section.id} variant="body" style={{ marginBottom: space.xl }}>
          <AppText variant="section">
            {section.title}
            {'\n'}
          </AppText>
          {section.paragraphs.join('\n\n')}
        </AppText>
      ))}
    </Screen>
  )
}
