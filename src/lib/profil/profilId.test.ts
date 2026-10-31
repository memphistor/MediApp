import { describe, expect, it } from 'vitest'
import { parseProfilFromPathname } from './profilRoutes'
import { generateProfilId, isValidProfilId } from './profilValidation'

describe('profilValidation', () => {
  it('generates valid ids', () => {
    const id = generateProfilId()
    expect(isValidProfilId(id)).toBe(true)
  })

  it('accepts memorable slug testfp', () => {
    expect(isValidProfilId('testfp')).toBe(true)
  })
})

describe('profilRoutes', () => {
  it('reads profil from path prefix', () => {
    expect(parseProfilFromPathname('/testfp/settings')).toEqual({
      profilId: 'testfp',
      appPath: '/settings',
    })
  })

  it('treats calendar as app route not profil', () => {
    expect(parseProfilFromPathname('/calendar').profilId).toBeNull()
  })
})
