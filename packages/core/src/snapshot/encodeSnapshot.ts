import type { AppSnapshot } from './types'
import { SNAPSHOT_VERSION } from './types'

/** Base64url encode (no padding) — works in Node and modern JS. */
export function encodeSnapshotBase64Url(snapshot: AppSnapshot): string {
  const json = JSON.stringify(snapshot)
  const bytes = new TextEncoder().encode(json)
  let binary = ''
  for (const b of bytes) {
    binary += String.fromCharCode(b)
  }
  const b64 =
    typeof btoa === 'function'
      ? btoa(binary)
      : Buffer.from(bytes).toString('base64')
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function decodeSnapshotBase64Url(encoded: string): AppSnapshot | null {
  try {
    let b64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
    while (b64.length % 4) b64 += '='
    const binary =
      typeof atob === 'function'
        ? atob(b64)
        : Buffer.from(b64, 'base64').toString('binary')
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
    const json = new TextDecoder().decode(bytes)
    const parsed = JSON.parse(json) as unknown
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      (parsed as { version?: number }).version === SNAPSHOT_VERSION
    ) {
      return parsed as AppSnapshot
    }
    return null
  } catch {
    return null
  }
}
