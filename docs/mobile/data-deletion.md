# Usuwanie danych — MediApp mobile (iOS / Android)

## W aplikacji (zalecane)

1. Otwórz **Ustawienia**.
2. Wybierz **Usuń wszystkie dane**.
3. Potwierdź komunikat.

Efekt:

- Usunięte tabele SQLite: `medications`, `dose_logs`, `settings`, `gamification`.
- Anulowane zaplanowane **lokalne przypomnienia**.
- Ponowny ekran powitalny (onboarding).

## Kopia przed usunięciem

W **Ustawieniach → Kopia zapasowa** możesz **wyeksportować plik JSON** i przechować go poza aplikacją (Pliki, iCloud, dysk).

## Czego aplikacja nie usuwa

- Plik JSON kopii, który sam zapiszesz w folderze systemowym.
- Kopie zapasowe całego telefonu (iCloud Backup / Google Backup) — zależą od ustawień systemu; baza `MediApp.db` może trafić do kopii systemowej.

## Odinstalowanie

Usunięcie aplikacji z urządzenia usuwa lokalną bazę **MediApp.db**. Bez wcześniejszego eksportu JSON danych nie odzyskasz.

## Wersja web

Patrz [`docs/data-deletion.md`](../data-deletion.md) (IndexedDB / przeglądarka).
