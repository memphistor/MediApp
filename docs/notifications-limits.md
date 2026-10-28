# Ograniczenia powiadomień MediApp

MediApp **nie ma serwera push**. Przypomnienia są wyświetlane, gdy:

- aplikacja jest otwarta lub w tle z aktywnym Service Workerem,
- co ok. **30 sekund** sprawdzany jest plan (przy włączonych powiadomieniach),
- użytkownik udzielił zgody przeglądarce.

## iOS / Safari

Powiadomienia PWA na iPhone są **mniej niezawodne** niż na Androidzie. Zalecamy dodanie strony do ekranu początkowego i okresowe otwieranie aplikacji.

## Brak zgody

Na ekranie **Dziś** pojawia się panel z akcjami Wzięte / Odłóż / Pomiń dla zaległych dawek.

## Alarm uporczywy

Co **5 minut** powtarza to samo powiadomienie, dopóki dawka ma status `planned` (wymaga włączenia w Ustawieniach).

## Testy manualne

Przed publikacją warto sprawdzić na: Chrome Android, Safari iOS, tryb oszczędzania baterii, zmianę strefy czasowej.
