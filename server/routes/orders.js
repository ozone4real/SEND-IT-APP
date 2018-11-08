import { Router, json, urlencoded } from 'express';
import parcelData from '../db/parcelData';
import validateOrder from '../middlewares/validator';

const router = Router();

router.use(json());
router.use(urlencoded({ extended: true }));

export default router;
