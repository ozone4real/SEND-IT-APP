import { Router, json, urlencoded } from 'express';
import parcelData from '../db/parcelData';

const router = Router();

router.use(json());
router.use(urlencoded({ extended: true }));

router.get('/parcels/:parcelId', (req, res) => {
  const { parcelId } = req.params;
  const order = parcelData.find(a => a.parcelId === parseInt(parcelId));
  if (!order) return res.status(404).send('Order not found');
  res.status(200).json(order);
});

export default router;
