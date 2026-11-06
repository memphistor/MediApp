import { Tabs } from 'expo-router'

import { FloatingTabBar } from '@/src/components/ui/FloatingTabBar'
import { pl } from '@/src/i18n/pl'

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => (
        <FloatingTabBar state={props.state} navigateToTab={props.navigateToTab} />
      )}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: pl.nav.today,
          tabBarLabel: pl.nav.today,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: pl.nav.calendar,
          tabBarLabel: pl.nav.calendar,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: pl.nav.add,
          tabBarLabel: pl.nav.add,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: pl.nav.progress,
          tabBarLabel: pl.nav.progress,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: pl.nav.history,
          tabBarLabel: pl.nav.history,
        }}
      />
    </Tabs>
  )
}
