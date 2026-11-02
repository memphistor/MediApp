import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

import {
  decodeSnapshotBase64Url,
  encodeSnapshotBase64Url,
} from './encodeSnapshot'
import {
  parseSnapshotJson,
  SnapshotValidationError,
  validateAppSnapshot,
} from './validateSnapshot'

const fixtureDir = dirname(fileURLToPath(import.meta.url))
const minimalFixture = JSON.parse(
  readFileSync(join(fixtureDir, '__fixtures__/minimal-v1.json'), 'utf8'),
)

describe('validateAppSnapshot', () => {
  it('accepts minimal fixture', () => {
    const snap = validateAppSnapshot(minimalFixture)
    expect(snap.medications).toHaveLength(1)
    expect(snap.version).toBe(1)
  })

  it('rejects wrong version', () => {
    expect(() =>
      validateAppSnapshot({ ...minimalFixture, version: 2 }),
    ).toThrow(SnapshotValidationError)
  })

  it('rejects missing medications array', () => {
    const { medications: _m, ...rest } = minimalFixture
    expect(() => validateAppSnapshot(rest)).toThrow(SnapshotValidationError)
  })

  it('parseSnapshotJson rejects invalid JSON', () => {
    expect(() => parseSnapshotJson('{')).toThrow(SnapshotValidationError)
  })
})

describe('encodeSnapshotBase64Url', () => {
  it('roundtrips minimal fixture', () => {
    const snap = validateAppSnapshot(minimalFixture)
    const encoded = encodeSnapshotBase64Url(snap)
    const decoded = decodeSnapshotBase64Url(encoded)
    expect(decoded?.medications[0]?.name).toBe('Fixture lek')
  })
})
