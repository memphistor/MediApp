import { StyleSheet, Text, View } from 'react-native'

import { BADGE_DEFINITIONS, type GamificationState } from '@mediapp/core'

import { useColorScheme } from '@/components/useColorScheme'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'

type ProgressBadgesProps = {
  gam: GamificationState
}

export function ProgressBadges({ gam }: ProgressBadgesProps) {
  const scheme = useColorScheme()
  const c = themeColors(scheme)
  const earnedIds = new Set(
    gam.badges.filter((b) => b.earnedAt).map((b) => b.id),
  )

  return (
    <View style={[styles.card, { backgroundColor: c.surfaceElevated }]}>
      <Text style={[styles.title, { color: c.text }]}>{pl.progress.badges}</Text>
      <View style={styles.chips}>
        {BADGE_DEFINITIONS.map((def) => {
          const earned = earnedIds.has(def.id)
          return (
            <View
              key={def.id}
              style={[
                styles.chip,
                {
                  backgroundColor: earned ? `${c.brand}26` : c.border,
                },
              ]}
            >
              <Text
                style={{
                  color: earned ? c.brand : c.textMuted,
                  fontSize: 14,
                  fontWeight: '500',
                }}
              >
                {def.label}
              </Text>
            </View>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { borderRadius: 20, padding: 16, backgroundColor: 'transparent' },
  title: { fontSize: 17, fontWeight: '600' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  chip: { borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
})
