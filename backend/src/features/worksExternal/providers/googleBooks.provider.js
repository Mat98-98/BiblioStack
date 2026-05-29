import axios from "axios";

const GOOGLE_API = "https://www.googleapis.com/books/v1/volumes";

export const googleBooksProvider = {
    name: "google-books",

    fetchByISBN: async (isbn) => {
        const res = await axios.get(GOOGLE_API, {
            timeout: 5000,
            params: {
                q: `isbn:${isbn}`,
                key: process.env.GOOGLE_BOOKS_API_KEY
            }
        });

        const item = res.data.items?.[0];
        if (!item) return null;

        const v = item.volumeInfo;

        return {
            source: "google-books",

            isbn,

            title: v.title ?? null,
            subtitle: v.subtitle ?? null,
            description: v.description ?? null,

            publicationDate: normalizeDate(v.publishedDate),

            authors: v.authors ?? [],
            publishers: v.publisher ? [v.publisher] : [],

            pages: v.pageCount ?? null,

            language: v.language?.toLowerCase() ?? null,

            coverUrl:
                v.imageLinks?.thumbnail?.replace("http://", "https://") ??
                null,

            coverLargeUrl:
                v.imageLinks?.large?.replace("http://", "https://") ??
                null
        };
    }
};

function normalizeDate(date) {
    if (!date) return null;

    const parsed = new Date(date);

    return isNaN(parsed)
        ? null
        : parsed.toISOString().split("T")[0];
}