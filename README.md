# MediApp

Osobisty **dziennik i przypominacz** — wpisujesz pozycje, harmonogram i własne notatki; aplikacja przypomina o godzinach, które sam wybierzesz.

MediApp **nie weryfikuje** danych o lekach, **nie sprawdza** interakcji ani **nie podpowiada** dawkowania z bazy produktów.

## Repozytorium

Prywatne repozytorium GitHub: [memphistor/MediApp](https://github.com/memphistor/MediApp)

## Podgląd w przeglądarce (GitHub Pages)

Po wdrożeniu z gałęzi `main`: **https://memphistor.github.io/MediApp/**

Wdrożenie: push na gałąź `main` uruchamia workflow **Deploy GitHub Pages** (albo ręcznie `npm run deploy:pages`). Pierwsze odświeżenie strony może potrwać 1–2 minuty.

## Uruchomienie lokalne

```bash
npm install
npm run dev
```

Podgląd buildu z ścieżką jak na Pages:

```bash
VITE_BASE_PATH=/MediApp/ npm run build && npm run preview
```

Produkcja:

```bash
npm run build
npm run preview
```

## Stack (szkielet)

- Vite + React + TypeScript
- Tailwind CSS 4
- React Router 7
- Dexie (IndexedDB, dane lokalne)
- vite-plugin-pwa (manifest, powiadomienia w przeglądarce przez Service Worker)

## Dokumentacja

- [Model danych](docs/data-model.md)
- [Przeznaczenie produktu (regulacyjnie)](docs/intended-purpose.md)
- [Roadmapa](docs/roadmap.md)

## Licencja

Prywatny projekt — brak publicznej licencji, dopóki nie zdecydujesz inaczej.
