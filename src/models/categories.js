import {pool} from '../../config/db.js';

//get all category items from category table
//used for populating category menu
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

//this method gets all categories and all nested categories
/**
 * recursively get all nested categories of selected category
 * includes base category it self
 * @param {*} category_id 
 * @returns all sub categories
 */
async function getAllCategoryIds(category_id) {
    const query = `
    WITH RECURSIVE subcategories AS (
      SELECT id, parent_id, name
      FROM category
      WHERE id = $1
      UNION ALL
      SELECT c.id, c.parent_id, c.name
      FROM category c
      INNER JOIN subcategories sc ON c.parent_id = sc.id
    )
    SELECT * FROM subcategories;
    `;
    const result = await pool.query(query,[category_id]);
    if (result.rows.length === 0) {
        console.log('cant find any category id');
        return;
    } 
    return result.rows;
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

async function renameCategoryById(id, newName){
    console.log('heyyyyy');
    try {
        const result = await pool.query('UPDATE category SET name = $1 WHERE id = $2 RETURNING *', [newName, id]);
        if (result.rows[0].name == newName) {
            console.log('\n\n\n*****\nsuccessfully done\n*****\n\n\n');
            return result.rows[0];
        }
        else if (result.rows.length === 0) {
            console.error('nothing returned from db');
        }
        else{
            console.error('an error accured while renaming the category');
        }
    } catch (error) {
        console.log(error.message + " stack: " + error.stack);
        throw new Error(error);
    }
}

export {getAllCategory, NestedCategoriesSecondLayer, removeCategoryById, addCategoryToDb, getAllCategoryIds, renameCategoryById};