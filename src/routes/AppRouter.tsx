import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { useSettings } from '@/context/SettingsContext'

const OnboardingView = lazy(() =>
  import('@/pages/OnboardingView').then((m) => ({ default: m.OnboardingView })),
)
const TodayView = lazy(() =>
  import('@/pages/TodayView').then((m) => ({ default: m.TodayView })),
)
const AddMedicationWizard = lazy(() =>
  import('@/pages/AddMedicationWizard').then((m) => ({
    default: m.AddMedicationWizard,
  })),
)
const MedicationDetail = lazy(() =>
  import('@/pages/MedicationDetail').then((m) => ({ default: m.MedicationDetail })),
)
const CalendarView = lazy(() =>
  import('@/pages/CalendarView').then((m) => ({ default: m.CalendarView })),
)
const HistoryView = lazy(() =>
  import('@/pages/HistoryView').then((m) => ({ default: m.HistoryView })),
)
const ProgressView = lazy(() =>
  import('@/pages/ProgressView').then((m) => ({ default: m.ProgressView })),
)
const SettingsView = lazy(() =>
  import('@/pages/SettingsView').then((m) => ({ default: m.SettingsView })),
)
const PrivacyConsentView = lazy(() =>
  import('@/pages/PrivacyConsentView').then((m) => ({
    default: m.PrivacyConsentView,
  })),
)
const PrivacyPolicyView = lazy(() =>
  import('@/pages/PrivacyPolicyView').then((m) => ({
    default: m.PrivacyPolicyView,
  })),
)
const NotificationLimitsView = lazy(() =>
  import('@/pages/NotificationLimitsView').then((m) => ({
    default: m.NotificationLimitsView,
  })),
)

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

function PageFallback() {
  return (
    <div className="flex min-h-40 items-center justify-center text-[var(--color-text-muted)]">
      Ładowanie…
    </div>
  )
}

export function AppRouter() {
  return (
    <BrowserRouter basename={routerBasename}>
      <Suspense fallback={<PageFallback />}>
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
          <Route path="medication/:id/edit" element={<AddMedicationWizard />} />
          <Route path="medication/:id" element={<MedicationDetail />} />
          <Route path="calendar" element={<CalendarView />} />
          <Route path="history" element={<HistoryView />} />
          <Route path="progress" element={<ProgressView />} />
          <Route path="settings" element={<SettingsView />} />
          <Route path="help/notifications" element={<NotificationLimitsView />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
