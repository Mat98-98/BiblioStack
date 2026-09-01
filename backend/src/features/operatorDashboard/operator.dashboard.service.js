import { operatorDashboardRepository } from "./operator.dashboard.repository.js";


export const operatorDashboardService = {
    getStats: async () =>
        await operatorDashboardRepository.getStats(),

    getRecentNotices: async (limit) =>
        await operatorDashboardRepository.getRecentNotices(limit),

    getReadyReservations: async (limit) =>
        await operatorDashboardRepository.getReadyReservations(limit)
};