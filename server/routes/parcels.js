import { Router, json, urlencoded } from 'express';
import validateOrder from '../middlewares/parcelValidator';
import ParcelController from '../controllers/parcelController';
import Auth from '../middlewares/auth';

const router = Router();

router.use(json());
router.use(urlencoded({ extended: false }));

router.post('/', validateOrder, ParcelController.createOrder);

router.get('/', [Auth.genAuth, Auth.adminAuth], ParcelController.getAllOrders);

router.get('/:parcelId', ParcelController.getOneOrder);

router.put('/:parcelId/cancel/', ParcelController.cancelOrder);

export default router;
