import { Router, json, urlencoded } from 'express';
import userController from '../controllers/userController';
import { DataCreationValidator } from '../middlewares/dataValidator';

const { userDataValidator } = DataCreationValidator;
const { signInUser, signUpUser } = userController;

const router = Router();

// Express middlewares
router.use(json());
router.use(urlencoded({ extended: false }));


// User signup/signin endpoints
router.post('/signup', userDataValidator, signUpUser);

router.post('/signin', signInUser);

export default router;
