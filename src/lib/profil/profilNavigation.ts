import { getActiveProfilId } from '@/db/database'
import { buildPathWithProfil } from '@/lib/profil/profilRoutes'

/** App route with optional profil prefix, e.g. `/testfp/settings`. */
export function appPath(appRoute: string, profilId?: string | null): string {
  const id = profilId !== undefined ? profilId : getActiveProfilId()
  const route = appRoute.startsWith('/') ? appRoute : `/${appRoute}`
  return buildPathWithProfil(id, route)
}
