import express from 'express';
import {getProductById, getProductsByCategory} from '../src/controllers/productController.js';

const router = new express.Router();

router.get('/product/:id', getProductById);
router.get('/category/:catid', getProductsByCategory);
export default router;