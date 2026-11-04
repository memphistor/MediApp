export const privacyPl = {
  title: 'Informacje o danych',
  sections: [
    {
      id: 'local',
      title: 'Gdzie są Twoje wpisy',
      paragraphs: [
        'Wszystko, co dodasz (pozycje, harmonogram, odhaczenia), zapisuje się tylko na tym telefonie, w lokalnej bazie SQLite (plik MediApp.db).',
        'MediApp nie wysyła wpisów o lekach na serwer operatora. Nie ma logowania ani synchronizacji w chmurze między urządzeniami.',
      ],
    },
    {
      id: 'co-nie',
      title: 'Czego aplikacja nie robi',
      paragraphs: [
        'Nie ma kont użytkowników ani analityki z treścią Twoich wpisów.',
        'MediApp nie weryfikuje leków, nie sprawdza interakcji i nie podpowiada dawkowania. To Twój notatnik i przypominacz.',
        'Lokalne przypomnienia pokazują treść wyłącznie z danych, które sam wpiszesz (np. nazwa pozycji i godzina).',
      ],
    },
    {
      id: 'kopia',
      title: 'Plik z wcześniejszej wersji',
      paragraphs: [
        'W Ustawieniach możesz wczytać plik kopii zapisany wcześniej. Import zastępuje dane na tym urządzeniu.',
        'Plik zostaje u Ciebie. MediApp go nie wysyła do chmury.',
      ],
    },
    {
      id: 'usuniecie',
      title: 'Usuwanie danych',
      paragraphs: [
        'Ustawienia → „Usuń wszystkie dane” → potwierdzenie. Usuwane są pozycje, dziennik dawek, ustawienia i stan gamifikacji; anulowane są zaplanowane przypomnienia.',
        'Odinstalowanie aplikacji usuwa plik bazy na urządzeniu.',
      ],
    },
  ],
} as const
