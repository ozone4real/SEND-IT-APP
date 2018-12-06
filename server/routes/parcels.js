import { Router } from 'express';
import { DataCreationValidator, DataUpdateValidator } from '../middlewares/dataValidator';
import ParcelController from '../controllers/parcelController';
import Auth from '../middlewares/auth';
import addPrice from '../middlewares/addPrice';

const {
  confirmOrder,
  getAllOrders,
  getOneOrder,
  createOrder,
  cancelOrder,
  changeDestination,
  changePresentLocation,
  changeStatus
} = ParcelController;
const { userAuth, adminAuth } = Auth;
const { parcelDataValidator } = DataCreationValidator;
const {
  status, destination, presentLocation, delivered, cancel, inTransit,
} = DataUpdateValidator;

const router = Router();

router.post('/',
  [userAuth, parcelDataValidator, addPrice],
  createOrder);
router.post('/confirm', [userAuth, parcelDataValidator, addPrice], confirmOrder);

router.put('/:parcelId/confirmUpdate', [userAuth, destination, addPrice, confirmOrder]);

router.get('/', [userAuth, adminAuth], getAllOrders);

router.get('/:parcelId', userAuth, getOneOrder);

router.put('/:parcelId/cancel/', [userAuth, cancel], cancelOrder);

router.put('/:parcelId/status',
  [userAuth, adminAuth, status, inTransit, delivered],
  changeStatus);

router.put('/:parcelId/destination',
  [userAuth, destination, addPrice], changeDestination);

router.put('/:parcelId/presentLocation',
  [userAuth, adminAuth, presentLocation],
  changePresentLocation);

export default router;
