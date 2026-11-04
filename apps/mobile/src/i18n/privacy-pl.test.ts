import { describe, expect, it } from 'vitest'

import { pl } from './pl'
import { privacyPl } from './privacy-pl'

describe('privacyPl (mobile store compliance)', () => {
  it('describes local SQLite storage, not web IndexedDB', () => {
    const text = privacyPl.sections.flatMap((s) => s.paragraphs).join(' ')
    expect(text).toMatch(/SQLite|MediApp\.db/i)
    expect(text).not.toMatch(/IndexedDB/i)
    expect(text).not.toMatch(/GitHub Pages/i)
    expect(text).not.toMatch(/przeglądar/i)
  })

  it('mentions local deletion without promising a JSON export', () => {
    const text = privacyPl.sections.flatMap((s) => s.paragraphs).join(' ')
    expect(text).toMatch(/Usuń wszystkie dane|Usuń/i)
    expect(text).not.toMatch(/wyeksportować/i)
    expect(text).not.toMatch(/JSON/i)
  })
})

describe('pl (mobile UI copy)', () => {
  it('does not use web/PWA storage wording in user-facing errors', () => {
    const blob = JSON.stringify(pl)
    expect(blob).not.toMatch(/IndexedDB/i)
    expect(blob).not.toMatch(/\bPWA\b/)
    expect(blob).not.toMatch(/przeglądark/i)
  })

  it('uses local notification wording in settings, not mobile push server', () => {
    expect(pl.settings.notificationsEnable).toMatch(/lokalne/i)
    expect(pl.settings.notificationsHint).not.toMatch(/\bPWA\b/)
    expect(pl.wizard.fields.remindersHint).not.toMatch(/push/i)
  })
})
