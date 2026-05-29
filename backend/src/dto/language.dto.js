import { z } from "zod";

// DTO base
export const LanguageBaseDTO = z.object({
    languageCode: z.string(),
    name: z.string()
});

export const LanguageBaseListDTO = z.array(LanguageBaseDTO);