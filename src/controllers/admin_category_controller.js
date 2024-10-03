import { removeCategoryById, addCategoryToDb, getAllCategory, renameCategoryById } from '../models/categories.js';
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

async function renameCategory(req, res, next) {
    console.log('ehem !!!');
    try {
        const catId = parseInt(req.body.categoryId);
        const newName = req.body.newname;
        await renameCategoryById(catId, newName);
        res.redirect('/admin');
    } catch (error) {
        console.log('message: ' + error.message + " stack: " + error.stack);
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

export { editcategory, addCategory, renameCategory, getNestedCategories};