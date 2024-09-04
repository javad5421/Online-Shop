import { getAllCategory } from "../models/categories.js";
import { buildNestedMenu } from "../services/nestedMenu.js";

async function getAdminPage(req,res,next){
    try {
        const categories = await getAllCategory();
        const nestedMenu = buildNestedMenu(categories);
        res.render("admin.ejs", {
            categories: nestedMenu
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

export {getAdminPage};