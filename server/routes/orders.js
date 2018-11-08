import { Router, json, urlencoded } from 'express';
import parcelData from '../db/parcelData';

const router = Router();

router.use(json());
router.use(urlencoded({ extended: true }));


export default router;
