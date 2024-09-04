import { removeCategoryById, addCategoryToDb, getAllCategory } from '../models/categories.js';
import {buildNestedMenu} from '../services/nestedMenu.js';

async function editcategory(req, res, next) {
    try {
        const item_id = parseInt(req.body.removeitem);
        console.log(`category item with id: ${item_id} deleted`);
        await removeCategoryById(item_id);
        res.redirect('/admin');
    } catch (error) {
        console.log(error.message + " stack: " + error.stack);
        next(error);
    }
}

async function addCategory(req, res, next) {
    try {
        const title = req.body.title;
        let parent_id;
        if (req.body.parentitem == 'parent') {
            parent_id = null;//if it was parent item
        } else {
            parent_id = parseInt(req.body.parentitem);
        }
        //add category to db 
        const newCategory = await addCategoryToDb(title, parent_id);
        if(newCategory) console.log(`new category title added: ${newCategory}`);

        res.redirect("/admin");
    } catch (error) {
        console.log(error.message + " stack: " + error.stack);
        next(error);
    }
}

async function getNestedCategories(req, res, next){
    try {
        const response = await getAllCategory();
        res.json(buildNestedMenu(response));
    } catch (error) {
        console.log(error.message + " stack: " + error.stack);
        next(error);
    }
}

export { editcategory, addCategory, getNestedCategories};