export const CURRENT_PRIVACY_POLICY_VERSION = '2026-10'

export function requiresPrivacyConsent(
  acceptedVersion: string | null | undefined,
): boolean {
  return acceptedVersion !== CURRENT_PRIVACY_POLICY_VERSION
}
