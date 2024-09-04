import express from 'express';
import {getProductById} from '../src/controllers/getProductController.js';

const router = new express.Router();

router.get('/product/:id', getProductById);

export default router;