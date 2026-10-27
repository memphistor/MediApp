export interface Badge {
  id: string
  label: string
  earnedAt?: string
}

export interface GamificationState {
  id: 'default'
  currentStreak: number
  shieldAvailable: boolean
  badges: Badge[]
  dayRingProgress: number
}
