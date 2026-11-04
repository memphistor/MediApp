import { AppText } from '@/src/components/ui/AppText'

export function WizardSectionTitle({ children }: { children: string }) {
  return (
    <AppText variant="section" style={{ marginTop: 4 }}>
      {children}
    </AppText>
  )
}
