# MediApp na iPhone — szybka pętla dev (bez kabla)

**Cel:** zmiana w kodzie na Macu → w kilka sekund ta sama wersja na telefonie (Wi‑Fi).

## Ważne: dwa rodzaje aplikacji na telefonie

| Aplikacja na iPhone | Skąd bierze kod | Czy widzi Twoje zmiany z Cursora? |
|---------------------|-----------------|-----------------------------------|
| **Expo Go** (App Store) | Mac z włączonym Metro | **Tak** — od razu |
| **Development build** (MediApp z EAS, profil `development`) | Mac z włączonym Metro | **Tak** — od razu |
| **TestFlight / wersja ze sklepu** | Wbudowany bundle z builda | **Nie** — trzeba nowy build + TestFlight (godziny/dni) |

Do codziennej pracy nad bugami (np. powiadomienia) używaj **Expo Go** albo **development build**. TestFlight zostaw na „czy wersja produkcyjna jest OK”.

---

## Opcja A — najszybciej dziś (Expo Go)

**Jednorazowo:** z App Store zainstaluj **Expo Go**.

**Za każdym razem gdy pracujesz:**

1. Mac i iPhone w **tej samej sieci Wi‑Fi**.
2. W katalogu projektu:

   ```bash
   npm run mobile:dev
   ```

   (To uruchamia **Metro** — serwer, który wysyła świeży JavaScript na telefon. QR w terminalu Cursora często **nie widać** — to normalne.)

3. Na iPhone w **Expo Go**:
   - zakładka **Projects** → powinna pojawić się sesja **MediApp** / `mediapp`, albo
   - **Enter URL manually** i wpisz adres z terminala, np. `exp://192.168.1.42:8081` (IP Maca + port 8081).

4. Po zapisaniu pliku w Cursorze aplikacja na telefonie **sama się przeładuje** (Fast Refresh).

**Nie potrzebujesz:** commita, pusha ani nowego builda — to tylko JavaScript z Metro.

---

## Opcja B — zalecana na dłużej (development build)

Expo Go jest wygodne, ale **powiadomienia i SQLite** zachowują się bliżej wersji ze sklepu w **własnej** aplikacji dev.

**Jednorazowo (build w chmurze, ~15–25 min):**

```bash
cd apps/mobile
npx eas-cli build --profile development --platform ios
```

Po buildzie EAS wyśle link — otwórz na iPhone i zainstaluj **MediApp (development)**. To nie TestFlight; to wewnętrzna dystrybucja EAS.

**Codziennie:**

```bash
npm run mobile:dev-client
```

Otwórz zainstalowaną aplikację **MediApp (dev)** — łączy się z Maciem po Wi‑Fi i ładuje ten sam kod co w Cursorze.

Jeśli Wi‑Fi gryzie (gość / izolacja urządzeń):

```bash
npm run mobile:dev:tunnel
```

(wolniejsze, ale działa bez wspólnej sieci lokalnej)

---

## Kiedy commit / push / build?

| Co zmieniasz | Co robisz na telefonie |
|--------------|------------------------|
| TS/TSX, logika, UI (99% pracy) | Metro + Expo Go **lub** dev client — **zero** builda |
| `app.json`, nowa biblioteka natywna, plugin | Nowy **EAS build** (dev lub preview), potem znowu Metro |
| Wersja „jak u klientów” przed sklepem | `eas build --profile preview` + TestFlight |

---

## Node

Projekt ma `.nvmrc` → **Node 22**. Przy dziwnych błędach Metro:

```bash
nvm use
npm run mobile:dev
```

---

## Skróty npm (z roota repo)

| Komenda | Znaczenie |
|---------|-----------|
| `npm run mobile:dev` | Metro, LAN — Expo Go lub dev client |
| `npm run mobile:dev-client` | Metro tylko dla development build |
| `npm run mobile:dev:tunnel` | Metro przez tunel Expo |
