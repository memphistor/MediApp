import { SymbolView } from 'expo-symbols'
import { Link, Tabs } from 'expo-router'
import { Platform, Pressable } from 'react-native'

import { useClientOnlyValue } from '@/components/useClientOnlyValue'
import { useColorScheme } from '@/components/useColorScheme'
import Colors from '@/constants/Colors'
import { pl } from '@/src/i18n/pl'

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light'

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: pl.nav.today,
          tabBarLabel: pl.nav.today,
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'sun.max.fill',
                android: 'wb_sunny',
                web: 'wb_sunny',
              }}
              tintColor={color}
              size={24}
            />
          ),
          headerRight: () => (
            <Link href="/settings" asChild>
              <Pressable style={{ marginRight: 12 }}>
                {({ pressed }) => (
                  <SymbolView
                    name={{
                      ios: 'line.3.horizontal',
                      android: 'menu',
                      web: 'menu',
                    }}
                    size={22}
                    tintColor={Colors[colorScheme].text}
                    style={{ opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: pl.nav.calendar,
          tabBarLabel: pl.nav.calendar,
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'calendar',
                android: 'calendar_today',
                web: 'calendar_today',
              }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: pl.nav.add,
          tabBarLabel: pl.nav.add,
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'plus.circle.fill',
                android: 'add_circle',
                web: 'add_circle',
              }}
              tintColor={color}
              size={26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: pl.nav.progress,
          tabBarLabel: pl.nav.progress,
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'chart.bar.fill',
                android: 'bar_chart',
                web: 'bar_chart',
              }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: pl.nav.history,
          tabBarLabel: pl.nav.history,
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'clock.fill',
                android: 'history',
                web: 'history',
              }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  )
}
