import { z } from "zod";

// DTO base
export const PublisherBaseDTO = z.object({
    id: z.number(),
    name: z.string()
});

export const PublisherBaseListDTO = z.array(PublisherBaseDTO);

// DTO riservato alla ricerca delle case editrici
export const PublisherSearchListDTO = z.object({
    data: z.array(PublisherBaseDTO),
    hasMore: z.boolean()
});