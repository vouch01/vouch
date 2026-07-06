import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from "@neondatabase/serverless";
import { eq , and , desc } from "drizzle-orm";
import { vendors, } from "../db/schema.js";
import {config } from 'dotenv';
config()


const sql =neon(process.env.DATABASE_URL! );
const db = drizzle({client: sql})

async function testConnection(){
    // const result =  await db.execute("SELECT 1");
    // return result;
    const test = await db.select().from(vendors).where(eq(vendors.email, 'iziogbaraymond72@gmail.com'))
console.log(test)
} 

testConnection()