/// <reference lib="webworker" />
import { clientsClaim } from 'workbox-core'
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'

declare let self: ServiceWorkerGlobalScope

precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()
clientsClaim()

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const data = event.notification.data as { logIds?: string[] } | undefined
  const logIds = data?.logIds ?? []
  const action = event.action || 'open'

  event.waitUntil(
    (async () => {
      const clients = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
      })
      for (const client of clients) {
        client.postMessage({ type: 'REMINDER_ACTION', action, logIds })
        await client.focus()
        return
      }
      const base = self.registration.scope
      const url = `${base}?reminderAction=${encodeURIComponent(action)}&logIds=${encodeURIComponent(logIds.join(','))}`
      await self.clients.openWindow(url)
    })(),
  )
})
