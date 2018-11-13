import { Router, json, urlencoded } from 'express';
import UserController from '../controllers/userController';

const router = Router();

router.use(json());
router.use(urlencoded({ extended: false }));

router.get('/:userId/parcels', UserController.getAllUserOrders);

export default router;
