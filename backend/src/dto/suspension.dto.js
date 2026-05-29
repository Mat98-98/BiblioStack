import { z } from 'zod';
import {UserMiniDTO} from "./shared.dto.js";

// Costruisco il core del DTO
const SuspensionCore = z.object({
    id: z.number(),
    user: UserMiniDTO,
    startDate: z.date(),
    endDate: z.date().optional().nullable(),
})

export const SuspensionBaseDTO = SuspensionCore;

export const SuspensionBaseListDTO = z.array(SuspensionBaseDTO);

export const SuspensionDetailDTO = SuspensionCore.extend({
    handler: UserMiniDTO,
    reason: z.string().optional().nullable(),
})