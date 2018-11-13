import { Router, json, urlencoded } from 'express';
import validateOrder from '../middlewares/validator';
import ParcelController from '../controllers/parcelController';

const router = Router();

router.use(json());
router.use(urlencoded({ extended: false }));

router.post('/', validateOrder, ParcelController.createOrder);

router.get('/', ParcelController.getAllOrders);

router.get('/:parcelId', ParcelController.getOneOrder);

router.put('/:parcelId/cancel/', ParcelController.cancelOrder);

export default router;
