# Synchronizacja logiki z gałęzi `main`

Gdy na **`main`** zmienia się kreator, harmonogram, gamifikacja lub typy danych, przenieś te same zmiany do **`packages/core`** na gałęzi `mobile`.

## Co kopiować

| Źródło na `main` | Cel |
|------------------|-----|
| `src/types/*.ts` | `packages/core/src/types/` |
| `src/lib/dates.ts`, `id.ts` | `packages/core/src/lib/` |
| `src/lib/schedule/**` | `packages/core/src/lib/schedule/` |
| `src/lib/wizard/buildMedication.ts` | core — **bez** `mergeWizardFormFromDom` |
| `src/lib/wizard/medicationColors.ts`, `medicationIcons.ts` | core |
| `src/lib/medication/**` | core |
| `src/lib/dose/doseStatusDisplay.ts` | core |
| `src/lib/gamification/**` | core |
| `src/lib/calendar/*` (bez DOM) | core |
| `src/lib/history/historySections.ts` | core |
| Powiązane `*.test.ts` | obok modułów w core |

## Czego nie kopiować do core

- `src/lib/profil/profilId.ts`, `profilLink.ts`, `profilNavigation.ts`, `profilRoutes.ts` — URL i multi-profil (mobile v1: jeden profil na instalację).
- `src/lib/profil/appSnapshot.ts` — implementacja Dexie zostaje na web; **walidacja** w `packages/core/src/snapshot/validateSnapshot.ts`.
- `mergeWizardFormFromDom` w kreatorze — tylko web (FormData / DOM).

## Procedura

1. `git fetch origin main`
2. Porównaj diff: `git diff origin/main -- src/types src/lib`
3. Ręcznie lub cherry-pick z commitów na `main` — unikaj nadpisywania całego `packages/core` bez review.
4. W root repo: `npm run test:core`
5. Commit na `mobile`.

## Importy w core

W `packages/core` używaj względnych importów lub aliasu `@mediapp/core/*` wewnątrz pakietu — **nie** `@/` wskazującego na web `src/`.
