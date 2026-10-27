export const pl = {
  appName: 'MediApp',
  appTagline: 'Osobisty dziennik i przypominacz',

  nav: {
    today: 'Dziś',
    calendar: 'Kalendarz',
    progress: 'Postęp',
    settings: 'Ustawienia',
    add: 'Dodaj',
  },

  disclaimer: {
    short:
      'Dane o lekach wpisujesz sam. Aplikacja ich nie weryfikuje. W sprawach dawkowania skonsultuj się z lekarzem lub farmaceutą.',
    title: 'Ważne informacje',
  },

  onboarding: {
    title: 'Witaj w MediApp',
    body1:
      'To jest Twój osobisty notatnik: zapisujesz pozycje, harmonogram i notatki — aplikacja przypomina o godzinach, które sam wybierzesz.',
    body2:
      'MediApp nie ocenia terapii, nie sprawdza interakcji ani nie podpowiada dawkowania z bazy leków.',
    body3:
      'Dane są przechowywane lokalnie na tym urządzeniu. Możesz je wyeksportować lub usunąć w ustawieniach.',
    accept: 'Rozumiem, zaczynam',
  },

  today: {
    title: 'Dziś',
    empty: 'Brak zaplanowanych pozycji na dziś.',
    addFirst: 'Dodaj pierwszą pozycję',
    demoNote: 'Poniżej przykładowy widok (szkielet).',
  },

  doseStatus: {
    planned: 'Zaplanowana',
    taken: 'Wzięta',
    skipped: 'Pominięta',
    missed: 'Przegapiona',
  },

  wizard: {
    title: 'Nowa pozycja',
    step: 'Krok',
    of: 'z',
    next: 'Dalej',
    back: 'Wstecz',
    save: 'Zapisz (wkrótce)',
    saveHint: 'Zapis do bazy w kolejnej iteracji — pola są tylko do podglądu.',
    fields: {
      name: 'Nazwa (wpisz ręcznie)',
      kind: 'Rodzaj',
      form: 'Forma',
      dose: 'Dawka (np. 1 tabletka lub 500 mg)',
      emptyStomach: 'Według ulotki lub zaleceń lekarza: czy przyjmujesz na czczo?',
      meal: 'Przed, w trakcie czy po posiłku?',
      times: 'Godziny przyjęcia (HH:mm)',
      schedule: 'Jak często?',
      dateRange: 'Od kiedy do kiedy?',
      purpose: 'Na co to przyjmujesz? (opcjonalnie)',
      colorIcon: 'Kolor i ikona',
      note: 'Własna notatka',
    },
    notSelected: 'Nie wybrano',
    kinds: {
      prescription: 'Lek na receptę',
      otc: 'Lek bez recepty',
      supplement: 'Suplement',
      other: 'Inne',
    },
    forms: {
      tablet: 'Tabletka',
      capsule: 'Kapsułka',
      drops: 'Krople',
      sachet: 'Saszetka',
      injection: 'Zastrzyk',
      liquid: 'Płyn',
      other: 'Inne',
    },
    emptyStomach: {
      yes: 'Tak',
      no: 'Nie',
      na: 'Nie dotyczy',
    },
    meal: {
      before: 'Przed posiłkiem',
      during: 'W trakcie posiłku',
      after: 'Po posiłku',
      skipped: 'Pomiń',
    },
    schedules: {
      daily: 'Codziennie',
      weekdays: 'Wybrane dni tygodnia',
      everyNDays: 'Co X dni',
      weekly: 'Raz w tygodniu',
      monthly: 'Raz w miesiącu',
      cycle: 'Cykl (np. 21 dni / 7 przerwy)',
      asNeeded: 'Tylko w razie potrzeby',
    },
  },

  detail: {
    title: 'Pozycja',
    yourNotes: 'Twoje notatki',
    schedule: 'Harmonogram',
    notFound: 'Nie znaleziono pozycji.',
  },

  calendar: {
    title: 'Kalendarz',
    legendFull: 'Dzień z pełnym planem (zaplanowane odhaczenia)',
    legendPartial: 'Częściowy',
    placeholder: 'Miesięczny widok — logika w kolejnej fazie.',
  },

  history: {
    title: 'Historia',
    exportPdf: 'Eksport PDF',
    exportCsv: 'Eksport CSV',
    soon: 'Wkrótce',
    empty: 'Brak wpisów w dzienniku.',
  },

  progress: {
    title: 'Postęp',
    dayRing: 'Pierścień dnia',
    streak: 'Seria dni',
    shield: 'Tarcza chroni serię przy jednym przegapionym dniu',
    badges: 'Odznaki',
    stats: 'W tym miesiącu odhaczono 92% zaplanowanych pozycji (demo).',
    demo: 'Wartości demonstracyjne — logika w kolejnej fazie.',
  },

  settings: {
    title: 'Ustawienia',
    theme: 'Wygląd',
    themeLight: 'Jasny',
    themeDark: 'Ciemny',
    themeSystem: 'Systemowy',
    fontScale: 'Rozmiar czcionki',
    fontNormal: 'Standardowy',
    fontLarge: 'Duży',
    data: 'Dane',
    deleteAll: 'Usuń wszystkie dane',
    deleteConfirm: 'Na pewno usunąć wszystkie dane z tego urządzenia? Tej operacji nie można cofnąć.',
    deleted: 'Dane zostały usunięte.',
    privacy: 'Polityka prywatności (w przygotowaniu)',
    onboarding: 'Pokaż onboarding ponownie',
  },

  reminder: {
    mockTitle: 'Podgląd przypomnienia',
    taken: 'Wzięte',
    snooze: 'Odłóż',
    skip: 'Pomiń',
    takeAll: 'Wzięte wszystko',
    grouped: 'Rano: 3 pozycje',
  },

  common: {
    cancel: 'Anuluj',
    close: 'Zamknij',
  },
} as const

export type I18n = typeof pl
