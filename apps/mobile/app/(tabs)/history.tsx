import { useMemo, useState } from 'react'
import { ActivityIndicator, Pressable, Text, View } from 'react-native'
import { useRouter } from 'expo-router'

import { toDateKey, type DoseLog, type MedicationEntry } from '@mediapp/core'

import { useColorScheme } from '@/components/useColorScheme'
import { DoseStatusBadge } from '@/src/components/dose/DoseStatusBadge'
import { TakenAtEditor } from '@/src/components/history/TakenAtEditor'
import { MedicationIconBadge } from '@/src/components/medication/MedicationIconBadge'
import { AppText } from '@/src/components/ui/AppText'
import { Card } from '@/src/components/ui/Card'
import { TrendIcon } from '@/src/components/ui/icons'
import { Screen } from '@/src/components/ui/Screen'
import { SettingsButton } from '@/src/components/ui/SettingsIcon'
import { SegmentedControl } from '@/src/components/ui/SegmentedControl'
import { formatHm } from '@/src/format/dayLabel'
import { useHistoryData } from '@/src/hooks/useProgressData'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'

type Segment = 'past' | 'today' | 'planned'

function dayHeading(key: string): string {
  return new Date(`${key}T12:00:00`).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
  })
}

function groupByDay(logs: DoseLog[], direction: 'asc' | 'desc'): [string, DoseLog[]][] {
  const map = new Map<string, DoseLog[]>()
  for (const log of logs) {
    const key = toDateKey(new Date(log.scheduledAt))
    const list = map.get(key) ?? []
    list.push(log)
    map.set(key, list)
  }
  const keys = [...map.keys()].sort((a, b) => (direction === 'asc' ? a.localeCompare(b) : b.localeCompare(a)))
  return keys.map((key) => {
    const rows = (map.get(key) ?? []).slice().sort((a, b) => {
      const delta = new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
      return direction === 'asc' ? delta : -delta
    })
    return [key, rows]
  })
}

export default function HistoryScreen() {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const router = useRouter()
  const data = useHistoryData()
  const [segment, setSegment] = useState<Segment>('past')
  const todayKey = toDateKey(new Date())

  const meds = data?.medications ?? []
  const logs = data?.logs ?? []

  const visible = useMemo(() => {
    if (segment === 'today') {
      return logs.filter((log) => toDateKey(new Date(log.scheduledAt)) === todayKey)
    }
    if (segment === 'planned') {
      return logs.filter((log) => toDateKey(new Date(log.scheduledAt)) > todayKey)
    }
    return logs.filter((log) => toDateKey(new Date(log.scheduledAt)) < todayKey)
  }, [logs, segment, todayKey])

  const groups = useMemo(
    () => groupByDay(visible, segment === 'planned' ? 'asc' : 'desc'),
    [visible, segment],
  )

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <AppText variant="title" style={{ flex: 1 }}>{pl.history.title}</AppText>
        <SettingsButton />
      </View>
      <Pressable
        onPress={() => router.push('/progress/analytics')}
        style={{
          alignSelf: 'flex-start',
          marginTop: 16,
          height: 44,
          paddingLeft: 14,
          paddingRight: 18,
          borderRadius: 22,
          backgroundColor: scheme === 'dark' ? '#1C3D38' : '#D5EFEA',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <TrendIcon color={c.brand} />
        <Text style={{ color: c.brand, fontSize: 15, fontWeight: '500' }}>
          {pl.history.analytics}
        </Text>
      </Pressable>

      <View style={{ marginTop: 20 }}>
        <SegmentedControl
          value={segment}
          onChange={setSegment}
          options={[
            { value: 'past', label: pl.history.segmentPast },
            { value: 'today', label: pl.history.segmentToday },
            { value: 'planned', label: pl.history.segmentPlanned },
          ]}
        />
      </View>

      {!data ? (
        <ActivityIndicator color={c.brand} style={{ marginTop: 24 }} />
      ) : groups.length === 0 ? (
        <AppText variant="secondary" tone="muted" style={{ marginTop: 28 }}>
          {pl.history.sectionEmpty}
        </AppText>
      ) : (
        <View style={{ marginTop: 8 }}>
          {groups.map(([key, rows]) => (
            <View key={key}>
              <Text
                style={{
                  marginTop: 28,
                  marginBottom: 12,
                  marginLeft: 6,
                  fontSize: 15,
                  fontWeight: '500',
                  color: c.textMuted,
                }}
              >
                {dayHeading(key)}
              </Text>
              <Card padded={false}>
                {rows.map((log, index) => (
                  <HistoryRow
                    key={log.id}
                    log={log}
                    medication={meds.find((med) => med.id === log.medicationId)}
                    divider={index > 0}
                  />
                ))}
              </Card>
            </View>
          ))}
        </View>
      )}
    </Screen>
  )
}

function HistoryRow({
  log,
  medication,
  divider,
}: {
  log: DoseLog
  medication: MedicationEntry | undefined
  divider: boolean
}) {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const planned = formatHm(log.scheduledAt)
  const detail =
    log.status === 'taken' && log.takenAt
      ? `${planned} · ${pl.history.takenClock.replace('{time}', formatHm(log.takenAt))}`
      : planned

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingHorizontal: 22,
        paddingVertical: 16,
        borderTopWidth: divider ? 1 : 0,
        borderTopColor: c.line,
      }}
    >
      <MedicationIconBadge icon={medication?.icon ?? '💊'} color={medication?.color} boxSize={46} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={{ fontSize: 17, fontWeight: '500', color: c.text }} numberOfLines={1}>
          {medication?.name ?? '—'}
        </Text>
        <Text style={{ marginTop: 3, fontSize: 15, color: c.textMuted }}>{detail}</Text>
        {log.status === 'taken' && log.takenAt ? (
          <TakenAtEditor logId={log.id} takenAt={log.takenAt} linkOnly />
        ) : null}
      </View>
      <DoseStatusBadge status={log.status} log={log} medication={medication} />
    </View>
  )
}
