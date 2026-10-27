# Roadmapa MediApp

## Faza 1 — Rdzeń (po szkielecie)

**Zrobione (partia 2):**

- Zapis `MedicationEntry` z kreatora (Dexie)
- Generator wystąpień dawek + synchronizacja `DoseLog`
- Widok „Dziś”, historia, kalendarz miesiąca z prawdziwych logów
- Oznaczanie: wzięta / pominięta; auto `missed` po końcu dnia
- Usuwanie pozycji z kaskadą logów

**Zostało w Fazie 1:**

- Edycja istniejącej pozycji
- Szybkie „zapisz przyjęcie” dla `asNeeded`
- Pełniejszy kalendarz (definicja „pełnego dnia” vs plan)

## Faza 2 — Powiadomienia

- Web Notifications + Service Worker
- Akcje: Wzięte / Odłóż / Pomiń; opcjonalny alarm uporczywy
- Grupowanie pozycji o tej samej porze
- Testy: Android, iOS Safari, oszczędzanie baterii, zmiana strefy czasowej

## Faza 3 — Eksport i RODO

- Eksport CSV i PDF (surowe zapisy, bez interpretacji)
- Polityka prywatności i ekran zgód
- Dokumentacja procedury usuwania danych

## Faza 4 — Gamifikacja

- Pierścień dnia, seria z tarczą, odznaki — liczone z logów
- Komunikaty opisowe („3 z 4 pozycji”), bez ocen zdrowotnych
- Seria tylko dla dawek planowych, nie „w razie potrzeby”

## Po konsultacji regulacyjnej

- Synchronizacja między urządzeniami (szyfrowanie end-to-end)
- Tryb opiekuna
- Autouzupełnianie **wyłącznie nazw** (bez danych dawkowania)
- Widżety systemowe

## Ograniczenia znane

Powiadomienia PWA na iOS są mniej niezawodne niż na Androidzie — komunikować w UI i w dokumentacji pomocy.
