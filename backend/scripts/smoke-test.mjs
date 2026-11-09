/*
 * Smoke test delle API BiblioStack.
 * Pensato per girare DENTRO il container backend dopo il seed:
 *     ./bibliostack.sh smoke
 * Usa solo fetch nativo (Node >= 20), nessuna dipendenza.
 *
 * Variabili: API_BASE (default http://localhost:5001/api), SEED_PASSWORD (default password123)
 */

const API = process.env.API_BASE ?? "http://localhost:5001/api";
const PASSWORD = process.env.SEED_PASSWORD ?? "password123";

let failures = 0;
let warnings = 0;

const ok = (msg) => console.log(`  ✅ ${msg}`);
const fail = (msg) => { failures++; console.log(`  ❌ ${msg}`); };
const warn = (msg) => { warnings++; console.log(`  ⚠️  ${msg}`); };

// Client minimale con gestione dei cookie (accessToken / refreshToken httpOnly)
const createClient = () => {
    const jar = new Map();
    return async (method, path, body) => {
        const headers = { Origin: "http://localhost:5173" };
        if (jar.size) headers.Cookie = [...jar].map(([k, v]) => `${k}=${v}`).join("; ");
        if (body !== undefined) headers["Content-Type"] = "application/json";

        const res = await fetch(`${API}${path}`, {
            method,
            headers,
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });
        for (const c of res.headers.getSetCookie()) {
            const [pair] = c.split(";");
            const [k, ...v] = pair.split("=");
            jar.set(k.trim(), v.join("="));
        }
        let data = null;
        const text = await res.text();
        try { data = JSON.parse(text); } catch { data = text; }
        return { status: res.status, data };
    };
};

const expectStatus = (label, res, expected) => {
    const list = Array.isArray(expected) ? expected : [expected];
    if (list.includes(res.status)) ok(`${label} → ${res.status}`);
    else fail(`${label} → atteso ${list.join("/")}, ottenuto ${res.status} ${JSON.stringify(res.data).slice(0, 200)}`);
    return res;
};

const login = async (email) => {
    const client = createClient();
    const res = await client("POST", "/auth/login", { email, password: PASSWORD });
    expectStatus(`login ${email}`, res, 200);
    return { client, user: res.data?.user };
};

const section = (title) => console.log(`\n▶ ${title}`);

