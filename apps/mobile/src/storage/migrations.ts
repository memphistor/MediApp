import type { SQLiteDatabase } from 'expo-sqlite'

import { DB_SCHEMA_VERSION, MIGRATION_V1_SQL } from './schema'

async function getCurrentVersion(db: SQLiteDatabase): Promise<number> {
  try {
    const row = await db.getFirstAsync<{ version: number }>(
      'SELECT version FROM _schema_version LIMIT 1',
    )
    return row?.version ?? 0
  } catch {
    return 0
  }
}

export async function runMigrations(db: SQLiteDatabase): Promise<void> {
  const current = await getCurrentVersion(db)
  if (current >= DB_SCHEMA_VERSION) return

  if (current < 1) {
    await db.execAsync(MIGRATION_V1_SQL)
    await db.runAsync('DELETE FROM _schema_version')
    await db.runAsync('INSERT INTO _schema_version (version) VALUES (?)', [
      DB_SCHEMA_VERSION,
    ])
  }
}
