import { Router, json, urlencoded } from 'express';
import userController from '../controllers/userController';
import { DataCreationValidator } from '../middlewares/dataValidator';

const { userDataValidator } = DataCreationValidator;
const { signInUser, signUpUser } = userController;

const router = Router();

router.use(json());
router.use(urlencoded({ extended: false }));

router.post('/signup', userDataValidator, signUpUser);

router.post('/signin', signInUser);

export default router;
