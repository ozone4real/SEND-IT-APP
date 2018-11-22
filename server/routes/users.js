import { Router } from 'express';
import { DataCreationValidator } from '../middlewares/dataValidator';
import UserController from '../controllers/UserController';
import Auth from '../middlewares/auth';


const { userAuth } = Auth;
const { getAllUserOrders, signInUser, signUpUser, signUpAdmin } = UserController;
const { userDataValidator } = DataCreationValidator;


const users = Router();
const auth = Router();


users.get('/:userId/parcels', userAuth, getAllUserOrders);

auth.post('/signup', userDataValidator, signUpUser);
auth.post('/signin', signInUser);
auth.post('/signupAdmin', signUpAdmin);

export { auth, users };
