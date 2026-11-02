import { useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import {
  dayComplianceTone,
  formatTimingDeltaMinutes,
  groupLogsByDateKey,
  scheduledDoses,
  timingLabelForLog,
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
import { TakenAtEditor } from '@/src/components/history/TakenAtEditor'
import { CollapsibleSection } from '@/src/components/layout/CollapsibleSection'
import { useCalendarMonthLogs } from '@/src/hooks/useProgressData'
import { useStorage } from '@/src/context/StorageContext'
import { listMedications } from '@/src/storage/repositories/medicationRepository'
import { pl } from '@/src/i18n/pl'
import { themeColors } from '@/src/theme/colors'

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function CalendarScreen() {
  const scheme = useColorScheme()
  const c = themeColors(scheme)
  const now = new Date()
  const [cursor, setCursor] = useState({
    year: now.getFullYear(),
    month: now.getMonth(),
  })
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
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
    return groupLogsByDateKey(logs ?? [])
  }, [logs])

  const cells = buildMonthGrid(year, month)
  const monthLabel = new Date(year, month, 1).toLocaleDateString('pl-PL', {
    month: 'long',
    year: 'numeric',
  })

  const selectedLogs = selectedKey ? (byDay.get(selectedKey) ?? []) : []
  const selectedPlan = scheduledDoses(selectedLogs)
  const selectedPrn = selectedLogs.filter((l) => l.source === 'prn')

  const shiftMonth = (delta: number) => {
    setCursor((cur) => {
      const next = new Date(cur.year, cur.month + delta, 1)
      return { year: next.getFullYear(), month: next.getMonth() }
    })
    setSelectedKey(null)
  }

  const renderLog = (log: DoseLog) => {
    const med = medMap.get(log.medicationId)
    const timingLabels = pl.progress.timing
    const showTiming = log.status === 'taken' && log.source !== 'prn'
    const timingText = showTiming
      ? timingLabelForLog(log, {
          onTime: timingLabels.onTime,
          early: timingLabels.early,
          late: timingLabels.late,
          unknown: timingLabels.unknown,
          missed: timingLabels.missed,
          planned: pl.doseStatus.planned,
        })
      : null
    const delta = formatTimingDeltaMinutes(log)

    return (
      <View
        key={log.id}
        style={[styles.logRow, { borderColor: c.border, backgroundColor: c.surfaceElevated }]}
      >
        <View style={styles.logMain}>
          <Text style={[styles.logName, { color: c.text }]}>
            {med?.name ?? '—'}{' '}
            <Text style={{ color: c.textMuted }}>· {formatTime(log.scheduledAt)}</Text>
          </Text>
          {timingText ? (
            <Text style={[styles.timing, { color: c.textMuted }]}>
              {timingText}
              {delta && timingText !== timingLabels.missed ? ` (${delta})` : ''}
            </Text>
          ) : null}
          {log.status === 'taken' && log.takenAt ? (
            <TakenAtEditor logId={log.id} takenAt={log.takenAt} />
          ) : null}
        </View>
        <DoseStatusBadge status={log.status} log={log} medication={med} />
      </View>
    )
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.surface }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: c.text }]}>{pl.calendar.title}</Text>
          <View style={styles.nav}>
            <Pressable
              onPress={() => shiftMonth(-1)}
              style={[styles.navBtn, { borderColor: c.border }]}
              accessibilityLabel={pl.calendar.prevMonth}
            >
              <Text style={{ color: c.text, fontSize: 20 }}>‹</Text>
            </Pressable>
            <Pressable
              onPress={() => shiftMonth(1)}
              style={[styles.navBtn, { borderColor: c.border }]}
              accessibilityLabel={pl.calendar.nextMonth}
            >
              <Text style={{ color: c.text, fontSize: 20 }}>›</Text>
            </Pressable>
          </View>
        </View>
        <Text style={[styles.monthLabel, { color: c.textMuted }]}>{monthLabel}</Text>

        {logs === null ? (
          <ActivityIndicator color={c.brand} style={{ marginTop: 24 }} />
        ) : (
          <>
            <View style={styles.weekRow}>
              {CALENDAR_WEEKDAYS.map((w) => (
                <Text key={w} style={[styles.weekday, { color: c.textMuted }]}>
                  {w}
                </Text>
              ))}
            </View>
            <View style={styles.grid}>
              {cells.map((cell, i) => {
                if (!cell.date) {
                  return <View key={`empty-${i}`} style={styles.cellEmpty} />
                }
                const key = toDateKey(cell.date)
                const dayLogs = byDay.get(key) ?? []
                const tone = dayComplianceTone(dayLogs)
                const dayStyle = calendarDayStyle(tone, c)
                const hasPrn = dayLogs.some((l) => l.source === 'prn')
                const selected = selectedKey === key
                return (
                  <Pressable
                    key={key}
                    onPress={() => setSelectedKey(key)}
                    style={[
                      styles.cell,
                      {
                        backgroundColor: dayStyle.backgroundColor,
                        borderColor: selected ? c.brand : dayStyle.borderColor,
                        borderWidth: selected ? 2 : dayStyle.borderWidth,
                      },
                    ]}
                  >
                    <Text style={{ color: dayStyle.textColor, fontWeight: dayStyle.fontWeight }}>
                      {cell.day}
                    </Text>
                    {hasPrn ? (
                      <View style={[styles.prnDot, { backgroundColor: c.brand }]} />
                    ) : null}
                  </Pressable>
                )
              })}
            </View>

            <CollapsibleSection title={pl.calendar.legendToggle}>
              <Text style={[styles.legendLine, { color: c.textMuted }]}>
                {pl.calendar.legendFull}
              </Text>
              <Text style={[styles.legendLine, { color: c.textMuted }]}>
                {pl.calendar.legendPartial}
              </Text>
              <Text style={[styles.legendLine, { color: c.textMuted }]}>
                {pl.calendar.legendMissed}
              </Text>
              <Text style={[styles.legendLine, { color: c.textMuted }]}>
                {pl.calendar.legendPlanned}
              </Text>
              <Text style={[styles.legendLine, { color: c.textMuted }]}>
                {pl.calendar.legendPrn}
              </Text>
            </CollapsibleSection>

            {selectedKey ? (
              <View style={styles.dayDetail}>
                <Text style={[styles.dayTitle, { color: c.text }]}>
                  {new Date(`${selectedKey}T12:00:00`).toLocaleDateString('pl-PL', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </Text>
                {selectedPlan.length === 0 && selectedPrn.length === 0 ? (
                  <Text style={{ color: c.textMuted }}>{pl.calendar.dayEmpty}</Text>
                ) : (
                  <>
                    {selectedPlan.length > 0 ? (
                      <View>
                        <Text style={[styles.sectionLabel, { color: c.textMuted }]}>
                          {pl.calendar.planSection}
                        </Text>
                        {selectedPlan.map(renderLog)}
                      </View>
                    ) : null}
                    {selectedPrn.length > 0 ? (
                      <View style={{ marginTop: 12 }}>
                        <Text style={[styles.sectionLabel, { color: c.textMuted }]}>
                          {pl.calendar.prnSection}
                        </Text>
                        {selectedPrn.map(renderLog)}
                      </View>
                    ) : null}
                  </>
                )}
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 32 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '600' },
  nav: { flexDirection: 'row', gap: 8 },
  navBtn: {
    minWidth: 44,
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthLabel: { marginTop: 8, fontSize: 14, textTransform: 'capitalize' },
  weekRow: { flexDirection: 'row', marginTop: 16 },
  weekday: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  cellEmpty: { width: `${100 / 7}%`, aspectRatio: 1 },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginBottom: 4,
  },
  prnDot: {
    position: 'absolute',
    bottom: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendLine: { fontSize: 12, marginBottom: 4 },
  dayDetail: { marginTop: 20, gap: 8 },
  dayTitle: { fontSize: 16, fontWeight: '600' },
  sectionLabel: { fontSize: 12, fontWeight: '600', marginBottom: 8 },
  logRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  logMain: { flex: 1 },
  logName: { fontSize: 14, fontWeight: '500' },
  timing: { fontSize: 12, marginTop: 2 },
})
