export const privacyPl = {
  title: 'Polityka prywatności',
  versionLabel: 'Wersja',
  sections: [
    {
      id: 'administrator',
      title: 'Administrator danych',
      paragraphs: [
        'Operatorem aplikacji MediApp jest właściciel repozytorium projektu (dane kontaktowe: do uzupełnienia przed publikacją w sklepie z aplikacjami).',
        'MediApp nie przesyła Twoich wpisów o lekach na własny serwer — dane pozostają w przeglądarce na Twoim urządzeniu (IndexedDB).',
      ],
    },
    {
      id: 'dane',
      title: 'Jakie dane przetwarzamy',
      paragraphs: [
        'Dane wpisujesz sam: nazwy produktów, dawki, harmonogram, notatki, opcjonalne etykiety (np. „tarczyca”) oraz logi odhaczeń (wzięta / pominięta / przegapiona).',
        'Mogą to być dane o zdrowiu w rozumieniu art. 9 RODO, jeśli sam je tam umieścisz.',
      ],
    },
    {
      id: 'cel',
      title: 'Cel i podstawa prawna',
      paragraphs: [
        'Cel: prowadzenie osobistego dziennika i przypominacza na podstawie Twoich wpisów.',
        'Podstawa: Twoja zgoda (art. 6 ust. 1 lit. a RODO oraz art. 9 ust. 2 lit. a RODO w zakresie danych o zdrowiu).',
      ],
    },
    {
      id: 'przechowywanie',
      title: 'Gdzie i jak długo',
      paragraphs: [
        'Dane są przechowywane lokalnie do momentu ich usunięcia przez Ciebie w aplikacji lub wyczyszczenia danych witryny w przeglądarce.',
        'Statyczna strona na GitHub Pages dostarcza pliki aplikacji; nie ma dostępu do zawartości Twojej lokalnej bazy.',
      ],
    },
    {
      id: 'prawa',
      title: 'Twoje prawa',
      paragraphs: [
        'Masz prawo dostępu, sprostowania, usunięcia, ograniczenia, przenoszenia danych oraz cofnięcia zgody.',
        'Usunięcie wszystkich danych w Ustawieniach realizuje prawo do usunięcia na tym urządzeniu.',
        'Cofnięcie zgody: usuń dane w aplikacji i przestań korzystać z MediApp.',
      ],
    },
    {
      id: 'usuniecie',
      title: 'Usuwanie danych',
      paragraphs: [
        'Ustawienia → „Usuń wszystkie dane” → potwierdzenie. Zostaną usunięte pozycje, logi dawek i ustawienia (w tym zgody).',
      ],
    },
    {
      id: 'powiadomienia',
      title: 'Powiadomienia',
      paragraphs: [
        'W bieżącej wersji przypomnienia działają lokalnie w przeglądarce (bez serwera). Szczegóły w dokumentacji aplikacji.',
      ],
    },
  ],
} as const
