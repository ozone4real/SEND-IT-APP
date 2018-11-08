import { Router, json, urlencoded } from 'express';
import parcelData from '../db/parcelData';
import validateOrder from '../middlewares/validator';

const router = Router();

router.use(json());
router.use(urlencoded({ extended: true }));

router.post('/parcels', validateOrder, (req, res) => {
  const order = req.body;
  order.id = parcelData.length + 1;
  order.status = 'received';
  parcelData.push(order);
  res.status(200).send(order);
});

export default router;
