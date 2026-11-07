export const privacyPl = {
  title: 'Informacje o danych',
  sections: [
    {
      id: 'local',
      title: 'Gdzie są Twoje wpisy',
      paragraphs: [
        'Wszystko, co dodasz (pozycje, harmonogram, odhaczenia, ustawienia i postęp), zapisuje się tylko na tym telefonie, w lokalnej bazie SQLite (plik MediApp.db).',
        'Aplikacja trzyma też techniczną kopię tych wpisów w pamięci na tym samym telefonie. Ta kopia nie jest plikiem do wysłania i nie trafia na serwer MediApp.',
        'Nie ma logowania ani synchronizacji w chmurze między urządzeniami.',
      ],
    },
    {
      id: 'co-nie',
      title: 'Czego aplikacja nie robi',
      paragraphs: [
        'Nie ma kont użytkowników, reklam ani analityki z treścią Twoich wpisów. Nie sprzedajemy tych danych i nie udostępniamy ich innym firmom.',
        'MediApp nie weryfikuje leków, nie sprawdza interakcji i nie podpowiada dawkowania. To Twój notatnik i przypominacz.',
        'Lokalne przypomnienia pokazują treść wyłącznie z danych, które sam wpiszesz (np. nazwa pozycji i godzina). Pojawiają się tylko, gdy zezwolisz na powiadomienia.',
        'W tej wersji nie ma eksportu ani importu pliku z danymi. Wpisy nie przeniosą się same na inny telefon.',
      ],
    },
    {
      id: 'usuniecie',
      title: 'Usuwanie danych',
      paragraphs: [
        'Ustawienia → „Usuń wszystkie dane” → potwierdzenie. Usuwane są pozycje, dziennik dawek, ustawienia, postęp i techniczna kopia na tym telefonie. Anulowane są zaplanowane przypomnienia.',
        'Odinstalowanie aplikacji usuwa dane MediApp z telefonu.',
        'Jeśli masz włączoną kopię całego telefonu (np. iCloud), system może objąć nią dane aplikacji. Tym sterujesz w ustawieniach telefonu, nie w MediApp.',
      ],
    },
  ],
} as const
