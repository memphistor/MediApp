/** Calendar day in local timezone as YYYY-MM-DD */
export function toDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function endOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999)
}

export function addDays(d: Date, days: number): Date {
  const next = new Date(d)
  next.setDate(next.getDate() + days)
  return next
}

/** Monday 00:00 local time of the ISO week containing `d`. */
export function startOfWeekMonday(d: Date): Date {
  const day = startOfLocalDay(d)
  const diff = (day.getDay() + 6) % 7
  return addDays(day, -diff)
}

export function weekDayKeys(monday: Date): string[] {
  return Array.from({ length: 7 }, (_, i) => toDateKey(addDays(monday, i)))
}

export function daysBetweenCalendar(start: Date, end: Date): number {
  const a = startOfLocalDay(start).getTime()
  const b = startOfLocalDay(end).getTime()
  return Math.round((b - a) / 86400000)
}

export function combineDateAndTime(day: Date, timeHHmm: string): Date {
  const [h, m] = timeHHmm.split(':').map((x) => Number(x))
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), h, m, 0, 0)
}

export function parseTimesInput(raw: string): string[] {
  return raw
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean)
}

export function isValidTimeHHmm(t: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(t)
}

export function formatLocaleDateTime(iso: string): string {
  return new Date(iso).toLocaleString('pl-PL', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

export function formatLocaleTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** Value for `<input type="datetime-local" />` in local timezone. */
export function toDatetimeLocalValue(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${day}T${h}:${min}`
}

export function fromDatetimeLocalValue(value: string): Date | null {
  if (!value.trim()) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}
