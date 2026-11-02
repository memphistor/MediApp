# Checklist — sklepy

## Konta

- [ ] **Apple Developer Program** (~99 USD/rok)
- [ ] **Google Play Console** (jednorazowa opłata rejestracyjna)
- [ ] Konto **Expo** + `eas init` w `apps/mobile` (powiązanie `projectId` w `app.json`)

## Buildy

- [x] `eas.json` — profile `development`, `preview`, `production` (+ `app-bundle` na produkcji Android)
- [ ] Pierwszy **`eas build --profile preview --platform ios`**
- [ ] Później: Android AAB (`preview` / `production`)

## Materiały sklepu

- [x] Ikona 1024×1024 (teal `#0f766e`, spójna z web)
- [ ] Screenshoty iPhone (6.7", 6.1") — polskie UI — szablon: [`store-listing.md`](./store-listing.md)
- [x] Krótki opis: osobisty notatnik/przypominacz — [`store-listing.md`](./store-listing.md)
- [x] Disclaimer jak onboarding — in-app [`onboarding.tsx`](../apps/mobile/app/onboarding.tsx)

## Prywatność i compliance

- [x] Treść in-app mobile — [`apps/mobile/src/i18n/privacy-pl.ts`](../apps/mobile/src/i18n/privacy-pl.ts)
- [x] Hostowany URL (po deploy Pages): **https://memphistor.github.io/MediApp/privacy-mobile.html** — plik [`public/privacy-mobile.html`](../public/privacy-mobile.html)
- [x] Szablony etykiet: [`store-privacy-labels.md`](./store-privacy-labels.md)
- [ ] **App Store Privacy Nutrition Labels** — wypełnienie w App Store Connect
- [ ] **Google Play Data safety** — wypełnienie w Play Console
- [x] Kategoria: Health & Fitness (unikać claimów medycznych)

## Powiadomienia

- [x] `expo-notifications` + uzasadnienie POST_NOTIFICATIONS w `app.json` (Android)
- [ ] Uzasadnienie exact alarms (Android) w formularzu Play, jeśli wymagane przy publikacji

## Wersja produktu

- [x] `expo.version` **1.0.0** w [`app.json`](../apps/mobile/app.json)
- [x] Bundle ID `com.memphistor.mediapp` (iOS + Android)

## Testy przed produkcją

- [ ] TestFlight (iOS) / internal testing (Android)
- [ ] Real device: przypomnienie lokalne, odhaczenie dawki — [`release-checklist.md`](./release-checklist.md) §4

## Operacje release

- [x] [`release-checklist.md`](./release-checklist.md)
- [ ] Opcjonalny CI: `.github/workflows/mobile-eas.yml` (secret `EXPO_TOKEN`)
