import express from 'express';
import { paginationMiddleware } from "../middleware/pagination.middleware.js";
import { publicationCountriesController } from "../controllers/publication.countries.controller.js";


const router = express.Router();


// GET /publicationCountries?page=1&limit=20
router.get('/', paginationMiddleware, publicationCountriesController.getAll);

// GET /publicationCountries/:id
router.get('/:countryCode', publicationCountriesController.getByCountryCode);

export default router;