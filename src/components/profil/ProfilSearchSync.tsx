import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getActiveProfilId } from '@/db/database'
import {
  buildPathWithProfil,
  parseProfilFromPathname,
} from '@/lib/profil/profilRoutes'
import {
  isValidProfilId,
  LEGACY_PROFIL_PARAM,
} from '@/lib/profil/profilId'

/** Keeps profil slug in the path (`/testfp/…`) and migrates old `?profil=`. */
export function ProfilSearchSync() {
  const location = useLocation()
  const navigate = useNavigate()
  const profilId = getActiveProfilId()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const legacyProfil = params.get(LEGACY_PROFIL_PARAM)
    if (legacyProfil && isValidProfilId(legacyProfil)) {
      const { appPath: inner } = parseProfilFromPathname(location.pathname)
      params.delete(LEGACY_PROFIL_PARAM)
      const search = params.toString()
      navigate(
        {
          pathname: buildPathWithProfil(legacyProfil.toLowerCase(), inner),
          search: search ? `?${search}` : '',
          hash: location.hash,
        },
        { replace: true },
      )
      return
    }

    if (!profilId) return

    const { profilId: pathProfil, appPath: inner } = parseProfilFromPathname(
      location.pathname,
    )
    if (pathProfil === profilId) return

    navigate(
      {
        pathname: buildPathWithProfil(profilId, inner),
        search: location.search,
        hash: location.hash,
      },
      { replace: true },
    )
  }, [location.pathname, location.search, location.hash, profilId, navigate])

  return null
}
