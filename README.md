# BiblioStack

## Descrizione del progetto

BiblioStack è un sistema web full-stack per la gestione di una biblioteca.
L’applicazione offre un catalogo pubblico delle opere e un’area autenticata
per utenti, bibliotecari e amministratori.

Il progetto permette di:

- Consultare e cercare le opere presenti nel catalogo;
- Visualizzare i dettagli di un’opera e prenotare le copie disponibili;
- Gestire prestiti, restituzioni, prenotazioni e storico delle attività;
- Gestire utenti, ruoli, sospensioni, opere e copie dalla dashboard
  amministrativa;
- Usare tessere e codici QR per l’identificazione degli utenti;
- Inviare notifiche e promemoria automatici per prestiti e prenotazioni;
- Arricchire i dati bibliografici tramite Google Books API e Open Library API.

Il repository è organizzato in due applicazioni:

- `frontend/`: interfaccia React eseguita con Vite;
- `backend/`: API REST basate su Node.js ed Express;
- `docker/`: servizi PostgreSQL e Redis utilizzati dall’applicazione.

### Stack tecnologico

- **Frontend:** React, React Router, Vite, Tailwind CSS, shadcn/ui,
  React Hook Form, Zod, TanStack Table e Axios.
- **Backend:** Node.js, Express, Drizzle ORM, Zod, JWT, Argon2 e Pino.
- **Database e servizi:** PostgreSQL e Redis, avviati tramite Docker Compose.

## Istruzioni di installazione

### Prerequisiti

Installare i seguenti strumenti:

- Node.js e npm;
- Docker Desktop con Docker Compose;
- Git.

### 1. Clonare il repository

```bash
git clone https://github.com/Mat98-98/BiblioStack.git
cd BiblioStack
```

### 2. Configurare PostgreSQL e Redis

Creare il file di configurazione Docker:

```bash
cp docker/.env.example docker/.env
```

Modificare `docker/.env` impostando almeno valori validi per:

```dotenv
POSTGRES_USER=bibliostack
POSTGRES_PASSWORD=una-password-sicura
POSTGRES_DB=bibliostack
POSTGRES_VERSION=18.3
POSTGRES_PORT=5432
POSTGRES_EXTERNAL_PORT=5433
REDIS_VERSION=8.10.2-alpine
REDIS_PORT=6379
REDIS_EXTERNAL_PORT=6379
REDIS_PASSWORD=una-password-sicura
```

Su macOS è consigliabile usare una porta diversa da 5432 come porta PostgreSQL per evitare
conflitti con altri servizi locali.

Avviare i container dalla cartella `docker/`:

```bash
cd docker
docker compose up -d
cd ..
```

Gli script presenti in `docker/postgres/init/` inizializzano automaticamente
lo schema, i trigger, le viste e gli indici del database al primo avvio del
volume PostgreSQL.

### 3. Configurare il backend

Creare il file `backend/.env`:

```bash
cp backend/.env.example backend/.env
```

Impostare almeno le variabili necessarie all’avvio locale:

```dotenv
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://bibliostack:una-password-sicura@localhost:5433/bibliostack
PORT=5001

JWT_SECRET=una-chiave-jwt-locale
JWT_REFRESH=una-seconda-chiave-jwt-locale
CARD_SECRET=una-chiave-per-le-tessere

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=una-password-sicura
```

Le variabili per Google OAuth, Google Books, Resend e i domini autorizzati
sono necessarie solo per usare le rispettive integrazioni. Per un ambiente
locale, usare valori fittizi soltanto per i servizi che non si intendono
utilizzare.

Installare le dipendenze ed eseguire, se necessario, il seed:

```bash
cd backend
npm install
node src/db/seed.js
```

Il seed inserisce dati iniziali di esempio per ruoli, lingue, paesi,
editori, generi e altri dati di catalogo.

### 4. Configurare il frontend

Creare il file `frontend/.env`:

```bash
cp frontend/.env.example frontend/.env
```

Impostare l’URL delle API:

```dotenv
VITE_API_URL=http://localhost:5001/api
VITE_GOOGLE_CLIENT_ID=il-tuo-client-id-google
```

Installare le dipendenze:

```bash
cd frontend
npm install
```

## Utilizzo

### Avviare l’applicazione in sviluppo

Avviare il backend dalla cartella `backend/`:

```bash
npm run dev
```

Il server sarà disponibile su `http://localhost:5001`. L’endpoint
`http://localhost:5001/` può essere usato per verificare che il server sia
attivo.

In un secondo terminale, avviare il frontend dalla cartella `frontend/`:

```bash
npm run dev
```

L’interfaccia sarà disponibile, normalmente, su
`http://localhost:5173`.

### Comandi disponibili

#### Backend

| Comando | Descrizione |
| --- | --- |
| `npm run dev` | Avvia il backend con Nodemon. |
| `npm start` | Avvia il backend senza Nodemon. |
| `npm run drizzle:generate` | Genera le migrazioni Drizzle. |
| `npm run drizzle:push` | Sincronizza lo schema tramite Drizzle. |

#### Frontend

| Comando | Descrizione |
| --- | --- |
| `npm run dev` | Avvia il server di sviluppo Vite. |
| `npm run build` | Crea la build di produzione. |
| `npm run preview` | Serve localmente la build di produzione. |
| `npm run lint` | Esegue ESLint. |

### Principali sezioni dell’applicazione

- `/`: home page pubblica;
- `/catalog`: catalogo e ricerca delle opere;
- `/works/:id`: dettaglio di un’opera;
- `/profile`: profilo dell’utente autenticato;
- `/card`: tessera personale e codice QR;
- `/loans`: storico dei prestiti;
- `/reservations`: storico delle prenotazioni;
- `/admin`: dashboard amministrativa;
- `/admin/users`: gestione degli utenti;
- `/admin/works`: gestione delle opere;
- `/admin/loans`: gestione dei prestiti.

Le rotte amministrative richiedono autenticazione e autorizzazioni adeguate.

## Esempi / Demo

### Consultare il catalogo

1. Aprire `http://localhost:5173/catalog`.
2. Cercare un’opera usando la barra di ricerca.
3. Aprire una scheda per visualizzare dettagli e disponibilità.
4. Effettuare l’accesso per creare una prenotazione.

<!-- INSERISCI QUI LO SCREENSHOT DEL CATALOGO -->
![Catalog](docs/images/catalog.png)

### Gestire opere e copie

1. Accedere con un account autorizzato.
2. Aprire `http://localhost:5173/admin/works`.
3. Creare o modificare un’opera.
4. Aggiungere e gestire le copie associate.

<!-- INSERISCI QUI LO SCREENSHOT DELLA DASHBOARD AMMINISTRATIVA -->
<!-- Esempio: ![Dashboard amministrativa](docs/images/dashboard-admin.png) -->

### Gestire prestiti e prenotazioni

1. Aprire la sezione prestiti dalla dashboard.
2. Registrare un nuovo prestito o una restituzione.
3. Consultare le prenotazioni pronte per il ritiro.
4. Verificare notifiche e scadenze generate dal sistema.

<!-- INSERISCI QUI LO SCREENSHOT DELLA GESTIONE DI PRESTITI E PRENOTAZIONI -->
<!-- Esempio: ![Gestione prestiti](docs/images/prestiti.png) -->

### Tessera e codice QR

1. Accedere alla pagina `/card`.
2. Visualizzare la tessera personale.
3. Usare il codice QR nelle operazioni che richiedono la verifica dell’utente.
![QR Code](docs/images/qr_code.png)