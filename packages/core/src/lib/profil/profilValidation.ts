/** Safe slug for IndexedDB suffix and URL path (4–32 chars). */
const PROFIL_ID_RE = /^[a-z0-9][a-z0-9_-]{3,31}$/i

export function isValidProfilId(id: string): boolean {
  return PROFIL_ID_RE.test(id)
}

export function generateProfilId(): string {
  const raw =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().replace(/-/g, '')
      : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`
  return raw.slice(0, 12).toLowerCase()
}
