export function formatAuthors(authors) {
    if (!authors || authors.length === 0) return null;

    return authors
        .map(a => [a.firstName, a.lastName].filter(Boolean).join(" "))
        .join(", ");
}