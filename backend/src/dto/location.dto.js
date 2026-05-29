import { z } from "zod";

// DTO di supporto
const SchoolSchema = z.object({
    id: z.number(),
    name: z.string()
})

const SchoolCitiesSchema = z.object({
    id: z.number(),
    name: z.string()
})

// Core del DTO

const LocationCore = z.object({
    id: z.number(),
    shelfCode: z.string()
})

// DTO base

export const LocationBaseDTO = LocationCore.extend({
    school: SchoolSchema
});

export const LocationBaseListDTO = z.array(LocationBaseDTO);

// DTO dettagliato
export const LocationDetailDTO = LocationCore.extend({
    school: SchoolSchema.extend({
        city: SchoolCitiesSchema
    })
});