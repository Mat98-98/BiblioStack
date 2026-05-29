import { openLibraryProvider } from "./providers/openLibrary.provider.js";
import { googleBooksProvider } from "./providers/googleBooks.provider.js";

const providers = [
    openLibraryProvider,
    googleBooksProvider
];

export const worksExternalService = {

    getByISBN: async (isbn) => {
        if (!isbn) {
            throw new Error("ISBN required");
        }

        for (const provider of providers) {
            try {
                const result = await provider.fetchByISBN(isbn);

                if (result) {
                    return result;
                }

            } catch (error) {
                console.error(
                    `[${provider.name}] failed`,
                    error.message
                );
            }
        }

        throw new Error("Work not found");
    }
};