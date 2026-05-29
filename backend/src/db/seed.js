/*
 * Mock data per i test dell'applicazione durante lo sviluppo
 */

import { config } from "dotenv";
config();

import * as schema from "./schema.js";
import { relations } from "./relations.js";
import { drizzle } from "drizzle-orm/node-postgres";

const db = drizzle(process.env.DATABASE_URL, { schema, relations });

async function seed() {
    console.log("🌱 Avvio seed...\n");

    // -----------------------------------------------------------------------
    // LOOKUP TABLES
    // -----------------------------------------------------------------------

    const [roleAdmin, roleLibrarian, roleSystem, roleStudent] = await db
        .insert(schema.roles)
        .values([
            { name: "admin" },
            { name: "librarian" },
            { name: "system" },
            { name: "student" },
        ])
        .returning();
    console.log("✅ Roles inseriti");

    const [italian, english, french] = await db
        .insert(schema.languages)
        .values([
            { languageCode: "ita", name: "Italiano" },
            { languageCode: "eng", name: "Inglese" },
            { languageCode: "fra", name: "Francese" },
        ])
        .returning();
    console.log("✅ Languages inserite");

    const [italy, usa, france] = await db
        .insert(schema.publicationCountries)
        .values([
            { countryCode: "IT", name: "Italia" },
            { countryCode: "US", name: "Stati Uniti" },
            { countryCode: "FR", name: "Francia" },
        ])
        .returning();
    console.log("✅ Publication countries inseriti");

    const [mondadori, einaudi, hoepli] = await db
        .insert(schema.publishers)
        .values([
            { name: "Mondadori" },
            { name: "Einaudi" },
            { name: "Hoepli" },
        ])
        .returning();
    console.log("✅ Publishers inseriti");

    const [eur] = await db
        .insert(schema.currencies)
        .values([{ code: "EUR" }])
        .returning();
    console.log("✅ Currencies inserite");

    const [deweyLit, deweyTech, deweyHistory] = await db
        .insert(schema.deweyCodes)
        .values([
            { code: "800", description: "Letteratura" },
            { code: "600", description: "Tecnologia e scienze applicate" },
            { code: "900", description: "Storia e geografia" },
        ])
        .returning();
    console.log("✅ Dewey codes inseriti");

    const [genreNovel, genreScifi, genreHistory] = await db
        .insert(schema.genres)
        .values([
            { name: "Romanzo" },
            { name: "Fantascienza" },
            { name: "Storico" },
        ])
        .returning();
    console.log("✅ Genres inseriti");

    const [noticeOverdue, noticeDamage] = await db
        .insert(schema.noticeTypes)
        .values([
            { name: "Restituzione in ritardo" },
            { name: "Danno al libro" },
        ])
        .returning();
    console.log("✅ Notice types inseriti");

    // -----------------------------------------------------------------------
    // SCUOLE E COLLOCAZIONI
    // -----------------------------------------------------------------------

    const [cityVicenza, cityVerona] = await db
        .insert(schema.schoolCities)
        .values([
            { name: "Vicenza" },
            { name: "Verona" },
        ])
        .returning();
    console.log("✅ School cities inserite");

    const [schoolA, schoolB] = await db
        .insert(schema.schools)
        .values([
            { cityId: cityVicenza.id, name: "Liceo Scientifico A. Quadri" },
            { cityId: cityVerona.id,  name: "ITIS Ferraris" },
        ])
        .returning();
    console.log("✅ Schools inserite");

    const [locA1, locA2, locB1] = await db
        .insert(schema.locations)
        .values([
            { schoolId: schoolA.id, shelfCode: "A-001" },
            { schoolId: schoolA.id, shelfCode: "A-002" },
            { schoolId: schoolB.id, shelfCode: "B-001" },
        ])
        .returning();
    console.log("✅ Locations inserite");

    // -----------------------------------------------------------------------
    // UTENTI
    // -----------------------------------------------------------------------

    // passwordHash = bcrypt di "password123"
    const HASH = "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi";

    const [librarianMario, librarianGiulia] = await db
        .insert(schema.users)
        .values([
            {
                roleId: roleLibrarian.id,
                firstName: "Mario",
                lastName: "Rossi",
                email: "mario.rossi@biblioteca.it",
                phone: "3331234567",
                passwordHash: HASH,
            },
            {
                roleId: roleLibrarian.id,
                firstName: "Giulia",
                lastName: "Bianchi",
                email: "giulia.bianchi@biblioteca.it",
                phone: "3339876543",
                passwordHash: HASH,
            },
        ])
        .returning();
    console.log("✅ Bibliotecari inseriti");

    const [patronLuca, patronSara, patronTomm] = await db
        .insert(schema.users)
        .values([
            {
                roleId: roleStudent.id,
                firstName: "Luca",
                lastName: "Verdi",
                email: "luca.verdi@studenti.it",
                passwordHash: HASH,
            },
            {
                roleId: roleStudent.id,
                firstName: "Sara",
                lastName: "Neri",
                email: "sara.neri@studenti.it",
                passwordHash: HASH,
            },
            {
                roleId: roleStudent.id,
                firstName: "Tommaso",
                lastName: "Ferrari",
                email: "tommaso.ferrari@studenti.it",
                passwordHash: HASH,
            },
        ])
        .returning();
    console.log("✅ Studenti inseriti");

    // -----------------------------------------------------------------------
    // AUTORI
    // -----------------------------------------------------------------------

    const [authorManzoni, authorOrwell, authorUmberto] = await db
        .insert(schema.authors)
        .values([
            { firstName: "Alessandro", lastName: "Manzoni" },
            { firstName: "George",     lastName: "Orwell" },
            { firstName: "Umberto",    lastName: "Eco" },
        ])
        .returning();
    console.log("✅ Authors inseriti");

    const [contribAuthor, contribTranslator] = await db
        .insert(schema.contributions)
        .values([
            { name: "Autore" },
            { name: "Traduttore" },
        ])
        .returning();
    console.log("✅ Contributions inserite");

    // -----------------------------------------------------------------------
    // OPERE
    // -----------------------------------------------------------------------

    // work1: 2 item, nessuno in prestito → disponibile
    // work2: 1 item, in prestito attivo  → non disponibile
    // work3: 0 item                      → nessuna copia fisica
    const [work1, work2, work3] = await db
        .insert(schema.works)
        .values([
            {
                id: "ISBN-978-88-04-72232-0",
                publisherId: mondadori.id,
                deweyCode: deweyLit.code,
                languageCode: italian.languageCode,
                publicationCountry: italy.countryCode,
                title: "I Promessi Sposi",
                description: "Il classico romanzo storico di Alessandro Manzoni.",
                pages: 720,
                publicationDate: new Date("1840-01-01"),
            },
            {
                id: "ISBN-978-88-06-22561-0",
                publisherId: einaudi.id,
                deweyCode: deweyLit.code,
                languageCode: italian.languageCode,
                publicationCountry: italy.countryCode,
                title: "1984",
                description: "Il romanzo distopico di George Orwell.",
                pages: 328,
                publicationDate: new Date("1949-06-08"),
            },
            {
                id: "ISBN-978-88-452-7216-0",
                publisherId: einaudi.id,
                deweyCode: deweyHistory.code,
                languageCode: italian.languageCode,
                publicationCountry: italy.countryCode,
                title: "Il Nome della Rosa",
                description: "Un romanzo storico-poliziesco ambientato nel Medioevo.",
                pages: 502,
                publicationDate: new Date("1980-01-01"),
            },
        ])
        .returning();
    console.log("✅ Works inseriti");

    await db.insert(schema.authorWorks).values([
        { authorId: authorManzoni.id, workId: work1.id, contributionId: contribAuthor.id },
        { authorId: authorOrwell.id,  workId: work2.id, contributionId: contribAuthor.id },
        { authorId: authorUmberto.id, workId: work3.id, contributionId: contribAuthor.id },
    ]);
    console.log("✅ Author-Works inseriti");

    await db.insert(schema.workGenres).values([
        { workId: work1.id, genreId: genreNovel.id },
        { workId: work1.id, genreId: genreHistory.id },
        { workId: work2.id, genreId: genreScifi.id },
        { workId: work3.id, genreId: genreNovel.id },
        { workId: work3.id, genreId: genreHistory.id },
    ]);
    console.log("✅ Work-Genres inseriti");

    // -----------------------------------------------------------------------
    // ITEM (copie fisiche)
    // -----------------------------------------------------------------------

    const [item1a, item1b, item2a] = await db
        .insert(schema.items)
        .values([
            {
                id: "ITEM-001",
                workId: work1.id,
                locationId: locA1.id,
                currencyCode: eur.code,
                acquisitionDate: new Date("2022-09-01"),
                price: "18.50",
            },
            {
                id: "ITEM-002",
                workId: work1.id,
                locationId: locA2.id,
                currencyCode: eur.code,
                acquisitionDate: new Date("2023-01-15"),
                price: "18.50",
            },
            {
                id: "ITEM-003",
                workId: work2.id,
                locationId: locB1.id,
                currencyCode: eur.code,
                acquisitionDate: new Date("2021-06-10"),
                price: "14.00",
            },
        ])
        .returning();
    console.log("✅ Items inseriti");

    // -----------------------------------------------------------------------
    // PRESTITI
    // -----------------------------------------------------------------------

    // Prestito attivo:  Luca ha in prestito ITEM-003 (work2 → "1984")
    // Prestito chiuso:  Sara ha restituito  ITEM-001 (work1 → "I Promessi Sposi")
    const [loanActive, loanClosed] = await db
        .insert(schema.loans)
        .values([
            {
                userId: patronLuca.id,
                handledBy: librarianMario.id,
                itemId: item2a.id,
                loanDate: new Date("2026-04-01"),
                dueDate: new Date("2026-04-22"),
            },
            {
                userId: patronSara.id,
                handledBy: librarianMario.id,
                itemId: item1a.id,
                loanDate: new Date("2026-03-01"),
                dueDate: new Date("2026-03-22"),
                returnDate: new Date("2026-03-20"),
            },
        ])
        .returning();
    console.log("✅ Loans inseriti");

    // -----------------------------------------------------------------------
    // PRENOTAZIONI
    // -----------------------------------------------------------------------

    // Tommaso ha una prenotazione pending su work2 (l'unica copia è in prestito a Luca)
    const [reservationPending] = await db
        .insert(schema.reservations)
        .values([
            {
                userId: patronTomm.id,
                workId: work2.id,
                status: "pending",
                reservationDate: new Date("2026-04-10"),
            },
        ])
        .returning();
    console.log("✅ Reservations inserite");

    // -----------------------------------------------------------------------
    // RIEPILOGO per Postman
    // -----------------------------------------------------------------------

    console.log("\n✅ Seed completato!\n");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📋 RIFERIMENTI UTILI PER I TEST POSTMAN");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n👤 UTENTI");
    console.log(`  Bibliotecari : ID ${librarianMario.id} (Mario Rossi), ID ${librarianGiulia.id} (Giulia Bianchi)`);
    console.log(`  Studenti     : ID ${patronLuca.id} (Luca), ID ${patronSara.id} (Sara), ID ${patronTomm.id} (Tommaso)`);
    console.log("\n📚 OPERE");
    console.log(`  work1 "${work1.title}"   → ID: ${work1.id}`);
    console.log(`         2 copie disponibili (ITEM-001, ITEM-002) → status atteso: ready`);
    console.log(`  work2 "${work2.title}"             → ID: ${work2.id}`);
    console.log(`         1 copia in prestito attivo a Luca → status atteso: pending`);
    console.log(`  work3 "${work3.title}" → ID: ${work3.id}`);
    console.log(`         Nessuna copia fisica → status atteso: pending`);
    console.log("\n📦 ITEM");
    console.log(`  ITEM-001 → ${work1.title} (disponibile)`);
    console.log(`  ITEM-002 → ${work1.title} (disponibile)`);
    console.log(`  ITEM-003 → ${work2.title} (in prestito attivo a Luca, ID ${patronLuca.id})`);
    console.log("\n🔖 PRENOTAZIONI ESISTENTI");
    console.log(`  ID ${reservationPending.id} → Tommaso (ID ${patronTomm.id}) su "${work2.title}" — status: pending`);
    console.log("\n💡 SCENARI DA TESTARE");
    console.log(`  ✅ ready    : POST { userId: ${patronSara.id}, workId: "${work1.id}" }`);
    console.log(`  ✅ pending  : POST { userId: ${patronSara.id}, workId: "${work2.id}" }`);
    console.log(`  ❌ doppio   : POST { userId: ${patronTomm.id}, workId: "${work2.id}" }  → 400`);
    console.log(`  ❌ prestito : POST { userId: ${patronLuca.id}, workId: "${work2.id}" }  → 400`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    process.exit(0);
}

seed().catch((err) => {
    console.error("❌ Seed fallito:", err);
    process.exit(1);
});
