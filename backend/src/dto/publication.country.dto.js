import {z} from "zod";

export const PublicationCountryDTO = z.object({
    countryCode: z.string().length(2, "Country code must be exactly 2 characters"),
    name: z.string().min(1, "Country name is required"),
});

export const PublicationCountryListDTO = z.array(PublicationCountryDTO);