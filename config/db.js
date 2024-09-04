import pg from 'pg';
import env from 'dotenv';

env.config();

const config = {
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    host: process.env.HOST,
    port: process.env.PORT
}

const pool = new pg.Pool(config);

export {pool};