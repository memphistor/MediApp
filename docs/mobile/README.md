# MediApp — wersja mobilna (Expo)

Natywna aplikacja na **iOS** i **Android** rozwijana na gałęzi **`mobile`**.

## Web vs mobile

| | Gałąź | Wdrożenie |
|---|--------|-----------|
| **Web (PWA)** | `main` | GitHub Pages |
| **Mobile** | `mobile` | EAS Build → App Store / Google Play |

Kod web w tym repozytorium (katalog `src/`) na gałęzi `mobile` służy jako baza do synchronizacji logiki do `packages/core`. Nowe funkcje produktu na sklepy dodajemy w `apps/mobile`. **Faza 6:** checklist wydania sklepowego — [`release-checklist.md`](./release-checklist.md).

## Struktura

```
apps/mobile/       Expo + expo-router
packages/core/     @mediapp/core — typy i logika bez UI
docs/mobile/       decyzje, checklisty, synchronizacja z main
```

## Uruchomienie (dev)

```bash
npm install
npm run mobile:dev
```

**iPhone bez kabla:** [dev-on-iphone.md](./dev-on-iphone.md) — Expo Go / development build vs TestFlight.

Szczegóły: [tech-decisions.md](./tech-decisions.md), synchronizacja z web: [sync-from-main.md](./sync-from-main.md).
