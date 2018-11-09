import { Router, json, urlencoded } from 'express';
import parcelData from '../db/parcelData';
import validateOrder from '../middlewares/validator';

const router = Router();

router.use(json());
router.use(urlencoded({ extended: true }));

router.post('/', validateOrder, (req, res) => {
  const order = req.body;
  order.id = parcelData.length + 1;
  order.status = 'received';
  parcelData.push(order);
  res.status(200).send(order);
});


router.get('/:parcelId', (req, res) => {
  const { parcelId } = req.params;
  const order = parcelData.find(a => a.parcelId === parseInt(parcelId));
  if (!order) return res.status(404).send('Order not found');
  res.status(200).json(order);
});

export default router;
