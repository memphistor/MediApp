import {
  buildPathWithProfil,
  parseProfilFromPathname,
} from '@/lib/profil/profilRoutes'
import {
  generateProfilId,
  isValidProfilId,
} from '@/lib/profil/profilValidation'

const LEGACY_PROFIL_PARAM = 'profil'
const STORAGE_KEY = 'mediapp-active-profil'

export { generateProfilId, isValidProfilId }

export function readProfilIdFromLocation(
  location: Pick<Location, 'pathname' | 'search' | 'hash'>,
): string | null {
  const fromPath = parseProfilFromPathname(location.pathname).profilId
  if (fromPath) return fromPath

  const fromSearch = new URLSearchParams(location.search).get(LEGACY_PROFIL_PARAM)
  if (fromSearch && isValidProfilId(fromSearch)) {
    return fromSearch.toLowerCase()
  }

  const hashBody = location.hash.startsWith('#') ? location.hash.slice(1) : location.hash
  if (hashBody) {
    const fromHash = new URLSearchParams(hashBody).get(LEGACY_PROFIL_PARAM)
    if (fromHash && isValidProfilId(fromHash)) {
      return fromHash.toLowerCase()
    }
  }
  return null
}

export function getStoredProfilId(): string | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && isValidProfilId(stored)) return stored.toLowerCase()
  } catch {
    /* private mode */
  }
  return null
}

export function setStoredProfilId(id: string | null): void {
  try {
    if (id) localStorage.setItem(STORAGE_KEY, id.toLowerCase())
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

export function buildAppUrlWithProfil(
  profilId: string,
  options?: { cacheBust?: boolean; appPath?: string },
): string {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '')
  const origin = window.location.origin
  const path = buildPathWithProfil(profilId, options?.appPath ?? '/')
  const url = `${origin}${base}${path}`
  if (!options?.cacheBust) return url
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}v=${Date.now()}`
}

export { LEGACY_PROFIL_PARAM, STORAGE_KEY as ACTIVE_PROFIL_STORAGE_KEY }
