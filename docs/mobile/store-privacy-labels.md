# App Store / Google Play — deklaracje prywatności (MediApp mobile)

Wypełnij formularze w konsolach zgodnie z poniższymi odpowiedziami. Model: **dane tylko lokalnie**, eksport JSON **przez użytkownika** (Share / Pliki), **brak** serwera MediApp.

**Polityka (URL):** https://memphistor.github.io/MediApp/privacy-mobile.html  
(wymaga wdrożenia Pages z `public/privacy-mobile.html` na `main`)

---

## Apple — App Privacy (Nutrition Labels)

| Pytanie | Odpowiedź |
|---------|-----------|
| Czy zbieracie dane? | **Tak** — dane wpisywane przez użytkownika w aplikacji |
| Typ danych | **Health & Fitness** — harmonogram / wpisy o produktach (treść od użytkownika) |
| Powiązane z tożsamością użytkownika | **Nie** (brak konta, brak ID reklamowego) |
| Używane do śledzenia | **Nie** |
| Udostępnianie stronom trzecim | **Nie** |
| Zbieranie na serwerze operatora | **Nie** |

**Third-party SDK:** Expo / React Native — **nie** przekazują treści leków do Expo; brak Firebase Analytics / Ads w projekcie.

**App Review Notes (skrót):**

- Brak logowania. Test: onboarding → Dodaj pozycję → włącz przypomnienia → sprawdź lokalną notyfikację na **fizycznym** urządzeniu.
- Deep link `mediapp://` — powrót do ekranu Dziś z akcji notyfikacji.

---

## Google Play — Data safety

| Sekcja | Odpowiedź |
|--------|-----------|
| Czy aplikacja zbiera lub udostępnia dane? | **Nie** zbieramy na serwerze; dane **w aplikacji lokalnie** |
| Health and fitness | **Collected** — user-provided, **stored on device**, **not shared** |
| Encryption in transit | **N/A** (brak transmisji wpisów do operatora) |
| Encryption at rest | System iOS/Android (standardowe sandbox) |
| Deletion | In-app „Usuń wszystkie dane” + odinstalowanie |
| Uprawnienia | `POST_NOTIFICATIONS` — lokalne przypomnienia; uzasadnienie w `app.json` |

**Exact alarms:** w repo **brak** `SCHEDULE_EXACT_ALARM`. Jeśli review zgłosi problem z persistent/snooze — opisz lokalny charakter przypomnień; ewentualnie dodaj uzasadnienie w formularzu bez zmiany manifestu, dopóki QA nie wymusi inaczej.

**Eksport danych:** użytkownik może **sam** wyeksportować JSON (Ustawienia) — **nie** jest to zbieranie przez dewelopera.

---

## Spójność z in-app

Po zmianie [`apps/mobile/src/i18n/privacy-pl.ts`](../../apps/mobile/src/i18n/privacy-pl.ts) zaktualizuj też [`public/privacy-mobile.html`](../../public/privacy-mobile.html) i ten plik, jeśli zmienia się model danych.
