# BiblioStack — Library Management System

## Introduzione

BiblioStack è una web application full-stack per la gestione di una biblioteca digitale.

Il sistema permette la gestione di utenti, ruoli e contenuti bibliografici attraverso una dashboard amministrativa.

Include funzionalità di ricerca e arricchimento dei dati delle opere tramite integrazione con API esterne.

L’obiettivo è fornire una piattaforma scalabile per la gestione di una biblioteca digitale con validazione rigorosa dei dati e architettura backend modulare.

---

## Stack tecnologico

### Frontend

- React (Vite) & React Router: Per la costruzione dell'interfaccia utente in modalità SPA (Single Page Application) con un ambiente di sviluppo estremamente rapido e la gestione del routing dinamico.

- Tailwind CSS & shadcn/ui: Per un design system responsivo, pulito e accessibile (utilizzando componenti UI headless come Dialog, Table e Dropdown).

- React Hook Form & Zod: Per la gestione performante dello stato dei form e la validazione rigorosa dei dati lato client.

- TanStack Table: Libreria avanzata per la gestione flessibile delle tabelle dati amministrative.

- Axios: Client HTTP per l'interazione semplificata e protetta con le API.

---

### Backend

- Node.js & Express: Infrastruttura server per l'esposizione sicura delle API RESTful.

- Drizzle ORM: ORM moderno, leggero e type-safe, utilizzato per interagire con il database mantenendo alte prestazioni e una sintassi vicina a SQL puro.

- Zod (Schema & DTO): Utilizzato per validare in modo stretto i payload in ingresso e filtrare i dati in uscita (Data Transfer Object), prevenendo esposizioni involontarie di dati sensibili.

- JWT Authentication: Autenticazione stateless sicura per la gestione degli accessi e dei permessi.

- Bcrypt: Per l'hashing sicuro delle credenziali degli utenti prima del salvataggio.

---

### Database

- PostgreSQL: RDBMS relazionale potente e affidabile, utilizzato per la persistenza sicura e strutturata dei dati (utenti, anagrafiche, catalogo opere, ruoli e storici).

---

### Architettura

Il backend è strutturato secondo un’architettura a strati con separazione delle responsabilità:

- Gestione delle richieste HTTP

- Logica di business separata

- Accesso ai dati tramite repository

- Validazione tramite schema Zod

- Trasformazione delle risposte tramite DTO

---

## Integrazioni esterne

Il sistema si integra con:

- Google Books API

- Open Library API

per recuperare e arricchire automaticamente le informazioni delle opere (titolo, autore, descrizione, copertina...).

---

## Sicurezza

- Autenticazione tramite JWT

- Middleware di autorizzazione basato su ruoli

- Validazione server-side di tutti i payload

- Protezione delle rotte sensibili (admin only)

---

## Obiettivo del progetto

Il progetto nasce come esercizio di software engineering full-stack, con focus su:

- Architettura scalabile

- Separazione delle responsabilità

- Consistenza tra frontend e backend

- Integrazione di servizi esterni

- Validazione forte dei dati

---