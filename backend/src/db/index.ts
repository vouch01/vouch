import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from './schema.js'


export const db =drizzle(process.env.DATABASE_URL!, {schema});
// export const db = drizzle( sql,{schema} )