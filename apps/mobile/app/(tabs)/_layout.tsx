import { Tabs } from 'expo-router'
import { StyleSheet } from 'react-native'

import { useColorScheme } from '@/components/useColorScheme'
import { TabIcon, type TabIconId } from '@/src/components/ui/TabIcon'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'

function tabIcon(id: TabIconId) {
  return ({ focused }: { focused: boolean }) => (
    <TabIcon id={id} focused={focused} />
  )
}

export default function TabLayout() {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.brand,
        tabBarInactiveTintColor: c.textMuted,
        tabBarStyle: {
          backgroundColor: c.surfaceElevated,
          borderTopColor: c.border,
          borderTopWidth: StyleSheet.hairlineWidth,
        },
        tabBarLabelStyle: { fontSize: 13, fontWeight: '500' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: pl.nav.today,
          tabBarLabel: pl.nav.today,
          tabBarIcon: tabIcon('today'),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: pl.nav.calendar,
          tabBarLabel: pl.nav.calendar,
          tabBarIcon: tabIcon('calendar'),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: pl.nav.add,
          tabBarLabel: pl.nav.add,
          tabBarIcon: tabIcon('add'),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: pl.nav.progress,
          tabBarLabel: pl.nav.progress,
          tabBarIcon: tabIcon('progress'),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: pl.nav.history,
          tabBarLabel: pl.nav.history,
          tabBarIcon: tabIcon('history'),
        }}
      />
    </Tabs>
  )
}
