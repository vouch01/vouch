import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from "@neondatabase/serverless";
import {config } from 'dotenv';
config()


const sql =neon(process.env.DATABASE_URL! );
const db = drizzle({client: sql})

async function testConnection(){
    const result =  await db.execute("SELECT 1");
    return result;
} 

testConnection()