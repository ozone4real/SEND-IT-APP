import { Router, json, urlencoded } from 'express';
import validateOrder from '../middlewares/parcelOrderValidator';
import UpdateValidator from '../middlewares/parcelUpdateValidator';
import ParcelController from '../controllers/parcelController';
import Auth from '../middlewares/auth';

const router = Router();

router.use(json());
router.use(urlencoded({ extended: false }));

router.post('/', validateOrder, ParcelController.createOrder);

router.get('/', [Auth.genAuth, Auth.adminAuth], ParcelController.getAllOrders);

router.get('/:parcelId', ParcelController.getOneOrder);

router.put('/:parcelId/cancel/', UpdateValidator.cancel, ParcelController.cancelOrder);

router.put('/:parcelId/status', [Auth.genAuth, Auth.adminAuth, UpdateValidator.changeStatus, UpdateValidator.delivered], ParcelController.changeStatus);

router.put('/:parcelId/destination', UpdateValidator.changeDestination, ParcelController.changeDestination);

export default router;
