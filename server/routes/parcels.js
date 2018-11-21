import { Router, json, urlencoded } from 'express';
import validateOrder from '../middlewares/parcelOrderValidator';
import UpdateValidator from '../middlewares/parcelUpdateValidator';
import ParcelController from '../controllers/parcelController';
import Auth from '../middlewares/auth';

const router = Router();

router.use(json());
router.use(urlencoded({ extended: false }));

router.post('/', [Auth.genAuth, validateOrder], ParcelController.createOrder);

router.get('/', [Auth.genAuth, Auth.adminAuth], ParcelController.getAllOrders);

router.get('/:parcelId', Auth.genAuth, ParcelController.getOneOrder);

router.put('/:parcelId/cancel/', [Auth.genAuth, UpdateValidator.cancel], ParcelController.cancelOrder);

router.put('/:parcelId/status', [Auth.genAuth, Auth.adminAuth, UpdateValidator.changeStatus, UpdateValidator.inTransit, UpdateValidator.delivered], ParcelController.changeStatus);

router.put('/:parcelId/destination', [Auth.genAuth, UpdateValidator.changeDestination], ParcelController.changeDestination);

router.put('/:parcelId/presentLocation', [Auth.genAuth, Auth.adminAuth, UpdateValidator.changePresentLocation], ParcelController.changePresentLocation);

export default router;
