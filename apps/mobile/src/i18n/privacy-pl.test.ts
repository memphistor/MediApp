import { describe, expect, it } from 'vitest'

import { privacyPl } from './privacy-pl'

describe('privacyPl (mobile store compliance)', () => {
  it('describes local SQLite storage, not web IndexedDB', () => {
    const text = privacyPl.sections.flatMap((s) => s.paragraphs).join(' ')
    expect(text).toMatch(/SQLite|MediApp\.db/i)
    expect(text).not.toMatch(/IndexedDB/i)
    expect(text).not.toMatch(/GitHub Pages/i)
    expect(text).not.toMatch(/przeglądar/i)
  })

  it('mentions backup JSON and deletion', () => {
    const text = privacyPl.sections.flatMap((s) => s.paragraphs).join(' ')
    expect(text).toMatch(/JSON/i)
    expect(text).toMatch(/Usuń wszystkie dane|Usuń/i)
  })
})
