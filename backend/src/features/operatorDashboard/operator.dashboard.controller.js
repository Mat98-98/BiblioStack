import { operatorDashboardService } from "./operator.dashboard.service.js";
import {OperatorDashboardStatsDTO, ReadyReservationListDTO, RecentNoticeListDTO} from "./operator.dashboard.dto.js";

export const operatorDashboardController = {
    getStats: async (req, res, next) => {
        try {
            const stats = await operatorDashboardService.getStats();
            res.json(OperatorDashboardStatsDTO.parse(stats));
        } catch (error) {
            next(error);
        }
    },

    getRecentNotices: async (req, res, next) => {
        try {
            const limit = Number(req.query.limit) || 5;
            const notices = await operatorDashboardService.getRecentNotices(limit);
            res.json(RecentNoticeListDTO.parse(notices));
        } catch (error) {
            next(error);
        }
    },

    getReadyReservations: async (req, res, next) => {
        try {
            const limit = Number(req.query.limit) || 5;
            const reservations = await operatorDashboardService.getReadyReservations(limit);
            res.json(ReadyReservationListDTO.parse(reservations));

        } catch (error) {
            next(error);
        }
    }
};