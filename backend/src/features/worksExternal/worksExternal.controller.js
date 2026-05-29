import { worksExternalService } from "./worksExternal.service.js";
import {toWorkExternalDTO} from "./worksExternal.mapper.js";

export const worksExternalController = {
    getByISBN: async (req, res, next) => {
        try {
            const { isbn } = req.params;

            const work = await worksExternalService.getByISBN(isbn);

            res.json(toWorkExternalDTO(work, isbn));
        } catch (error) {
            next(error);
        }
    }
};