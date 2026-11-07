import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

import { validateAppSnapshot } from '../../../../../packages/core/src/snapshot/validateSnapshot'

import {
  normalizeGamificationFromSnapshot,
  normalizeSettingsFromSnapshot,
} from './snapshotNormalize'

const fixtureDir = dirname(fileURLToPath(import.meta.url))
const fixturePath = join(
  fixtureDir,
  '../../../../../packages/core/src/snapshot/__fixtures__/minimal-v1.json',
)
const minimalFixture = JSON.parse(readFileSync(fixturePath, 'utf8'))

describe('appSnapshot normalize', () => {
  it('normalizes settings to default id', () => {
    const snap = validateAppSnapshot(minimalFixture)
    const settings = normalizeSettingsFromSnapshot(snap.settings)
    expect(settings.id).toBe('default')
    expect(settings.theme).toBe('system')
  })

  it('normalizes gamification to default id', () => {
    const snap = validateAppSnapshot(minimalFixture)
    const gam = normalizeGamificationFromSnapshot(snap.gamification)
    expect(gam.id).toBe('default')
  })
})
