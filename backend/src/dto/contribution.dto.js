import { z } from "zod";

// DTO base
export const ContributionBaseDto = z.object({
    id: z.number(),
    name: z.string()
});

export const ContributionBaseListDTO = z.array(ContributionBaseDto);