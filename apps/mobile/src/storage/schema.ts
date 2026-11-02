/** SQLite schema — aligned with web Dexie stores (see src/db/schema.ts). */

export const DB_FILE_NAME = 'MediApp.db'
export const DB_SCHEMA_VERSION = 1

export const MIGRATION_V1_SQL = `
CREATE TABLE IF NOT EXISTS _schema_version (
  version INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS medications (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  kind TEXT NOT NULL,
  form TEXT NOT NULL,
  form_other_label TEXT,
  dose_text TEXT NOT NULL,
  on_empty_stomach TEXT NOT NULL,
  meal_timing TEXT,
  times_json TEXT NOT NULL,
  schedule_json TEXT NOT NULL,
  date_range_json TEXT,
  purpose_label TEXT,
  color TEXT NOT NULL,
  icon TEXT NOT NULL,
  user_note TEXT,
  stock_remaining INTEGER,
  stock_units_per_intake INTEGER,
  reminders_enabled INTEGER,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS dose_logs (
  id TEXT PRIMARY KEY NOT NULL,
  medication_id TEXT NOT NULL,
  scheduled_at TEXT NOT NULL,
  status TEXT NOT NULL,
  skip_reason TEXT,
  taken_at TEXT,
  last_notified_at TEXT,
  source TEXT
);

CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY NOT NULL,
  theme TEXT NOT NULL,
  font_scale TEXT NOT NULL,
  onboarding_completed INTEGER NOT NULL,
  privacy_policy_version_accepted TEXT,
  privacy_consent_at TEXT,
  special_category_consent_at TEXT,
  notifications_enabled INTEGER NOT NULL,
  snooze_minutes_default INTEGER NOT NULL,
  persistent_alarm_enabled INTEGER NOT NULL,
  snooze_until_by_log_id_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS gamification (
  id TEXT PRIMARY KEY NOT NULL,
  current_streak INTEGER NOT NULL,
  shield_available INTEGER NOT NULL,
  badges_json TEXT NOT NULL,
  day_ring_progress REAL NOT NULL,
  month_rate REAL NOT NULL,
  taken_total INTEGER NOT NULL,
  today_taken INTEGER NOT NULL,
  today_total INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_dose_logs_scheduled_at ON dose_logs(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_dose_logs_medication_id ON dose_logs(medication_id);
CREATE INDEX IF NOT EXISTS idx_dose_logs_status ON dose_logs(status);
CREATE INDEX IF NOT EXISTS idx_medications_name ON medications(name);
`
