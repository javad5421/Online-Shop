import {insertInProducts, insertInImages} from '../models/products.js';

async function addNewProduct_controller (req, res, next){
    try {
        const files = req.files;
        const folderName = req.folderName;
        //an array which contain all images related to product
        const image_urls = files.map(file => `/image/products/${folderName}/${file.originalname}`);
        const details = JSON.parse(req.body.details);
        const colors = JSON.parse(req.body.colors);
        //other parts of form
        const name = req.body.name;
        const price = parseInt(req.body.price);
        const quantity = parseInt(req.body.quantity);
        const description = req.body.description;
        const p_title = req.body.persian_title;
        const e_title = req.body.english_title;
        const category_id = parseInt(req.body.category);
        const discount = parseInt(req.body.discount);
        const datetime = new Date(req.body.datetime);

        const result = await insertInProducts(name,price,quantity,description,p_title, e_title, discount, datetime, category_id, details);
        if(result.id){
            insertInImages(image_urls, result.id);
        }
    } catch (error) {
        console.log(error.message + error.stack);
        next(error);
    }
}

export {addNewProduct_controller};