const main = async () => {
    const anon = createClient();

    section("Endpoint pubblici");
    expectStatus("GET /works", await anon("GET", "/works"), 200);
    expectStatus("GET /works/search?search=rosa", await anon("GET", "/works/search?search=rosa"), 200);
    expectStatus("GET /genres", await anon("GET", "/genres"), 200);
    expectStatus("GET /auth/me senza login", await anon("GET", "/auth/me"), 401);
    expectStatus("login con password errata",
        await anon("POST", "/auth/login", { email: "admin@biblioteca.it", password: "sbagliata" }), 401);

    section("Autenticazione e ruoli");
    const admin = await login("admin@biblioteca.it");
    const librarian = await login("mario.rossi@biblioteca.it");
    const student = await login("sara.neri@studenti.it");
    const luca = await login("luca.verdi@studenti.it");
    if (!admin.user || !librarian.user || !student.user) {
        fail("Login dei ruoli di test fallito: il seed è stato eseguito? (./bibliostack.sh seed)");
        return;
    }
    expectStatus("GET /auth/me (admin)", await admin.client("GET", "/auth/me"), 200);
    expectStatus("GET /roles (admin)", await admin.client("GET", "/roles"), 200);
    expectStatus("GET /roles (bibliotecario → vietato)", await librarian.client("GET", "/roles"), 403);
    expectStatus("GET /users (studente → vietato)", await student.client("GET", "/users"), 403);
    expectStatus("GET /loans (bibliotecario)", await librarian.client("GET", "/loans"), 200);
    expectStatus("GET /loans/mine (studente)", await student.client("GET", "/loans/mine"), 200);
    expectStatus("GET /operator-dashboard/stats (bibliotecario)",
        await librarian.client("GET", "/operator-dashboard/stats"), 200);
    expectStatus("POST /auth/refresh", await student.client("POST", "/auth/refresh"), 200);
    expectStatus("GET /cards/me (studente)", await student.client("GET", "/cards/me"), 200);

    section("Flusso prenotazione (studente)");
    const item = await anon("GET", "/items/ITEM-002");
    expectStatus("GET /items/ITEM-002", item, 200);
    const workId = item.data?.work?.id;
    if (workId) {
        const r = await student.client("POST", "/reservations", { workId });
        expectStatus("POST /reservations", r, 201);
        if (r.data?.id) {
            r.data.status === "ready"
                ? ok("prenotazione in stato ready (copia disponibile)")
                : warn(`stato prenotazione inatteso: ${r.data.status}`);
            expectStatus("POST /reservations doppia → rifiutata",
                await student.client("POST", "/reservations", { workId }), 400);
            expectStatus("PATCH /reservations/:id annulla",
                await student.client("PATCH", `/reservations/${r.data.id}`, { status: "cancelled" }), 200);
        }
    }

    section("Flusso prestito (bibliotecario)");
    const due = new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10);
    const loan = await librarian.client("POST", "/loans", {
        userId: luca.user.id, itemId: "ITEM-002", dueDate: due,
    });
    expectStatus("POST /loans (check-out ITEM-002)", loan, 201);
    if (loan.data?.id) {
        expectStatus("POST /loans stessa copia → conflitto", await librarian.client("POST", "/loans", {
            userId: student.user.id, itemId: "ITEM-002", dueDate: due,
        }), [403, 409]);
        expectStatus("GET /loans/:id altrui (studente → vietato)",
            await student.client("GET", `/loans/${loan.data.id}`), 403);
        expectStatus("PATCH /loans/:id/checkIn",
            await librarian.client("PATCH", `/loans/${loan.data.id}/checkIn`), 200);
    }

    section("Controlli di sicurezza");
    expectStatus("GET /notices senza login", await anon("GET", "/notices"), 401);
    expectStatus("GET /notices (studente → vietato)", await student.client("GET", "/notices"), 403);
    expectStatus("GET /notices (bibliotecario)", await librarian.client("GET", "/notices"), 200);
    expectStatus("DELETE /suspensions/:id senza login", await anon("DELETE", "/suspensions/999999"), 401);
    expectStatus("DELETE /suspensions/:id (bibliotecario → vietato)",
        await librarian.client("DELETE", "/suspensions/999999"), 403);
    expectStatus("POST /auth/register disattivato", await anon("POST", "/auth/register", {
        email: `smoke-${Date.now()}@example.invalid`, password: "Aa1!aaaaaa",
    }), 403);

    section("Sospensioni (operatore preso dal token, modifica, visibilità)");
    const tomorrow = new Date(Date.now() + 864e5).toISOString();
    const susp = await librarian.client("POST", "/suspensions", {
        userId: luca.user.id, handledBy: admin.user.id, reason: "smoke test", endDate: tomorrow,
    });
    expectStatus("POST /suspensions (bibliotecario)", susp, 201);
    if (susp.data?.id) {
        susp.data.handledBy === librarian.user.id
            ? ok("handledBy = bibliotecario loggato (il valore nel body è ignorato)")
            : fail(`handledBy falsificabile: ${susp.data.handledBy}`);
        const upd = await admin.client("PATCH", `/suspensions/${susp.data.id}`, { reason: "smoke test aggiornato" });
        expectStatus("PATCH /suspensions/:id (admin)", upd, 200);
        upd.data?.reason === "smoke test aggiornato" ? ok("motivo aggiornato") : fail("PATCH non ha aggiornato il motivo");
        expectStatus("GET /suspensions/:id (proprietario)", await luca.client("GET", `/suspensions/${susp.data.id}`), 200);
        expectStatus("GET /suspensions/:id (altro studente → vietato)",
            await student.client("GET", `/suspensions/${susp.data.id}`), 403);
        expectStatus("DELETE /suspensions/:id (admin)", await admin.client("DELETE", `/suspensions/${susp.data.id}`), 200);
    }

    section("Logout");
    expectStatus("POST /auth/logout", await student.client("POST", "/auth/logout"), 200);
    expectStatus("POST /auth/refresh dopo logout", await student.client("POST", "/auth/refresh"), 401);
};

main()
    .catch((err) => { failures++; console.error("Errore inatteso:", err); })
    .finally(() => {
        console.log(`\nRisultato: ${failures} errori, ${warnings} avvisi`);
        process.exit(failures ? 1 : 0);
    });
