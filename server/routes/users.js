import { Router, json, urlencoded } from 'express';
import UserController from '../controllers/userController';
import Auth from '../middlewares/auth';

const router = Router();

router.use(json());
router.use(urlencoded({ extended: false }));

router.get('/:userId/parcels', Auth.genAuth, UserController.getAllUserOrders);

export default router;
