-- Forza il fuso orario di Roma a livello di database per la gestione date/ora.
-- Usa current_database() così funziona con qualunque valore di POSTGRES_DB.
DO $$
BEGIN
    EXECUTE format('ALTER DATABASE %I SET timezone = %L', current_database(), 'Europe/Rome');
END
$$;
