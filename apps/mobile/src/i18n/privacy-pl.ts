export const privacyPl = {
  title: 'Informacje o danych',
  sections: [
    {
      id: 'local',
      title: 'Gdzie są Twoje wpisy',
      paragraphs: [
        'Wszystko, co dodasz (pozycje, harmonogram, odhaczenia), zapisuje się tylko na tym telefonie — w lokalnej bazie SQLite (plik MediApp.db).',
        'MediApp nie wysyła wpisów o lekach na serwer operatora. Nie ma logowania ani synchronizacji w chmurze między urządzeniami.',
      ],
    },
    {
      id: 'co-nie',
      title: 'Czego aplikacja nie robi',
      paragraphs: [
        'Nie ma kont użytkowników ani analityki z treścią twoich wpisów.',
        'MediApp nie weryfikuje leków, nie sprawdza interakcji i nie podpowiada dawkowania — to Twój notatnik i przypominacz.',
        'Lokalne przypomnienia pokazują treść wyłącznie z danych, które sam wpiszesz (np. nazwa pozycji i godzina).',
      ],
    },
    {
      id: 'kopia',
      title: 'Kopia zapasowa (JSON)',
      paragraphs: [
        'W Ustawieniach możesz wyeksportować plik JSON z lekami, dziennikiem dawek i ustawieniami — np. przed wymianą telefonu lub reinstalacją aplikacji.',
        'Import z pliku zastępuje dane na tym urządzeniu. Plik trzymasz we własnym folderze (Pobrane, iCloud, dysk) — MediApp go nie uploaduje.',
      ],
    },
    {
      id: 'usuniecie',
      title: 'Usuwanie danych',
      paragraphs: [
        'Ustawienia → „Usuń wszystkie dane” → potwierdzenie. Usuwane są pozycje, dziennik dawek, ustawienia i stan gamifikacji; anulowane są zaplanowane przypomnienia.',
        'Odinstalowanie aplikacji usuwa plik bazy na urządzeniu — bez kopii JSON danych nie odzyskasz.',
      ],
    },
  ],
} as const
