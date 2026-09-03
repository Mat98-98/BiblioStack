/*
 * Definizione dello schema drizzle. Lo schema rispecchia esattamente il database.
*/

// @todo: rimuovere tutti i bigint e mettere integer
import {
    pgTable,
    pgView,
    pgEnum,
    integer,
    smallint,
    bigint,
    text,
    char,
    timestamp,
    date,
    numeric,
    primaryKey,
    check
} from 'drizzle-orm/pg-core';

import { sql } from 'drizzle-orm';

// --- ENUM ---
export const reservationStatusEnum = pgEnum("reservation_status", [
    "pending",
    "ready",
    "fulfilled",
    "cancelled",
    "expired"
]);

export const tokenTypeEnum = pgEnum("token_type", [
    'reset',
    'setup'
])

// --- TABELLE DI SUPPORTO E ANAGRAFICHE ---

export const authors = pgTable('authors', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    firstName: text('first_name'),
    lastName: text('last_name'),
});

export const contributions = pgTable('contributions', {
    id: smallint('id').primaryKey().generatedAlwaysAsIdentity(),
    name: text('name').notNull(),
});

export const publishers = pgTable('publishers', {
    id: smallint('id').primaryKey().generatedAlwaysAsIdentity(),
    name: text('name').notNull().unique(),
});

export const languages = pgTable('languages', {
    languageCode: char('language_code', { length: 3 }).primaryKey(),
    name: text('name').notNull().unique(),
}, (table) => [
    check('languages_language_code_check', sql`length(${table.languageCode}) = 3`)
]);

export const publicationCountries = pgTable('publication_countries', {
    countryCode: char('country_code', { length: 2 }).primaryKey(),
    name: text('name').notNull().unique(),
}, (table) => [
    check('publication_countries_country_code_check', sql`length(${table.countryCode}) = 2`)
]);

export const deweyCodes = pgTable('dewey_codes', {
    code: text('code').primaryKey(),
    description: text('description'),
});

export const schoolCities = pgTable('school_cities', {
    id: smallint('id').primaryKey().generatedAlwaysAsIdentity(),
    name: text('name').notNull(),
});

export const schools = pgTable('schools', {
    id: smallint('id').primaryKey().generatedAlwaysAsIdentity(),
    cityId: smallint('city_id').notNull().references(() => schoolCities.id),
    name: text('name'),
});

export const locations = pgTable('locations', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    schoolId: smallint('school_id').notNull().references(() => schools.id),
    shelfCode: text('shelf_code'),
});

export const roles = pgTable('roles', {
    id: smallint('id').primaryKey().generatedAlwaysAsIdentity(),
    name: text('name').notNull().unique(),
});

export const passwordTokens = pgTable('password_tokens', {
    token: text('token').primaryKey(),
    userId: bigint('user_id', {mode: "number"}).notNull().references(() => users.id, {onDelete: "cascade"}),
    type: tokenTypeEnum('type').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
    expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
    usedAt: timestamp('used_at', { withTimezone: true, mode: 'date' })
});

export const refreshTokens = pgTable("refresh_tokens", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    replacedByTokenHash: text("replaced_by_token_hash"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
    check(
        "chk_refresh_tokens_expires_after_created",
        sql`${table.expiresAt} > ${table.createdAt}`
    ),
    check(
        "chk_refresh_tokens_replaced_implies_revoked",
        sql`${table.replacedByTokenHash} IS NULL OR ${table.revokedAt} IS NOT NULL`
    ),
]);

export const currencies = pgTable('currencies', {
    code: char('code', { length: 3 }).primaryKey(),
});

export const genres = pgTable('genres', {
    id: smallint('id').primaryKey().generatedAlwaysAsIdentity(),
    name: text('name').notNull().unique()
});

export const noticeTypes = pgTable('notice_types', {
    id: smallint('id').primaryKey().generatedAlwaysAsIdentity(),
    name: text('name').notNull().unique()
});


// --- TABELLE PRINCIPALI (UTENTI, OPERE E OGGETTI) ---

export const users = pgTable('users', {
    // Nota: mode 'number' fa sì che JS legga il bigint come numero normale e non come stringa
    id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
    googleId: text('google_id').unique(),
    roleId: smallint('role_id').notNull().references(() => roles.id),
    firstName: text('first_name'),
    lastName: text('last_name'),
    email: text('email').notNull().unique(),
    phone: text('phone'),
    cardVersion: smallint('card_version').notNull().default(1),
    passwordHash: text('password_hash'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'date' }).default(null)
}, (table) => [
    check('users_card_version_check', sql`${table.cardVersion} > 0`)
]);

export const works = pgTable('works', {
    id: text('id').primaryKey(),
    publisherId: smallint('publisher_id').references(() => publishers.id),
    deweyCode: text('dewey_code').references(() => deweyCodes.code, { onUpdate: 'cascade' }),
    languageCode: char('language_code', { length: 3 }).references(() => languages.languageCode, { onUpdate: 'cascade' }),
    publicationCountry: char('publication_country', { length: 2 }).references(() => publicationCountries.countryCode, { onUpdate: 'cascade' }),
    title: text('title').notNull(),
    otherTitleInformation: text('other_title_information'),
    description: text('description'),
    pages: smallint('pages'),
    publicationDate: date('publication_date', {mode: 'date'}),
    coverUrl: text('cover_url')
});

