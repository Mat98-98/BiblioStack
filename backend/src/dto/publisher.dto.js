import { z } from "zod";

// DTO base
export const PublisherBaseDTO = z.object({
    id: z.number(),
    name: z.string()
});

export const PublisherBaseListDTO = z.array(PublisherBaseDTO);