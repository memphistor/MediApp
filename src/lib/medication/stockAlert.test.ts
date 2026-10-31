import { describe, expect, it } from 'vitest'
import {
  estimateAverageDailyStockUnits,
  stockAlertLevel,
} from '@/lib/medication/stockAlert'
import type { MedicationEntry } from '@/types/medication'

function dailyMed(stockRemaining: number): MedicationEntry {
  return {
    id: '1',
    name: 'Test',
    kind: 'otc',
    form: 'tablet',
    doseText: '1',
    onEmptyStomach: 'na',
    times: ['08:00', '20:00'],
    schedule: { type: 'daily' },
    color: '#000',
    icon: '💊',
    stockRemaining,
    stockUnitsPerIntake: 1,
    createdAt: '',
    updatedAt: '',
  }
}

describe('stockAlertLevel', () => {
  it('warns below 7 daily doses for twice-daily med', () => {
    const med = dailyMed(10)
    expect(estimateAverageDailyStockUnits(med)).toBeCloseTo(2)
    expect(stockAlertLevel(med)).toBe('warn')
  })

  it('critical at 3 or fewer daily doses left', () => {
    expect(stockAlertLevel(dailyMed(6))).toBe('critical')
  })

  it('ok when plenty of stock', () => {
    expect(stockAlertLevel(dailyMed(30))).toBe('ok')
  })
})
