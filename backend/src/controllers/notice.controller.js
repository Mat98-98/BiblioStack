import { noticeService } from "../services/notice.service.js";
import { NoticeBaseListDTO, NoticeDetailDTO } from "../dto/notice.dto.js";
import { CreateNoticeSchema, UpdateNoticeSchema } from "../schemas/notice.schema.js";

export const noticeController = {
    getAll: async (req, res, next) => {
        try {
            const notices = await noticeService.getAll(req.pagination);
            const data = NoticeBaseListDTO.parse(notices);
            res.json(data);
        } catch (error) {
            next(error);
        }
    },

    getById: async (req, res, next) => {
        try {
            const notice = await noticeService.getById(req.params.id);
            res.json(NoticeDetailDTO.parse(notice));
        } catch (error) {
            next(error);
        }
    },

    create: async (req, res, next) => {
        try {
            const validatedData = CreateNoticeSchema.parse(req.body);
            const newNotice = await noticeService.create(validatedData);
            res.status(201).json(newNotice);
        } catch (error) {
            next(error);
        }
    },

    update: async (req, res, next) => {
        try {
            const validatedData = UpdateNoticeSchema.parse(req.body);
            const updatedNotice = await  noticeService.update(req.params.id, validatedData);
            res.json(updatedNotice);
        } catch (error) {
            next(error);
        }
    },

    delete: async (req, res, next) => {
        try {
            const result = await noticeService.delete(req.params.id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}