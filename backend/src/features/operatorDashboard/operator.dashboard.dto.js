import { z } from 'zod';
import { UserMiniDTO } from "../../dto/shared.dto.js";


export const OperatorDashboardStatsDTO = z.object({
    activeLoans: z.number(),
    overdueLoans: z.number(),
    availableItems: z.number(),
    totalItems: z.number(),
    totalUsers: z.number(),
});

const NoticeTypeSchema = z.object({ id: z.number(), name: z.string() });

export const RecentNoticeDTO = z.object({
    id: z.number(),
    description: z.string().nullable(),
    issuedAt: z.date(),
    user: UserMiniDTO,
    type: NoticeTypeSchema
});

export const RecentNoticeListDTO = z.array(RecentNoticeDTO);