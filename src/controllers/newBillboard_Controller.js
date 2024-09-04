import { insertToBillboard } from "../models/billboards.js";

async function addNewBillboard(req, res, next) {
    try {
        //billboard image files;
        const files = req.files;
        const image_urls = files.map(file => `image/billboards/${req.folderName}/${file.originalname}`);

        const billboard_type = req.body.billboard_type;
        const billboard_url = req.body.billboard_url;
        console.log(`type ${billboard_type} && url: ${billboard_url}`);
        await insertToBillboard(image_urls[0], billboard_type, billboard_url);
    } catch (error) {
        console.log(error.message + " \n" + error.stack);
        next(error);
    }
}

export {addNewBillboard};