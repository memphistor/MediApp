import { StyleSheet, Text, View } from 'react-native'

import { BADGE_DEFINITIONS, type GamificationState } from '@mediapp/core'

import { useColorScheme } from '@/components/useColorScheme'
import { MedalIcon } from '@/src/components/ui/icons'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'
import { cardShadow } from '@/src/theme/tokens'

const LABELS: Record<string, string> = {
  streak_7: pl.progress.badgeStreak7,
  streak_30: pl.progress.badgeStreak30,
  taken_100: pl.progress.badgeTaken100,
}

type ProgressBadgesProps = {
  gam: GamificationState
}

export function ProgressBadges({ gam }: ProgressBadgesProps) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const earnedIds = new Set(
    gam.badges.filter((badge) => badge.earnedAt).map((badge) => badge.id),
  )

  return (
    <View style={styles.row}>
      {BADGE_DEFINITIONS.map((def) => {
        const earned = earnedIds.has(def.id)
        return (
          <View key={def.id} style={styles.item}>
            <View
              style={[
                styles.circle,
                cardShadow(scheme),
                { backgroundColor: earned ? c.tint : c.surfaceElevated },
              ]}
            >
              <MedalIcon color={earned ? c.brand : c.faint} />
            </View>
            <Text style={[styles.label, { color: c.textMuted }]}>
              {LABELS[def.id] ?? def.label}
            </Text>
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  item: {
    width: 104,
    alignItems: 'center',
    gap: 10,
  },
  circle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12.5,
    lineHeight: 17,
    textAlign: 'center',
  },
})
