# Informacje o danych — MediApp

**Wersja:** 2026-11 (mobile v1.0)

Treść in-app:

- **Web (PWA):** [`src/i18n/privacy-pl.ts`](../src/i18n/privacy-pl.ts), ekran `/privacy`
- **Mobile (iOS/Android):** [`apps/mobile/src/i18n/privacy-pl.ts`](../apps/mobile/src/i18n/privacy-pl.ts), ekran `/privacy`

**URL publiczny (sklepy, mobile):** po wdrożeniu Pages z gałęzi `main`:

**https://memphistor.github.io/MediApp/privacy-mobile.html**

---

## Kontakt operatora

**MediApp** — projekt osobisty (TheMemphistor).

**Prywatność / RODO:** [GitHub Issues — prywatne zgłoszenie](https://github.com/memphistor/MediApp/issues/new) (wybierz „Report a vulnerability” lub issue bez publicznych danych zdrowotnych).

Przed publikacją w App Store / Google Play ustaw **dedykowany adres e-mail** w konsoli sklepu i dopisz go tutaj, jeśli wymagany przez review.

---

## Aplikacja mobilna (iOS / Android)

- Wpisy (pozycje, harmonogram, odhaczenia) zapisujesz sam; przechowywane **lokalnie** w SQLite (`MediApp.db`) na urządzeniu.
- **Brak** serwera MediApp zbierającego treść wpisów, **brak** kont i synchronizacji w chmurze.
- **Przypomnienia** są lokalne; treść pochodzi z danych, które wpiszesz.
- **Kopia zapasowa:** eksport/import pliku JSON w Ustawieniach (przenoszenie między urządzeniami / po reinstalacji).
- **Usunięcie:** Ustawienia → Usuń wszystkie dane (w tym anulowanie zaplanowanych przypomnień). Odinstalowanie aplikacji usuwa bazę na urządzeniu.
- Aplikacja **nie weryfikuje** leków medycznie — notatnik i przypominacz ([`intended-purpose.md`](intended-purpose.md)).

Szczegóły: [`docs/mobile/data-deletion.md`](mobile/data-deletion.md).

---

## Wersja web (PWA)

- Dane w **IndexedDB** w przeglądarce na urządzeniu użytkownika.
- GitHub Pages dostarcza pliki aplikacji; operator **nie widzi** zawartości Twojej bazy.
- Usunięcie: Ustawienia → Usuń wszystkie dane lub wyczyszczenie danych witryny w przeglądarce.

Szczegóły: [`docs/data-deletion.md`](data-deletion.md).

---

## RODO (skrót)

Nazwy produktów i wpisy mogą stanowić dane o zdrowiu (art. 9). Przetwarzasz je **u siebie** na urządzeniu; operator nie otrzymuje tych treści z aplikacji mobilnej ani z lokalnej bazy PWA.

**Prawa użytkownika:** dostęp (widoczność w aplikacji), przenoszenie (eksport JSON na mobile / www), usunięcie (jak wyżej).

**Podstawa (mobile/web v1):** korzystanie z aplikacji po zapoznaniu się z informacjami i disclaimerem medycznym na onboardingu — bez osobnego konta.

---

## Zmiany

Przy istotnej zmianie treści zaktualizujemy wersję w nagłówku tego pliku oraz teksty in-app. Brak wymuszonego ekranu zgody art. 9 w obecnej wersji produktu (zgodnie z uproszczeniem flow na web).
