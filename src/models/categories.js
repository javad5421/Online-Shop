import {pool} from '../../config/db.js';

//get all category items from category table
async function getAllCategory(){
    try {
        const result = await pool.query("SELECT * FROM category");
        if(result.rows.length == 0){
            throw new Error("Null return from category");
        }
        else{
            return result.rows;
        }
    } catch (error) {
        throw(error);
    }
}

async function NestedCategoriesSecondLayer(id){
    try {
        const result0 = await pool.query('SELECT parent_id FROM category WHERE id = $1', [id]);
        if (result0.rows.length === 0) {
            console.log('cant find parent category id');
            return;
        } 

        const parent_id = parseInt(result0.rows[0].parent_id);
        const result1 = await pool.query('SELECT id FROM category WHERE parent_id = $1', [parent_id]);

        if (result1.rows.length === 0) {
            console.log('cant find parent all nested category id');
            return;
        } 
        const categoryIds = result1.rows.map(catId => catId.id);

        return categoryIds;

    } catch (error) {
        console.log(error.message + " stack: " + error.stack);
        throw new Error(error);
    }
}

async function removeCategoryById(id) {
    try {
        await pool.query('DELETE FROM category WHERE id = $1 OR parent_id = $1', [id]);
    } catch (error) {
        console.log(error.message + " stack: " + error.stack);
        throw new Error(error);
    }
} 

async function addCategoryToDb(title, parent_id){
    try {
        const result = await pool.query("INSERT INTO category(name, parent_id) VALUES($1, $2) RETURNING *", [title, parent_id]);
        return result.rows[0];
    } catch (error) {
        console.log(error.message + " stack: " + error.stack);
        throw new Error(error);
    }
}

export {getAllCategory, NestedCategoriesSecondLayer, removeCategoryById, addCategoryToDb};