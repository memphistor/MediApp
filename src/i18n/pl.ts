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
      'Osobisty notatnik i przypominacz: wpisujesz pozycje i godziny, aplikacja przypomina. Nie ma logowania ani synchronizacji w chmurze.',
    body2:
      'Wpisy zapisują się tylko w tej przeglądarce na tym urządzeniu. Możesz je skasować w Ustawieniach → Usuń wszystkie dane.',
    accept: 'Zaczynam',
    disclaimerConfirm:
      'Przeczytałem/am i rozumiem powyższe ważne informacje.',
  },

  today: {
    title: 'Dziś',
    empty: 'Brak zaplanowanych pozycji na dziś.',
    emptyNoMeds: 'Nie masz jeszcze żadnych pozycji — dodaj pierwszą poniżej.',
    addFirst: 'Dodaj pierwszą pozycję',
    addMore: 'Dodaj pozycję',
    notificationsOn:
      'Powiadomienia włączone — sprawdzamy plan co 30 s, gdy aplikacja jest aktywna.',
    notificationsOff:
      'Włącz powiadomienia w Ustawieniach lub odhaczaj pozycje na liście.',
    skipTitle: 'Pomiń dawkę',
    skipReasonLabel: 'Powód (opcjonalnie)',
    asNeededTitle: 'W razie potrzeby',
    logIntake: 'Zapisz przyjęcie',
    logged: 'Zapisano przyjęcie.',
  },

  doseStatus: {
    planned: 'Zaplanowana',
    taken: 'Wzięta',
    skipped: 'Pominięta',
    missed: 'Przegapiona',
  },

  wizard: {
    title: 'Nowa pozycja',
    editTitle: 'Edytuj pozycję',
    step: 'Krok',
    of: 'z',
    next: 'Dalej',
    back: 'Wstecz',
    save: 'Zapisz',
    saving: 'Zapisywanie…',
    fixErrors: 'Uzupełnij pola oznaczone na czerwono, żeby przejść dalej lub zapisać.',
    saveFailed:
      'Nie udało się zapisać w przeglądarce. Sprawdź, czy strona może zapisywać dane lokalnie (IndexedDB), i spróbuj ponownie.',
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
      dateFrom: 'Od (opcjonalnie)',
      dateTo: 'Do (opcjonalnie)',
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
    delete: 'Usuń pozycję',
    deleteConfirm:
      'Usunąć tę pozycję i wszystkie powiązane wpisy w dzienniku na tym urządzeniu?',
    edit: 'Edytuj',
    logIntake: 'Zapisz przyjęcie',
  },

  calendar: {
    title: 'Kalendarz',
    prevMonth: 'Poprzedni miesiąc',
    nextMonth: 'Następny miesiąc',
    legendFull: 'Wszystkie zaplanowane dawki wzięte',
    legendPartial: 'Część dawek wzięta, reszta jeszcze w planie',
    legendMissed: 'Są pominięte lub opuszczone',
    legendPlanned: 'Tylko zaplanowane, nic jeszcze nie odhaczone',
    legendPrn: 'Przyjęcie doraźne (poza planem dnia)',
    dayEmpty: 'Brak dawek w tym dniu.',
    prnSection: 'Doraźne',
    planSection: 'Plan',
  },

  history: {
    title: 'Historia',
    empty: 'Brak wpisów w dzienniku.',
  },

  progress: {
    title: 'Postęp',
    dayRing: 'Pierścień dnia',
    streak: 'Seria dni',
    streakDays: '{n} dni z rzędu z pełnym planem',
    todayCount: 'Dziś zapisano {taken} z {total} pozycji',
    monthStats: 'W tym miesiącu odhaczono {percent}% zaplanowanych pozycji',
    shieldActive: 'Tarcza dostępna — jeden niepełny dzień nie zeruje serii',
    shieldRecharge: 'Tarcza zużyta — odnawia się po 7 pełnych dniach z rzędu',
    badges: 'Odznaki',
    badgeLocked: 'Jeszcze nie zdobyta',
    badgeStreak7: 'Tydzień pełnego planu',
    badgeStreak30: 'Miesiąc pełnego planu',
    badgeTaken100: '100 odhaczonych dawek',
  },

  settings: {
    title: 'Ustawienia',
    notifications: 'Przypomnienia',
    notificationsEnable: 'Powiadomienia o zaplanowanych godzinach',
    notificationsHint:
      'Działają najlepiej, gdy aplikacja jest zainstalowana (PWA). Na iOS mogą być mniej niezawodne.',
    permissionDenied: 'Brak zgody przeglądarki — użyj panelu na ekranie Dziś.',
    snoozeMinutes: 'Odłożenie (minuty)',
    persistentAlarm: 'Alarm uporczywy do odhaczenia',
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
    dataInfo: 'Informacje o danych',
    onboarding: 'Pokaż ekran powitalny ponownie',
    notificationLimits: 'Limity powiadomień',
  },

  notificationHelp: {
    title: 'Limity powiadomień',
    lead: 'MediApp nie ma serwera push. Przypomnienie pojawia się, gdy aplikacja jest otwarta albo działa w tle z aktywnym Service Workerem i gdy przeglądarka ma zgodę.',
    tick: 'Plan jest sprawdzany co około 30 sekund przy włączonych powiadomieniach.',
    ios: 'Na iPhonie (Safari) powiadomienia PWA są mniej niezawodne niż na Androidzie. Dodaj aplikację do ekranu początkowego i otwieraj ją od czasu do czasu.',
    noPermission:
      'Bez zgody przeglądarki na ekranie Dziś zostaje panel z akcjami Wzięte, Odłóż i Pomiń.',
    persistent:
      'Alarm uporczywy powtarza to samo powiadomienie co 5 minut, dopóki dawka ma status zaplanowana.',
    closed:
      'Gdy aplikacja jest długo zamknięta — szczególnie na iOS — przypomnienie może nie przyjść, dopóki jej nie otworzysz.',
  },

  reminder: {
    mockTitle: 'Podgląd przypomnienia',
    activeTitle: 'Teraz — według twojego planu',
    grouped: 'Rano: 3 pozycje',
    groupedCount: '{count} pozycje o tej samej porze',
    taken: 'Wzięte',
    snooze: 'Odłóż',
    skip: 'Pomiń',
    takeAll: 'Wzięte wszystko',
  },

  common: {
    cancel: 'Anuluj',
    close: 'Zamknij',
  },
} as const

export type I18n = typeof pl
