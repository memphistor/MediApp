# Dane na urządzeniu (mobile v1)

## Model

- **Jedna instalacja aplikacji** = jeden zestaw pozycji, harmonogramów, wpisów dziennika, ustawień i stanu gamifikacji.
- **Brak konta użytkownika** i brak wysyłania wpisów na serwer operatora.
- **Usunięcie aplikacji** z telefonu usuwa dane (jak wyczyszczenie danych strony w przeglądarce). Zob. też [`docs/data-deletion.md`](../data-deletion.md).

## Web vs telefon

- Wersja **www** (gałąź `main`) i **aplikacja ze sklepu** (gałąź `mobile`) **nie synchronizują się** automatycznie w v1.
- Przeniesienie danych z web do app — opcjonalnie w **Fazie 5** (import pliku JSON / snapshot).

## Profil

- Na web można mieć wiele profili (różne końcówki URL). W mobile v1: **tylko jeden profil** na instalację.

## Teksty w aplikacji

- Onboarding i ustawienia powinny jasno mówić, że dane są **tylko na tym urządzeniu** (teksty z [`src/i18n/pl.ts`](../../src/i18n/pl.ts) — do dostosowania z „przeglądarka” na „telefon” w kolejnych fazach).
