# Migracja danych z wersji www (PWA) do aplikacji mobilnej

Wersja **www** (gałąź `main`, GitHub Pages) i **aplikacja ze sklepu** (gałąź `mobile`) **nie synchronizują się** automatycznie. Przeniesienie danych odbywa się przez **plik JSON** (format `AppSnapshot` v1).

## Krok 1 — Eksport z przeglądarki

1. Otwórz MediApp w przeglądarce (adres z Twoim profilem, jeśli używasz linku profilu).
2. Wejdź w **Ustawienia**.
3. Sekcja **Kopia zapasowa** → **Pobierz kopię (JSON)**.
4. Zapisz plik (np. `MediApp-kopia-2026-11-02.json`) w Menedżerze plików, iCloud Drive, e-mail do siebie itd.

## Krok 2 — Import w aplikacji mobilnej

1. Zainstaluj MediApp na telefonie (build deweloperski lub wersja ze sklepu, gdy dostępna).
2. **Ustawienia** → **Kopia zapasowa** → **Importuj kopię**.
3. Wybierz zapisany plik `.json`.
4. Potwierdź import — **obecne dane na telefonie zostaną zastąpione** zawartością pliku.
5. Po imporcie sprawdź ekran **Dziś**, **Kalendarz** i **Ustawienia** (powiadomienia mogą wymagać ponownej zgody systemu).

## Co jest w pliku

- Pozycje leków, harmonogramy, zapas (jeśli śledzony)
- Logi dawek (odhaczenia, pominięcia, PRN)
- Ustawienia (motyw, czcionka, powiadomienia)
- Stan gamifikacji (serie, odznaki)

Notatki do pozycji (`medicationNotes`) z web mogą być w pliku, ale **aplikacja mobilna je na razie ignoruje** (brak tabeli w SQLite).

## Kopia między telefonami

Ten sam plik JSON możesz **eksportować z aplikacji mobilnej** (**Eksportuj kopię**) i importować na innym urządzeniu — bez udziału wersji www.

## Bezpieczeństwo

Plik zawiera **dane o zdrowiu wpisywane przez Ciebie**. Traktuj go jak wrażliwy dokument. Nie udostępniaj publicznie; przechowuj w zaufanym miejscu.
