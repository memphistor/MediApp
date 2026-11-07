# Usuwanie danych — MediApp mobile (iOS / Android)

## W aplikacji (zalecane)

1. Otwórz **Ustawienia**.
2. Wybierz **Usuń wszystkie dane**.
3. Potwierdź komunikat.

Efekt:

- Usunięte tabele SQLite: `medications`, `dose_logs`, `settings`, `gamification`.
- Usunięta techniczna kopia w pamięci aplikacji (AsyncStorage).
- Anulowane zaplanowane **lokalne przypomnienia**.
- Ponowny ekran powitalny (onboarding).

## Eksport pliku

W tej wersji aplikacji **nie ma** przycisku eksportu ani importu. Przed usunięciem nie da się zapisać kopii z poziomu MediApp.

## Czego aplikacja nie usuwa

- Kopie zapasowe całego telefonu (iCloud Backup) — zależą od ustawień systemu; baza `MediApp.db` może trafić do kopii systemowej.

## Odinstalowanie

Usunięcie aplikacji z urządzenia usuwa lokalną bazę **MediApp.db** i pamięć aplikacji. Bez kopii zrobionej poza MediApp danych nie odzyskasz.

## Wersja web

Patrz [`docs/data-deletion.md`](../data-deletion.md) (IndexedDB / przeglądarka).
