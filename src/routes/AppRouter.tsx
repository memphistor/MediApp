import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ProfilPathGuard } from '@/components/profil/ProfilPathGuard'
import { ProfilSearchSync } from '@/components/profil/ProfilSearchSync'
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
const AsNeededView = lazy(() =>
  import('@/pages/AsNeededView').then((m) => ({ default: m.AsNeededView })),
)
const ProgressView = lazy(() =>
  import('@/pages/ProgressView').then((m) => ({ default: m.ProgressView })),
)
const ProgressAnalyticsView = lazy(() =>
  import('@/pages/ProgressAnalyticsView').then((m) => ({
    default: m.ProgressAnalyticsView,
  })),
)
const SettingsView = lazy(() =>
  import('@/pages/SettingsView').then((m) => ({ default: m.SettingsView })),
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

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined

function PageFallback() {
  return (
    <div className="flex min-h-40 items-center justify-center text-[var(--color-text-muted)]">
      Ładowanie…
    </div>
  )
}

function AppShellRoutes() {
  return (
    <Route
      element={
        <OnboardingGate>
          <AppShell />
        </OnboardingGate>
      }
    >
      <Route index element={<TodayView />} />
      <Route path="add" element={<AddMedicationWizard />} />
      <Route path="medication/:id/edit" element={<AddMedicationWizard />} />
      <Route path="medication/:id" element={<MedicationDetail />} />
      <Route path="calendar" element={<CalendarView />} />
      <Route path="history" element={<HistoryView />} />
      <Route path="as-needed" element={<AsNeededView />} />
      <Route path="progress/analytics" element={<ProgressAnalyticsView />} />
      <Route path="progress" element={<ProgressView />} />
      <Route path="settings" element={<SettingsView />} />
      <Route path="help/notifications" element={<NotificationLimitsView />} />
    </Route>
  )
}

export function AppRouter() {
  return (
    <BrowserRouter basename={routerBasename}>
      <ProfilSearchSync />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/onboarding" element={<OnboardingView />} />
          <Route path="/privacy" element={<PrivacyPolicyView />} />
          <Route path="/privacy-consent" element={<Navigate to="/" replace />} />
          {AppShellRoutes()}
          <Route path="/:profilId" element={<ProfilPathGuard />}>
            {AppShellRoutes()}
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
