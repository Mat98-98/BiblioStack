
-- View per verificare se ci sono copie libere da prestiti o prenotazioni con flag ready
CREATE VIEW item_availability AS
SELECT
    i.id          AS item_id,
    i.work_id,
    i.location_id
FROM items i
WHERE
    NOT EXISTS (
        SELECT 1 FROM loans l
        WHERE l.item_id = i.id
          AND l.return_date IS NULL
    )
  AND
    NOT EXISTS (
        SELECT 1 FROM reservations r
        WHERE r.assigned_item_id = i.id
          AND r.status = 'ready'
    );

-- View che contiene le sospensioni attive
CREATE VIEW active_suspensions AS
SELECT DISTINCT ON (user_id)
    id,
    user_id,
    reason,
    start_date,
    end_date
FROM suspensions
WHERE end_date IS NULL OR end_date > now()
ORDER BY user_id, start_date DESC;