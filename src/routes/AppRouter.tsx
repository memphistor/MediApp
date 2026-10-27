import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { useSettings } from '@/context/SettingsContext'
import { OnboardingView } from '@/pages/OnboardingView'
import { TodayView } from '@/pages/TodayView'
import { AddMedicationWizard } from '@/pages/AddMedicationWizard'
import { MedicationDetail } from '@/pages/MedicationDetail'
import { CalendarView } from '@/pages/CalendarView'
import { HistoryView } from '@/pages/HistoryView'
import { ProgressView } from '@/pages/ProgressView'
import { SettingsView } from '@/pages/SettingsView'
import { PrivacyConsentView } from '@/pages/PrivacyConsentView'
import { PrivacyPolicyView } from '@/pages/PrivacyPolicyView'

function OnboardingGate({ children }: { children: React.ReactNode }) {
  const { settings, ready } = useSettings()
  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-[var(--color-text-muted)]">
        Ładowanie…
      </div>
    )
  }
  if (!settings.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />
  }
  return children
}

function PrivacyGate({ children }: { children: React.ReactNode }) {
  const { ready, needsPrivacyConsent } = useSettings()
  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-[var(--color-text-muted)]">
        Ładowanie…
      </div>
    )
  }
  if (needsPrivacyConsent) {
    return <Navigate to="/privacy-consent" replace />
  }
  return children
}

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined

export function AppRouter() {
  return (
    <BrowserRouter basename={routerBasename}>
      <Routes>
        <Route path="/onboarding" element={<OnboardingView />} />
        <Route path="/privacy-consent" element={<PrivacyConsentView />} />
        <Route path="/privacy" element={<PrivacyPolicyView />} />
        <Route
          element={
            <OnboardingGate>
              <PrivacyGate>
                <AppShell />
              </PrivacyGate>
            </OnboardingGate>
          }
        >
          <Route index element={<TodayView />} />
          <Route path="add" element={<AddMedicationWizard />} />
          <Route path="medication/:id" element={<MedicationDetail />} />
          <Route path="calendar" element={<CalendarView />} />
          <Route path="history" element={<HistoryView />} />
          <Route path="progress" element={<ProgressView />} />
          <Route path="settings" element={<SettingsView />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
