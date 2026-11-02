import type { AppSnapshot } from './types'
import { SNAPSHOT_VERSION } from './types'

export class SnapshotValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SnapshotValidationError'
  }
}

export function parseSnapshotJson(text: string): unknown {
  try {
    return JSON.parse(text) as unknown
  } catch {
    throw new SnapshotValidationError('Plik nie jest poprawnym JSON.')
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((x) => typeof x === 'string')
}

/** Structural validation for AppSnapshot v1 (import from web or mobile). */
export function validateAppSnapshot(raw: unknown): AppSnapshot {
  if (!isRecord(raw)) {
    throw new SnapshotValidationError('Nieprawidłowa kopia — brak obiektu głównego.')
  }

  if (raw.version !== SNAPSHOT_VERSION) {
    throw new SnapshotValidationError('Nieobsługiwana wersja kopii.')
  }

  if (typeof raw.exportedAt !== 'string' || !raw.exportedAt) {
    throw new SnapshotValidationError('Nieprawidłowa kopia — brak daty eksportu.')
  }

  if (!Array.isArray(raw.medications)) {
    throw new SnapshotValidationError('Nieprawidłowa kopia — brak listy pozycji.')
  }

  if (!Array.isArray(raw.doseLogs)) {
    throw new SnapshotValidationError('Nieprawidłowa kopia — brak logów dawek.')
  }

  if (!Array.isArray(raw.medicationNotes)) {
    throw new SnapshotValidationError('Nieprawidłowa kopia — brak pola notatek.')
  }

  if (!Array.isArray(raw.settings)) {
    throw new SnapshotValidationError('Nieprawidłowa kopia — brak ustawień.')
  }

  if (!Array.isArray(raw.gamification)) {
    throw new SnapshotValidationError('Nieprawidłowa kopia — brak stanu postępu.')
  }

  for (const med of raw.medications) {
    if (!isRecord(med) || typeof med.id !== 'string' || typeof med.name !== 'string') {
      throw new SnapshotValidationError('Nieprawidłowa pozycja w kopii.')
    }
    if (!isStringArray(med.times)) {
      throw new SnapshotValidationError('Nieprawidłowy harmonogram pozycji w kopii.')
    }
    if (!isRecord(med.schedule) || typeof med.schedule.type !== 'string') {
      throw new SnapshotValidationError('Nieprawidłowy typ harmonogramu w kopii.')
    }
  }

  for (const log of raw.doseLogs) {
    if (
      !isRecord(log) ||
      typeof log.id !== 'string' ||
      typeof log.medicationId !== 'string' ||
      typeof log.scheduledAt !== 'string' ||
      typeof log.status !== 'string'
    ) {
      throw new SnapshotValidationError('Nieprawidłowy wpis dawki w kopii.')
    }
  }

  return raw as AppSnapshot
}
