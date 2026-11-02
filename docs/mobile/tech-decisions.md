# Decyzje techniczne — MediApp mobile

## Stack

1. **Expo managed (SDK 58) + EAS Build** — jeden kod na Google Play i App Store.
2. **expo-router** — mapowanie tras jak na web ([`src/routes/AppRouter.tsx`](../../src/routes/AppRouter.tsx)).
3. **TypeScript strict** w `apps/mobile` i `packages/core`.

## Produkt

4. **Jeden profil na instalację** — brak logowania, brak slugów URL; jedna baza SQLite w Fazie 1 (`MediApp.db`).
5. **Brak synchronizacji z web v1** — opcjonalny import JSON w Fazie 5.

## Warstwy

6. **`@mediapp/core`** — typy i logika bez UI/DOM; testy Vitest w pakiecie.
7. **Baza (Faza 1 — zaimplementowana):** `expo-sqlite`, plik **`MediApp.db`**, warstwa w [`apps/mobile/src/storage/`](../../apps/mobile/src/storage/) (schema v1, migracje, repozytoria, `syncDoseLogs`, `medicationStock`). Schema jak [`src/db/schema.ts`](../../src/db/schema.ts); bez tabeli `medication_notes` do późniejszej fazy.
8. **Kreator i pozycje (Faza 2 — zaimplementowana):** 3-krokowy kreator na tabie Dodaj i edycja w `medication/[id]/edit`; szczegóły w `medication/[id]` (usuń, PRN, zapas, toggle przypomnień). UI w [`apps/mobile/src/components/wizard/`](../../apps/mobile/src/components/wizard/) i [`components/medication/`](../../apps/mobile/src/components/medication/); walidacja i `buildMedicationFromWizard` z `@mediapp/core`. Pickery: `@react-native-picker/picker`, `@react-native-community/datetimepicker`.
9. **Powiadomienia (Faza 3 — zaimplementowana):** `expo-notifications` — model hybrydowy: scheduled lokalnie po sync + tick co 30 s (persistent/snooze); akcje Wzięte/Odłóż/Pomiń; [`apps/mobile/src/notifications/`](../../apps/mobile/src/notifications/); `buildReminderGroups` w `@mediapp/core`. Bez service workera PWA.
10. **Ekrany produktowe (Faza 4 — zaimplementowana):** kalendarz, historia, postęp + `/progress/analytics`, lista PRN (`/as-needed`), onboarding z gate, pełne ustawienia (motyw, font, usuń dane); gamifikacja UI (`react-native-svg` DayRing, odznaki, tydzień) na istniejącym `gamificationRepository` + `@mediapp/core`. Bez eksportu RODO i profilu URL (Fazy 5–6).

## UI

11. **Styling: React Native `StyleSheet` + tokeny kolorów** ([`apps/mobile/src/theme/colors.ts`](../../apps/mobile/src/theme/colors.ts)), spójne z [`src/styles/index.css`](../../src/styles/index.css). NativeWind można dodać później, jeśli przepisywanie ekranów przyspieszy.

## Wersje

12. **React** — wersja dobrana przez Expo (mobile); web na `main` może używać innej wersji React do czasu osobnego release.

## Środowisko

13. **Node 22** (`.nvmrc`) — zalecane dla Expo; unikać Node 26 przy problemach z Metro.

## Nie w Fazie 0

- ~~`expo-sqlite`~~ — **Faza 1** (storage w `apps/mobile/src/storage/`)
- ~~`expo-notifications`~~ — **Faza 3** (lokalne przypomnienia)
