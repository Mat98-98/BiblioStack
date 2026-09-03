import { loans, items, works, users } from "../db/schema.js";
import { db } from "../db/connection.js";
import { eq, isNull, isNotNull, and, or, ilike, lt, gte, sql, asc, desc } from "drizzle-orm";
import { userSelect } from "./presets/user.preset.js";
import { normalizeSearch } from "../utils/search.util.js";

// Alias per distinguere patron/librarian nei join
const patron = users;

export const loanRepository = {

    findAll: async ({ page, limit }) => {
        const offset = (page - 1) * limit;
        return await db.query.loans.findMany({
            limit,
            offset,
            with: {
                item: { with: { work: {columns: { title: true }}}},
                patron: { columns: userSelect.safe },
                librarian: { columns: userSelect.safe }
            },
            orderBy: { loanDate: "desc" }
        });
    },

    findById: async (id) =>
        await db.query.loans.findFirst({
            where: { id },
            with: {
                item: { with: { work: {columns: { title: true }}}},
                patron: { columns: userSelect.safe },
                librarian: { columns: userSelect.safe },
                notices: true
            }
        }),

    findActiveByItemId: async (itemId) =>
        await db.query.loans.findFirst({
            where: {
                itemId,
                returnDate: { isNull: true }
            }
        }),

    findActiveByUserAndWork: async (userId, workId) => {
        const loan = await db.query.loans.findFirst({
            where: {
                userId,
                returnDate: { isNull: true }
            },
            with: { item: true }
        });
        return loan?.item?.workId === workId ? loan : null;
    },

    // Query per prelevare i prestiti non restituiti in base alla data di scadenza. Il parametro è mandato dal service e di default è eq.
    findByDueDateStatus: async (dateStr, comparator = "eq") => {
        return await db.query.loans.findMany({
            where: { returnDate: { isNull: true }, dueDate: { [comparator]: dateStr } },
        })
    },


    create: async (data, tx = db) =>
        await tx.insert(loans).values(data).returning(),

    update: async (id, data, tx = db) =>
        await tx.update(loans).set(data).where(eq(loans.id, id)).returning(),

    delete: (id) =>
        db.delete(loans).where(eq(loans.id, id)).returning(),

    search: async ({ page, limit, search, status, sortBy, sortOrder, workId, userId }) => {
        const offset = (page - 1) * limit;

        // Parsing della stringa in input
        const { pattern, isEmpty } = normalizeSearch(search ?? "");

        // Determino qui la colonna di ordinamento, perché serve sia nel SELECT che nell'ORDER BY (per SELECT DISTINCT, ogni colonna dell'ORDER BY deve comparire nel SELECT)
        const sortColumn = sortBy === "dueDate" ? loans.dueDate : loans.loanDate;
        // .as() forza l'alias SQL esplicito (AS sort_value), non solo la chiave nell'oggetto JS
        const sortExpr = sql`${sortColumn}`.as("sort_value");

        // Query base con join necessari per filtrare su titolo opera e nome utente
        const base =
            db.selectDistinct({ id: loans.id, sortValue: sortExpr }).from(loans)
                .leftJoin(items, eq(items.id, loans.itemId))
                .leftJoin(works, eq(works.id, items.workId))
                .leftJoin(patron, eq(patron.id, loans.userId))
                .$dynamic();

        // Creo un'array vuoto su cui verranno pushate le condizioni che costituiranno i filtri
        const conditions = [];

        // Filtro testuale: opera, nome/cognome utente (in entrambi gli ordini) o codice inventario copia
        if (!isEmpty) {
            conditions.push(or(
                ilike(works.title, pattern),
                ilike(patron.firstName, pattern),
                ilike(patron.lastName, pattern),
                sql`(${patron.firstName} || ' ' || ${patron.lastName}) ILIKE ${pattern}`,
                ilike(loans.itemId, pattern)
            ));
        }

        // Filtro per stato del prestito (per all non serve alcun filtro)
        if (status === "returned") {
            conditions.push(isNotNull(loans.returnDate));
        } else if (status === "overdue") {
            conditions.push(and(isNull(loans.returnDate), lt(loans.dueDate, new Date().toISOString().split('T')[0])));
        } else if (status === "active") {
            conditions.push(and(isNull(loans.returnDate), or(isNull(loans.dueDate), gte(loans.dueDate, new Date().toISOString().split('T')[0]))));
        }

        // Filtri di contesto: prestiti di una specifica opera o di uno specifico utente
        if (workId) conditions.push(eq(works.id, workId));
        if (userId) conditions.push(eq(loans.userId, userId));

        if (conditions.length > 0) {
            base.where(and(...conditions));
        }

        // Ordinamento dati (la whitelist dei parametri è stata fatta nello schema zod per evitare injections)
        const orderFn = sortOrder === "asc" ? asc : desc;
        // asc(loans.id) come tie-breaker: evita un ordine instabile tra righe con data identica
        base.orderBy(orderFn(sql`sort_value`), asc(loans.id));

        const paged = await base.limit(limit).offset(offset);

        if (paged.length === 0) return [];

        // Fetch completo con relazioni (item, patron, librarian), partendo dagli id già filtrati/ordinati
        const ids = paged.map(r => r.id);
        const fullLoans = await db.query.loans.findMany({
            where: { id: { in: ids } },
            with: {
                item: { with: { work: {columns: { title: true }}}},
                patron: { columns: userSelect.safe },
                librarian: { columns: userSelect.safe }
            }
        });

        // Riordino secondo l'ordinamento/ranking calcolato sopra, perso da findMany
        const loanMap = new Map(fullLoans.map(l => [l.id, l]));
        return ids.map(id => loanMap.get(id)).filter(Boolean);
    }
}