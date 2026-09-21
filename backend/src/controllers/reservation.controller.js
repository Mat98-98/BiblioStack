import { reservationService } from "../services/reservation.service.js";
import {
    ReservationBaseListDTO,
    ReservationDetailDTO,
    ReservationMineListDTO,
    ReservationSearchListDTO
} from "../dto/reservation.dto.js";
import {
    CreateReservationSchema,
    ReservationSearchSchema,
    UpdateReservationSchema
} from "../schemas/reservation.schema.js";

export const reservationController = {
    getAll: async (req, res, next) => {
        try {
            const reservations = await reservationService.getAll(req.pagination);
            const data = ReservationBaseListDTO.parse(reservations);
            res.json(data);
        } catch (error) {
            next(error);
        }
    },

    getById: async (req, res, next) => {
        try {
            const reservation = await reservationService.getById(req.params.id, req.user);
            res.json(ReservationDetailDTO.parse(reservation));
        } catch (error) {
            next(error);
        }
    },

    getMine: async (req, res, next) => {
        try {
            const filters = ReservationSearchSchema.omit({ userId: true }).parse(req.query);
            const reservations = await reservationService.search({ ...req.pagination, ...filters, userId: req.user.id });
            res.json(ReservationMineListDTO.parse(reservations));
        } catch (error) {
            next(error);
        }
    },

    search: async (req, res, next) => {
        try {
            // Validazione dei filtri passati nell'url
            const filters = ReservationSearchSchema.parse(req.query);

            const reservations = await reservationService.search( {...req.pagination, ...filters});
            res.json(ReservationSearchListDTO.parse(reservations));
        } catch (error) {
            next(error);
        }
    },

    create: async (req, res, next) => {
        try {
            const { workId } = CreateReservationSchema.parse(req.body);
            const newReservation = await reservationService.create({
                userId: req.user.id,
                workId
            });
            res.status(201).json(newReservation);
        } catch (error) {
            next(error);
        }
    },

    update: async (req, res, next) => {
        try {
            const validatedData = UpdateReservationSchema.parse(req.body);
            const updatedReservation = await reservationService.update(req.params.id, validatedData, req.user);
            res.json(updatedReservation);
        } catch (error) {
            next(error);
        }
    },

    delete: async (req, res, next) => {
        try {
            const result = await reservationService.delete(req.params.id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}