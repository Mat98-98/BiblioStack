import axios from "axios";

const OPEN_LIBRARY_API = "https://openlibrary.org/api/books";

export const openLibraryProvider = {
    name: "open-library",

    fetchByISBN: async (isbn) => {
        const res = await axios.get(OPEN_LIBRARY_API, {
            timeout: 5000,
            params: {
                bibkeys: `ISBN:${isbn}`,
                format: "json",
                jscmd: "data"
            }
        });

        const work = res.data[`ISBN:${isbn}`];

        if (!work) return null;

        return {
            source: "open-library",

            isbn,

            title: work.title ?? null,
            subtitle: work.subtitle ?? null,

            description:
                typeof work.description === "string"
                    ? work.description
                    : work.description?.value ?? null,

            publicationDate: normalizeDate(work.publish_date),

            authors:
                work.authors?.map((a) => a.name) ?? [],

            publishers:
                work.publishers?.map((p) => p.name) ?? [],

            pages: work.number_of_pages ?? null,

            language: extractLanguage(work.languages),

            coverUrl:
                work.cover?.medium ??
                work.cover?.large ??
                null,

            coverLargeUrl:
                work.cover?.large ??
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

function extractLanguage(languages) {
    if (!languages?.length) return null;

    const code = languages[0]?.key?.split("/").pop();

    return code?.toLowerCase() ?? null;
}