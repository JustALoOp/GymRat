# GymRat - Aplikacja do śledzenia treningu siłowego

To jest pełnostackowa aplikacja do śledzenia postępów w treningu siłowym, zbudowana przy użyciu stosu MERN (MongoDB, Express, React, Node.js) z wykorzystaniem TypeScript, Vite i Docker.

## Funkcjonalności

-   Rejestracja i logowanie użytkowników
-   Tworzenie, edycja i usuwanie planów treningowych
-   Dodawanie i śledzenie ćwiczeń w ramach sesji treningowych
-   Wizualizacja postępów za pomocą wykresów
-   Responsywny design dla urządzeń mobilnych i desktopowych

## Uruchomienie aplikacji za pomocą Docker (Ubuntu)

Poniższa instrukcja krok po kroku opisuje, jak uruchomić aplikację na systemie Ubuntu przy użyciu Dockera.

### Wymagania wstępne

-   System operacyjny Ubuntu
-   Zainstalowany `git`
-   Dostęp do terminala

### Krok 1: Instalacja Docker Engine

Jeśli nie masz zainstalowanego Dockera, wykonaj poniższe kroki.

1.  **Zaktualizuj listę pakietów:**
    ```bash
    sudo apt-get update
    ```

2.  **Zainstaluj pakiety niezbędne do korzystania z repozytorium HTTPS:**
    ```bash
    sudo apt-get install -y ca-certificates curl gnupg
    ```

3.  **Dodaj oficjalny klucz GPG Dockera:**
    ```bash
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg
    ```

4.  **Skonfiguruj repozytorium Dockera:**
    ```bash
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    ```

5.  **Zainstaluj Docker Engine:**
    ```bash
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    ```

6.  **Sprawdź, czy Docker został poprawnie zainstalowany:**
    ```bash
    sudo docker run hello-world
    ```
    Jeśli widzisz wiadomość powitalną od Dockera, instalacja przebiegła pomyślnie.

7.  **(Opcjonalnie) Uruchamianie Dockera bez `sudo`:**
    Aby uniknąć konieczności wpisywania `sudo` przy każdym poleceniu `docker`, dodaj swojego użytkownika do grupy `docker`:
    ```bash
    sudo groupadd docker
    sudo usermod -aG docker $USER
    ```
    Po wykonaniu tego polecenia **wyloguj się i zaloguj ponownie**, aby zmiany weszły w życie.

### Krok 2: Klonowanie repozytorium

Sklonuj repozytorium aplikacji na swój komputer:
```bash
git clone https://github.com/JustALoOp/GymRat.git
cd GymRat
```

### Krok 3: Konfiguracja zmiennych środowiskowych

Aplikacja wymaga pliku `.env` do przechowywania kluczowych zmiennych. Możesz utworzyć go na podstawie dostarczonego przykładu.

1.  **Skopiuj plik `.env.example`:**
    ```bash
    cp .env.example .env
    ```

2.  **Otwórz plik `.env` w edytorze tekstu:**
    ```bash
    nano .env
    ```

3.  **Uzupełnij zmienne:**
    -   `MONGO_URI`: W środowisku Docker, ta zmienna powinna wskazywać na kontener z bazą danych: `mongodb://mongo:27017/gym-tracker`.
    -   `JWT_SECRET`: Wygeneruj silny, losowy ciąg znaków (możesz użyć menedżera haseł lub polecenia `openssl rand -base64 32`).
    -   `JWT_COOKIE_EXPIRE`: Określ czas ważności tokena (np. `30d` dla 30 dni).

    Przykładowa zawartość pliku `.env`:
    ```env
    # Wartość dla środowiska Docker
    MONGO_URI=mongodb://mongo:27017/gym-tracker

    # Przykładowe wartości - zastąp je własnymi
    JWT_SECRET=twoj_bardzo_tajny_klucz_jwt
    JWT_COOKIE_EXPIRE=30d
    ```

### Krok 4: Uruchomienie aplikacji

Gdy Docker jest zainstalowany, a repozytorium sklonowane i skonfigurowane, możesz uruchomić całą aplikację za pomocą jednego polecenia.

1.  **Zbuduj i uruchom kontenery:**
    ```bash
    docker compose up --build
    ```
    Polecenie to zbuduje obrazy dla frontendu i backendu (jeśli nie istnieją) i uruchomi wszystkie usługi zdefiniowane w pliku `docker-compose.yml` (frontend, backend, baza danych).

2.  **Dostęp do aplikacji:**
    -   Frontend aplikacji będzie dostępny pod adresem: `http://localhost:8080`
    -   Backend API będzie nasłuchiwać na porcie `5000`, ale dostęp do niego z przeglądarki odbywa się przez proxy Nginx skonfigurowane w kontenerze frontendu.

### Krok 5: Zatrzymywanie aplikacji

Aby zatrzymać wszystkie kontenery, naciśnij `Ctrl + C` w terminalu, w którym uruchomiłeś `docker compose up`.

Aby zatrzymać i usunąć kontenery, użyj polecenia:
```bash
docker compose down
```

Aby usunąć również wolumeny (w tym dane z bazy danych), dodaj flagę `-v`:
```bash
docker compose down -v
```

## Struktura projektu

-   `backend/`: Kod źródłowy serwera Node.js/Express.
-   `frontend/`: Kod źródłowy aplikacji React/Vite.
-   `docker-compose.yml`: Plik konfiguracyjny do orkiestracji kontenerów.
-   `.env`: Plik ze zmiennymi środowiskowymi (ignorowany przez Git).