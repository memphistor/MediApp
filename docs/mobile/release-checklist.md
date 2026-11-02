# Release checklist — MediApp mobile (Faza 6)

Definition of Done operacyjne przed **`eas submit`**. Odznaczaj ręcznie po wykonaniu.

**Gałąź:** `mobile` · **Node:** 22 (`nvm use`)

---

## 1. Compliance

- [ ] [`apps/mobile/src/i18n/privacy-pl.ts`](../apps/mobile/src/i18n/privacy-pl.ts) — SQLite, bez tekstów PWA
- [ ] [`public/privacy-mobile.html`](../../public/privacy-mobile.html) — spójne z in-app
- [ ] Pages wdrożone → URL działa: https://memphistor.github.io/MediApp/privacy-mobile.html
- [ ] Kontakt w [`docs/privacy-policy.md`](../privacy-policy.md) (+ e-mail w konsoli sklepu jeśli wymagany)

---

## 2. EAS i wersja

- [ ] `eas login` + `eas init` → `extra.eas.projectId` w [`apps/mobile/app.json`](../../apps/mobile/app.json)
- [ ] Backup credentials Android: `eas credentials` → pobierz keystore
- [ ] `expo.version` = **1.0.0**
- [ ] `npx expo-doctor` (w `apps/mobile`)

---

## 3. Buildy preview

```bash
cd apps/mobile
npx eas build --profile preview --platform ios
npx eas build --profile preview --platform android
```

- [ ] iOS preview zainstalowany (TestFlight lub internal ad hoc)
- [ ] Android preview (internal track) **lub** decyzja dokumentowana: **iOS-only v1**

---

## 4. QA manual (§6.7 planu Fazy 6)

| # | Scenariusz | iOS | Android |
|---|------------|-----|---------|
| 1 | Cold start → onboarding → Dziś | | |
| 2 | Dodaj lek → sync → kalendarz | | |
| 3 | Wzięte / Pomiń → historia / postęp | | |
| 4 | Notyfikacja → akcja Wzięte (**real device**) | | |
| 5 | Usuń dane → onboarding | | |
| 6 | `/privacy` — treść mobile | | |
| 7 | Motyw ciemny / duży font | | |
| 8 | Eksport / import JSON (Faza 5) | | |

**Tester / data:** _______________

---

## 5. Sklepy

- [ ] Wypełniono [`store-privacy-labels.md`](./store-privacy-labels.md) w konsolach
- [ ] Listing wg [`store-listing.md`](./store-listing.md) + screenshoty
- [ ] Privacy Policy URL w App Store Connect i Play Console

---

## 6. Produkcja

```bash
cd apps/mobile
npx eas build --profile production --platform all
npx eas submit --profile production --platform ios
npx eas submit --profile production --platform android
```

- [ ] Build production iOS / Android
- [ ] Submit → review App Store
- [ ] Submit → review Google Play
- [ ] TestFlight / internal → produkcja po akceptacji

---

## 7. Po release

- [ ] Tag git `mobile-v1.0.0` (opcjonalnie trigger CI EAS)
- [ ] Zaktualizuj [`store-readiness.md`](./store-readiness.md) datami buildów

---

## CI lokalne przed push

```bash
npm run test:core
npm run test:mobile
npm run lint -w mediapp-mobile
```
