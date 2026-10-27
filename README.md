# MediApp

Osobisty **dziennik i przypominacz** — wpisujesz pozycje, harmonogram i własne notatki; aplikacja przypomina o godzinach, które sam wybierzesz.

MediApp **nie weryfikuje** danych o lekach, **nie sprawdza** interakcji ani **nie podpowiada** dawkowania z bazy produktów.

## Repozytorium

Prywatne repozytorium GitHub: [memphistor/MediApp](https://github.com/memphistor/MediApp)

## Uruchomienie

```bash
npm install
npm run dev
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
- vite-plugin-pwa (manifest; pełne powiadomienia w kolejnej fazie)

## Dokumentacja

- [Model danych](docs/data-model.md)
- [Przeznaczenie produktu (regulacyjnie)](docs/intended-purpose.md)
- [Roadmapa](docs/roadmap.md)

## Licencja

Prywatny projekt — brak publicznej licencji, dopóki nie zdecydujesz inaczej.
