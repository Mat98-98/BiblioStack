/*
       =========================== CREAZIONE E SETUP SCHEMA ===========================
*/

CREATE SCHEMA IF NOT EXISTS school_library; -- Schema dedicato per isolare le tabelle della biblioteca
ALTER DATABASE buonarroti SET search_path TO school_library, public; -- Configura il percorso di ricerca: dà priorità allo schema biblioteca, poi a public
SET search_path TO school_library, public; -- Applica il search_path alla sessione corrente per l'esecuzione dello script


/*
       =========================== CREAZIONE TABELLE ===========================
*/


-- Tabella autori
CREATE TABLE IF NOT EXISTS authors (
                                       id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                       first_name text,
                                       last_name text
);

-- Tabella contributi
CREATE TABLE IF NOT EXISTS contributions (
                                             id smallint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                             name text NOT NULL
);


-- Tabella casa editrice
CREATE TABLE IF NOT EXISTS publishers (
                                          id smallint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                          name text NOT NULL UNIQUE
);


-- Tabella lingue
CREATE TABLE IF NOT EXISTS languages (
                                         language_code char(3) CHECK (length(language_code) = 3) PRIMARY KEY,
                                         name text NOT NULL UNIQUE
);


-- Tabella paesi di pubblicazione
CREATE TABLE IF NOT EXISTS publication_countries (
                                                     country_code char(2) CHECK (length(country_code) = 2) PRIMARY KEY,
                                                     name text NOT NULL UNIQUE
);


-- Tabella codici dewey
CREATE TABLE IF NOT EXISTS dewey_codes (
                                           code text PRIMARY KEY,
                                           description text
);

-- Tabella città istituti
CREATE TABLE IF NOT EXISTS school_cities (
                                             id smallint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                             name text NOT NULL
);

-- Tabella istituti
CREATE TABLE IF NOT EXISTS schools (
                                       id smallint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                       city_id smallint NOT NULL REFERENCES school_cities(id) ON DELETE NO ACTION, -- FK school_cities id
                                       name text
);


-- Tabella locazione (mensola/collocazione fisica)
CREATE TABLE IF NOT EXISTS locations (
                                         id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                         school_id smallint NOT NULL REFERENCES schools(id) ON DELETE NO ACTION,
                                         shelf_code text
);


-- Tabella ruoli utente
CREATE TABLE IF NOT EXISTS roles (
                                     id smallint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                     name text NOT NULL UNIQUE
);


-- Tabelle utenti
CREATE TABLE IF NOT EXISTS users (
                                     id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                     role_id smallint NOT NULL REFERENCES roles(id) ON DELETE NO ACTION,
                                     first_name text,
                                     last_name text,
                                     email text NOT NULL UNIQUE,
                                     phone text,
                                     card_version smallint NOT NULL DEFAULT 1 CHECK (card_version > 0),
                                     password_hash text,
                                     created_at timestamptz DEFAULT now(),
                                     deleted_at timestamptz DEFAULT null
);


-- Enum per il tipo di token
CREATE TYPE token_type AS ENUM (
    'reset',
    'setup'
    );

-- Tabella token per cambio e setup password iniziale
CREATE TABLE IF NOT EXISTS password_tokens (
                                               token text PRIMARY KEY,
                                               user_id int NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                               type token_type NOT NULL,
                                               created_at timestamptz DEFAULT now(),
                                               expires_at timestamptz NOT NULL,
                                               used_at timestamptz
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
                                              id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                              user_id int NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                              token_hash TEXT NOT NULL UNIQUE,
                                              expires_at timestamptz NOT NULL,
                                              revoked_at timestamptz,
                                              replaced_by_token_hash TEXT,
                                              created_at timestamptz NOT NULL DEFAULT now(),

                                              CONSTRAINT chk_refresh_tokens_expires_after_created
                                                  CHECK (expires_at > created_at),

                                              CONSTRAINT chk_refresh_tokens_replaced_implies_revoked
                                                  CHECK (replaced_by_token_hash IS NULL OR revoked_at IS NOT NULL)
);


-- Tabella opere
CREATE TABLE IF NOT EXISTS works (
                                     id text PRIMARY KEY,
                                     publisher_id smallint REFERENCES publishers(id) ON DELETE NO ACTION,
                                     dewey_code text REFERENCES dewey_codes(code) ON DELETE NO ACTION ON UPDATE CASCADE,
                                     language_code char(3) REFERENCES languages(language_code) ON DELETE NO ACTION ON UPDATE CASCADE,
                                     publication_country char(2) REFERENCES publication_countries(country_code) ON DELETE NO ACTION ON UPDATE CASCADE,
                                     title text NOT NULL,
                                     other_title_information text,
                                     description text,
                                     pages smallint,
                                     publication_date date,
                                     cover_url text
);


