import express from 'express';
import {getAdminPage} from '../src/controllers/adminHOmePage_Controller.js';
import { editcategory, addCategory, getNestedCategories } from '../src/controllers/admin_category_controller.js';
import {uploadImage} from "../src/middlewares/uploadImagesMiddleware.js";
import { addNewProduct_controller} from '../src/controllers/admin_addProduct.js';
import { addNewBillboard } from '../src/controllers/newBillboard_Controller.js';

const router = express.Router();

//uploadImage's path argument that is reletive to image folder base on defination of storage in multer 
const productImage_path = 'products';
const billboardImage_path = 'billboards';

router.get("/", getAdminPage);

//send nested categories to frontend js (fetch)
router.get("/getnestedcategories", getNestedCategories);

//handle category edit
router.post("/editcategory", editcategory);
router.post("/addcategory", addCategory);

router.post('/addproduct', uploadImage(productImage_path).array('images'), addNewProduct_controller);
router.post('/addbillboard', uploadImage(billboardImage_path).array('image'), addNewBillboard);
export default router;