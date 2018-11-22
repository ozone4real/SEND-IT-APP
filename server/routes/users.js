import { Router, json, urlencoded } from 'express';
import UserController from '../controllers/userController';
import Auth from '../middlewares/auth';

const { userAuth } = Auth;
const { getAllUserOrders } = UserController; 
const router = Router();

router.use(json());
router.use(urlencoded({ extended: false }));

router.get('/:userId/parcels', userAuth, getAllUserOrders);

export default router;
