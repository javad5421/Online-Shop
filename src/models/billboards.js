import { pool } from "../../config/db.js";

async function insertToBillboard(image, type, url) {
    const query = 'INSERT INTO billboard (image, type, url) VALUES ($1,$2,$3) RETURNING *';
    
    try {
        const result = await pool.query(query, [image, type, url]);
        if (result.rows.length === 0) {
            console.log('cant insert billboard to database');
            throw new Error('cant insert billboard to database');
        }
    } catch (error) {
        console.log(error.message + error.stack);
    }
}

async function getBillboard(type){
    const query = 'SELECT * FROM billboard WHERE type = $1';
    try {
        const result = await pool.query(query, [type]);
        if(result.rows.length === 0){
            console.log('nothing was in billboard table');
            return null;
        }
        else{
            return result.rows;
        }
    } catch (error) {
        console.log(error.message + error.stack);
    }
}

export{insertToBillboard, getBillboard};