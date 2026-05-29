// Questo middleware consente di gestire la paginazione in modo da alleggerire le query

export const paginationMiddleware = (req, res, next) => {
    // Prendo page e limit dalla query string dell'URL
    let { page = 1, limit = 10 } = req.query;

    // Conversione da stringa a numero
    page = Number(page);
    limit = Number(limit);

    if (!page || page < 1) page = 1;
    if (!limit || limit < 1) limit = 10;

    // Impongo un limite massimo
    if (limit > 50) limit = 50;

    req.pagination = { page, limit };

    next();
};