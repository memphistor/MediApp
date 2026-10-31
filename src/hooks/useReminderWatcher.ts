import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { appPath } from '@/lib/profil/profilNavigation'
import { useSettings } from '@/context/SettingsContext'
import {
  handleReminderActionMessage,
  runReminderTick,
} from '@/services/reminders/reminderEngine'

function parseReminderFromUrl(): { action: string; logIds: string[] } | null {
  const params = new URLSearchParams(window.location.search)
  const action = params.get('reminderAction')
  const ids = params.get('logIds')
  if (!action || !ids) return null
  return { action, logIds: ids.split(',').filter(Boolean) }
}

function focusDose(
  navigate: ReturnType<typeof useNavigate>,
  logIds: string[],
): void {
  const id = logIds[0]
  if (!id) return
  navigate(`${appPath('/')}?focusLog=${encodeURIComponent(id)}`)
}

export function useReminderWatcher(): void {
  const navigate = useNavigate()
  const { settings, ready, replaceSettings } = useSettings()
  const settingsRef = useRef(settings)
  settingsRef.current = settings

  useEffect(() => {
    if (!ready) return

    const fromUrl = parseReminderFromUrl()
    if (fromUrl) {
      if (fromUrl.action === 'open') {
        focusDose(navigate, fromUrl.logIds)
        return
      }
      void handleReminderActionMessage(
        fromUrl.action,
        fromUrl.logIds,
        settings,
        replaceSettings,
      ).then(() => {
        const url = new URL(window.location.href)
        url.searchParams.delete('reminderAction')
        url.searchParams.delete('logIds')
        window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`)
      })
    }
  }, [ready, replaceSettings, settings, navigate])

  useEffect(() => {
    if (!ready || !settings.notificationsEnabled) return

    const tick = () => {
      void runReminderTick(settingsRef.current)
    }
    tick()
    const id = window.setInterval(tick, 30_000)
    const onVisible = () => {
      if (document.visibilityState === 'visible') tick()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [
    ready,
    settings.notificationsEnabled,
    settings.persistentAlarmEnabled,
    settings.snoozeMinutesDefault,
    settings.snoozeUntilByLogId,
  ])

  useEffect(() => {
    if (!ready) return

    const onMessage = (event: MessageEvent) => {
      const data = event.data as {
        type?: string
        action?: string
        logIds?: string[]
      }
      if (data.type !== 'REMINDER_ACTION' || !data.logIds?.length) return
      if ((data.action ?? 'open') === 'open') {
        focusDose(navigate, data.logIds)
        return
      }
      void handleReminderActionMessage(
        data.action ?? 'open',
        data.logIds,
        settings,
        replaceSettings,
      )
    }

    navigator.serviceWorker?.addEventListener('message', onMessage)
    return () => {
      navigator.serviceWorker?.removeEventListener('message', onMessage)
    }
  }, [ready, settings, replaceSettings, navigate])
}
