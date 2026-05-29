import * as schema from "./schema.js";
import { relations } from "./relations.js";
import { drizzle } from "drizzle-orm/node-postgres";


const db = drizzle(process.env.DATABASE_URL, {
    schema,
    relations,
});

export { db };