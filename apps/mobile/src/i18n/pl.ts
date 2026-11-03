export const pl = {
  appName: 'MediApp',
  appTagline: 'Osobisty dziennik i przypominacz',

  nav: {
    today: 'Dziś',
    calendar: 'Kalendarz',
    progress: 'Postęp',
    history: 'Historia',
    settings: 'Ustawienia',
    add: 'Dodaj',
    menuOpen: 'Menu',
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
      'Wpisy zostają na tym urządzeniu. W Ustawieniach możesz wyeksportować kopię JSON, usunąć wszystkie dane albo przeczytać informacje o przechowywaniu.',
    accept: 'Zaczynam',
    disclaimerConfirm:
      'Przeczytałem/am i rozumiem informacje powyżej.',
  },

  today: {
    title: 'Dziś',
    empty: 'Brak zaplanowanych pozycji na dziś.',
    emptyNoMeds: 'Nie masz jeszcze żadnych pozycji. Dodaj pierwszą poniżej.',
    addFirst: 'Dodaj pierwszą pozycję',
    addMore: 'Dodaj pozycję',
    notificationsOff:
      'Powiadomienia są wyłączone. Odhaczaj pozycje na liście albo włącz je w Ustawieniach.',
    skipTitle: 'Pomiń dawkę',
    skipReasonLabel: 'Powód (opcjonalnie)',
    asNeededTitle: 'W razie potrzeby',
    asNeededLink: 'Pozycje w razie potrzeby',
    asNeededLinkHint:
      'Nie muszą być na liście na co dzień. Wejdź tu, gdy coś bierzesz lub świadomie pomijasz.',
    logIntake: 'Zapisz przyjęcie',
    logged: 'Zapisano przyjęcie.',
  },

  doseStatus: {
    planned: 'Zaplanowana',
    taken: 'Wzięta',
    skipped: 'Pominięta',
    skippedAsNeededOk: 'Świadomie pominięte',
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
    fixErrors: 'Uzupełnij pola oznaczone poniżej, żeby zapisać.',
    saveFailed:
      'Nie udało się zapisać pozycji. Spróbuj ponownie. Jeśli problem wraca, zamknij aplikację i uruchom ją od nowa.',
    fields: {
      name: 'Nazwa',
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
      color: 'Kolor',
      icon: 'Ikona',
      note: 'Własna notatka',
      trackStock: 'Śledź, ile sztuk zostało w opakowaniu',
      stockRemaining: 'Aktualnie w opakowaniu (szt.)',
      stockUnitsPerIntake: 'Szt. na jedno przyjęcie',
      stockHint:
        'Po zaznaczeniu „Wzięta” aplikacja odejmie podaną liczbę sztuk. Możesz uzupełnić zapas na karcie pozycji.',
      remindersEnable: 'Przypomnienia o tej pozycji',
      remindersHint:
        'Lokalne powiadomienie i panel na ekranie Dziś o zaplanowanej godzinie. Włączenie globalne jest w Ustawieniach.',
      weekdays: 'Dni tygodnia',
      everyNDays: 'Co ile dni?',
      weeklyDay: 'Dzień tygodnia',
      monthlyDay: 'Dzień miesiąca (1–28)',
      cycleActive: 'Dni brania',
      cycleBreak: 'Dni przerwy',
    },
    sections: {
      basic: 'Podstawowe',
      intake: 'Sposób przyjmowania',
      schedule: 'Harmonogram',
      notes: 'Notatki',
      appearance: 'Wygląd',
      stock: 'Zapas opakowania',
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

  asNeeded: {
    title: 'W razie potrzeby',
    empty: 'Nie masz pozycji oznaczonych jako „tylko w razie potrzeby”.',
    intro:
      'Tu zapisujesz przyjęcie albo świadome pominięcie, bez codziennej listy na ekranie Dziś.',
    skipOk: 'Świadomie pominięte',
    todayEntry: 'Dzisiejszy wpis',
    noneToday: 'Dziś jeszcze nic nie zaznaczono.',
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
    reminders: 'Przypomnienia',
    remindersHint:
      'Tylko ta pozycja. W Ustawieniach włączasz powiadomienia dla całej aplikacji.',
  },

  stock: {
    remaining: 'Zapas: {n} szt.',
    low: 'mało zostało',
    warnDays: 'zostało ok. {n} dni zapasu',
    criticalDays: 'tylko ok. {n} dni zapasu!',
    replenishTitle: 'Uzupełnij opakowanie',
    replenishHint: 'Dodaj sztuki po zakupie nowego opakowania.',
    replenishAmount: 'Ile sztuk dodajesz?',
    replenishAction: 'Dodaj do zapasu',
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
    legendToggle: 'Co oznaczają kolory',
    dayEmpty: 'Brak dawek w tym dniu.',
    prnSection: 'Doraźne',
    planSection: 'Plan',
    weekTitle: 'Ten tydzień (pon.–niedz.)',
    weekSummary: 'Pełny plan: {full} z {withPlan} dni z zaplanowanymi dawkami',
    weekDayFull: 'Wszystko wzięte',
    weekDayMissed: 'Są pominięte lub opuszczone',
    weekDayProgress: '{taken} z {total} wzięte',
    weekDayEmpty: 'Brak zaplanowanych dawek',
    weekDayFuture: 'Jeszcze przed nami',
  },

  history: {
    title: 'Historia',
    analyticsLink: 'Analityka →',
    empty: 'Brak wpisów w dzienniku.',
    sectionPast: 'Przeszłe',
    sectionPlanned: 'Zaplanowane',
    dueToday: 'Dziś do odhaczenia',
    backToToday: 'Wróć do Dziś',
    sectionEmpty: 'Brak wpisów w tej sekcji.',
    plannedAt: 'Plan',
    takenAt: 'Wzięto',
    editTakenAt: 'Popraw godzinę',
    takenAtLabel: 'Kiedy wzięto?',
    saveTakenAt: 'Zapisz',
    cancelEdit: 'Anuluj',
    takenAtInvalid: 'Podaj poprawną datę i godzinę.',
    takenAtSaveFailed:
      'Nie udało się zapisać. Wpis musi być oznaczony jako wzięty.',
  },

  progress: {
    title: 'Postęp',
    dayRing: 'Pierścień dnia',
    weekRing: 'Ten tydzień (skrót)',
    weekCount: 'Przyjęto {taken} z {total} dawek z planu w tym tygodniu',
    weekDaysAria: 'Postęp w poszczególne dni tygodnia',
    overviewTitle: 'Skrót',
    overviewMonth: 'Ten miesiąc: {pct}% planu ({taken} z {due} dawek przyjętych)',
    overviewEmpty: 'Brak zaplanowanych dawek w tym miesiącu.',
    analyticsCta: 'Szczegółowa analityka',
    analyticsHint: 'Terminowość, okresy, rozbicie per pozycja i dzień po dniu.',
    analyticsTitle: 'Analityka',
    analyticsIntro:
      'Pełne statystyki całego planu oraz wybranej pozycji. Historia dawek nadal jest na zakładce Historia.',
    analyticsBack: '← Wróć do Postępu',
    streak: 'Seria dni',
    streakDays: '{n} dni z rzędu z pełnym planem',
    todayCount: 'Dziś przyjęto {taken} z {total} pozycji z planu',
    monthStats: 'W tym miesiącu przyjęto {percent}% zaplanowanych pozycji',
    periodTitle: 'Postęp w czasie',
    periodHint:
      'Ile dawek z planu zostało przyjętych oraz ile wziętych było w terminie.',
    periodAdherence: '{taken} z {due} dawek z planu przyjętych',
    periodCardDetail:
      '{taken} z {due} przyjętych · w terminie {onTime} z {taken}',
    periodOnTime: 'W terminie: {onTime}/{taken} ({pct}%)',
    periods: {
      day: 'Dziś',
      month: 'Ten miesiąc',
      days100: 'Ostatnie 100 dni',
      year: 'Ostatni rok',
    },
    perMed: {
      kicker: 'Jedna pozycja z planu',
      title: 'Postęp per pozycja',
      hint: 'Wybierz pozycję, żeby zobaczyć wpisy w wybranym okresie.',
      select: 'Pozycja',
      period: 'Okres',
      summary: 'Przyjęte z planu: {taken} z {due} ({pct}%)',
      intakeList: 'Wpisy w okresie',
      empty: 'Brak wpisów w tym okresie dla tej pozycji.',
      noMedications: 'Dodaj pierwszą pozycję, żeby śledzić postęp per lek.',
      prnEntry: 'Przyjęcie doraźne',
    },
    shieldActive:
      'Masz jednorazową ochronę serii: jeden niepełny dzień jej nie zeruje',
    shieldRecharge:
      'Ochrona wykorzystana. Wraca po 7 kolejnych dniach z pełnym planem',
    badges: 'Odznaki',
    badgeLocked: 'Jeszcze nie zdobyta',
    badgeStreak7: 'Tydzień pełnego planu',
    badgeStreak30: 'Miesiąc pełnego planu',
    badgeTaken100: '100 przyjętych dawek',
    timing: {
      scopeAll: 'Cały plan: terminowość',
      title: 'Terminowość przyjmowania',
      hint:
        '„W terminie” = przyjęcie od 30 min przed do 90 min po zaplanowanej godzinie (wg zapisu w aplikacji).',
      today: 'Dziś',
      last7Days: 'Ostatnie 7 dni',
      thisMonth: 'Ten miesiąc',
      noData: 'Brak zaplanowanych dawek w tym okresie.',
      noneTaken:
        'Nic jeszcze nie przyjęte. Przyjęcia z planu: {adherencePct}%.',
      summaryLine:
        '{onTime} z {taken} wziętych w terminie ({onTimePct}%). Przyjęcia z planu: {adherencePct}%.',
      todayBreakdown: 'Dziś: rozbicie',
      onTime: 'W terminie',
      early: 'Za wcześnie',
      late: 'Po terminie',
      unknown: 'Wzięte bez dokładnej godziny',
      missed: 'Pominięte / opuszczone',
      dailyTitle: 'Dzień po dniu (7 dni)',
      dayNoPlan: 'Brak planu',
      dayPending: 'Jeszcze w planie',
      dayMissed: 'Nie wszystko wzięte',
      dayAllOnTime: 'Wszystko w terminie',
      dayOffTime: '{onTime}/{taken} w terminie',
    },
  },

  settings: {
    title: 'Ustawienia',
    notifications: 'Powiadomienia (cała aplikacja)',
    notificationsEnable: 'Włącz lokalne przypomnienia o zaplanowanych godzinach',
    notificationsHint:
      'System wysyła powiadomienia na godziny z harmonogramu. Na iPhonie w trybie oszczędzania energii mogą się opóźniać. Przy każdej pozycji możesz wyłączyć przypomnienia tylko dla niej.',
    notificationsPerMed:
      'Przy każdej pozycji z harmonogramem możesz włączyć lub wyłączyć przypomnienia tylko dla niej.',
    permissionDenied:
      'Brak zgody systemu. Włącz powiadomienia w ustawieniach telefonu albo odhaczaj dawki na ekranie Dziś.',
    snoozeMinutes: 'Domyślne odłożenie (minuty)',
    persistentAlarm: 'Domyślnie uporczywe przypomnienie',
    persistentAlarmHint:
      'Powtarza powiadomienie co kilka minut, dopóki nie oznaczysz dawki. Dotyczy pozycji z włączonymi przypomnieniami.',
    theme: 'Wygląd',
    themeLight: 'Jasny',
    themeDark: 'Ciemny',
    themeSystem: 'Systemowy',
    fontScale: 'Rozmiar czcionki',
    fontNormal: 'Standardowy',
    fontLarge: 'Duży',
    data: 'Dane',
    backupTitle: 'Kopia zapasowa',
    backupHint:
      'Dane są tylko na tym telefonie. Zapisz plik JSON, aby przenieść je na inne urządzenie, po reinstalacji aplikacji albo z wersji www.',
    backupExport: 'Eksportuj kopię',
    backupImport: 'Importuj kopię',
    backupExportDone: 'Gotowe. Wybierz, gdzie zapisać plik.',
    backupExportFailed: 'Nie udało się przygotować kopii.',
    backupImportConfirmTitle: 'Importować kopię?',
    backupImportConfirmBody:
      'Obecne leki, harmonogram, odhaczenia i ustawienia zostaną zastąpione zawartością pliku. Tej operacji nie można cofnąć.',
    backupImportSuccess: 'Kopia została wczytana.',
    backupInvalid: 'Plik nie wygląda na poprawną kopię MediApp.',
    backupImportFailed: 'Import nie powiódł się.',
    backupLargeTitle: 'Duży plik',
    backupLargeBody: 'Import może chwilę potrwać.',
    deleteAll: 'Usuń wszystkie dane',
    deleteConfirm: 'Na pewno usunąć wszystkie dane z tego urządzenia? Tej operacji nie można cofnąć.',
    deleted: 'Dane zostały usunięte.',
    dataInfo: 'Informacje o danych',
    onboarding: 'Pokaż ekran powitalny ponownie',
    notificationLimits: 'Limity powiadomień',
  },

  notificationHelp: {
    title: 'Limity powiadomień',
    lead: 'MediApp nie ma serwera push. Przypomnienia są lokalne, planowane w aplikacji na godziny z Twojego harmonogramu.',
    tick: 'Gdy aplikacja jest otwarta, dodatkowo co ok. 30 sekund sprawdzamy zaległe dawki (np. alarm uporczywy).',
    ios: 'Na iPhonie system może opóźnić lub zgrupować powiadomienia w trybie oszczędzania energii. W razie wątpliwości otwórz aplikację i sprawdź ekran Dziś.',
    noPermission:
      'Bez zgody systemu na powiadomienia na ekranie Dziś zostaje panel z akcjami Wzięte, Odłóż i Pomiń.',
    persistent:
      'Alarm uporczywy powtarza przypomnienie co 5 minut, dopóki dawka ma status zaplanowana (gdy aplikacja może działać w tle lub jest otwarta).',
    closed:
      'Po długim zamknięciu aplikacji przez system przypomnienie może przyjść z opóźnieniem, zwłaszcza na iOS. Otwórz MediApp od czasu do czasu, aby odświeżyć plan.',
  },

  reminder: {
    activeTitle: 'Teraz: według Twojego planu',
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
