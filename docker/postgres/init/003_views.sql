
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