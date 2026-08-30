import { noticeTypesService } from "../services/notice.types.service.js";
import {NoticeTypeDTO, NoticeTypeListDTO} from "../dto/notice.types.dto.js";

export const noticeTypesController = {
    getAll: async (req, res, next) => {
        try {
            const noticeTypes = await noticeTypesService.getAll(req.pagination);
            const data = NoticeTypeListDTO.parse(noticeTypes);
            res.json(data);
        } catch (error) {
            next(error);
        }
    },

    getById: async (req, res, next) => {
        try {
            const noticeType = await noticeTypesService.getById(req.params.id);
            res.json(NoticeTypeDTO.parse(noticeType));
        } catch (error) {
            next(error);
        }
    }
}