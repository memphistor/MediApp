export function buildMonthGrid(year: number, month: number) {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const startPad = (first.getDay() + 6) % 7
  const cells: { date: Date | null; day?: number }[] = []
  for (let i = 0; i < startPad; i++) cells.push({ date: null })
  for (let d = 1; d <= last.getDate(); d++) {
    cells.push({ date: new Date(year, month, d), day: d })
  }
  while (cells.length % 7 !== 0) cells.push({ date: null })
  return cells
}

export const CALENDAR_WEEKDAYS = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'] as const
