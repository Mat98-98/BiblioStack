/*
 * Definizione delle relazioni tra le tabelle. Consente la scrittura delle query senza join manuali.
 * !!! NB: Questo schema è compatibile solamente dalla versione 2 di drizzle in poi !!!
 */

import * as schema from './schema.js';
import { defineRelations } from 'drizzle-orm';

export const relations = defineRelations(schema, (r) => ({

    /*
        ======== Relazioni della tabella Works (opere) ========
    */

    works: {
        language: r.one.languages({
            from: r.works.languageCode,
            to: r.languages.languageCode
        }),
        publisher: r.one.publishers({
            from: r.works.publisherId,
            to: r.publishers.id
        }),
        country: r.one.publicationCountries({
            from: r.works.publicationCountry,
            to: r.publicationCountries.countryCode
        }),
        dewey: r.one.deweyCodes({
            from: r.works.deweyCode,
            to: r.deweyCodes.code
        }),
        items: r.many.items({
            from: r.works.id,
            to: r.items.workId
        }),
        // Collegamento (N-N) con la tabella Authors passando per AuthorWorks (un'opera può avere ha più autori)
        authors: r.many.authors({
            from: r.works.id.through(r.authorWorks.workId),
            to: r.authors.id.through(r.authorWorks.authorId)
        }),
        // Collegamento (N-N) con la tabella Genres passando per WorkGenres (un'opera può avere più generi)
        genres: r.many.genres({
            from: r.works.id.through(r.workGenres.workId),
            to: r.genres.id.through(r.workGenres.genreId)
        })
    },

    /*
        ======== Relazioni della tabella Password_tokens (password tokens) ========
    */

    passwordTokens: {
        user: r.one.users({
            from: r.passwordTokens.userId,
            to: r.users.id
        })
    },

    /*
        ======== Relazioni della tabella Refresh_tokens (refresh tokens) ========
    */

    refreshTokens: {
        user: r.one.users({
            from: r.refreshTokens.userId,
            to: r.users.id
        })
    },

    /*
        ======== Relazioni della tabella Users (utenti) ========
    */

    users: {
        role: r.one.roles({
            from: r.users.roleId,
            to: r.roles.id
        }),
        loansAsPatron: r.many.loans({
            from: r.users.id,
            to: r.loans.userId,
            alias: "loans_as_patron"
        }),
        loansHandled: r.many.loans({
            from: r.users.id,
            to: r.loans.handledBy,
            alias: "loans_handled"
        }),
        reservations: r.many.reservations({
            from: r.users.id,
            to: r.reservations.userId,
            alias: "user_reservations"
        }),
        suspensionsReceived: r.many.suspensions({
            from: r.users.id,
            to: r.suspensions.userId,
            alias: "suspensions_received"
        }),
        suspensionsHandled: r.many.suspensions({
            from: r.users.id,
            to: r.suspensions.handledBy,
            alias: "suspensions_handled"
        }),
        noticesReceived: r.many.notices({
            from: r.users.id,
            to: r.notices.userId,
            alias: "notices_received"
        }),
        noticesHandled: r.many.notices({
            from: r.users.id,
            to: r.notices.handledBy,
            alias: "notices_handled"
        }),
        activeSuspension: r.one.activeSuspensions({
            from: r.users.id,
            to: r.activeSuspensions.userId
        })
    },

    /*
        ======== Relazioni tabella Items (libri) ========
    */

    items: {
        work: r.one.works({
            from: r.items.workId,
            to: r.works.id
        }),
        location: r.one.locations({
            from: r.items.locationId,
            to: r.locations.id
        }),
        currency: r.one.currencies({
            from: r.items.currencyCode,
            to: r.currencies.code
        }),
        loans: r.many.loans({
            from: r.items.id,
            to: r.loans.itemId
        })
    },

    /*
        ======== Relazioni tabella Loans (prestiti) ========
    */

    loans: {
        item: r.one.items({
            from: r.loans.itemId,
            to: r.items.id
        }),
        patron: r.one.users({
            from: r.loans.userId,
            to: r.users.id,
            alias: "loans_as_patron"
        }),
        librarian: r.one.users({
            from: r.loans.handledBy,
            to: r.users.id,
            alias: "loans_handled"
        }),
        notices: r.many.notices({
            from: r.loans.id,
            to: r.notices.loanId,
            alias: "loan_notices"
        })
    },

    /*
        ======== Relazioni tabella Notices (segnalazioni) ========
    */

    notices: {
        type: r.one.noticeTypes({
            from: r.notices.noticeTypeId,
            to: r.noticeTypes.id
        }),
        user: r.one.users({
            from: r.notices.userId,
            to: r.users.id,
            alias: "notices_received"   // ← corrisponde all'alias in users
        }),
        handler: r.one.users({
            from: r.notices.handledBy,
            to: r.users.id,
            alias: "notices_handled"    // ← corrisponde all'alias in users
        }),
        loan: r.one.loans({
            from: r.notices.loanId,
            to: r.loans.id,
            alias: "loan_notices"
        })
    },

    /*
    ======== Relazioni tabella Locations (collocazioni) ========
    */

    locations: {
        school: r.one.schools({
            from: r.locations.schoolId,
            to: r.schools.id
        }),
        items: r.many.items({
            from: r.locations.id,
            to: r.items.locationId
        })
    },

    /*
        ======== Relazioni tabella Schools (scuole) ========
    */

    schools: {
        city: r.one.schoolCities({
            from: r.schools.cityId,
            to: r.schoolCities.id
        }),
        locations: r.many.locations({
            from: r.schools.id,
            to: r.locations.schoolId
        })
    },

    /*
        ======== Relazioni tabella Reservations (prenotazioni) ========
    */

    reservations: {
        user: r.one.users({
            from: r.reservations.userId,
            to: r.users.id
        }),
        work: r.one.works({
            from: r.reservations.workId,
            to: r.works.id
        }),
        assignedItem: r.one.items({
            from: r.reservations.assignedItemId,
            to: r.items.id
        })
    },

    /*
        ======== Relazioni tabella Suspensions (sospensioni) ========
    */

    suspensions: {
        user: r.one.users({
            from: r.suspensions.userId,
            to: r.users.id,
            alias: "suspensions_received"
        }),
        handler: r.one.users({
            from: r.suspensions.handledBy,
            to: r.users.id,
            alias: "suspensions_handled"
        })
    },

    /*
        ======== Relazioni tabella Authors (Autori) ========
    */

    // Collegamento (N-N) con la tabella Works passando per AuthorWorks (un autore può avere più opere)
    authors: {
        works: r.many.works({
            from: r.authors.id.through(r.authorWorks.authorId),
            to: r.works.id.through(r.authorWorks.workId)
        })
    },

    /*
    ======== Relazioni tabella ActiveSuspensions (vista sospensioni attive) ========
    */

    activeSuspensions: {
        user: r.one.users({
            from: r.activeSuspensions.userId,
            to: r.users.id
        })
    }
}));
