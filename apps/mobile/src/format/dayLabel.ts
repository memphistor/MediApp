export function formatHm(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value
  return date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })
}

export function capitalizePl(value: string): string {
  if (!value) return value
  return value.charAt(0).toLocaleUpperCase('pl-PL') + value.slice(1)
}
