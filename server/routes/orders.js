import { Router, json, urlencoded } from 'express';
import parcelData from '../db/parcelData';

const router = Router();

router.use(json());
router.use(urlencoded({ extended: true }));

router.get('/parcels', (req, res) => {
  res.status(200).json(parcelData);
});

export default router;
