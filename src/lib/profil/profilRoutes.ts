import { isValidProfilId } from '@/lib/profil/profilValidation'

/** First URL segment — not a profil slug (app routes). */
export const RESERVED_APP_SEGMENTS = new Set([
  'onboarding',
  'privacy',
  'privacy-consent',
  'add',
  'calendar',
  'history',
  'progress',
  'settings',
  'medication',
  'help',
  'as-needed',
])

export function isProfilPathSegment(segment: string): boolean {
  const lower = segment.toLowerCase()
  if (RESERVED_APP_SEGMENTS.has(lower)) return false
  return isValidProfilId(segment)
}

export function parseProfilFromPathname(pathname: string): {
  profilId: string | null
  appPath: string
} {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) {
    return { profilId: null, appPath: '/' }
  }
  const first = segments[0]
  if (!isProfilPathSegment(first)) {
    return { profilId: null, appPath: pathname || '/' }
  }
  const rest = segments.slice(1)
  const appPath = rest.length > 0 ? `/${rest.join('/')}` : '/'
  return { profilId: first.toLowerCase(), appPath }
}

export function buildPathWithProfil(
  profilId: string | null | undefined,
  appPath: string,
): string {
  if (isGlobalAppPath(appPath)) {
    return appPath.startsWith('/') ? appPath : `/${appPath}`
  }
  const path = appPath.startsWith('/') ? appPath : `/${appPath}`
  if (!profilId) {
    return path === '' ? '/' : path
  }
  if (path === '/') {
    return `/${profilId.toLowerCase()}`
  }
  return `/${profilId.toLowerCase()}${path}`
}

/** Routes outside profil prefix (always at app root). */
export const GLOBAL_APP_PATHS = new Set(['/privacy', '/onboarding'])

export function isGlobalAppPath(pathname: string): boolean {
  const path = pathname.split('?')[0]?.split('#')[0] ?? pathname
  if (GLOBAL_APP_PATHS.has(path)) return true
  const { appPath } = parseProfilFromPathname(path)
  return GLOBAL_APP_PATHS.has(appPath)
}
