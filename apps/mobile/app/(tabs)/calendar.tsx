import { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Pressable, Text, View } from 'react-native'

import {
  dayComplianceTone,
  scheduledDoses,
  toDateKey,
  type DoseLog,
  type MedicationEntry,
} from '@mediapp/core'

import { useColorScheme } from '@/components/useColorScheme'
import { calendarDayStyle } from '@/src/components/calendar/calendarDayStyle'
import {
  buildMonthGrid,
  CALENDAR_WEEKDAYS,
} from '@/src/components/calendar/monthGrid'
import { DoseStatusBadge } from '@/src/components/dose/DoseStatusBadge'
import { MedicationIconBadge } from '@/src/components/medication/MedicationIconBadge'
import { AppText } from '@/src/components/ui/AppText'
import { Card } from '@/src/components/ui/Card'
import { CircleButton } from '@/src/components/ui/CircleButton'
import { BackIcon, ChevronRightIcon } from '@/src/components/ui/icons'
import { Screen } from '@/src/components/ui/Screen'
import { SettingsButton } from '@/src/components/ui/SettingsIcon'
import { useCalendarMonthLogs } from '@/src/hooks/useProgressData'
import { useStorage } from '@/src/context/StorageContext'
import { capitalizePl, formatHm } from '@/src/format/dayLabel'
import { listMedications } from '@/src/storage/repositories/medicationRepository'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'
import type { ThemePalette } from '@/src/theme/colors'

function legendSwatch(
  kind: 'full' | 'partial' | 'missed' | 'selected',
  c: ThemePalette,
) {
  if (kind === 'full') return { backgroundColor: c.brand, borderWidth: 0, borderColor: 'transparent' }
  if (kind === 'partial') return { backgroundColor: c.partialFill, borderWidth: 0, borderColor: 'transparent' }
  if (kind === 'missed') return { backgroundColor: c.missedDayFill, borderWidth: 0, borderColor: 'transparent' }
  return { backgroundColor: c.surfaceElevated, borderWidth: 2, borderColor: c.brand }
}

