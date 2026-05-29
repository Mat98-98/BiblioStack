import { z } from "zod";

// DTO base
export const GenreBaseDTO = z.object({
    id: z.number(),
    name: z.string()
});

export const GenreBaseListDTO = z.array(GenreBaseDTO);