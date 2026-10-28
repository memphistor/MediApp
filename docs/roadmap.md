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

**Zrobione:**

- Web Notifications przez Service Worker (`injectManifest`)
- Akcje: Wzięte / Odłóż / Pomiń oraz „Wzięte wszystko” (grupowanie po `scheduledAt`)
- Ustawienia: włączenie, odłożenie (minuty), alarm uporczywy (powtórka co 5 min)
- Panel na ekranie **Dziś**, gdy brak zgody lub wyłączone powiadomienia
- Tick co 30 s przy aktywnej aplikacji (bez serwera push)

**Ograniczenia (bez backendu):**

- Przy zamkniętej aplikacji przypomnienia mogą się opóźnić (szczególnie iOS) — patrz [`docs/notifications-limits.md`](notifications-limits.md)

## Faza 3 — Eksport i RODO

**Zrobione:**

- Eksport CSV (pozycje + dziennik) i PDF z Historii i Ustawień; zakres 30/90 dni lub całość
- Polityka prywatności (`/privacy`), zgoda art. 9 (`/privacy-consent`), wersjonowanie polityki
- [`docs/data-deletion.md`](data-deletion.md), [`docs/privacy-policy.md`](privacy-policy.md)

**Później (opcjonalnie):**

- Eksport JSON lub ZIP dwóch CSV w jednym pliku
- Uzupełnienie kontaktu operatora w polityce przed sklepem app store

## Faza 4 — Gamifikacja

**Zrobione:**

- Pierścień dnia, seria z tarczą (7 pełnych dni = odnowienie), odznaki `streak_7`, `streak_30`, `taken_100`
- Statystyka miesiąca i komunikaty opisowe (bez ocen zdrowotnych)
- Haptyka po „Wzięte” na ekranie Dziś

**Później (opcjonalnie):**

- Animowana roślina, odznaki sezonowe

## Po konsultacji regulacyjnej

- Synchronizacja między urządzeniami (szyfrowanie end-to-end)
- Tryb opiekuna
- Autouzupełnianie **wyłącznie nazw** (bez danych dawkowania)
- Widżety systemowe

## Ograniczenia znane

Powiadomienia PWA na iOS są mniej niezawodne niż na Androidzie — komunikować w UI i w dokumentacji pomocy.
