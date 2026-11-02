# Checklist — sklepy (szkic)

## Konta

- [ ] **Apple Developer Program** (~99 USD/rok)
- [ ] **Google Play Console** (jednorazowa opłata rejestracyjna)
- [ ] Konto **Expo** + `eas init` w `apps/mobile` (powiązanie `projectId` w `app.json`)

## Buildy

- [ ] `eas.json` — profile `development`, `preview`, `production` (gotowe w repo)
- [ ] Pierwszy **`eas build --profile preview --platform ios`**
- [ ] Później: Android AAB (`preview` / `production`)

## Materiały sklepu

- [ ] Ikona 1024×1024 (teal `#0f766e`, spójna z web)
- [ ] Screenshoty iPhone (6.7", 6.1") — polskie UI
- [ ] Krótki opis: osobisty notatnik/przypominacz, **bez** weryfikacji medycznej ([`docs/intended-purpose.md`](../intended-purpose.md))
- [ ] Disclaimer jak onboarding web

## Prywatność i compliance

- [ ] URL polityki: np. GitHub Pages [`docs/privacy-policy.md`](../privacy-policy.md) + ekran in-app `/privacy`
- [ ] **App Store Privacy Nutrition Labels**: dane zdrowotne wpisywane przez użytkownika, przechowywane lokalnie, brak śledzenia
- [ ] **Google Play Data safety**: to samo — brak zbierania na serwer
- [ ] Kategoria: Health & Fitness (unikać claimów medycznych)

## Po Fazie 3 (powiadomienia)

- [ ] Uzasadnienie POST_NOTIFICATIONS / exact alarms (Android) w formularzu Play, jeśli wymagane

## Testy przed produkcją

- [ ] TestFlight (iOS) / internal testing (Android)
- [ ] Real device: przypomnienie lokalne, odhaczenie dawki
