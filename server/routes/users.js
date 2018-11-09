import { Router, json, urlencoded } from 'express';
import parcelData from '../db/parcelData';

const router = Router();

router.use(json());
router.use(urlencoded({ extended: true }));

router.get('/:userId/parcels', (req, res) => {
  const { userId } = req.params;
  const userOrders = parcelData.filter(a => a.userId === userId);
  if (userOrders.length === 0) return res.status(404).send('No orders found for user');
  res.status(200).json(userOrders);
});

export default router;