export default function CalendarScreen() {
  const scheme = useColorScheme() ?? 'light'
  const c = themeColors(scheme)
  const now = useMemo(() => new Date(), [])
  const [cursor, setCursor] = useState({
    year: now.getFullYear(),
    month: now.getMonth(),
  })
  const [selectedKey, setSelectedKey] = useState<string | null>(toDateKey(now))
  const { year, month } = cursor
  const logs = useCalendarMonthLogs(year, month)
  const { refreshKey } = useStorage()
  const [medications, setMedications] = useState<MedicationEntry[]>([])

  useEffect(() => {
    void listMedications().then(setMedications)
  }, [refreshKey, logs])

  const medMap = useMemo(() => {
    const map = new Map<string, MedicationEntry>()
    for (const med of medications) map.set(med.id, med)
    return map
  }, [medications])

  const byDay = useMemo(() => {
    const map = new Map<string, DoseLog[]>()
    for (const log of logs ?? []) {
      const key = toDateKey(new Date(log.scheduledAt))
      const list = map.get(key) ?? []
      list.push(log)
      map.set(key, list)
    }
    return map
  }, [logs])

  const cells = buildMonthGrid(year, month)
  const monthLabel = capitalizePl(
    new Date(year, month, 1).toLocaleDateString('pl-PL', {
      month: 'long',
      year: 'numeric',
    }),
  )

  const selectedLogs = selectedKey ? (byDay.get(selectedKey) ?? []) : []
  const selectedPlan = scheduledDoses(selectedLogs)
  const selectedPrn = selectedLogs.filter((log) => log.source === 'prn')
  const selectedTitle = selectedKey
    ? capitalizePl(
        new Date(`${selectedKey}T12:00:00`).toLocaleDateString('pl-PL', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        }),
      )
    : ''

  const shiftMonth = (delta: number) => {
    setCursor((cur) => {
      const next = new Date(cur.year, cur.month + delta, 1)
      return { year: next.getFullYear(), month: next.getMonth() }
    })
    setSelectedKey(null)
  }

  const legend = [
    ['full', pl.calendar.legendFull],
    ['partial', pl.calendar.legendPartial],
    ['missed', pl.calendar.legendMissed],
    ['selected', pl.calendar.legendSelected],
  ] as const

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <AppText variant="title" style={{ flex: 1 }}>{pl.calendar.title}</AppText>
        <SettingsButton />
      </View>
      <View
        style={{
          marginTop: 18,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: '400', color: c.text }}>{monthLabel}</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <CircleButton
            size={40}
            onPress={() => shiftMonth(-1)}
            accessibilityLabel={pl.calendar.prevMonth}
          >
            <BackIcon color={c.text} size={20} />
          </CircleButton>
          <CircleButton
            size={40}
            onPress={() => shiftMonth(1)}
            accessibilityLabel={pl.calendar.nextMonth}
          >
            <ChevronRightIcon color={c.text} />
          </CircleButton>
        </View>
      </View>

      {logs === null ? (
        <ActivityIndicator color={c.brand} style={{ marginTop: 24 }} />
      ) : (
        <>
          <Card padded={false} style={{ marginTop: 14, paddingTop: 16, paddingBottom: 8 }}>
            <View style={{ flexDirection: 'row' }}>
              {CALENDAR_WEEKDAYS.map((label) => (
                <Text
                  key={label}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    color: c.textMuted,
                    fontSize: 13,
                    fontWeight: '500',
                  }}
                >
                  {label}
                </Text>
              ))}
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
              {cells.map((cell, index) => {
                if (!cell.date) {
                  return <View key={`empty-${index}`} style={{ width: `${100 / 7}%`, height: 44 }} />
                }
                const key = toDateKey(cell.date)
                const tone = dayComplianceTone(byDay.get(key) ?? [])
                const look = calendarDayStyle(tone, c)
                const selected = selectedKey === key
                const backgroundColor = selected && (tone === 'planned' || tone === 'empty')
                  ? c.surfaceElevated
                  : look.backgroundColor
                const textColor = selected && tone !== 'full' && tone !== 'missed' && tone !== 'partial'
                  ? c.brand
                  : look.textColor
                return (
                  <Pressable
                    key={key}
                    onPress={() => setSelectedKey(key)}
                    style={{ width: `${100 / 7}%`, height: 44, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor,
                        borderWidth: selected ? 2 : look.borderWidth,
                        borderColor: selected ? c.brand : look.borderColor,
                      }}
                    >
                      <Text style={{ color: textColor, fontSize: 16, fontWeight: selected ? '500' : look.fontWeight }}>
                        {cell.day}
                      </Text>
                    </View>
                  </Pressable>
                )
              })}
            </View>
            <View
              style={{
                marginTop: 8,
                borderTopWidth: 1,
                borderTopColor: c.line,
                flexDirection: 'row',
                flexWrap: 'wrap',
                paddingHorizontal: 18,
                paddingVertical: 16,
                gap: 12,
              }}
            >
              {legend.map(([kind, label]) => {
                const swatch = legendSwatch(kind, c)
                return (
                  <View key={kind} style={{ width: '47%', flexDirection: 'row', alignItems: 'center', gap: 9 }}>
                    <View
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 7,
                        backgroundColor: swatch.backgroundColor,
                        borderWidth: swatch.borderWidth,
                        borderColor: swatch.borderColor,
                      }}
                    />
                    <Text style={{ flex: 1, fontSize: 13, lineHeight: 17, color: c.missedText }}>
                      {label}
                    </Text>
                  </View>
                )
              })}
            </View>
          </Card>

          {selectedKey ? (
            <View style={{ marginTop: 24 }}>
              <AppText variant="section" style={{ marginBottom: 12 }}>
                {selectedTitle}
              </AppText>
              {selectedPlan.length === 0 && selectedPrn.length === 0 ? (
                <AppText variant="secondary" tone="muted">{pl.calendar.dayEmpty}</AppText>
              ) : (
                <Card padded={false}>
                  {[...selectedPlan, ...selectedPrn].map((log, index) => {
                    const med = medMap.get(log.medicationId)
                    return (
                      <View
                        key={log.id}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 14,
                          paddingHorizontal: 22,
                          paddingVertical: 12,
                          borderTopWidth: index === 0 ? 0 : 1,
                          borderTopColor: c.line,
                        }}
                      >
                        <MedicationIconBadge
                          icon={med?.icon ?? '💊'}
                          color={med?.color}
                          boxSize={44}
                        />
                        <View style={{ flex: 1, minWidth: 0 }}>
                          <Text style={{ fontSize: 17, fontWeight: '500', color: c.text }} numberOfLines={1}>
                            {med?.name ?? '—'}
                          </Text>
                          <Text style={{ marginTop: 3, fontSize: 15, color: c.textMuted }}>
                            {formatHm(log.scheduledAt)}
                            {med?.doseText ? ` · ${med.doseText}` : ''}
                          </Text>
                        </View>
                        <DoseStatusBadge status={log.status} log={log} medication={med} />
                      </View>
                    )
                  })}
                </Card>
              )}
            </View>
          ) : null}
        </>
      )}
    </Screen>
  )
}
