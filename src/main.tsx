import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/index.css'
import { SettingsProvider } from '@/context/SettingsContext'
import { AppRouter } from '@/routes/AppRouter'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <AppRouter />
    </SettingsProvider>
  </StrictMode>,
)
