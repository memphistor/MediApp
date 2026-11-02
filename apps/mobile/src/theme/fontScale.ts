import type { FontScale } from '@mediapp/core'

const LARGE_MULTIPLIER = 1.12

export function scaledFont(baseSize: number, fontScale: FontScale): number {
  return fontScale === 'large' ? baseSize * LARGE_MULTIPLIER : baseSize
}
