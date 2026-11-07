import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type TabRoute = { key: string; name: string }

type BottomTabBarProps = {
  state: { index: number; routes: TabRoute[] }
  navigateToTab: (routeKey: string) => void
}

import { useColorScheme } from '@/components/useColorScheme'
import { PlusIcon } from '@/src/components/ui/icons'
import { TabIcon, type TabIconId } from '@/src/components/ui/TabIcon'
import { rememberTab } from '@/src/navigation/lastTab'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'

const ORDER = ['index', 'calendar', 'add', 'progress', 'history'] as const

const LABEL: Record<(typeof ORDER)[number], string> = {
  index: pl.nav.today,
  calendar: pl.nav.calendar,
  add: pl.nav.add,
  progress: pl.nav.progress,
  history: pl.nav.history,
}

const ICON: Record<Exclude<(typeof ORDER)[number], 'add'>, TabIconId> = {
  index: 'today',
  calendar: 'calendar',
  progress: 'progress',
  history: 'history',
}

export function FloatingTabBar({ state, navigateToTab }: BottomTabBarProps) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const insets = useSafeAreaInsets()
  const focused = state.routes[state.index]?.name
  if (focused && focused !== 'add') rememberTab(focused)
  if (focused === 'add') return null

  const routes = ORDER.map((name) => state.routes.find((route) => route.name === name)).filter(
    (route): route is (typeof state.routes)[number] => route != null,
  )

  return (
    <View
      style={[
        styles.bar,
        {
          bottom: Math.max(insets.bottom - 18, 12),
          backgroundColor: scheme === 'dark' ? 'rgba(26,36,41,0.94)' : 'rgba(255,255,255,0.94)',
          shadowColor: '#14323C',
        },
      ]}
    >
      {routes.map((route) => {
        const active = state.routes[state.index]?.key === route.key
        const name = route.name as (typeof ORDER)[number]
        const onPress = () => {
          if (!active) navigateToTab(route.key)
        }
        if (name === 'add') {
          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityLabel={LABEL.add}
              onPress={onPress}
              style={styles.tab}
            >
              <View style={[styles.plus, { backgroundColor: c.brand }]}>
                <PlusIcon color="#ffffff" size={22} />
              </View>
              <Text style={[styles.label, { color: c.brand }]}>{LABEL.add}</Text>
            </Pressable>
          )
        }
        const tone = active ? c.brand : '#8A979F'
        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={LABEL[name]}
            onPress={onPress}
            style={[styles.tab, active && { backgroundColor: c.tint }]}
          >
            <TabIcon id={ICON[name]} focused={active} />
            <Text style={[styles.label, { color: tone }]}>{LABEL[name]}</Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 18,
    right: 18,
    height: 72,
    borderRadius: 36,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  tab: {
    flex: 1,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
  },
  plus: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -2,
  },
})
