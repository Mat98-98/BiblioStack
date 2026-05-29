import { z } from 'zod';
import {WorkMiniDTO} from "./shared.dto.js";

// DTO di supporto
const SchoolDTO = z.object({
    id: z.number(),
    name: z.string().nullable()
})

const LocationDTO = z.object({
    id: z.number(),
    shelfCode: z.string().nullable(),
    school: SchoolDTO.nullable()
});

// Core del DTO
const ItemCore = z.object ({
    id: z.string(),
    acquisitionDate: z.date().nullable(),
    price: z.coerce.number().nullable().optional()
});

// DTO base
export const ItemBaseDTO = ItemCore.extend({
    work: WorkMiniDTO
});

export const ItemBaseListDTO = z.array(ItemBaseDTO);

// DTO dettagliato
export const ItemDetailDTO = ItemCore.extend({
    work: WorkMiniDTO,
    location: LocationDTO.nullable()
})