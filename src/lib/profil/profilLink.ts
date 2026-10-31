import { getActiveProfilId, getDb } from '@/db/database'
import {
  buildHashWithKopia,
  exportAppSnapshot,
} from '@/lib/profil/appSnapshot'
import {
  buildAppUrlWithProfil,
  setStoredProfilId,
} from '@/lib/profil/profilId'
import {
  generateProfilId,
  isValidProfilId,
} from '@/lib/profil/profilValidation'

export function startProfilLink(customSlug?: string): void {
  const trimmed = customSlug?.trim().toLowerCase()
  const id =
    trimmed && isValidProfilId(trimmed) ? trimmed : generateProfilId()
  setStoredProfilId(id)
  window.location.assign(buildAppUrlWithProfil(id, { cacheBust: true }))
}

export async function buildShareableProfilUrl(options: {
  includeKopiaInHash: boolean
}): Promise<{ url: string; kopiaOmitted: boolean }> {
  const profilId = getActiveProfilId()
  if (!profilId) {
    throw new Error('Brak aktywnego profilu.')
  }

  let kopiaOmitted = false
  let url = buildAppUrlWithProfil(profilId, { cacheBust: true })

  if (options.includeKopiaInHash) {
    const snapshot = await exportAppSnapshot(getDb())
    const hash = buildHashWithKopia(snapshot)
    if (hash.length > 14_000) {
      kopiaOmitted = true
    } else {
      url = `${url}${hash}`
    }
  }

  return { url, kopiaOmitted }
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export { isValidProfilId, generateProfilId }
