# QA regresja (automatyczna) — Faza 6

Data: 2026-11-02

## CI lokalne (pass)

| Check | Wynik |
|-------|--------|
| `npm run test:core` | 59 testów OK |
| `npm run test:mobile` | 10 testów OK (w tym `privacy-pl.test.ts`) |
| `npm run lint -w mediapp-mobile` | tsc OK |
| `npx expo-doctor` (apps/mobile) | 20/20 OK |

## Manual na urządzeniu (wymagane przed production)

Użyj [`release-checklist.md`](./release-checklist.md) §4 — szczególnie **notyfikacja na real device** (iOS/Android).

Po pierwszym buildzie preview zainstaluj AAB/APK/IPA z EAS i odhacz scenariusze w checklistie.

## EAS

- Projekt: `e6240fd1-1ad9-4b3f-ad9a-6be8762d538b`
- Pierwszy Android preview: zobacz [`eas-first-build.md`](./eas-first-build.md) i dashboard Expo
- iOS preview: pierwszy build **interaktywny** (credentials) — patrz `eas-first-build.md`
