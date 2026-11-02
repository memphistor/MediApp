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
7. **Baza (Faza 1):** `expo-sqlite`, schema jak [`src/db/schema.ts`](../../src/db/schema.ts).
8. **Powiadomienia (Faza 3):** `expo-notifications` — bez service workera PWA.

## UI

9. **Styling: React Native `StyleSheet` + tokeny kolorów** ([`apps/mobile/src/theme/colors.ts`](../../apps/mobile/src/theme/colors.ts)), spójne z [`src/styles/index.css`](../../src/styles/index.css). NativeWind można dodać później, jeśli przepisywanie ekranów przyspieszy.

## Wersje

10. **React** — wersja dobrana przez Expo (mobile); web na `main` może używać innej wersji React do czasu osobnego release.

## Środowisko

11. **Node 22** (`.nvmrc`) — zalecane dla Expo; unikać Node 26 przy problemach z Metro.

## Nie w Fazie 0

- `expo-sqlite`, `expo-notifications` — instalacja w Fazach 1 i 3.
