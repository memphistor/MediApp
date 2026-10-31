import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/index.css'
import { initializeAppStorage } from '@/db/database'
import { SettingsProvider } from '@/context/SettingsContext'
import { AppRouter } from '@/routes/AppRouter'

const rootEl = document.getElementById('root')!

initializeAppStorage()
  .then(() => {
    createRoot(rootEl).render(
      <StrictMode>
        <SettingsProvider>
          <AppRouter />
        </SettingsProvider>
      </StrictMode>,
    )
  })
  .catch((err) => {
    console.error(err)
    rootEl.textContent =
      'Nie udało się wczytać danych. Odśwież stronę lub usuń parametry z adresu.'
  })
