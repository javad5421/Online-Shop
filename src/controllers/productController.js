import {getProducts} from '../models/products.js';
import { buildNestedMenu } from "../services/nestedMenu.js";
import { getAllCategory } from "../models/categories.js";
import {NestedCategoriesSecondLayer, getAllCategoryIds} from '../models/categories.js';

async function getProductById(req, res, next) {
    try {
        const categories = await getAllCategory();
        const nestedMenu = buildNestedMenu(categories);

        const productId = parseInt(req.params.id);
        const product = await getProducts(true, true, true, true, 0, productId); 
        const nestedCategory_ids = await NestedCategoriesSecondLayer(parseInt(product[0].category));
        const otherProducts = await getProducts(false, true, true, false, 0, -1, nestedCategory_ids);
        
        res.render('product.ejs', {
            categories: nestedMenu,
            product: product[0],
            otherProducts: otherProducts
        });

    } catch (error) {
        console.log(error.message + " stack: " + error.stack);
        next(error);
    }
}

async function getProductsByCategory(req, res, next) {
    try {
        const categories = await getAllCategory();
        const nestedMenu = buildNestedMenu(categories);

        const cat_id = parseInt(req.params.catid);
        const allsubCategories = await getAllCategoryIds(cat_id);
        const allCategoryIds = allsubCategories.map(cat => cat.id);
        const products = await getProducts(false,true,true,false, 0, -1, allCategoryIds);
        
        let subCategories = null;
        if (allsubCategories.length > 1) {
            subCategories = allsubCategories.filter(item => item.id != cat_id);
        }
        
        //extract colors from all selected products and put them in color
        const colors = [];
        products.forEach(p => {
            if ('colors' in p) {
                p.colors.forEach(color => {
                    const newColor = [color.name, color.hex];
                    colors.push(newColor);
                })
            }
        });

        res.render('category.ejs', {
            categories: nestedMenu,
            products: products,
            subCategories: subCategories,
            colors: colors
        });
    } catch (error) {
        console.log(error.message + " stack: " + error.stack);
        next(error);
    }
}

export {getProductById, getProductsByCategory};