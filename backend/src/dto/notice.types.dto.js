import { z } from 'zod';

export const NoticeTypeDTO = z.object({
    id: z.number(),
    name: z.string()
});

export const NoticeTypeListDTO = z.array(NoticeTypeDTO);