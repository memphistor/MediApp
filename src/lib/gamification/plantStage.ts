export function plantEmojiForStreak(streak: number): string {
  if (streak >= 30) return '🌳'
  if (streak >= 7) return '🪴'
  if (streak >= 1) return '🌿'
  return '🌱'
}
