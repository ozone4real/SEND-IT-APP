import { Router, json, urlencoded } from 'express';
import AuthController from '../controllers/authController';
import userValidator from '../middlewares/userValidator';

const router = Router();

router.use(json());
router.use(urlencoded({ extended: false }));

router.post('/signup', userValidator, AuthController.signUpUser);

router.post('/signin', AuthController.signInUser);

export default router;