-- Tabella sospensioni
CREATE TABLE IF NOT EXISTS suspensions (
                                           id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                           user_id int NOT NULL REFERENCES users(id) ON DELETE NO ACTION, -- FK
                                           handled_by int NOT NULL REFERENCES users(id) ON DELETE NO ACTION, --FK bibliotecario, il sistema avrà un utente in modo da monitorare le sospensioni automatiche
                                           reason text,
                                           start_date timestamptz DEFAULT now(),
                                           end_date timestamptz
);


-- Tabella valute
CREATE TABLE IF NOT EXISTS currencies (
                                          code CHAR(3) PRIMARY KEY
);


-- Tabella copie
CREATE TABLE IF NOT EXISTS items (
                                     id text PRIMARY KEY,
                                     work_id text NOT NULL REFERENCES works(id) ON DELETE CASCADE,
                                     location_id int REFERENCES locations(id) ON DELETE SET NULL,
                                     currency_code char(3) REFERENCES currencies(code) ON DELETE NO ACTION ON UPDATE CASCADE,
                                     acquisition_date date,
                                     price numeric(12,2)
);


-- Enum per gestire lo stato delle prenotazioni
CREATE TYPE reservation_status AS ENUM (
    'pending',
    'ready',
    'fulfilled',
    'cancelled',
    'expired'
    );

-- Tabella prenotazioni
CREATE TABLE IF NOT EXISTS reservations (
                                            id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                            user_id int NOT NULL REFERENCES users(id) ON DELETE NO ACTION,
                                            work_id text NOT NULL REFERENCES works(id) ON DELETE CASCADE,
                                            assigned_item_id text REFERENCES items(id) ON DELETE SET NULL,
                                            reservation_date timestamptz DEFAULT now(),
                                            status reservation_status DEFAULT 'pending',
                                            expires_at timestamptz
);



-- Tabella opere autore (Per risolvere relazione N/N tra opere e autori)
CREATE TABLE IF NOT EXISTS author_works (
                                            author_id int NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
                                            work_id text NOT NULL REFERENCES works(id) ON DELETE CASCADE,
                                            contribution_id smallint NOT NULL REFERENCES contributions(id) ON DELETE NO ACTION,
                                            PRIMARY KEY (author_id, work_id, contribution_id)
);


-- Tabella prestiti
CREATE TABLE IF NOT EXISTS loans (
                                     id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                     user_id int NOT NULL REFERENCES users(id) ON DELETE NO ACTION, --FK
                                     handled_by int NOT NULL REFERENCES users(id) ON DELETE NO ACTION, -- FK bibliotecario
                                     item_id text NOT NULL REFERENCES items(id) ON DELETE NO ACTION, -- FK copie
                                     loan_date timestamptz DEFAULT now(),
                                     due_date date, -- Data prevista restituzione libro
                                     return_date timestamptz -- Data effettiva di restituzione libro
);


-- Tabella per i tipi di segnalazione (ritardo, danneggiamento libro ecc.)
CREATE TABLE IF NOT EXISTS notice_types (
                                            id smallint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                            name text NOT NULL UNIQUE
);

-- Tabella segnalazioni utente
CREATE TABLE IF NOT EXISTS notices (
                                       id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                       user_id int NOT NULL REFERENCES users(id) ON DELETE NO ACTION,
                                       handled_by int NOT NULL REFERENCES users(id) ON DELETE NO ACTION, -- Il sistema avrà un utente in modo da monitorare le segnalazioni automatiche
                                       notice_type_id smallint NOT NULL REFERENCES notice_types(id) ON DELETE NO ACTION ON UPDATE CASCADE,
                                       loan_id int NOT NULL REFERENCES loans(id) ON DELETE NO ACTION,
                                       description text,
                                       issued_at timestamptz DEFAULT now()
);


-- Tabella generi
CREATE TABLE IF NOT EXISTS genres (
                                      id smallint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                      name text NOT NULL UNIQUE
);


-- Tabella per relazione n/n tra generi e opere
CREATE TABLE IF NOT EXISTS work_genres (
                                           work_id text NOT NULL REFERENCES  works(id) ON DELETE CASCADE,
                                           genre_id smallint NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
                                           PRIMARY KEY (work_id, genre_id)
);