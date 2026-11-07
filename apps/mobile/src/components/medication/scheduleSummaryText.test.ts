import { describe, expect, it } from 'vitest'

import { scheduleSummaryText } from './scheduleSummaryText'

const plStub = {
  wizard: {
    schedules: {
      daily: 'Codziennie',
      weekdays: 'Wybrane dni tygodnia',
      everyNDays: 'Co X dni',
      weekly: 'Raz w tygodniu',
      monthly: 'Raz w miesiącu',
      cycle: 'Cykl (np. 21 dni / 7 przerwy)',
      asNeeded: 'Tylko w razie potrzeby',
    },
    notSelected: 'Nie wybrano',
  },
}

describe('scheduleSummaryText', () => {
  it('daily', () => {
    expect(
      scheduleSummaryText({ type: 'daily' }, plStub),
    ).toBe('Codziennie')
  })

  it('weekdays', () => {
    expect(
      scheduleSummaryText({ type: 'weekdays', days: [1, 3] }, plStub),
    ).toContain('Pn')
  })

  it('asNeeded', () => {
    expect(
      scheduleSummaryText({ type: 'asNeeded' }, plStub),
    ).toBe('Tylko w razie potrzeby')
  })
})
