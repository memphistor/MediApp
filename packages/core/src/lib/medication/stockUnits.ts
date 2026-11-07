export function isStockTracked(
  med: { stockRemaining?: number } | undefined,
): med is { stockRemaining: number; stockUnitsPerIntake?: number } {
  return med != null && typeof med.stockRemaining === 'number'
}

export function unitsPerIntake(med: {
  stockUnitsPerIntake?: number
}): number {
  const n = med.stockUnitsPerIntake ?? 1
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1
}
