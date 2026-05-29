import { distance } from "fastest-levenshtein";
import { authorRepository } from "../repositories/author.repository.js";
import { SIMILARITY_THRESHOLD } from "../constants.js";



const normalizeName = (str) =>
    str?.toLowerCase().replace(/\./g, "").replace(/\s+/g, " ").trim() ?? "";


export const findSimilarAuthor = async (firstName, lastName) => {
    const candidates = await authorRepository.findByLastName(lastName);
    if (candidates.length === 0) return { match: null, candidates: [] };

    const fullNameInput = normalizeName(`${firstName ?? ""} ${lastName}`);
    let bestMatch = null;
    let bestDistance = Infinity;

    for (const candidate of candidates) {
        const fullNameCandidate = normalizeName(
            `${candidate.firstName ?? ""} ${candidate.lastName}`
        );
        const d = distance(fullNameInput, fullNameCandidate);
        if (d < bestDistance) {
            bestDistance = d;
            bestMatch = { author: candidate, distance: d };
        }
    }

    // Restituisce sempre i candidati se il cognome matcha, bestMatch solo se sotto threshold
    return {
        match: bestMatch && bestDistance <= SIMILARITY_THRESHOLD ? bestMatch.author : null,
        candidates
    };
};

export const parseAuthorName = (authorName) => {
    const parts     = authorName.trim().split(" ");
    const firstName = parts.length > 1 ? parts.slice(0, -1).join(" ") : null;
    const lastName  = parts.at(-1);
    return { firstName, lastName };
};