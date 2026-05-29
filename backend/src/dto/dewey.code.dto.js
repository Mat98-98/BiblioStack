import { z } from 'zod';
import {WorkMiniDTO} from "./shared.dto.js";

// Core
const DeweyCodeCore = z.object ({
    code: z.string(),
    description: z.string().nullable(),
})

// DTO base
export const DeweyCodeBaseDTO = DeweyCodeCore;

export const DeweyCodeBaseListDTO = z.array(DeweyCodeBaseDTO);

// DTO dettagliato
export const DeweyCodeDetailDTO = DeweyCodeCore.extend({
    work: WorkMiniDTO
});