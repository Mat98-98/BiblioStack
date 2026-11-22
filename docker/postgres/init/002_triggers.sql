/*
  =========================== FUNZIONI ===========================
*/

-- Funzione: Controlla se l'utente esiste ha i permessi di admin, bibliotecario o sistema
CREATE OR REPLACE FUNCTION check_staff_role()
RETURNS TRIGGER AS $$
DECLARE
handler_role user_role;
BEGIN
    -- Su UPDATE il controllo serve solo se handled_by cambia davvero
    IF TG_OP = 'UPDATE' AND NEW.handled_by IS NOT DISTINCT FROM OLD.handled_by THEN
        RETURN NEW;
END IF;

SELECT role INTO handler_role
FROM users
WHERE id = NEW.handled_by;

IF handler_role IS NULL OR handler_role NOT IN ('admin', 'librarian') THEN
        RAISE EXCEPTION 'Operation denied. User % (Role: %) does not have staff permissions.',
            NEW.handled_by, COALESCE(handler_role::text, 'None');
END IF;

RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Funzione: Controlla se l'utente è attualmente sospeso
CREATE OR REPLACE FUNCTION check_user_suspension()
RETURNS TRIGGER AS $$
BEGIN
    -- Cerca se l'utente ha una sospensione in corso (la data di fine è nel futuro, o è indefinita)
    IF EXISTS (
        SELECT 1 FROM suspensions
        WHERE user_id = NEW.user_id
        AND start_date <= now()
        AND (end_date IS NULL OR end_date > now())
    ) THEN
        RAISE EXCEPTION 'Operation denied. User % is currently suspended.', NEW.user_id;
END IF;

RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Funzione: Controlla se la copia fisica è già in prestito
CREATE OR REPLACE FUNCTION check_item_availability()
RETURNS TRIGGER AS $$
BEGIN
    -- Controlla se esiste già un prestito per questo item in cui la data di restituzione è vuota (NULL)
    IF EXISTS (
        SELECT 1 FROM loans
        WHERE item_id = NEW.item_id
        AND return_date IS NULL
    ) THEN
        RAISE EXCEPTION 'Operation denied. Item % is already out on loan and has not been returned.', NEW.item_id;
END IF;

RETURN NEW;
END;
$$ LANGUAGE plpgsql;

/*
  =========================== TRIGGERS ===========================
*/

-- Trigger per i prestiti
CREATE TRIGGER trg_check_loan_role
    BEFORE INSERT OR UPDATE ON loans
                         FOR EACH ROW
                         EXECUTE FUNCTION check_staff_role();

-- Trigger per le segnalazioni
CREATE TRIGGER trg_check_notice_role
    BEFORE INSERT OR UPDATE ON notices
                         FOR EACH ROW
                         EXECUTE FUNCTION check_staff_role();

-- Trigger per le sospensioni
CREATE TRIGGER trg_check_suspension_role
    BEFORE INSERT OR UPDATE ON suspensions
                         FOR EACH ROW
                         EXECUTE FUNCTION check_staff_role();

-- Trigger: Blocca il prestito se sospeso
CREATE TRIGGER trg_prevent_loan_if_suspended
    BEFORE INSERT ON loans
    FOR EACH ROW
    EXECUTE FUNCTION check_user_suspension();

-- Trigger: Blocca la prenotazione se sospeso
CREATE TRIGGER trg_prevent_reservation_if_suspended
    BEFORE INSERT ON reservations
    FOR EACH ROW
    EXECUTE FUNCTION check_user_suspension();

-- Trigger: Blocca l'inserimento se il libro non è a scaffale
CREATE TRIGGER trg_check_item_availability
    BEFORE INSERT ON loans
    FOR EACH ROW
    EXECUTE FUNCTION check_item_availability();