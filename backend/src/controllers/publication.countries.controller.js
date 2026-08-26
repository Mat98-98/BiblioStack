import { publicationCountriesService } from "../services/publication.countries.service.js";
import { PublicationCountryDTO, PublicationCountryListDTO } from "../dto/publication.country.dto.js";
import { z } from "zod";

const CountryCodeParamSchema = z.object({
    countryCode: z.string().length(2, "Country code must be exactly 2 characters")
});

export const publicationCountriesController = {

    getAll: async (req, res, next) => {
        try {
            const publicationCountries = await publicationCountriesService.getAll(req.pagination);
            const data = PublicationCountryListDTO.parse(publicationCountries);
            res.json(data);
        } catch (err) {
            next(err);
        }
    },

    getByCountryCode: async (req, res, next) => {
        try {
            const { countryCode } = CountryCodeParamSchema.parse(req.params);

            const publicationCountry =
                await publicationCountriesService.getByCountryCode(countryCode);

            res.json(PublicationCountryDTO.parse(publicationCountry));
        } catch (err) {
            next(err);
        }
    }
}