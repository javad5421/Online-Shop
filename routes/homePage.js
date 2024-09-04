import express from 'express';
import {homePage} from '../src/controllers/homePage_Controller.js';

const router = express.Router();

router.get('', homePage);

export default router;