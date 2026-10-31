export const privacyPl = {
  title: 'Informacje o danych',
  sections: [
    {
      id: 'local',
      title: 'Gdzie są Twoje wpisy',
      paragraphs: [
        'Wszystko, co dodasz (pozycje, harmonogram, odhaczenia), zapisuje się tylko w tej przeglądarce na tym urządzeniu — w pamięci lokalnej (IndexedDB).',
        'Strona z GitHub Pages dostarcza pliki aplikacji. Operator nie ma dostępu do zawartości Twojej bazy.',
      ],
    },
    {
      id: 'co-nie',
      title: 'Czego aplikacja nie robi',
      paragraphs: [
        'Nie ma logowania, kont użytkowników ani wysyłania wpisów na serwer.',
        'MediApp nie weryfikuje leków, nie sprawdza interakcji i nie podpowiada dawkowania — to Twój notatnik i przypominacz.',
      ],
    },
    {
      id: 'usuniecie',
      title: 'Usuwanie danych',
      paragraphs: [
        'Ustawienia → „Usuń wszystkie dane” → potwierdzenie. Usuwane są pozycje, dziennik dawek i ustawienia aplikacji.',
        'Możesz też wyczyścić dane witryny w ustawieniach przeglądarki — efekt jak reset aplikacji na tym urządzeniu.',
      ],
    },
  ],
} as const
