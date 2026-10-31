import { Navigate, Outlet, useParams } from 'react-router-dom'
import { isProfilPathSegment } from '@/lib/profil/profilRoutes'

export function ProfilPathGuard() {
  const { profilId } = useParams()
  if (!profilId || !isProfilPathSegment(profilId)) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}
