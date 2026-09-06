/*
  =========================== INDICI UNIQUE ===========================
*/

-- Indice unico per la tabella reservations (impedisce più prenotazione attive dello stesso utente per la stessa opera)
CREATE UNIQUE INDEX "reservations_user_work_active_unique"
ON "reservations" ("user_id", "work_id")
WHERE "status" IN ('pending', 'ready');

-- Indice unico per la tabella reservations (impedisce che la stessa copia sia assegnata a più prenotazioni ready contemporaneamente)
CREATE UNIQUE INDEX reservations_item_ready_unique
ON "reservations" ("assigned_item_id")
WHERE "status" = 'ready';


-- Indice unico per la tabella loans (evita che una copia possa avere più prestiti attivi contemporaneamente)
CREATE UNIQUE INDEX loans_item_active_unique
ON "loans" ("item_id")
WHERE "return_date" IS NULL;