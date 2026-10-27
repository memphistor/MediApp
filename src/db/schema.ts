/**
 * Dexie schema v1 — see docs/data-model.md for field descriptions.
 */
export const DB_NAME = 'MediAppDB'
export const DB_VERSION = 1

export const STORE_DEFINITIONS = {
  medications: 'id, name, updatedAt',
  doseLogs: 'id, medicationId, scheduledAt, status',
  settings: 'id',
  gamification: 'id',
} as const