export const items = pgTable('items', {
    id: text('id').primaryKey(),
    workId: text('work_id').notNull().references(() => works.id, { onDelete: 'cascade' }),
    locationId: integer('location_id').references(() => locations.id, { onDelete: 'set null' }),
    currencyCode: char('currency_code', { length: 3 }).references(() => currencies.code, { onUpdate: 'cascade' }),
    acquisitionDate: date('acquisition_date', {mode: 'date'}),
    price: numeric('price', { precision: 12, scale: 2 })
});


// --- TABELLE DI RELAZIONE (MOLTI-A-MOLTI COMPOSITE) ---

export const authorWorks = pgTable('author_works', {
    authorId: integer('author_id').notNull().references(() => authors.id, { onDelete: 'cascade' }),
    workId: text('work_id').notNull().references(() => works.id, { onDelete: 'cascade' }),
    contributionId: smallint('contribution_id').notNull().references(() => contributions.id),
}, (table) => [
    primaryKey({ columns: [table.authorId, table.workId, table.contributionId] })
]);

export const workGenres = pgTable('work_genres', {
    workId: text('work_id').notNull().references(() => works.id, { onDelete: 'cascade' }),
    genreId: smallint('genre_id').notNull().references(() => genres.id, { onDelete: 'cascade' }),
}, (table) => [
    primaryKey({ columns: [table.workId, table.genreId] })
]);


// --- TABELLE OPERATIVE (PRESTITI, PRENOTAZIONI, ECC.) ---

export const suspensions = pgTable('suspensions', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    userId: bigint('user_id', { mode: 'number' }).notNull().references(() => users.id),
    handledBy: bigint('handled_by', { mode: 'number' }).notNull().references(() => users.id),
    reason: text('reason'),
    startDate: timestamp('start_date', { withTimezone: true, mode: 'date' }).defaultNow(),
    endDate: timestamp('end_date', { withTimezone: true, mode: 'date' }),
});

export const reservations = pgTable('reservations', {
    id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
    userId: bigint('user_id', { mode: 'number' }).notNull().references(() => users.id),
    workId: text('work_id').notNull().references(() => works.id, { onDelete: 'cascade' }),
    assignedItemId: text('assigned_item_id').references(() => items.id, { onDelete: 'set null' }),
    reservationDate: timestamp('reservation_date', { withTimezone: true, mode: 'date' }).defaultNow(),
    expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }),
    status: reservationStatusEnum('status').default('pending')
});


export const loans = pgTable('loans', {
    id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
    userId: bigint('user_id', { mode: 'number' }).notNull().references(() => users.id),
    handledBy: bigint('handled_by', { mode: 'number' }).notNull().references(() => users.id),
    itemId: text('item_id').notNull().references(() => items.id),
    loanDate: timestamp('loan_date', { withTimezone: true, mode: 'date' }).defaultNow(),
    dueDate: date('due_date', { mode: 'date' }),
    returnDate: timestamp('return_date', { withTimezone: true, mode: 'date' }),
});


export const notices = pgTable('notices', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    userId: bigint('user_id', { mode: 'number' }).notNull().references(() => users.id),
    handledBy: bigint('handled_by', { mode: 'number' }).notNull().references(() => users.id),
    noticeTypeId: smallint('notice_type_id').notNull().references(() => noticeTypes.id, { onUpdate: 'cascade' }),
    loanId: bigint('loan_id', { mode: 'number' }).notNull().references(() => loans.id),
    description: text('description'),
    issuedAt: timestamp('issued_at', { withTimezone: true, mode: 'date' }).defaultNow(),
});

export const notifications = pgTable('notifications', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    userId: bigint('user_id', { mode: 'number' }).notNull().references(() => users.id,  {onDelete: 'cascade' }),
    title: text('title').notNull(),
    message: text('message').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
    readAt: timestamp('read_at', { withTimezone: true, mode: 'date' })
}, (table) => [
    check('notifications_title_length_check',
        sql`length(${table.title}) <= 64`),
    check('notifications_message_length_check',
        sql`length(${table.message}) <= 255`),
    check('notifications_read_after_created_check',
        sql`${table.readAt} IS NULL OR ${table.readAt} >= ${table.createdAt}`)
]);


// --- VIEWS ---
export const itemAvailability = pgView("item_availability", {
    itemId:     text("item_id").notNull(),
    workId:     text("work_id").notNull(),
    locationId: integer("location_id"),
}).existing();

export const activeSuspensions = pgView("active_suspensions", {
    id: integer("id").notNull(),
    userId: bigint("user_id", { mode: "number" }).notNull(),
    reason: text("reason"),
    startDate: timestamp("start_date", { withTimezone: true, mode: "date" }),
    endDate: timestamp("end_date", { withTimezone: true, mode: "date" }),
}).existing();